import yfinance as yf
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from stock_data import get_stock_data
from optimizer import optimize_portfolio, backtest_portfolio

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# creates webpage
@app.get("/")
def home():
    return {
        "message": "Welcome to InvestStart"
    }

# calls my function to get stock info
@app.get("/stock/{ticker}")
def stock(ticker: str):
    data = get_stock_data(ticker)
    history = data["history"]

    dates = history.index.strftime("%Y-%m-%d").tolist()
    prices = history["Close"].tolist()

    return {
        "ticker": data["ticker"],
        "name": data["name"],
        "price": data["price"],
        "market_cap": data["market_cap"],
        "sector": data["sector"],
        "industry": data["industry"],
        "fifty_two_week_high": data["fifty_two_week_high"],
        "fifty_two_week_low": data["fifty_two_week_low"],
        "pe_ratio": data["pe_ratio"],
        "dividend_yield": data["dividend_yield"],
        "dates": dates,
        "prices": prices
    }

@app.get("/optimize")
def optimize(
    risk_tolerance: str = "moderate",
    time_horizon: int = 10
):
    return optimize_portfolio(
        risk_tolerance,
        time_horizon
    )

@app.get("/backtest")
def backtest(
    risk_tolerance: str,
    time_horizon: int,
    amount: float = 10000
):

    result = optimize_portfolio(
        risk_tolerance,
        time_horizon
    )

    portfolio = result["portfolio"]

    weights = [
        portfolio.get(ticker, 0) / 100
        for ticker in [
            "SPY",
            "QQQ",
            "VTI",
            "VXUS",
            "BND"
        ]
    ]

    history = backtest_portfolio(
        weights,
        amount
    )

    return {
        "portfolio": result["portfolio"],
        "expected_return": result["expected_return"],
        "volatility": result["volatility"],
        "sharpe_ratio": result["sharpe_ratio"],
        "frontier": result["frontier"],
        "history": history
    }

@app.get("/practice/prices")
def practice_prices():

    tickers = ["SPY", "QQQ", "VTI", "VXUS", "BND"]

    prices = {}

    for ticker in tickers:

        data = get_stock_data(ticker)

        history = data["history"]

        latest_price = float(
            history["Close"].iloc[-1]
        )

        prices[ticker] = {
            "name": data["name"],
            "price": latest_price
        }

    return prices

@app.get("/practice/scenario/{scenario}")
def practice_scenario(scenario: str):

    scenarios = {
        "normal": {
            "start": "2019-01-02",
            "end": "2019-06-30"
        },

        "covid": {
            "start": "2020-01-02",
            "end": "2020-06-30"
        },

        "tech": {
            "start": "2022-01-03",
            "end": "2022-06-30"
        },

        "inflation": {
            "start": "2022-01-03",
            "end": "2022-12-30"
        }
    }

    if scenario not in scenarios:
        return {
            "error": "Unknown scenario"
        }

    dates = scenarios[scenario]

    assets = [
        "SPY",
        "QQQ",
        "VTI",
        "VXUS",
        "BND"
    ]

    data = yf.download(
        assets,
        start=dates["start"],
        end=dates["end"],
        auto_adjust=True,
        progress=False
    )

    prices = data["Close"].dropna()

    result = []

    for date, row in prices.iterrows():

        day = {
            "date": date.strftime("%Y-%m-%d")
        }

        for ticker in assets:
            day[ticker] = round(
                float(row[ticker]),
                2
            )

        result.append(day)

    return {
        "scenario": scenario,
        "days": result
    }