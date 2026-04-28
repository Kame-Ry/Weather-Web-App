import type { WeatherData } from './types'
import {
  AQI_LABELS, AQI_COLORS, AQI_BG,
  conditionToBg, feelsDesc, humidityDesc,
  visibilityDesc, pressureDesc, dayLabel,
  sunPosition, owmIcon,
} from './utils'

const $ = (id: string) => document.getElementById(id)!

export function showLoading(): void {
  $('loading-state').style.display   = 'block'
  $('empty-state').style.display     = 'none'
  $('weather-content').style.display = 'none'
  $('weather-content').className     = ''
}

export function showEmpty(): void {
  $('loading-state').style.display   = 'none'
  $('empty-state').style.display     = 'block'
  $('weather-content').style.display = 'none'
}

export function showError(msg: string): void {
  const el = $('error-msg')
  el.textContent = msg
  el.style.display = 'block'
  clearTimeout((showError as { _t?: ReturnType<typeof setTimeout> })._t)
  ;(showError as { _t?: ReturnType<typeof setTimeout> })._t = setTimeout(
    () => { el.style.display = 'none' },
    5000,
  )
}

export function render(d: WeatherData): void {
  $('weather-bg').style.background = conditionToBg(d.conditionCode, d.icon)

  $('hero-location').textContent = `${d.city}, ${d.country}`
  $('hero-temp').textContent     = `${d.temp}°`
  $('hero-desc').textContent     = d.description
  $('hero-range').textContent    = `H: ${d.tempMax}°  ·  L: ${d.tempMin}°`
  $('hero-updated').textContent  = `Updated ${new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`

  const icon = $('hero-icon') as HTMLImageElement
  icon.src = owmIcon(d.icon, '2x')
  icon.style.display = 'block'

  $('stat-feels').textContent     = `${d.feelsLike}°`
  $('stat-feels-sub').textContent = feelsDesc(d.temp, d.feelsLike)

  $('stat-humidity').textContent     = `${d.humidity}%`
  $('stat-humidity-sub').textContent = humidityDesc(d.humidity)

  $('stat-wind').textContent     = `${d.windSpeed} km/h`
  $('stat-wind-sub').textContent = d.windGust ? `${d.windDir} · gusts ${d.windGust}` : d.windDir

  const compassDot = $('compass-dot') as HTMLElement
  const rad = (d.windDeg - 90) * (Math.PI / 180)
  compassDot.style.transform = `translate(calc(${50 + Math.cos(rad) * 38}% - 1.5px), calc(${50 + Math.sin(rad) * 38}% - 1.5px))`

  if (d.visibility != null) {
    $('stat-visibility').textContent     = `${d.visibility} km`
    $('stat-visibility-sub').textContent = visibilityDesc(d.visibility)
  } else {
    $('stat-visibility').textContent     = '—'
    $('stat-visibility-sub').textContent = ''
  }

  $('stat-pressure').textContent     = String(d.pressure)
  $('stat-pressure-sub').textContent = pressureDesc(d.pressure) + ' hPa'

  if (d.aqi) {
    const idx = d.aqi as 1 | 2 | 3 | 4 | 5
    $('stat-aqi').innerHTML       = `<span class="aqi-pill" style="color:${AQI_COLORS[idx]};background:${AQI_BG[idx]}">${AQI_LABELS[idx]}</span>`
    $('stat-aqi-sub').textContent = `Index ${d.aqi} / 5`
  } else {
    $('stat-aqi').textContent     = '—'
    $('stat-aqi-sub').textContent = 'Unavailable'
  }

  const hourlyTrack = $('hourly-track')
  hourlyTrack.innerHTML = ''
  d.hourly.forEach(h => {
    const el = document.createElement('div')
    el.className = 'hourly-item'
    el.innerHTML = `
      <span class="time">${h.time}</span>
      <img src="${owmIcon(h.icon, '1x')}" alt="${h.description}" loading="lazy">
      <span class="temp">${h.temp}°</span>
      <span class="pop${h.pop > 0 ? '' : ' invisible'}">${h.pop > 0 ? h.pop + '%' : '·'}</span>
    `
    hourlyTrack.appendChild(el)
  })

  const forecastRows = $('forecast-rows')
  forecastRows.innerHTML = ''
  if (d.forecast.length) {
    const allMin = Math.min(...d.forecast.map(f => f.tempMin))
    const allMax = Math.max(...d.forecast.map(f => f.tempMax))
    const span   = allMax - allMin || 1
    d.forecast.forEach(f => {
      const left  = (((f.tempMin - allMin) / span) * 100).toFixed(1)
      const width = (((f.tempMax - f.tempMin) / span) * 100).toFixed(1)
      const row   = document.createElement('div')
      row.className = 'forecast-row'
      row.innerHTML = `
        <span class="forecast-day">${dayLabel(f.date)}</span>
        <img src="${owmIcon(f.icon, '1x')}" alt="${f.description}" loading="lazy">
        <span class="forecast-pop">${f.pop > 0 ? f.pop + '%' : ''}</span>
        <div class="forecast-temps">
          <span class="f-min">${f.tempMin}°</span>
          <div class="temp-bar"><div class="temp-bar-fill" style="left:${left}%;width:${width}%"></div></div>
          <span class="f-max">${f.tempMax}°</span>
        </div>
      `
      forecastRows.appendChild(row)
    })
  }

  $('sunrise-val').textContent = d.sunriseLocal
  $('sunset-val').textContent  = d.sunsetLocal
  $('sun-orb').style.left      = `${sunPosition(d.sunrise, d.sunset, d.timezone)}%`
  const dh = Math.floor((d.sunset - d.sunrise) / 3600)
  const dm = Math.floor(((d.sunset - d.sunrise) % 3600) / 60)
  $('daylight-text').textContent = `${dh}h ${dm}m of daylight`

  $('loading-state').style.display = 'none'
  $('empty-state').style.display   = 'none'
  const content = $('weather-content')
  content.style.display = 'block'
  content.className = 'visible'
}
