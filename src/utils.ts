export const AQI_LABELS = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor'] as const
export const AQI_COLORS = ['', '#22c55e', '#a3e635', '#facc15', '#f97316', '#ef4444'] as const
export const AQI_BG     = ['', 'rgba(34,197,94,0.15)', 'rgba(163,230,53,0.15)', 'rgba(250,204,21,0.15)', 'rgba(249,115,22,0.15)', 'rgba(239,68,68,0.15)'] as const

const WEATHER_BG: Record<string, string> = {
  thunderstorm: 'radial-gradient(ellipse 100% 60% at 50% 0%, #1a0d30 0%, #080810 65%)',
  drizzle:      'radial-gradient(ellipse 100% 60% at 50% 0%, #0d1a2a 0%, #080810 65%)',
  rain:         'radial-gradient(ellipse 100% 60% at 50% 0%, #0a1520 0%, #080810 65%)',
  snow:         'radial-gradient(ellipse 100% 60% at 50% 0%, #0f1e2e 0%, #080810 65%)',
  atmosphere:   'radial-gradient(ellipse 100% 60% at 50% 0%, #111116 0%, #080810 65%)',
  clear_day:    'radial-gradient(ellipse 100% 60% at 50% 0%, #082040 0%, #080810 65%)',
  clear_night:  'radial-gradient(ellipse 100% 60% at 50% 0%, #060a1e 0%, #080810 65%)',
  few_clouds:   'radial-gradient(ellipse 100% 60% at 50% 0%, #0d1828 0%, #080810 65%)',
  clouds:       'radial-gradient(ellipse 100% 60% at 50% 0%, #0f1118 0%, #080810 65%)',
}

export function conditionToBg(code: number, icon: string): string {
  const night = icon.endsWith('n')
  if (code >= 200 && code < 300) return WEATHER_BG.thunderstorm
  if (code >= 300 && code < 400) return WEATHER_BG.drizzle
  if (code >= 500 && code < 600) return WEATHER_BG.rain
  if (code >= 600 && code < 700) return WEATHER_BG.snow
  if (code >= 700 && code < 800) return WEATHER_BG.atmosphere
  if (code === 800)               return night ? WEATHER_BG.clear_night : WEATHER_BG.clear_day
  if (code <= 802)                return WEATHER_BG.few_clouds
  return WEATHER_BG.clouds
}

export function feelsDesc(temp: number, feels: number): string {
  const d = feels - temp
  if (d <= -4) return 'Feels colder'
  if (d >= 4)  return 'Feels warmer'
  return 'Feels similar'
}

export function humidityDesc(h: number): string {
  if (h < 30) return 'Dry'
  if (h < 50) return 'Comfortable'
  if (h < 70) return 'Moderate'
  if (h < 85) return 'Humid'
  return 'Very humid'
}

export function visibilityDesc(km: number): string {
  if (km >= 10) return 'Clear'
  if (km >= 5)  return 'Good'
  if (km >= 2)  return 'Moderate'
  return 'Poor'
}

export function pressureDesc(p: number): string {
  if (p < 1000) return 'Low pressure'
  if (p < 1013) return 'Below normal'
  if (p < 1020) return 'Normal'
  return 'High pressure'
}

export function dayLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00Z')
  const todayStr = new Date().toISOString().slice(0, 10)
  if (dateStr === todayStr) return 'Today'
  return d.toLocaleDateString('en-GB', { weekday: 'short' })
}

export function sunPosition(sunrise: number, sunset: number, timezone: number): number {
  const now = Math.floor(Date.now() / 1000)
  const s = sunrise + timezone
  const e = sunset  + timezone
  const n = now     + timezone
  if (n <= s) return 0
  if (n >= e) return 100
  return Math.round(((n - s) / (e - s)) * 100)
}

export function owmIcon(icon: string, size: '1x' | '2x' | '4x' = '2x'): string {
  return `https://openweathermap.org/img/wn/${icon}@${size}.png`
}
