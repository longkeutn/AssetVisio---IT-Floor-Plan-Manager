import { Device, Location } from '../types';
import { INITIAL_DEVICES, MOCK_LOCATIONS } from '../constants';

// Helper to check for GAS environment and wrap calls
// @ts-ignore
const isGas = typeof google !== 'undefined' && google.script && google.script.run;

const runGas = (funcName: string, ...args: any[]) => {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler(reject)
      [funcName](...args);
  });
};

const DELAY = 400;

class MockDatabase {
  private devices: Device[] = [...INITIAL_DEVICES];
  private locations: Location[] = [...MOCK_LOCATIONS];

  async getLocations(): Promise<Location[]> {
    if (isGas) return runGas('getLocations') as Promise<Location[]>;

    return new Promise((resolve) => {
      setTimeout(() => resolve(this.locations), DELAY);
    });
  }

  async getDevicesByLocation(locationId: string): Promise<Device[]> {
    if (isGas) return runGas('getDevicesByLocation', locationId) as Promise<Device[]>;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.devices.filter(d => d.locationId === locationId));
      }, DELAY);
    });
  }

  async addDevice(device: Device): Promise<Device> {
    if (isGas) return runGas('addDevice', device) as Promise<Device>;

    return new Promise((resolve) => {
      setTimeout(() => {
        const newDevice = { ...device, id: `D${Date.now()}` };
        this.devices.push(newDevice);
        resolve(newDevice);
      }, DELAY);
    });
  }

  async updateDevice(device: Device): Promise<Device> {
    if (isGas) return runGas('updateDevice', device) as Promise<Device>;

    return new Promise((resolve) => {
      setTimeout(() => {
        const index = this.devices.findIndex(d => d.id === device.id);
        if (index !== -1) {
          this.devices[index] = device;
        }
        resolve(device);
      }, DELAY);
    });
  }

  async deleteDevice(deviceId: string): Promise<void> {
    if (isGas) return runGas('deleteDevice', deviceId) as Promise<void>;

    return new Promise((resolve) => {
      setTimeout(() => {
        this.devices = this.devices.filter(d => d.id !== deviceId);
        resolve();
      }, DELAY);
    });
  }
}

export const db = new MockDatabase();