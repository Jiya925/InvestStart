function StockCard({ stock }) {
  return (
    <div className="stock-card">
      <h2>
        {stock.name} ({stock.ticker})
      </h2>

      <p>
        <strong>Current Price:</strong> ${stock.price}
      </p>

      <p>
        <strong>Market Cap:</strong> $
        {(stock.market_cap / 1000000000).toFixed(2)} Billion
      </p>

      <p>
        <strong>Sector:</strong> {stock.sector}
      </p>

      <p>
        <strong>Industry:</strong> {stock.industry}
      </p>

      <p>
        <strong>52 Week High:</strong> ${stock.fifty_two_week_high}
      </p>

      <p>
        <strong>52 Week Low:</strong> ${stock.fifty_two_week_low}
      </p>

      <p>
        <strong>P/E Ratio:</strong> {stock.pe_ratio}
      </p>

      <p>
        <strong>Dividend Yield:</strong>{" "}
        {stock.dividend_yield
          ? (stock.dividend_yield * 100).toFixed(2) + "%"
          : "N/A"}
      </p>
    </div>
  );
}

export default StockCard;