import yfinance as yf

# function to create stock object and get its data
def get_stock_data(ticker):
    stock = yf.Ticker(ticker)

    history = stock.history(period="5y")
    info = stock.info

    return {
        "ticker": ticker.upper(),
        "name": info.get("longName"),
        "price": info.get("currentPrice"),
        "market_cap": info.get("marketCap"),
        "sector": info.get("sector"),
        "industry": info.get("industry"),
        "fifty_two_week_high": info.get("fiftyTwoWeekHigh"),
        "fifty_two_week_low": info.get("fiftyTwoWeekLow"),
        "pe_ratio": info.get("trailingPE"),
        "dividend_yield": info.get("dividendYield"),
        "history": history
    }