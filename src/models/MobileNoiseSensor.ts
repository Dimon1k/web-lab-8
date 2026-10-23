import NoiseSensor from './NoiseSensor.js'

export default class MobileNoiseSensor extends NoiseSensor {
  batteryLevel: number

  constructor(
    id: string,
    district: string,
    location: string,
    noiseLevel: number,
    batteryLevel: number
  ) {
    super(id, district, location, noiseLevel)
    this.batteryLevel = batteryLevel
  }

  needsCharging(): boolean {
    return this.batteryLevel < 20
  }
}
