import NoiseSensor from './NoiseSensor.js';
export default class MobileNoiseSensor extends NoiseSensor {
    constructor(id, district, location, noiseLevel, batteryLevel) {
        super(id, district, location, noiseLevel);
        this.batteryLevel = batteryLevel;
    }
    needsCharging() {
        return this.batteryLevel < 20;
    }
}
