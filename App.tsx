import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import MapBoard from './components/MapBoard';
import DeviceModal from './components/DeviceModal';
import { db } from './services/mockDatabase';
import { analyzeAssets } from './services/geminiService';
import { Device, Location, AnalysisResult } from './types';

const App: React.FC = () => {
  // Application State
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [devices, setDevices] = useState<Device[]>([]);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<Partial<Device> | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      try {
        const locs = await db.getLocations();
        setLocations(locs);
        if (locs.length > 0) {
          setSelectedLocationId(locs[0].id);
        }
      } catch (error) {
        console.error("Failed to load initial data", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Load devices when location changes
  useEffect(() => {
    if (!selectedLocationId) return;
    
    setIsLoading(true);
    setAnalysisResult(null); // Clear previous AI analysis
    
    const fetchDevices = async () => {
      const devs = await db.getDevicesByLocation(selectedLocationId);
      setDevices(devs);
      setIsLoading(false);
    };
    fetchDevices();
  }, [selectedLocationId]);

  // Handlers
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedDevice({
      locationId: selectedLocationId,
      lat,
      lng
    });
    setModalOpen(true);
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setModalOpen(true);
  };

  const handleSaveDevice = async (deviceData: Partial<Device>) => {
    try {
      if (deviceData.id) {
        // Update existing
        const updated = await db.updateDevice(deviceData as Device);
        setDevices(prev => prev.map(d => d.id === updated.id ? updated : d));
      } else {
        // Add new
        const newDevice = await db.addDevice(deviceData as Device);
        setDevices(prev => [...prev, newDevice]);
      }
    } catch (error) {
      console.error("Error saving device", error);
      alert("Failed to save device");
    }
  };

  const handleDeleteDevice = async (id: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return;
    try {
      await db.deleteDevice(id);
      setDevices(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error("Error deleting device", error);
    }
  };

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    const locationName = locations.find(l => l.id === selectedLocationId)?.name || 'Unknown Location';
    
    try {
        const result = await analyzeAssets(locationName, devices);
        setAnalysisResult(result);
    } catch (e) {
        // Fallback for demo if no API key
        setAnalysisResult({
            summary: "AI Analysis requires a valid API Key in the environment. (Demo Mode: Analysis Simulated)",
            recommendations: ["Check firewall settings for Printer D4", "Upgrade firmware on Router D3", "Label all ethernet ports"],
            alertLevel: "MEDIUM"
        });
    } finally {
        setIsAnalyzing(false);
    }
  };

  const selectedLocation = locations.find(l => l.id === selectedLocationId);

  if (!selectedLocation && !isLoading) {
    return <div className="flex h-screen items-center justify-center text-slate-500">No locations found.</div>;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen overflow-hidden font-sans">
      <Sidebar 
        locations={locations}
        selectedLocationId={selectedLocationId}
        onSelectLocation={setSelectedLocationId}
        devices={devices}
        onSelectDevice={handleDeviceClick}
        onAddDevice={() => {
            setSelectedDevice({ locationId: selectedLocationId });
            setModalOpen(true);
        }}
        onAnalyze={handleAIAnalysis}
        isAnalyzing={isAnalyzing}
        analysisResult={analysisResult}
      />
      
      <div className="flex-1 relative h-full">
        {isLoading && (
            <div className="absolute inset-0 z-50 bg-white/80 flex items-center justify-center">
                <div className="text-blue-600 font-bold animate-pulse">Loading Assets...</div>
            </div>
        )}
        
        {selectedLocation && (
            <MapBoard 
                location={selectedLocation}
                devices={devices}
                onMapClick={handleMapClick}
                onDeviceClick={handleDeviceClick}
            />
        )}
      </div>

      <DeviceModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveDevice}
        onDelete={handleDeleteDevice}
        initialData={selectedDevice || {}}
        locationId={selectedLocationId}
      />
    </div>
  );
};

export default App;