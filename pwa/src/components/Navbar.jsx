import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="nav-bar">
      <div className="nav-brand">
        <Link to="/" style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          🌤️ WeatherNow
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">Pulpit</Link>
        <Link to="/map" className="nav-link">Mapa Pogodowa</Link>
      </div>
    </nav>
  );
}

export default Navbar;
