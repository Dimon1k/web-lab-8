import NoiseMeasurement from './NoiseMeasurement.js'

const NOISE_LIMITS = Object.freeze({
  normalMax: 55,
  warningMax: 70
})

export default class NoiseSensor {
  id: string
  district: string
  location: string
  noiseLevel: number
  measurements: NoiseMeasurement[]

  constructor(id: string, district: string, location: string, noiseLevel: number) {
    this.id = id
    this.district = district
    this.location = location
    this.noiseLevel = noiseLevel
    this.measurements = []
  }

  getStatus(): 'normal' | 'warning' | 'critical' {
    if (this.noiseLevel <= NOISE_LIMITS.normalMax) return 'normal'
    if (this.noiseLevel <= NOISE_LIMITS.warningMax) return 'warning'
    return 'critical'
  }

  static isValidNoiseLevel(value: number): boolean {
    return Number.isFinite(value) && value >= 0 && value <= 200
  }

  updateNoiseLevel(value: number): void {
    if (NoiseSensor.isValidNoiseLevel(value)) {
      this.noiseLevel = value
    }
  }

  addMeasurement(measurement: NoiseMeasurement): void {
    if (!(measurement instanceof NoiseMeasurement)) {
      throw new Error("Очікується об'єкт NoiseMeasurement")
    }
    this.measurements.push(measurement)
    this.updateNoiseLevel(measurement.value)
  }
}
