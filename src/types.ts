export interface HourlyItem {
  time: string
  temp: number
  icon: string
  description: string
  pop: number
  rain: number
  snow: number
  windSpeed: number
}

export interface ForecastDay {
  date: string
  tempMin: number
  tempMax: number
  icon: string
  description: string
  pop: number
}

export interface AqiComponents {
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
  nh3: number
}

export interface WeatherData {
  city: string
  country: string
  lat: number
  lon: number
  timezone: number
  temp: number
  feelsLike: number
  tempMin: number
  tempMax: number
  humidity: number
  pressure: number
  visibility: number | null
  windSpeed: number
  windGust: number | null
  windDeg: number
  windDir: string
  description: string
  icon: string
  conditionCode: number
  conditionMain: string
  sunrise: number
  sunset: number
  sunriseLocal: string
  sunsetLocal: string
  aqi: number | null
  aqiComponents: AqiComponents | null
  forecast: ForecastDay[]
  hourly: HourlyItem[]
}

export interface ApiError {
  error: string
}
