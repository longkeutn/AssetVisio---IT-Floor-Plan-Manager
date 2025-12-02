import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Device, Location, DeviceType, DeviceStatus } from '../types';
import { Monitor, Camera, Printer, Router, Server, AlertCircle } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix for default marker icons using CDN links
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const iconRetinaUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: iconUrl,
    iconRetinaUrl: iconRetinaUrl,
    shadowUrl: shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapBoardProps {
  location: Location;
  devices: Device[];
  onMapClick: (lat: number, lng: number) => void;
  onDeviceClick: (device: Device) => void;
}

const getIconForType = (type: DeviceType) => {
  switch (type) {
    case DeviceType.CAMERA: return <Camera size={16} />;
    case DeviceType.PRINTER: return <Printer size={16} />;
    case DeviceType.ROUTER: return <Router size={16} />;
    case DeviceType.SERVER: return <Server size={16} />;
    default: return <Monitor size={16} />;
  }
};

const getStatusColor = (status: DeviceStatus) => {
  switch (status) {
    case DeviceStatus.ONLINE: return 'bg-emerald-500';
    case DeviceStatus.OFFLINE: return 'bg-rose-500';
    case DeviceStatus.MAINTENANCE: return 'bg-amber-500';
    default: return 'bg-slate-400';
  }
};

const MapBoard: React.FC<MapBoardProps> = ({ location, devices, onMapClick, onDeviceClick }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const imageOverlayRef = useRef<L.ImageOverlay | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      // Initialize with CRS.Simple for flat image projection
      mapRef.current = L.map(mapContainerRef.current, {
        crs: L.CRS.Simple,
        minZoom: -2,
        maxZoom: 2,
        zoomSnap: 0.5,
        attributionControl: false
      });

      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onMapClick(lat, lng);
      });
    }

    return () => {
      // Cleanup if needed, though typically we keep the map instance alive if component persists
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  // Update Map Image and Bounds when Location Changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !location) return;

    // Remove old overlay
    if (imageOverlayRef.current) {
      imageOverlayRef.current.remove();
    }

    // In CRS.Simple:
    // SouthWest is [0,0]
    // NorthEast is [height, width] (Note: Lat acts as Y (height), Lng acts as X (width))
    const bounds: L.LatLngBoundsExpression = [[0, 0], [location.height, location.width]];

    imageOverlayRef.current = L.imageOverlay(location.mapImageUrl, bounds).addTo(map);
    map.fitBounds(bounds);
    
    // Set max bounds to prevent panning too far away
    map.setMaxBounds(new L.LatLngBounds([[-200, -200], [location.height + 200, location.width + 200]]));

  }, [location]);

  // Update Markers when Devices Change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    devices.forEach(device => {
      const IconComponent = getIconForType(device.type);
      const colorClass = getStatusColor(device.status);
      
      const html = renderToString(
        <div className="relative group cursor-pointer transition-transform hover:scale-110">
          <div className={`w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white ${colorClass}`}>
            {IconComponent}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white bg-white flex items-center justify-center">
             <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
          </div>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity">
            {device.name}
          </div>
        </div>
      );

      const customIcon = L.divIcon({
        className: 'custom-marker', // Tailwind handles styling via the html string
        html: html,
        iconSize: [32, 32],
        iconAnchor: [16, 16] // Center of the icon
      });

      const marker = L.marker([device.lat, device.lng], { icon: customIcon }).addTo(map);
      marker.on('click', () => {
        L.DomEvent.stopPropagation; // Prevent map click
        onDeviceClick(device);
      });

      markersRef.current.push(marker);
    });

  }, [devices, onDeviceClick]);

  return (
    <div className="h-full w-full relative bg-slate-100 overflow-hidden">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      
      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-3 rounded-lg shadow-lg border border-slate-200 z-[400] text-xs">
        <h4 className="font-bold text-slate-700 mb-2">Status Legend</h4>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Offline
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> Maintenance
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapBoard;