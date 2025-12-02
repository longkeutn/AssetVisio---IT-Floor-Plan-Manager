export enum DeviceType {
  PC = 'PC',
  CAMERA = 'CAMERA',
  PRINTER = 'PRINTER',
  ROUTER = 'ROUTER',
  SERVER = 'SERVER'
}

export enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE'
}

export interface Location {
  id: string;
  name: string;
  mapImageUrl: string;
  width: number; // Needed for CRS.Simple bounds
  height: number; // Needed for CRS.Simple bounds
}

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  ipAddress: string;
  locationId: string;
  lat: number; // Y coordinate in CRS.Simple
  lng: number; // X coordinate in CRS.Simple
  status: DeviceStatus;
}

export interface AnalysisResult {
  summary: string;
  recommendations: string[];
  alertLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}
