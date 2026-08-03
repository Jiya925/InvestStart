import Metric from "./Metric";

function StockCard({ stock }) {
  return (
    <div className="stock-card">
      <h2>
        {stock.name} ({stock.ticker})
      </h2>

      <Metric
        label="Current Price"
        value={`$${stock.price}`}
      />

      <Metric
        label="Market Cap"
        value={`$${(stock.market_cap / 1000000000).toFixed(2)} Billion`}
      />

      <Metric
        label="Sector"
        value={stock.sector}
      />

      <Metric
        label="Industry"
        value={stock.industry}
      />

      <Metric
        label="52 Week High"
        value={`$${stock.fifty_two_week_high}`}
      />

      <Metric
        label="52 Week Low"
        value={`$${stock.fifty_two_week_low}`}
      />

      <Metric
        label="P/E Ratio"
        value={stock.pe_ratio}
      />

      <Metric
        label="Dividend Yield"
        value={
          stock.dividend_yield
            ? `${(stock.dividend_yield * 100).toFixed(2)}%`
            : "N/A"
        }
      />
    </div>
  );
}

export default StockCard;