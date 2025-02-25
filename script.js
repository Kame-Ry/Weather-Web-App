<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
    <div class="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl text-gray-900">
        <div class="flex flex-col items-center">
            <input id="city-input" type="text" placeholder="Enter city..." class="border border-gray-300 p-2 rounded w-full max-w-sm mb-4 text-center">
            <button onclick="fetchWeather(document.getElementById('city-input').value)" class="bg-indigo-500 text-white px-6 py-2 rounded shadow-md hover:bg-indigo-600 transition">Get Weather</button>
        </div>
        
        <p id="last-updated" class="text-sm text-gray-500 mt-4">Loading...</p>
        <h1 class="text-4xl font-extrabold mb-4 text-indigo-600 tracking-wide uppercase drop-shadow-lg text-center" id="city">Loading...</h1>
        <p class="text-lg text-gray-700 text-center" id="weather-description">Loading...</p>
        <h2 class="text-6xl font-bold text-center" id="current-temp">--°C</h2>
        <div class="mt-4 grid grid-cols-2 gap-4 text-sm text-center">
            <p>Humidity: <span id="humidity">--</span>%</p>
            <p>Wind: <span id="wind">--</span> mph</p>
            <p>Sunrise: <span id="sunrise">--</span></p>
            <p>Sunset: <span id="sunset">--</span></p>
        </div>
        
        <h3 class="text-xl font-bold mt-6 text-indigo-900">Hourly Forecast</h3>
        <canvas id="hourly-chart"></canvas>
        
        <h3 class="text-xl font-bold mt-6 text-indigo-900">3-Day Forecast</h3>
        <div id="forecast-container" class="mt-2 flex flex-row space-x-4 overflow-x-auto"></div>
    </div>
    
    <script>
        const apiKey = '067e31ad4791b4705d65498a15ecc61f';
        
        function roundTemp(temp) {
            return (Math.round(temp * 10) / 10).toFixed(1);
        }
        
        async function fetchWeather(city) {
            if (!city) return alert("Please enter a city");
            try {
                const response = await fetch(`/api/weather?city=${city}`);
                if (!response.ok) throw new Error("Location not found");
                
                const data = await response.json();
                document.getElementById("last-updated").textContent = new Date().toLocaleString();
                document.getElementById("city").textContent = `${data.name}, ${data.sys.country}`;
                document.getElementById("weather-description").textContent = `Feels like ${roundTemp(data.main.feels_like)}°C. ${data.weather[0].description}`;
                document.getElementById("current-temp").textContent = `${roundTemp(data.main.temp)}°C`;
                document.getElementById("humidity").textContent = data.main.humidity;
                document.getElementById("wind").textContent = (data.wind.speed * 2.237).toFixed(1);
                document.getElementById("sunrise").textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
                document.getElementById("sunset").textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString();
                
                fetchForecast(city);
                fetchHourlyForecast(city);
            } catch (error) {
                alert(error.message);
                console.error(error);
            }
        }
        
        async function fetchHourlyForecast(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
                if (!response.ok) throw new Error("Could not fetch hourly forecast data");
                const data = await response.json();
                
                const hourlyTemps = [];
                const hourlyLabels = [];
                
                data.list.slice(0, 12).forEach(entry => {
                    hourlyTemps.push(roundTemp(entry.main.temp));
                    hourlyLabels.push(new Date(entry.dt_txt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                });
                
                new Chart(document.getElementById("hourly-chart"), {
                    type: "line",
                    data: {
                        labels: hourlyLabels,
                        datasets: [{
                            label: "Temperature (°C)",
                            data: hourlyTemps,
                            borderColor: "#4F46E5",
                            backgroundColor: "rgba(79, 70, 229, 0.2)",
                            fill: true
                        }]
                    }
                });
            } catch (error) {
                console.error("Error fetching hourly forecast:", error);
            }
        }
        
        async function fetchForecast(city) {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`);
                if (!response.ok) throw new Error("Could not fetch forecast data");
                const data = await response.json();
                
                const forecastContainer = document.getElementById("forecast-container");
                forecastContainer.innerHTML = "";
                const forecastDays = {};
                
                data.list.forEach(entry => {
                    const date = new Date(entry.dt_txt).toLocaleDateString();
                    if (!forecastDays[date]) {
                        forecastDays[date] = { temps: [], icon: entry.weather[0].icon, description: entry.weather[0].description };
                    }
                    forecastDays[date].temps.push(roundTemp(entry.main.temp));
                });
                
                const futureDates = Object.keys(forecastDays).slice(1, 4); 
                futureDates.forEach(date => {
                    const day = forecastDays[date];
                    const minTemp = Math.min(...day.temps);
                    const maxTemp = Math.max(...day.temps);
                    
                    const forecastCard = document.createElement("div");
                    forecastCard.className = "p-4 bg-indigo-100 rounded-lg shadow-md flex flex-col items-center text-center min-w-[150px]";
                    forecastCard.innerHTML = `
                        <h4 class="text-lg font-bold">${date}</h4>
                        <p>${maxTemp}°C / ${minTemp}°C</p>
                        <img src='https://openweathermap.org/img/wn/${day.icon}.png' class='w-12 h-12'>
                        <p class="text-sm">${day.description}</p>
                    `;
                    forecastContainer.appendChild(forecastCard);
                });
            } catch (error) {
                console.error("Error fetching forecast:", error);
            }
        }
    </script>
</body>
</html>
