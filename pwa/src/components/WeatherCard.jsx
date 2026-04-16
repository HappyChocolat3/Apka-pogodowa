import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudLightning, FiHeart } from 'react-icons/fi';
import { addFavorite } from '../api';

function WeatherCard({ data, isFavoriteMode, city, lat, lon }) {
  if (!data) return null;

  const current = data.current_weather;
  if (!current) return <div className="glass-panel">Brak danych obecnej pogody.</div>;

  const temp = current.temperature;
  const wcc = current.weathercode;
  
  // WMO Weather interpretation codes
  let icon = <FiSun size={48} color="#fcd34d" />;
  let desc = "Słonecznie";
  if ([1, 2, 3].includes(wcc)) { icon = <FiCloud size={48} color="#94a3b8" />; desc = "Zachmurzenie"; }
  if ([45, 48].includes(wcc)) { icon = <FiCloud size={48} color="#94a3b8" />; desc = "Mgła"; }
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(wcc)) { icon = <FiCloudRain size={48} color="#60a5fa" />; desc = "Deszcz"; }
  if ([71, 73, 75, 77, 85, 86].includes(wcc)) { icon = <FiCloudSnow size={48} color="#e2e8f0" />; desc = "Śnieg"; }
  if ([95, 96, 99].includes(wcc)) { icon = <FiCloudLightning size={48} color="#f59e0b" />; desc = "Burza"; }

  const handleAddFavorite = async () => {
    try {
      await addFavorite(city || 'Obecna', lat, lon);
      alert('Zapisano w ulubionych!');
    } catch(err) {
      alert('Błąd podczas zapisywania');
    }
  };

  return (
    <div className="glass-panel current-weather" style={{ position: 'relative' }}>
      {!isFavoriteMode && (
        <button 
          className="btn-icon" 
          style={{ position: 'absolute', top: '15px', right: '15px' }}
          onClick={handleAddFavorite}
          title="Dodaj do ulubionych"
        >
          <FiHeart color="var(--danger)" />
        </button>
      )}
      <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem' }}>{city || "Obecna lokalizacja"}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        {icon}
        <div className="temp-huge">{temp}°C</div>
      </div>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        {desc}
      </p>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem' }}>Wiatr</p>
          <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{current.windspeed} km/h</p>
        </div>
      </div>
    </div>
  );
}

export default WeatherCard;
