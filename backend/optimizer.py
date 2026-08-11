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
    and the covariance matrix.
    """

    daily_returns = prices.pct_change().dropna()

    annual_returns = daily_returns.mean() * 252

    covariance = daily_returns.cov() * 252

    return annual_returns, covariance


def calculate_portfolio(weights, annual_returns, covariance):
    """
    Calculate the expected return and volatility
    of a portfolio.
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


def optimize_portfolio(
    risk_tolerance,
    time_horizon,
    num_portfolios=5000
):
    """
    Generate thousands of possible portfolios and
    choose one based on risk tolerance and investment horizon.
    """

    prices = get_historical_prices()

    annual_returns, covariance = calculate_statistics(prices)

    results = []

    for _ in range(num_portfolios):

        # Generate random weights
        weights = np.random.random(len(ASSETS))

        # Make weights add up to 100%
        weights = weights / np.sum(weights)

        portfolio_return, portfolio_volatility = (
            calculate_portfolio(
                weights,
                annual_returns,
                covariance
            )
        )

        # Avoid division by zero
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

    # Risk tolerance

    if risk_tolerance == "conservative":

        # Conservative investors strongly prioritize
        # lower volatility.
        risk_weight = 2.0

        results_df["score"] = (
            results_df["return"]
            - risk_weight * results_df["volatility"]
        )

    elif risk_tolerance == "aggressive":

        # Aggressive investors prioritize return more.
        risk_weight = 0.25

        results_df["score"] = (
            results_df["return"]
            - risk_weight * results_df["volatility"]
        )

    else:

        # Moderate investors balance return and risk.
        risk_weight = 0.75

        results_df["score"] = (
            results_df["return"]
            - risk_weight * results_df["volatility"]
        )

    # Time horizon adjustment

    if time_horizon <= 5:

        # Shorter horizons should favor lower volatility.
        results_df["score"] -= (
            0.50 * results_df["volatility"]
        )

    elif time_horizon >= 20:

        # Longer horizons can tolerate more volatility
        # in exchange for higher expected returns.
        results_df["score"] += (
            0.20 * results_df["return"]
        )

    # Select the highest-scoring portfolio

    best_index = results_df["score"].idxmax()

    best = results_df.loc[best_index]

    # Convert weights into percentages
    portfolio = {}

    for ticker, weight in zip(
        ASSETS,
        best["weights"]
    ):
        portfolio[ticker] = round(
            float(weight) * 100,
            2
        )

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
        )
    }