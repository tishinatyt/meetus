
import React from 'react';
import { Location, Coordinates } from '../types';
import { StarIcon, MapPinIcon, BanknotesIcon, SparklesIcon } from '@heroicons/react/24/solid';
import { translations, Language } from '../translations';

interface LocationExplorerProps {
  locations: Location[];
  userCoords: Coordinates | null;
  lang: Language;
}

const calculateDistance = (c1: Coordinates, c2: Coordinates) => {
    const R = 6371;
    const dLat = (c2.lat - c1.lat) * Math.PI / 180;
    const dLng = (c2.lng - c1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(c1.lat * Math.PI / 180) * Math.cos(c2.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
};

const LocationExplorer: React.FC<LocationExplorerProps> = ({ locations, userCoords, lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-outfit font-bold">{t.explore.title}</h2>
        <p className="text-slate-500">{t.explore.desc}</p>
      </div>

      <div className="grid gap-6">
        {locations.map((loc, idx) => {
          const distance = userCoords ? calculateDistance(userCoords, loc.coords) : null;
          const isOptimal = idx === 1; // Simulation of AI optimal choice
          
          return (
            <div key={loc.id} className={`bg-white rounded-3xl overflow-hidden shadow-sm border transition-all ${isOptimal ? 'border-indigo-400 ring-4 ring-indigo-50' : 'border-slate-100'}`}>
              <div className="h-48 relative">
                <img src={loc.image} className="w-full h-full object-cover" alt={loc.name} />
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full flex items-center space-x-1 shadow-sm">
                  <StarIcon className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-bold text-slate-700">{loc.rating}</span>
                </div>
                {isOptimal && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-indigo-600 text-white rounded-full flex items-center space-x-1 shadow-lg shadow-indigo-200">
                    <SparklesIcon className="w-3 h-3" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">AI Optimal</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4">
                   <span className="px-3 py-1 bg-white/90 text-indigo-600 text-[10px] font-bold rounded-full shadow-sm">{loc.category}</span>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{loc.name}</h3>
                    <div className="flex items-center text-slate-400 text-xs mt-1">
                      <MapPinIcon className="w-3 h-3 mr-1 text-indigo-500" />
                      <span>{distance ? t.dashboard.distance.replace('{d}', distance) : loc.address}</span>
                    </div>
                  </div>
                  <div className="flex space-x-0.5">
                    {[...Array(4)].map((_, i) => (
                      <BanknotesIcon key={i} className={`w-3.5 h-3.5 ${i < loc.priceLevel ? 'text-emerald-500' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                
                {isOptimal && (
                  <p className="text-[10px] text-indigo-600 bg-indigo-50 p-2 rounded-xl font-medium italic">
                    "{t.explore.optimal}"
                  </p>
                )}
                
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <div className="flex -space-x-1">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-400">AI</div>
                    ))}
                    <div className="text-[10px] text-slate-400 ml-4 flex items-center font-medium">12 {t.explore.meetupsHeld}</div>
                  </div>
                  <button className="text-indigo-600 text-xs font-bold hover:underline">{t.explore.viewAvailability}</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationExplorer;
