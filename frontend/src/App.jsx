import { useState } from "react";

function App() {
  const [ticker, setTicker] = useState("");
  const [stock, setStock] = useState(null);

  async function searchStock() {
    const response = await fetch(
      `http://127.0.0.1:8000/stock/${ticker}`
    );

    const data = await response.json();

    setStock(data);
  }

  return (
    <div>
      <h1>InvestStart</h1>

      <input
        type="text"
        placeholder="Enter ticker (ex: AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />

      <button onClick={searchStock}>
        Search
      </button>


      {stock && (
        <div>
          <h2>{stock.name}</h2>
          <p>Price: ${stock.price}</p>
          <p>Market Cap: {stock.market_cap}</p>
        </div>
      )}
    </div>
  );
}

export default App;