import NoiseMeasurement from './models/NoiseMeasurement.js'
import NoiseSensor from './models/NoiseSensor.js'
import MonitoringSystem from './services/MonitoringSystem.js'

// Endpoint з вашого MockAPI
const API_URL = 'https://6ad5dc21f71f154ac4861d6d.mockapi.io/api/v1/sensors'

// Інтерфейс для опису сенсора з API
interface Sensor {
  id: string
  name?: string
  district: string
  location?: string
  noiseLevel: number
  status: 'active' | 'inactive' | 'normal' | 'warning' | 'critical'
}

// Початкова ініціалізація DOM
function onDOMReady(callback: () => void): void {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback)
  } else {
    callback()
  }
}

// =========================================================================
// ЧАСТИНА 1: Таблиця вимірювань (Лабораторна №5)
// =========================================================================
const sensorsData = [
  { id: 'NS-01', district: 'Галицький', location: 'просп. Свободи', noiseLevel: 58 },
  { id: 'NS-02', district: 'Франківський', location: 'вул. Наукова', noiseLevel: 74 },
  { id: 'NS-03', district: 'Шевченківський', location: 'просп. Чорновола', noiseLevel: 83 }
]

const system = new MonitoringSystem()

sensorsData.forEach(data => {
  const sensor = new NoiseSensor(data.id, data.district, data.location, data.noiseLevel)
  system.addSensor(sensor)
})

const sensor1 = system.findSensorById('NS-01')
if (sensor1) {
  sensor1.addMeasurement(new NoiseMeasurement(52))
}

function renderSensorCards(): void {
  const tbody = document.querySelector<HTMLTableSectionElement>('.measurements-table tbody')
  if (!tbody) return

  tbody.innerHTML = ''

  system.sensors.forEach((sensor: any) => {
    const tr = document.createElement('tr')
    const status = typeof sensor.getStatus === 'function' ? sensor.getStatus() : 'normal'

    let statusText = 'Норма'
    let cssClass = 'normal-text'

    if (status === 'warning') {
      statusText = 'Попередження'
      cssClass = 'status-warning'
    } else if (status === 'critical') {
      statusText = 'Перевищення'
      cssClass = 'danger-text'
    }

    tr.innerHTML = `
      <td>${new Date().toLocaleString('uk-UA', { dateStyle: 'short', timeStyle: 'short' })}</td>
      <td>${sensor.location} (${sensor.district})</td>
      <td class="${cssClass}">${sensor.noiseLevel} дБ</td>
      <td class="${cssClass}">${statusText}</td>
    `
    tbody.appendChild(tr)
  })
}

// =========================================================================
// ЧАСТИНА 2: Завантаження з API та фільтрація на TypeScript (Лабораторна №8)
// =========================================================================
let loadedSensors: Sensor[] = []

function getSensorStatus(sensor: Sensor): 'normal' | 'warning' | 'critical' {
  if (sensor.status === 'normal' || sensor.status === 'warning' || sensor.status === 'critical') {
    return sensor.status
  }
  const level = Number(sensor.noiseLevel)
  if (level <= 55) return 'normal'
  if (level <= 70) return 'warning'
  return 'critical'
}

function createSensorCard(sensor: Sensor): HTMLElement {
  const card = document.createElement('article')
  card.classList.add('sensor-card')

  const sensorName = sensor.name || sensor.id || `NS-${sensor.id}`
  const sensorLocation = sensor.location || 'Локація не вказана'
  const status = getSensorStatus(sensor)

  const districtText = sensor.district
    ? sensor.district.includes('район')
      ? sensor.district
      : `${sensor.district} район`
    : 'Район не вказаний'

  card.innerHTML = `
    <div class="card-header">
      <h3 class="sensor-id">${sensorName}</h3>
      <span class="status-badge status-badge--${status}">
        <span class="badge-dot"></span>
        ${status}
      </span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
        <span>${districtText}</span>
      </div>
      <div class="info-row">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
          <path d="M9 22v-4h6v4"/>
          <path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/>
          <path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/>
          <path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>
        </svg>
        <span>${sensorLocation}</span>
      </div>
    </div>

    <div class="card-footer">
      <div class="noise-info">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M2 10v4"/><path d="M6 6v12"/><path d="M10 3v18"/>
          <path d="M14 8v8"/><path d="M18 5v14"/><path d="M22 11v2"/>
        </svg>
        <span>Рівень шуму: <strong class="noise-value noise-value--${status}">${sensor.noiseLevel} дБ</strong></span>
      </div>
    </div>
  `

  return card
}

function renderSensors(sensors: Sensor[]): void {
  const container = document.querySelector<HTMLDivElement>('#sensors-list')
  if (!container) return

  container.innerHTML = ''

  if (sensors.length === 0) {
    container.innerHTML = '<p class="filter-note">Сенсорів за вибраними фільтрами не знайдено.</p>'
    return
  }

  sensors.forEach((sensor: Sensor) => {
    const card = createSensorCard(sensor)
    container.append(card)
  })
}

function applyFilters(): void {
  const districtFilter = document.querySelector<HTMLSelectElement>('#district-filter')
  const criticalFilter = document.querySelector<HTMLInputElement>('#critical-filter')

  const selectedDistrict = districtFilter ? districtFilter.value : 'all'
  const criticalOnly = criticalFilter ? criticalFilter.checked : false

  const filteredSensors = loadedSensors.filter((sensor: Sensor) => {
    const matchesDistrict = selectedDistrict === 'all' || sensor.district === selectedDistrict
    const status = getSensorStatus(sensor)
    const matchesStatus = !criticalOnly || status === 'critical'
    return matchesDistrict && matchesStatus
  })

  renderSensors(filteredSensors)
}

async function loadSensors(): Promise<void> {
  const container = document.querySelector<HTMLDivElement>('#sensors-list')

  try {
    const response = await fetch(API_URL)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    loadedSensors = (await response.json()) as Sensor[]
    applyFilters()
  } catch (error) {
    console.error('Не вдалося завантажити сенсори з API:', error)
    if (container) {
      container.innerHTML =
        '<p style="color: #e10000; font-weight: bold;">Помилка завантаження даних із сервера MockAPI.</p>'
    }
  }
}

function initActiveSensors(): void {
  const districtFilter = document.querySelector<HTMLSelectElement>('#district-filter')
  const criticalFilter = document.querySelector<HTMLInputElement>('#critical-filter')

  if (districtFilter) districtFilter.addEventListener('change', applyFilters)
  if (criticalFilter) criticalFilter.addEventListener('change', applyFilters)

  loadSensors()
}

onDOMReady(() => {
  try {
    renderSensorCards()
  } catch (err) {
    console.error('Помилка в рендері таблиці:', err)
  }

  try {
    initActiveSensors()
  } catch (err) {
    console.error('Помилка в рендері активних сенсорів:', err)
  }
})
