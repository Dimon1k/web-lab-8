import NoiseSensor from '../models/NoiseSensor.js';
export default class MonitoringSystem {
    constructor() {
        this.sensors = [];
    }
    addSensor(sensor) {
        if (!(sensor instanceof NoiseSensor)) {
            throw new Error("Можна додавати лише об'єкти NoiseSensor");
        }
        const sensorExists = this.sensors.some(item => item.id === sensor.id);
        if (sensorExists) {
            throw new Error(`Датчик ${sensor.id} вже існує`);
        }
        this.sensors.push(sensor);
    }
    findSensorById(id) {
        return this.sensors.find(sensor => sensor.id === id);
    }
    getSensorsByDistrict(district) {
        return this.sensors.filter(sensor => sensor.district === district);
    }
    getCriticalSensors() {
        return this.sensors.filter(sensor => sensor.getStatus() === 'critical');
    }
    getAverageNoiseLevel() {
        if (this.sensors.length === 0)
            return 0;
        const total = this.sensors.reduce((sum, sensor) => sum + sensor.noiseLevel, 0);
        return total / this.sensors.length;
    }
}
