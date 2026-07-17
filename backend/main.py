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

# ask user for stock ticker
ticker = input("Enter a stock ticker: ")

# get stock information
stock_data = get_stock_data(ticker)


# show results
print("\nCompany:", stock_data["name"])
print("Current Price:", stock_data["price"])
print("Market Cap:", stock_data["market_cap"])

print("\nHistorical Data:")
print(stock_data["history"].head())