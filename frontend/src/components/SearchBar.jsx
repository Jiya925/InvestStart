function SearchBar({
  ticker,
  setTicker,
  searchStock,
}) {
  return (
    <>
      <input
        type="text"
        placeholder="Enter ticker (ex: AAPL)"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
      />

      <button onClick={searchStock}>
        Search
      </button>
    </>
  );
}

export default SearchBar;