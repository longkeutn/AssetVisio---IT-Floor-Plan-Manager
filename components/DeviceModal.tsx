import React, { useState, useEffect } from 'react';
import { Device, DeviceType, DeviceStatus } from '../types';
import { X, Save, Trash2 } from 'lucide-react';

interface DeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (device: Partial<Device>) => void;
  onDelete: (id: string) => void;
  initialData?: Partial<Device>;
  locationId: string;
}

const DeviceModal: React.FC<DeviceModalProps> = ({ 
  isOpen, onClose, onSave, onDelete, initialData, locationId 
}) => {
  const [formData, setFormData] = useState<Partial<Device>>({
    name: '',
    type: DeviceType.PC,
    ipAddress: '',
    status: DeviceStatus.ONLINE,
    lat: 0,
    lng: 0,
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({ ...initialData, locationId });
    }
  }, [isOpen, initialData, locationId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {formData.id ? 'Edit Device' : 'Add New Device'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Device Name</label>
            <input
              required
              type="text"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g., Lobby Workstation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as DeviceType }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(DeviceType).map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as DeviceStatus }))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {Object.values(DeviceStatus).map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">IP Address</label>
            <input
              required
              type="text"
              value={formData.ipAddress || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, ipAddress: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
              placeholder="192.168.x.x"
            />
          </div>

          <div className="pt-2 text-xs text-slate-500 font-mono">
            Coordinates: [{formData.lat?.toFixed(0)}, {formData.lng?.toFixed(0)}]
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100">
             {formData.id && (
              <button
                type="button"
                onClick={() => { onDelete(formData.id!); onClose(); }}
                className="flex-1 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <Trash2 size={18} /> Delete
              </button>
            )}
            <button
              type="submit"
              className="flex-[2] px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium shadow-md shadow-blue-600/20"
            >
              <Save size={18} /> Save Device
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeviceModal;