import { useState, useEffect } from 'react';
import { getWeather, getCityNameFromCoords } from '../api';
import WeatherCard from '../components/WeatherCard';
import { FiSearch, FiMapPin } from 'react-icons/fi';

function Home() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [coords, setCoords] = useState({ lat: 52.2297, lon: 21.0122, name: 'Warszawa' }); // Domyślnie Wwa

  const fetchWeather = async (lat, lon) => {
    setLoading(true);
    setError('');
    try {
      const data = await getWeather(lat, lon);
      setWeather(data);
    } catch (err) {
      setError('Nie udao się pobrać danych - sprawdź połączenie (Offline Mode). Zobacz konsolę PWA jeśli offline nie działa prawidłowo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(coords.lat, coords.lon);
  }, [coords]);

  const useGeolocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async position => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const cityName = await getCityNameFromCoords(lat, lon);
          
          setCoords({
            lat,
            lon,
            name: cityName
          });
        },
        () => setError('Odblokuj dostęp do lokalizacji by otrzymać precyzyjną prognozę.')
      );
    }
  };

  return (
    <div>
      <div className="weather-header">
        <h1>Pogoda na żywo</h1>
      </div>

      <div style={{ display: 'flex', gap: '1rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <FiSearch style={{ position: 'absolute', top: '15px', left: '15px', color: 'var(--text-secondary)' }} />
          <input 
            type="text" 
            className="input-field" 
            style={{ paddingLeft: '2.5rem' }} 
            placeholder="Szukaj miasta" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="btn" onClick={useGeolocation} title="Użyj mojej lokalizacji">
          <FiMapPin />
        </button>
      </div>

      {error && <div className="error-msg" style={{ maxWidth: '600px', margin: '0 auto 1.5rem' }}>{error}</div>}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <WeatherCard 
            data={weather} 
            city={searchQuery || coords.name} 
            showForecast={true}
          />
        </div>
      )}
    </div>
  );
}

export default Home;
