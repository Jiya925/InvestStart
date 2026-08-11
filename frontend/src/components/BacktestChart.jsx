import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


function BacktestChart({ history }) {

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="backtest-card">

      <h2>Historical Performance</h2>

      <p>
        How $10,000 would have grown using your
        recommended portfolio over the past 5 years.
      </p>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <LineChart data={history}>

          <CartesianGrid />

          <XAxis
            dataKey="date"
            tickFormatter={(date) => date.slice(0, 4)}
          />

          <YAxis
            tickFormatter={(value) =>
              `$${value.toLocaleString()}`
            }
          />

          <Tooltip
            formatter={(value) =>
              `$${Number(value).toLocaleString()}`
            }
          />

          <Line
            type="monotone"
            dataKey="value"
            name="Portfolio Value"
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default BacktestChart;