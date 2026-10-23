export default class NoiseMeasurement {
  value: number
  measuredAt: Date

  constructor(value: number, measuredAt: Date = new Date()) {
    this.value = value
    this.measuredAt = measuredAt
  }
}
