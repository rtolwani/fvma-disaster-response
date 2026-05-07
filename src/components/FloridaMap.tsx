'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue in Leaflet + Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface Clinic {
  id: string;
  name: string;
  county: string;
  latitude: number;
  longitude: number;
  status: 'safe_operating' | 'safe_closed' | 'need_help' | 'unsafe_evacuating';
  needs: string[];
}

interface FloridaMapProps {
  clinics?: Clinic[];
  onCountyClick?: (county: string) => void;
}

// Sample Florida counties with approximate centers
const FLORIDA_COUNTIES = [
  { name: 'Miami-Dade', lat: 25.6149, lng: -80.5586 },
  { name: 'Broward', lat: 26.1901, lng: -80.3659 },
  { name: 'Palm Beach', lat: 26.7056, lng: -80.4942 },
  { name: 'Hillsborough', lat: 27.9904, lng: -82.3018 },
  { name: 'Orange', lat: 28.5383, lng: -81.3792 },
  { name: 'Pinellas', lat: 27.9136, lng: -82.7626 },
  { name: 'Duval', lat: 30.3322, lng: -81.6557 },
  { name: 'Lee', lat: 26.5629, lng: -81.8495 },
  { name: 'Polk', lat: 28.0327, lng: -81.6389 },
  { name: 'Brevard', lat: 28.2639, lng: -80.7214 },
  { name: 'Volusia', lat: 29.0289, lng: -81.0228 },
  { name: 'Seminole', lat: 28.7267, lng: -81.2242 },
  { name: 'Pasco', lat: 28.3093, lng: -82.4526 },
  { name: 'Sarasota', lat: 27.2364, lng: -82.4717 },
  { name: 'Manatee', lat: 27.4989, lng: -82.5748 },
  { name: 'Lake', lat: 28.7603, lng: -81.6389 },
  { name: 'Collier', lat: 26.1420, lng: -81.2318 },
  { name: 'Leon', lat: 30.4383, lng: -84.2807 },
  { name: 'Marion', lat: 29.1872, lng: -82.1401 },
  { name: 'St. Lucie', lat: 27.3441, lng: -80.3503 },
];

// Generate sample clinics for demo
function generateSampleClinics(): Clinic[] {
  const clinics: Clinic[] = [];
  const statuses: Clinic['status'][] = ['safe_operating', 'safe_closed', 'need_help', 'unsafe_evacuating'];
  
  FLORIDA_COUNTIES.forEach((county) => {
    // Generate 20-80 clinics per county (simulating 1000+ total)
    const clinicCount = Math.floor(Math.random() * 60) + 20;
    
    for (let i = 0; i < clinicCount; i++) {
      const latOffset = (Math.random() - 0.5) * 0.3;
      const lngOffset = (Math.random() - 0.5) * 0.3;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      clinics.push({
        id: `clinic-${county.name}-${i}`,
        name: `${county.name} Veterinary Clinic ${i + 1}`,
        county: county.name,
        latitude: county.lat + latOffset,
        longitude: county.lng + lngOffset,
        status: status,
        needs: status === 'need_help' || status === 'unsafe_evacuating' 
          ? ['Medical Supplies', 'Generator', 'Water'].slice(0, Math.floor(Math.random() * 3) + 1)
          : [],
      });
    }
  });
  
  return clinics;
}

export default function FloridaMap({ clinics, onCountyClick }: FloridaMapProps) {
  const [clinicData, setClinicData] = useState<Clinic[]>(clinics || []);
  const [selectedCounty, setSelectedCounty] = useState<string | null>(null);

  useEffect(() => {
    if (!clinics) {
      setClinicData(generateSampleClinics());
    } else {
      setClinicData(clinics);
    }
  }, [clinics]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe_operating': return '#22c55e'; // green
      case 'safe_closed': return '#3b82f6'; // blue
      case 'need_help': return '#f97316'; // orange
      case 'unsafe_evacuating': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  const getClusterIcon = (count: number) => {
    return L.divIcon({
      html: `<div style="
        background: #1e40af;
        color: white;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 14px;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">${count}</div>`,
      className: 'custom-cluster-icon',
      iconSize: [40, 40],
    });
  };

  // Group clinics by county for clustering
  const clinicsByCounty = clinicData.reduce((acc, clinic) => {
    if (!acc[clinic.county]) {
      acc[clinic.county] = [];
    }
    acc[clinic.county].push(clinic);
    return acc;
  }, {} as Record<string, Clinic[]>);

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[28.5383, -82.3018]} // Central Florida
        zoom={7}
        minZoom={6}
        maxZoom={10}
        className="h-full w-full rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* County markers with clinic counts */}
        {FLORIDA_COUNTIES.map((county) => {
          const countyClinics = clinicsByCounty[county.name] || [];
          const clinicCount = countyClinics.length;
          
          if (clinicCount === 0) return null;

          return (
            <Marker
              key={county.name}
              position={[county.lat, county.lng]}
              icon={getClusterIcon(clinicCount)}
              eventHandlers={{
                click: () => {
                  setSelectedCounty(county.name);
                  onCountyClick?.(county.name);
                },
              }}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-semibold text-gray-900">{county.name} County</h3>
                  <p className="text-gray-600">{clinicCount} clinics</p>
                  <div className="mt-2 space-y-1">
                    {countyClinics.slice(0, 5).map((clinic) => (
                      <div key={clinic.id} className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getStatusColor(clinic.status) }}
                        />
                        <span className="text-xs text-gray-700 truncate">{clinic.name}</span>
                      </div>
                    ))}
                    {clinicCount > 5 && (
                      <p className="text-xs text-gray-500">+{clinicCount - 5} more...</p>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
