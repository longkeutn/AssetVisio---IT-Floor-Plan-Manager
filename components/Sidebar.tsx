import React from 'react';
import { Device, Location, DeviceStatus } from '../types';
import { 
  Server, 
  Map as MapIcon, 
  Wifi, 
  WifiOff, 
  AlertTriangle,
  Search,
  Plus,
  BrainCircuit,
  Loader2
} from 'lucide-react';

interface SidebarProps {
  locations: Location[];
  selectedLocationId: string;
  onSelectLocation: (id: string) => void;
  devices: Device[];
  onSelectDevice: (device: Device) => void;
  onAddDevice: () => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  analysisResult: any;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  locations, 
  selectedLocationId, 
  onSelectLocation,
  devices,
  onSelectDevice,
  onAddDevice,
  onAnalyze,
  isAnalyzing,
  analysisResult
}) => {
  
  const onlineCount = devices.filter(d => d.status === DeviceStatus.ONLINE).length;
  const offlineCount = devices.filter(d => d.status === DeviceStatus.OFFLINE).length;
  const maintenanceCount = devices.filter(d => d.status === DeviceStatus.MAINTENANCE).length;

  return (
    <div className="w-full md:w-80 h-full bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Server size={18} />
          </div>
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">AssetVisio</h1>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Location</label>
          <div className="relative">
            <MapIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select 
              value={selectedLocationId}
              onChange={(e) => onSelectLocation(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1 p-2 bg-slate-50 border-b border-slate-100">
        <div className="flex flex-col items-center p-2 rounded bg-emerald-50 border border-emerald-100">
          <Wifi size={16} className="text-emerald-600 mb-1" />
          <span className="text-lg font-bold text-emerald-700 leading-none">{onlineCount}</span>
          <span className="text-[10px] text-emerald-600 uppercase">Online</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded bg-rose-50 border border-rose-100">
          <WifiOff size={16} className="text-rose-600 mb-1" />
          <span className="text-lg font-bold text-rose-700 leading-none">{offlineCount}</span>
          <span className="text-[10px] text-rose-600 uppercase">Offline</span>
        </div>
        <div className="flex flex-col items-center p-2 rounded bg-amber-50 border border-amber-100">
          <AlertTriangle size={16} className="text-amber-600 mb-1" />
          <span className="text-lg font-bold text-amber-700 leading-none">{maintenanceCount}</span>
          <span className="text-[10px] text-amber-600 uppercase">Maint.</span>
        </div>
      </div>

      {/* Device List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-bold text-slate-700">Devices ({devices.length})</h2>
          <button 
            onClick={onAddDevice}
            className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
            title="Add Device manually (or click map)"
          >
            <Plus size={16} />
          </button>
        </div>

        <div className="space-y-2">
          {devices.map(device => (
            <div 
              key={device.id}
              onClick={() => onSelectDevice(device)}
              className="group p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer bg-white"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-slate-800 text-sm group-hover:text-blue-700">{device.name}</h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">{device.ipAddress}</p>
                </div>
                <div className={`w-2 h-2 rounded-full mt-1.5 ${
                  device.status === DeviceStatus.ONLINE ? 'bg-emerald-500' :
                  device.status === DeviceStatus.OFFLINE ? 'bg-rose-500' : 'bg-amber-500'
                }`} />
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-slate-400">
                <span className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-500 uppercase tracking-wide text-[10px]">{device.type}</span>
                <span>ID: {device.id}</span>
              </div>
            </div>
          ))}
          
          {devices.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-sm italic border-2 border-dashed border-slate-200 rounded-lg">
              No devices on this floor yet.
            </div>
          )}
        </div>
      </div>

      {/* AI Action Area */}
      <div className="p-4 bg-gradient-to-b from-indigo-50 to-white border-t border-indigo-100">
        <button
          onClick={onAnalyze}
          disabled={isAnalyzing}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-indigo-200 disabled:opacity-70"
        >
          {isAnalyzing ? <Loader2 size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
          {isAnalyzing ? 'Analyzing...' : 'AI Network Analysis'}
        </button>

        {analysisResult && (
           <div className="mt-3 text-xs bg-white p-3 rounded border border-indigo-100 shadow-sm animate-fade-in">
             <div className="flex items-center justify-between mb-2">
               <span className="font-bold text-indigo-900">Analysis Report</span>
               <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                 analysisResult.alertLevel === 'HIGH' ? 'bg-red-100 text-red-700' :
                 analysisResult.alertLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-700' :
                 'bg-green-100 text-green-700'
               }`}>
                 {analysisResult.alertLevel} RISK
               </span>
             </div>
             <p className="text-slate-600 mb-2 leading-relaxed">{analysisResult.summary}</p>
             <ul className="list-disc pl-3 space-y-1 text-slate-500">
               {analysisResult.recommendations.map((rec: string, i: number) => (
                 <li key={i}>{rec}</li>
               ))}
             </ul>
           </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
