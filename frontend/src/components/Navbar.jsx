import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        InvestStart
      </Link>

      <div className="nav-links">
        <Link to="/">Learn</Link>
        <Link to="/analyze">Build & Analyze</Link>
        <Link to="/practice">Practice</Link>
      </div>
    </nav>
  );
}

export default Navbar;