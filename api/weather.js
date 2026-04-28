const CACHE = new Map();
const CACHE_TTL = 10 * 60 * 1000;

function getCacheKey({ city, lat, lon }) {
  return city
    ? `city:${city.toLowerCase().trim()}`
    : `coords:${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
}

function getWindDirection(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

function formatLocalTime(unixUtc, tzOffsetSeconds) {
  const d = new Date((unixUtc + tzOffsetSeconds) * 1000);
  const h = d.getUTCHours().toString().padStart(2, '0');
  const m = d.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

function processHourly(list, tzOffset) {
  return list.slice(0, 12).map(entry => ({
    time: formatLocalTime(entry.dt, tzOffset),
    temp: Math.round(entry.main.temp),
    icon: entry.weather[0].icon,
    description: entry.weather[0].main,
    pop: Math.round((entry.pop || 0) * 100),
    rain: entry.rain?.['3h'] ?? 0,
    snow: entry.snow?.['3h'] ?? 0,
    windSpeed: Math.round(entry.wind.speed * 3.6),
  }));
}

function processForecast(list) {
  const daily = {};

  list.forEach(entry => {
    const date = entry.dt_txt.split(' ')[0];
    if (!daily[date]) {
      daily[date] = { date, temps: [], icons: {}, descriptions: {}, pops: [] };
    }
    daily[date].temps.push(entry.main.temp);
    const icon = entry.weather[0].icon;
    daily[date].icons[icon] = (daily[date].icons[icon] || 0) + 1;
    const desc = entry.weather[0].description;
    daily[date].descriptions[desc] = (daily[date].descriptions[desc] || 0) + 1;
    daily[date].pops.push(entry.pop || 0);
  });

  return Object.values(daily).slice(0, 5).map(day => ({
    date: day.date,
    tempMin: Math.round(Math.min(...day.temps)),
    tempMax: Math.round(Math.max(...day.temps)),
    icon: Object.entries(day.icons).sort((a, b) => b[1] - a[1])[0][0],
    description: Object.entries(day.descriptions).sort((a, b) => b[1] - a[1])[0][0],
    pop: Math.round(Math.max(...day.pops) * 100),
  }));
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { city, lat, lon } = req.query;
  const API_KEY = process.env.WEATHER_API_KEY;

  if (!API_KEY) return res.status(500).json({ error: 'API key not configured.' });
  if (!city && (!lat || !lon)) return res.status(400).json({ error: 'Provide a city name or lat/lon coordinates.' });

  if (!city) {
    const latN = parseFloat(lat);
    const lonN = parseFloat(lon);
    if (isNaN(latN) || isNaN(lonN) || latN < -90 || latN > 90 || lonN < -180 || lonN > 180) {
      return res.status(400).json({ error: 'Invalid coordinates.' });
    }
  }

  const cacheKey = getCacheKey({ city, lat, lon });
  const cached = CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(200).json(cached.data);
  }

  const locationParam = city
    ? `q=${encodeURIComponent(city.trim())}`
    : `lat=${lat}&lon=${lon}`;

  const BASE = 'https://api.openweathermap.org/data/2.5';

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      fetch(`${BASE}/weather?${locationParam}&units=metric&appid=${API_KEY}`),
      fetch(`${BASE}/forecast?${locationParam}&units=metric&appid=${API_KEY}`),
    ]);

    if (!weatherRes.ok) {
      const err = await weatherRes.json().catch(() => ({}));
      const status = weatherRes.status;
      if (status === 404) return res.status(404).json({ error: 'City not found. Try a different search.' });
      if (status === 401) return res.status(401).json({ error: 'Invalid API key.' });
      return res.status(status).json({ error: err.message || 'Weather data unavailable.' });
    }

    const [weather, forecast] = await Promise.all([weatherRes.json(), forecastRes.json()]);
    const tzOffset = weather.timezone;

    const { lat: wLat, lon: wLon } = weather.coord;
    const aqiRes = await fetch(`${BASE}/air_pollution?lat=${wLat}&lon=${wLon}&appid=${API_KEY}`).catch(() => null);
    const aqiData = aqiRes?.ok ? await aqiRes.json().catch(() => null) : null;

    const data = {
      city: weather.name,
      country: weather.sys.country,
      lat: wLat,
      lon: wLon,
      timezone: tzOffset,
      temp: Math.round(weather.main.temp),
      feelsLike: Math.round(weather.main.feels_like),
      tempMin: Math.round(weather.main.temp_min),
      tempMax: Math.round(weather.main.temp_max),
      humidity: weather.main.humidity,
      pressure: weather.main.pressure,
      visibility: weather.visibility != null ? Math.round(weather.visibility / 100) / 10 : null,
      windSpeed: Math.round(weather.wind.speed * 3.6),
      windGust: weather.wind.gust != null ? Math.round(weather.wind.gust * 3.6) : null,
      windDeg: weather.wind.deg,
      windDir: getWindDirection(weather.wind.deg ?? 0),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon,
      conditionCode: weather.weather[0].id,
      conditionMain: weather.weather[0].main,
      sunrise: weather.sys.sunrise,
      sunset: weather.sys.sunset,
      sunriseLocal: formatLocalTime(weather.sys.sunrise, tzOffset),
      sunsetLocal: formatLocalTime(weather.sys.sunset, tzOffset),
      aqi: aqiData?.list?.[0]?.main?.aqi ?? null,
      aqiComponents: aqiData?.list?.[0]?.components ?? null,
      forecast: processForecast(forecast.list),
      hourly: processHourly(forecast.list, tzOffset),
    };

    CACHE.set(cacheKey, { data, timestamp: Date.now() });
    res.setHeader('X-Cache', 'MISS');
    res.status(200).json(data);
  } catch (err) {
    console.error('[weather api]', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
}
