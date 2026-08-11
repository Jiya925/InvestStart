import numpy as np
import pandas as pd
import yfinance as yf


# Assets that InvestStart considers
ASSETS = ["SPY", "QQQ", "VTI", "VXUS", "BND"]


def get_historical_prices():
    """
    Download 5 years of historical prices
    for the assets we're considering.
    """

    data = yf.download(
        ASSETS,
        period="5y",
        auto_adjust=True,
        progress=False
    )

    prices = data["Close"]

    return prices.dropna()


def calculate_statistics(prices):
    """
    Calculate historical annualized returns
    and covariance matrix.
    """

    daily_returns = prices.pct_change().dropna()

    annual_returns = daily_returns.mean() * 252

    covariance = daily_returns.cov() * 252

    return annual_returns, covariance


def calculate_portfolio(weights, annual_returns, covariance):
    """
    Calculate expected annual return and volatility.
    """

    portfolio_return = np.dot(
        weights,
        annual_returns
    )

    portfolio_variance = np.dot(
        weights.T,
        np.dot(covariance, weights)
    )

    portfolio_volatility = np.sqrt(
        portfolio_variance
    )

    return portfolio_return, portfolio_volatility

def backtest_portfolio(weights, start_amount=10000):
    """
    Simulate how a portfolio would have performed
    historically using the same weights.
    """

    prices = get_historical_prices()

    # Calculate daily percentage changes
    daily_returns = prices.pct_change().dropna()

    # Calculate the portfolio's daily return
    portfolio_daily_returns = daily_returns.dot(weights)

    # Grow the initial investment over time
    portfolio_value = (
        1 + portfolio_daily_returns
    ).cumprod() * start_amount

    # Convert dates and values into a format
    # that can be sent to the React frontend
    history = []

    for date, value in portfolio_value.items():

        history.append({
            "date": date.strftime("%Y-%m-%d"),
            "value": round(float(value), 2)
        })

    return history

def generate_valid_weights(risk_tolerance):
    """
    Generate a random portfolio that follows
    InvestStart's diversification constraints.
    """

    while True:

        weights = np.random.random(len(ASSETS))

        weights = weights / np.sum(weights)

        portfolio = dict(zip(ASSETS, weights))

        # No asset can exceed 50%
        if max(weights) > 0.50:
            continue

        # At least 5% international exposure
        if portfolio["VXUS"] < 0.05:
            continue

        # Conservative portfolios need at least 15% bonds
        if risk_tolerance == "conservative":
            if portfolio["BND"] < 0.15:
                continue

        # Moderate portfolios need at least 5% bonds
        if risk_tolerance == "moderate":
            if portfolio["BND"] < 0.05:
                continue

        return weights


def optimize_portfolio(
    risk_tolerance,
    time_horizon,
    num_portfolios=5000
):
    """
    Generate thousands of valid portfolios,
    evaluate them, and select the best one.

    Also returns all portfolios so the frontend
    can build the Efficient Frontier visualization.
    """

    prices = get_historical_prices()

    annual_returns, covariance = calculate_statistics(prices)

    results = []

    for _ in range(num_portfolios):

        weights = generate_valid_weights(
            risk_tolerance
        )

        portfolio_return, portfolio_volatility = (
            calculate_portfolio(
                weights,
                annual_returns,
                covariance
            )
        )

        if portfolio_volatility == 0:
            continue

        sharpe_ratio = (
            portfolio_return / portfolio_volatility
        )

        results.append({
            "weights": weights,
            "return": portfolio_return,
            "volatility": portfolio_volatility,
            "sharpe": sharpe_ratio
        })

    results_df = pd.DataFrame(results)

    # ---------------------------------------------
    # Calculate score based on risk tolerance
    # ---------------------------------------------

    if risk_tolerance == "conservative":

        risk_weight = 2.0

    elif risk_tolerance == "aggressive":

        risk_weight = 0.25

    else:

        risk_weight = 0.75

    results_df["score"] = (
        results_df["return"]
        - risk_weight * results_df["volatility"]
    )

    # ---------------------------------------------
    # Adjust score based on time horizon
    # ---------------------------------------------

    if time_horizon <= 5:

        results_df["score"] -= (
            0.50 * results_df["volatility"]
        )

    elif time_horizon >= 20:

        results_df["score"] += (
            0.20 * results_df["return"]
        )

    # ---------------------------------------------
    # Find the actual Efficient Frontier
    # ---------------------------------------------

    # Sort portfolios from lowest risk to highest risk.
    sorted_results = results_df.sort_values(
        by="volatility"
    )

    frontier = []

    highest_return_so_far = -np.inf

    frontier_indices = []

    for index, row in sorted_results.iterrows():

        current_return = float(row["return"])
        current_volatility = float(row["volatility"])

        # A portfolio is efficient if it provides
        # a higher return than every portfolio
        # with less risk.
        if current_return > highest_return_so_far:

            frontier_indices.append(index)

            frontier.append({
                "return": round(
                    current_return * 100,
                    2
                ),
                "volatility": round(
                    current_volatility * 100,
                    2
                )
            })

            highest_return_so_far = current_return

    # ---------------------------------------------
    # Choose the recommended portfolio
    # from the Efficient Frontier
    # ---------------------------------------------

    frontier_results = results_df.loc[
        frontier_indices
    ]

    best_index = frontier_results["score"].idxmax()

    best = frontier_results.loc[best_index]

    # ---------------------------------------------
    # Convert weights into percentages
    # ---------------------------------------------

    portfolio = {}

    for ticker, weight in zip(
        ASSETS,
        best["weights"]
    ):
        portfolio[ticker] = round(
            float(weight) * 100,
            2
        )

    # ---------------------------------------------
    # Return the recommendation and frontier
    # ---------------------------------------------

    return {
        "portfolio": portfolio,

        "expected_return": round(
            float(best["return"]) * 100,
            2
        ),

        "volatility": round(
            float(best["volatility"]) * 100,
            2
        ),

        "sharpe_ratio": round(
            float(best["sharpe"]),
            2
        ),

        "frontier": frontier
    }