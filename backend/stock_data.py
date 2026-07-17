import yfinance as yf

# function to create stock object and get its data
def get_stock_data(ticker):
    stock = yf.Ticker(ticker)

    history = stock.history(period="5y")
    info = stock.info

    return {
        "name": info.get("longName"),
        "price": info.get("currentPrice"),
        "market_cap": info.get("marketCap"),
        "history": history
    }