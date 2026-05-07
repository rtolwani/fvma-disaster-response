'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, AlertTriangle, CheckCircle, Users, GraduationCap } from 'lucide-react';

export default function Dashboard() {
  // Mock data - will replace with real Supabase data
  const [stats] = useState({
    responded: 850,
    total: 1200,
    needHelp: 89,
    critical: 24,
    safe: 737,
    ceOptIn: 945,
  });

  const [responses] = useState([
    { id: 1, clinic: 'Sunshine Animal Hospital', county: 'Miami-Dade', status: 'safe_operating', time: '10:45 AM', needs: [] },
    { id: 2, clinic: 'Coastal Veterinary Clinic', county: 'Broward', status: 'need_help', time: '10:42 AM', needs: ['Generator', 'Water'] },
    { id: 3, clinic: 'Bayfront Emergency', county: 'Tampa', status: 'unsafe_evacuating', time: '10:40 AM', needs: ['Evacuation Transport', 'Medical Supplies'] },
    { id: 4, clinic: 'Orlando Pet Care', county: 'Orange', status: 'safe_closed', time: '10:38 AM', needs: [] },
    { id: 5, clinic: 'Jacksonville Animal ER', county: 'Duval', status: 'need_help', time: '10:35 AM', needs: ['Personnel'] },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe_operating': return 'bg-green-100 text-green-800';
      case 'safe_closed': return 'bg-blue-100 text-blue-800';
      case 'need_help': return 'bg-orange-100 text-orange-800';
      case 'unsafe_evacuating': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'safe_operating': return 'Safe & Operating';
      case 'safe_closed': return 'Safe & Closed';
      case 'need_help': return 'Needs Help';
      case 'unsafe_evacuating': return 'Unsafe/Evacuating';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">FVMA Disaster Response</h1>
                <p className="text-sm text-gray-600">Emergency Coordination Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Hurricane Ian 2026</span>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                End Event
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Responded</p>
                <p className="text-2xl font-bold text-gray-900">{stats.responded}/{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Need Help</p>
                <p className="text-2xl font-bold text-orange-600">{stats.needHelp}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Safe</p>
                <p className="text-2xl font-bold text-green-600">{stats.safe}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CE Opt-In</p>
                <p className="text-2xl font-bold text-purple-600">{stats.ceOptIn}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Map Placeholder */}
          <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Florida Clinic Map</h2>
              <div className="flex items-center gap-2">
                <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">
                  <option>All Counties</option>
                  <option>Miami-Dade</option>
                  <option>Broward</option>
                  <option>Tampa</option>
                  <option>Orange</option>
                </select>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
                  Refresh
                </button>
              </div>
            </div>
            
            {/* Map Container */}
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-2" />
                <p className="text-sm">Interactive Florida Map</p>
                <p className="text-xs mt-1">Clustered view: 1,200+ clinics</p>
                <p className="text-xs text-gray-400 mt-2">(Leaflet map integration coming)</p>
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex items-center gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>High Response (&gt;80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Moderate (50-80%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Low (&lt;50%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical</span>
              </div>
            </div>
          </div>

          {/* Response Feed */}
          <div className="col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Live Responses</h2>
            <div className="space-y-3">
              {responses.map((response) => (
                <div key={response.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{response.clinic}</p>
                      <p className="text-xs text-gray-500">{response.county} • {response.time}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(response.status)}`}>
                      {getStatusLabel(response.status)}
                    </span>
                  </div>
                  {response.needs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {response.needs.map((need, i) => (
                        <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 text-xs rounded">
                          {need}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Start Voice Calls
          </button>
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Launch SMS Campaign
          </button>
          <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
