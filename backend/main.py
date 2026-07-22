from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from stock_data import get_stock_data

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

    return {
        "name": data["name"],
        "price": data["price"],
        "market_cap": data["market_cap"]
    }