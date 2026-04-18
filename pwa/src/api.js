import axios from 'axios';

// Prosty generator fallbackowy by nie trzeba byo instalowac 'uuid' (ktorego nie installowalismy)
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function getClientId() {
    let clientId = localStorage.getItem('clientId');
    if (!clientId) {
        clientId = generateUUID();
        localStorage.setItem('clientId', clientId);
    }
    return clientId;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Dodaje UUID klienta do każdego zapytania
api.interceptors.request.use(config => {
  config.headers['Client-ID'] = getClientId();
  return config;
});

export const getFavorites = async () => {
  const res = await api.get('/favorites');
  return res.data;
};

export const addFavorite = async (city, lat, lon) => {
  const res = await api.post('/favorites', { city, lat, lon });
  return res.data;
};

export const removeFavorite = async (id) => {
  await api.delete(`/favorites/${id}`);
};

export const getWeather = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&timezone=auto`;
  const res = await axios.get(url);
  return res.data;
};

export const getCityNameFromCoords = async (lat, lon) => {
  try {
    const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`, {
      headers: {
        'Accept-Language': 'pl'
      }
    });
    if (res.data && res.data.address) {
      return res.data.address.city || res.data.address.town || res.data.address.village || 'Twoja lokalizacja';
    }
  } catch (error) {
    console.error('Błąd reverse geocodingu', error);
  }
  return 'Z geolokalizacji';
};
