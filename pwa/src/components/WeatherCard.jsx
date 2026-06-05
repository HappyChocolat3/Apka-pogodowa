import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiCloudLightning } from 'react-icons/fi';

function WeatherCard({ data, city, showForecast }) {
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

  // Obliczenie aktualnego indeksu UV z danych godzinowych
  let uvIndex = null;
  if (data.hourly && data.hourly.time && data.hourly.uv_index && current.time) {
    const currentHourIndex = data.hourly.time.indexOf(current.time);
    if (currentHourIndex !== -1) {
      uvIndex = data.hourly.uv_index[currentHourIndex];
    } else {
      const currentHourStr = current.time.slice(0, 13); // format YYYY-MM-DDTHH
      const matchIndex = data.hourly.time.findIndex(t => t.startsWith(currentHourStr));
      if (matchIndex !== -1) {
        uvIndex = data.hourly.uv_index[matchIndex];
      }
    }
  }

  const getUvDetails = (uv) => {
    if (uv === null || uv === undefined) return { desc: '', className: '' };
    if (uv <= 2) return { desc: 'Niski', className: 'uv-low' };
    if (uv <= 5) return { desc: 'Umiarkowany', className: 'uv-moderate' };
    if (uv <= 7) return { desc: 'Wysoki', className: 'uv-high' };
    if (uv <= 10) return { desc: 'B. wysoki', className: 'uv-veryhigh' };
    return { desc: 'Ekstremalny', className: 'uv-extreme' };
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    if (date.toDateString() === today) return "Dziś";
    const day = date.toLocaleDateString('pl-PL', { weekday: 'short' });
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getWeatherIcon = (code) => {
    if ([1, 2, 3].includes(code)) return <FiCloud size={24} color="#94a3b8" />;
    if ([45, 48].includes(code)) return <FiCloud size={24} color="#94a3b8" />;
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <FiCloudRain size={24} color="#60a5fa" />;
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <FiCloudSnow size={24} color="#e2e8f0" />;
    if ([95, 96, 99].includes(code)) return <FiCloudLightning size={24} color="#f59e0b" />;
    return <FiSun size={24} color="#fcd34d" />;
  };

  return (
    <div className="glass-panel current-weather" style={{ position: 'relative' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '500', marginBottom: '0.5rem' }}>{city || "Obecna lokalizacja"}</h2>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        {icon}
        <div className="temp-huge">{temp}°C</div>
      </div>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
        {desc}
      </p>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', color: 'var(--text-secondary)', width: '100%', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '0.875rem' }}>Wiatr</p>
          <p style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{current.windspeed} km/h</p>
        </div>
        {uvIndex !== null && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>Indeks UV</p>
            <span className={`uv-badge ${getUvDetails(uvIndex).className}`}>
              {uvIndex.toFixed(1)} - {getUvDetails(uvIndex).desc}
            </span>
          </div>
        )}
      </div>

      {showForecast && data.daily && data.daily.time && (
        <div className="forecast-section">
          <h3 className="forecast-title">Prognoza na 7 dni</h3>
          <div className="forecast-list">
            {data.daily.time.map((dayTime, index) => {
              const maxTemp = data.daily.temperature_2m_max[index];
              const minTemp = data.daily.temperature_2m_min[index];
              const dailyWcc = data.daily.weathercode[index];
              const dailyUvMax = data.daily.uv_index_max[index];
              return (
                <div key={dayTime} className="forecast-card">
                  <span className="forecast-day">{getDayName(dayTime)}</span>
                  {getWeatherIcon(dailyWcc)}
                  <span className="forecast-temp">
                    {Math.round(maxTemp)}° <span className="forecast-temp-min">{Math.round(minTemp)}°</span>
                  </span>
                  {dailyUvMax !== undefined && (
                    <span className={`uv-badge ${getUvDetails(dailyUvMax).className}`} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', marginTop: '0.25rem' }}>
                      UV {dailyUvMax.toFixed(0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
