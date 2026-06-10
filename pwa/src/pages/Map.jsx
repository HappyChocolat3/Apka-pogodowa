import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { getWeather, getCityNameFromCoords } from '../api';
import WeatherCard from '../components/WeatherCard';

// Fix dla ikon w vite zeby markery leaflet.js ladowaly swoje zrodla prawidlowo
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
const defIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconAnchor: [12, 41]
});

function MapEvents({ onLocationClick }) {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapView() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clickedPos, setClickedPos] = useState(null);

  const [clickedPosName, setClickedPosName] = useState("");

  const fetchPointWeather = async (lat, lon) => {
    setLoading(true);
    setClickedPos({ lat, lon });
    setClickedPosName("");
    try {
      const data = await getWeather(lat, lon);
      setWeatherData(data);
      const name = await getCityNameFromCoords(lat, lon);
      setClickedPosName(name);
    } catch {
      alert("Błąd integracji z Open-Meteo API. Sprawdź sieć lokalną.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="weather-header">
        <h1>Interaktywna Mapa</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Kliknij w dowolne miejsce na mapie, żeby sprawdzić pogodę</p>
      </div>
      
      <div style={{ position: 'relative', height: '600px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)', boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)' }}>
        
        <MapContainer center={[52.2297, 21.0122]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer
             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapEvents onLocationClick={fetchPointWeather} />
          {clickedPos && (
             <Marker position={[clickedPos.lat, clickedPos.lon]} icon={defIcon} />
          )}
        </MapContainer>

        {/* Nakładka z widgetem pogody na mapie! */}
        {clickedPos && (
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: '90%', maxWidth: '400px' }}>
            {loading ? (
              <div className="glass-panel" style={{ textAlign: 'center' }}>
                <div className="spinner" style={{ margin: '1rem auto' }}></div>
                <p>Opracowywanie prognozy Open-Meteo...</p>
              </div>
            ) : (
              weatherData && (
                  <div style={{ background: '#0f172a', borderRadius: '16px' }}>
                    <WeatherCard 
                      data={weatherData} 
                      city={clickedPosName || `Wyszukiwanie lokalizacji...`}
                      showForecast={true}
                    />
                  </div>
              )
            )}
            <button className="btn" onClick={() => setClickedPos(null)} style={{ width: '100%', marginTop: '0.5rem', background: 'var(--danger)' }}>
              Zamknij podgląd
            </button>
          </div>
        )}
        
      </div>
    </div>
  )
}

export default MapView;
