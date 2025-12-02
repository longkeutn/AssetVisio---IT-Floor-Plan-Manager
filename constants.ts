import { Location, Device, DeviceType, DeviceStatus } from './types';

// Using picsum to simulate floor plans. In a real app, these would be URLs to images in Drive/Storage.
export const MOCK_LOCATIONS: Location[] = [
  {
    id: 'L1',
    name: 'Headquarters - 1st Floor',
    // We use a high-res placeholder to simulate a floor plan
    mapImageUrl: 'https://images.unsplash.com/photo-1558036117-15db5275d42b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    width: 1600,
    height: 1066
  },
  {
    id: 'L2',
    name: 'Warehouse B',
    mapImageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&q=80',
    width: 1600,
    height: 1000
  }
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 'D1',
    name: 'Reception PC',
    type: DeviceType.PC,
    ipAddress: '192.168.1.101',
    locationId: 'L1',
    lat: 300,
    lng: 400,
    status: DeviceStatus.ONLINE
  },
  {
    id: 'D2',
    name: 'Lobby Camera',
    type: DeviceType.CAMERA,
    ipAddress: '192.168.1.50',
    locationId: 'L1',
    lat: 800,
    lng: 200,
    status: DeviceStatus.ONLINE
  },
  {
    id: 'D3',
    name: 'Server Room Router',
    type: DeviceType.ROUTER,
    ipAddress: '192.168.1.1',
    locationId: 'L1',
    lat: 900,
    lng: 1400,
    status: DeviceStatus.MAINTENANCE
  },
  {
    id: 'D4',
    name: 'Warehouse Printer',
    type: DeviceType.PRINTER,
    ipAddress: '10.0.0.45',
    locationId: 'L2',
    lat: 500,
    lng: 800,
    status: DeviceStatus.OFFLINE
  }
];
