function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{label}</strong>
      <p>{value}</p>
    </div>
  );
}

export default Metric;