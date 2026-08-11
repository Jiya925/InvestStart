import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";


function EfficientFrontier({ portfolios, recommended }) {

  if (!portfolios || portfolios.length === 0) {
    return null;
  }

  return (
    <div className="efficient-frontier">

      <h2>Risk vs. Return</h2>

      <p>
        Each point represents a possible portfolio.
        Portfolios further left have lower historical
        volatility, while portfolios higher up have
        higher historical returns.
      </p>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <ScatterChart>

          <CartesianGrid />

          <XAxis
            type="number"
            dataKey="volatility"
            name="Volatility"
            unit="%"
            label={{
              value: "Risk (Volatility)",
              position: "insideBottom",
              offset: -5,
            }}
          />

          <YAxis
            type="number"
            dataKey="return"
            name="Return"
            unit="%"
            label={{
              value: "Expected Return",
              angle: -90,
              position: "insideLeft",
            }}
          />

          <Tooltip
            cursor={{
              strokeDasharray: "3 3",
            }}
          />

          <Legend />

          <Scatter
            name="Possible Portfolios"
            data={portfolios}
          />

          {recommended && (
            <Scatter
                name="⭐ Your Portfolio"
                data={[recommended]}
                shape="star"
                fill="#ffb235"
                stroke="#000000"
                strokeWidth={2}
            />
            )}

        </ScatterChart>

      </ResponsiveContainer>

    </div>
  );
}

export default EfficientFrontier;