let weatherCache = {};

export default async function handler(req, res) {
    const { city } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    if (!city) return res.status(400).json({ error: "City is required" });

    // Check cache
    if (weatherCache[city] && (Date.now() - weatherCache[city].timestamp < 10 * 60 * 1000)) {
        return res.status(200).json(weatherCache[city].data);
    }

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

    try {
        const [weatherRes, forecastRes] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
        const weatherData = await weatherRes.json();
        const forecastData = await forecastRes.json();

        if (!weatherRes.ok) {
            return res.status(weatherRes.status).json({ error: weatherData.message || "Weather data unavailable." });
        }

        const forecast = forecastData.list.filter(entry => entry.dt_txt.includes("12:00:00")).map(entry => ({
            date: entry.dt_txt.split(" ")[0],
            temp: entry.main.temp,
            icon: entry.weather[0].icon,
            description: entry.weather[0].description
        }));

        const hourly = forecastData.list.slice(0, 8).map(entry => ({
            time: entry.dt_txt.split(" ")[1].slice(0, 5),
            temp: entry.main.temp
        }));

        const responseData = { ...weatherData, forecast, hourly };

        weatherCache[city] = { data: responseData, timestamp: Date.now() };
        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ error: "Server error. Please try again later." });
    }
}
