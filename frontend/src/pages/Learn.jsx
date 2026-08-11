import { useState } from "react";
import "../App.css";
import SearchBar from "../components/SearchBar";
import StockCard from "../components/StockCard";

function Learn() {
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
    <div className="container">
      <h1>InvestStart</h1>

      <SearchBar
        ticker={ticker}
        setTicker={setTicker}
        searchStock={searchStock}
      />


      {stock && <StockCard stock={stock} />}
    </div>
  );
}

export default Learn;