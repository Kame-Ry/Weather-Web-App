import './style.css'
import type { WeatherData, ApiError } from './types'
import { render, showLoading, showEmpty, showError } from './render'

async function fetchWeather(params: { city: string } | { lat: number; lon: number }): Promise<void> {
  const qs = 'city' in params
    ? `city=${encodeURIComponent(params.city.trim())}`
    : `lat=${params.lat}&lon=${params.lon}`

  showLoading()
  try {
    const res  = await fetch(`/api/weather?${qs}`)
    const data = await res.json() as WeatherData | ApiError

    if (!res.ok || 'error' in data) {
      throw new Error('error' in data ? data.error : 'Could not load weather.')
    }

    render(data)
  } catch (err) {
    showError(err instanceof Error ? err.message : 'Something went wrong.')
    showEmpty()
  }
}

function geolocate(): void {
  if (!navigator.geolocation) {
    showError('Geolocation is not supported by your browser.')
    showEmpty()
    return
  }

  const btn = document.getElementById('locate-btn') as HTMLButtonElement
  btn.disabled = true

  navigator.geolocation.getCurrentPosition(
    pos => {
      btn.disabled = false
      fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude })
    },
    () => {
      btn.disabled = false
      showEmpty()
    },
    { timeout: 8000 },
  )
}

const searchInput = document.getElementById('search-input') as HTMLInputElement
const locateBtn   = document.getElementById('locate-btn')   as HTMLButtonElement

searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = searchInput.value.trim()
    if (val) fetchWeather({ city: val })
  }
})

locateBtn.addEventListener('click', geolocate)

geolocate()
