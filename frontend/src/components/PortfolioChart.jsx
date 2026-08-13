import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function PortfolioChart({ history }) {

  if (!history || history.length < 2) {
    return (
      <div className="portfolio-chart">
        <h2>Portfolio Performance</h2>

        <p>
          Advance through the simulation to see
          how your portfolio performs.
        </p>
      </div>
    );
  }

  return (
    <div className="portfolio-chart">

      <h2>Portfolio Performance</h2>

      <p>
        Track how your virtual $10,000 changes
        throughout the historical scenario.
      </p>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <LineChart data={history}>

          <CartesianGrid />

          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={(value) =>
              `$${value.toLocaleString()}`
            }
          />

          <Tooltip
            formatter={(value) =>
              `$${Number(value).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }
              )}`
            }
          />

          <Line
            type="monotone"
            dataKey="value"
            name="Portfolio Value"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default PortfolioChart;