import { useState } from "react";

function Analyze() {
  const [amount, setAmount] = useState(10000);
  const [risk, setRisk] = useState("Medium");
  const [years, setYears] = useState(10);
  const [portfolio, setPortfolio] = useState(null);

  function generatePortfolio() {
    let recommendation;

    if (risk === "Low") {
      recommendation = [
        { ticker: "VOO", percentage: 70 },
        { ticker: "BND", percentage: 30 },
      ];
    } else if (risk === "Medium") {
      recommendation = [
        { ticker: "VOO", percentage: 60 },
        { ticker: "AAPL", percentage: 20 },
        { ticker: "MSFT", percentage: 20 },
      ];
    } else {
      recommendation = [
        { ticker: "VOO", percentage: 40 },
        { ticker: "AAPL", percentage: 30 },
        { ticker: "NVDA", percentage: 30 },
      ];
    }

    setPortfolio(recommendation);
  }

  return (
    <div className="analyze-page">
      <h1>Build & Analyze</h1>

      <p className="page-description">
        Create a sample portfolio based on your investment goals.
      </p>

      <div className="analyze-form">

        <label>
          Starting Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </label>

        <label>
          Risk Tolerance
          <select
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </label>

        <label>
          Investment Horizon
          <select
            value={years}
            onChange={(e) => setYears(e.target.value)}
          >
            <option value={5}>5 years</option>
            <option value={10}>10 years</option>
            <option value={20}>20 years</option>
          </select>
        </label>

        <button onClick={generatePortfolio}>
          Generate Portfolio
        </button>

      </div>

      {portfolio && (
        <div className="portfolio-card">
          <h2>Your Sample Portfolio</h2>

          <p>
            Based on ${Number(amount).toLocaleString()} invested for{" "}
            {years} years with {risk.toLowerCase()} risk tolerance.
          </p>

          <div className="portfolio-list">
            {portfolio.map((investment) => {
              const dollarAmount =
                Number(amount) * (investment.percentage / 100);

              return (
                <div
                  className="portfolio-item"
                  key={investment.ticker}
                >
                  <div>
                    <strong>{investment.ticker}</strong>
                    <span>{investment.percentage}%</span>
                  </div>

                  <strong>
                    ${dollarAmount.toLocaleString()}
                  </strong>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analyze;