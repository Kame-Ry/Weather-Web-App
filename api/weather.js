export default async function handler(req, res) {
    const { city, type } = req.query;
    const API_KEY = process.env.WEATHER_API_KEY;

    if (!city) {
        return res.status(400).json({ error: "City is required" });
    }

    let url;
    if (type === "forecast") {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    } else if (type === "hourly") {
        url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
    } else {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch weather data. Please check the city name and try again." });
        }
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "An internal server error occurred while fetching weather data." });
    }
}
