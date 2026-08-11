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