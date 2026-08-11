import { useState } from "react";
import EfficientFrontier from "../components/EfficientFrontier";
import BacktestChart from "../components/BacktestChart";

function Analyze() {
  const [amount, setAmount] = useState(10000);
  const [risk, setRisk] = useState("Medium");
  const [years, setYears] = useState(10);

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generatePortfolio() {

    setLoading(true);
    setError(null);

    try {

      const response = await fetch(
        `http://127.0.0.1:8000/backtest?risk_tolerance=${risk.toLowerCase()}&time_horizon=${years}&amount=${amount}`
      );

      if (!response.ok) {
        throw new Error("Failed to generate portfolio");
      }

      const data = await response.json();

      const recommendation = Object.entries(
        data.portfolio
      ).map(([ticker, percentage]) => ({
        ticker,
        percentage,
      }));

      setPortfolio({
        investments: recommendation,

        expectedReturn: data.expected_return,

        volatility: data.volatility,

        sharpeRatio: data.sharpe_ratio,

        frontier: data.frontier,

        history: data.history,
      });

    } catch (error) {

      console.error(
        "Error generating portfolio:",
        error
      );

      setError(
        "Something went wrong while analyzing your portfolio."
      );

    } finally {

      setLoading(false);

    }
  }

  return (
    <div className="analyze-page">
      <h1>Build & Analyze</h1>

      <p className="page-description">
        Create a portfolio based on your investment goals and
        historical market data.
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

        <button onClick={generatePortfolio} disabled={loading}>
          {loading ? "Analyzing..." : "Generate Portfolio"}
        </button>

      </div>

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {portfolio && (
        <>
          <div className="portfolio-card">

            <h2>Your Recommended Portfolio</h2>

            <p>
              Based on ${Number(amount).toLocaleString()} invested for{" "}
              {years} years with {risk.toLowerCase()} risk tolerance.
            </p>

            <div className="portfolio-list">

              {portfolio.investments.map((investment) => {
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

            <div className="portfolio-metrics">

              <div>
                <span>Historical Annual Return</span>
                <strong>
                  {portfolio.expectedReturn}%
                </strong>
              </div>

              <div>
                <span>Historical Volatility</span>
                <strong>
                  {portfolio.volatility}%
                </strong>
              </div>

              <div>
                <span>Sharpe Ratio</span>
                <strong>
                  {portfolio.sharpeRatio}
                </strong>
              </div>

            </div>

          </div>

          <EfficientFrontier
            portfolios={portfolio.frontier}
            recommended={{
              return: portfolio.expectedReturn,
              volatility: portfolio.volatility,
            }}
          />

          <BacktestChart
            history={portfolio.history}
          />

        </>
      )}
    </div>
  );
}

export default Analyze;