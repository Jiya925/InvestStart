from stock_data import get_stock_data

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