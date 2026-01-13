
import React from 'react';
import { UserProfile, GroupMeeting, Coordinates } from '../types';
import { CalendarDaysIcon, MapPinIcon, UsersIcon, CheckBadgeIcon, ClockIcon } from '@heroicons/react/24/solid';
import { translations, Language } from '../translations';

interface DashboardProps {
  user: UserProfile;
  activeMeeting: GroupMeeting | null;
  userCoords: Coordinates | null;
  onOpenChat: () => void;
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

const Dashboard: React.FC<DashboardProps> = ({ user, activeMeeting, userCoords, onOpenChat, lang }) => {
  const t = translations[lang];
  const distance = activeMeeting && userCoords ? calculateDistance(userCoords, activeMeeting.location.coords) : null;
  const eta = distance ? Math.round(parseFloat(distance) * 5 + 5) : null;

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-indigo-200 text-sm font-bold uppercase tracking-widest">{t.dashboard.myArchetype}</span>
            <CheckBadgeIcon className="w-6 h-6 text-white/50" />
          </div>
          <div className="space-y-1">
            <h2 className="text-4xl font-outfit font-bold">{t.archetypes[user.archetype]}</h2>
            <p className="text-indigo-100/80 text-sm leading-relaxed">{t.dashboard.archetypeDesc}</p>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {user.interests.map(i => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium border border-white/20">#{i}</span>
            ))}
          </div>
        </div>
        <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 px-1">{t.dashboard.upcoming}</h3>
        
        {activeMeeting ? (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h4 className="text-xl font-bold">{activeMeeting.title}</h4>
                <p className="text-indigo-600 text-sm font-semibold">{activeMeeting.time}</p>
              </div>
              <div className="flex -space-x-2">
                {activeMeeting.members.map(m => (
                  <img key={m.id} src={m.avatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt={m.name} />
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl relative overflow-hidden group">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-md">
                <img src={activeMeeting.location.image} className="w-full h-full object-cover" alt="Venue" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">{activeMeeting.location.name}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
                  <div className="flex items-center text-[10px] text-slate-500">
                    <MapPinIcon className="w-3 h-3 mr-1 text-indigo-500" />
                    <span>{distance ? t.dashboard.distance.replace('{d}', distance) : 'Calculating...'}</span>
                  </div>
                  <div className="flex items-center text-[10px] text-slate-500">
                    <ClockIcon className="w-3 h-3 mr-1 text-indigo-500" />
                    <span>{eta ? t.dashboard.eta.replace('{t}', eta.toString()) : 'Calculating...'}</span>
                  </div>
                </div>
              </div>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                   <MapPinIcon className="w-4 h-4" />
                </div>
              </div>
            </div>

            <button 
              onClick={onOpenChat}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
            >
              <UsersIcon className="w-5 h-5" />
              <span>{t.dashboard.enterChat}</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
              <CalendarDaysIcon className="w-8 h-8 text-slate-300" />
            </div>
            <div className="space-y-1">
              <p className="font-bold">{t.dashboard.noMeetings}</p>
              <p className="text-sm text-slate-400">{t.dashboard.noMeetingsDesc}</p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
