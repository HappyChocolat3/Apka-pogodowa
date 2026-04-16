import { useState, useEffect } from 'react';
import { getFavorites, getWeather, removeFavorite } from '../api';
import WeatherCard from '../components/WeatherCard';
import { FiTrash2 } from 'react-icons/fi';

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchFavs = async () => {
    try {
      const data = await getFavorites();
      setFavorites(data);
      
      const wxMap = {};
      for (const f of data) {
        wxMap[f.id] = await getWeather(f.lat, f.lon);
      }
      setWeatherData(wxMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavs();
  }, []);

  const handleRemove = async (id) => {
    await removeFavorite(id);
    fetchFavs();
  };

  return (
    <div>
      <div className="weather-header">
        <h1>Moje Lokacje</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Zarządzaj swoimi ulubionymi miejscami zapisanymi w bazie danych</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="weather-grid">
          {favorites.length === 0 ? (
            <div className="glass-panel" style={{ gridColumn: '1 / -1', textAlign: 'center' }}>
              <p>Nie masz żadnych zapisanych lokacji. Spróbuj dodać wschodzące słońce z pulpitu!</p>
            </div>
          ) : (
            favorites.map(fav => (
              <div key={fav.id} style={{ position: 'relative' }}>
                <button 
                  className="btn-icon" 
                  style={{ position: 'absolute', top: '15px', right: '15px', zIndex: 10 }}
                  onClick={() => handleRemove(fav.id)}
                  title="Usuń"
                >
                  <FiTrash2 color="var(--danger)" />
                </button>
                <div style={{ pointerEvents: 'none' }}>
                  <WeatherCard 
                    data={weatherData[fav.id]} 
                    isFavoriteMode={true} 
                    city={fav.city} 
                    lat={fav.lat} 
                    lon={fav.lon} 
                  />
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Favorites;
