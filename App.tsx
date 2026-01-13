
import React, { useState, useEffect } from 'react';
import { UserArchetype, UserProfile, GroupMeeting, Location, Coordinates } from './types';
import Header from './components/Header';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import GroupChat from './components/GroupChat';
import LocationExplorer from './components/LocationExplorer';
import { HomeIcon, ChatBubbleLeftRightIcon, MapPinIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { translations, Language } from './translations';
import { AnalysisResult } from './geminiService';

type View = 'home' | 'onboarding' | 'chat' | 'explore' | 'profile';

const MOCK_PARTNERS: Location[] = [
  { id: 'loc_1', name: 'Binary Brews', category: 'Coffee & Code', address: '123 Tech Ave', image: 'https://picsum.photos/seed/cafe/600/400', priceLevel: 2, rating: 4.8, coords: { lat: 50.4501, lng: 30.5234 }, allowsAlcohol: false },
  { id: 'loc_2', name: 'The Art Vault', category: 'Gallery', address: '45 Creative Blvd', image: 'https://picsum.photos/seed/art/600/400', priceLevel: 3, rating: 4.5, coords: { lat: 50.4541, lng: 30.5111 }, allowsAlcohol: true },
  { id: 'loc_3', name: 'Peak Fitness', category: 'Climbing Gym', address: '88 Sport Way', image: 'https://picsum.photos/seed/climb/600/400', priceLevel: 2, rating: 4.9, coords: { lat: 50.4601, lng: 30.5334 }, allowsAlcohol: false },
  { id: 'loc_4', name: 'Neon Nights', category: 'Cocktail Bar', address: '10 Party St', image: 'https://picsum.photos/seed/bar/600/400', priceLevel: 4, rating: 4.7, coords: { lat: 50.4401, lng: 30.5034 }, allowsAlcohol: true }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('onboarding');
  const [user, setUser] = useState<UserProfile>({
    id: 'user_1',
    name: 'Alex',
    archetype: UserArchetype.UNKNOWN,
    interests: [],
    avatar: 'https://picsum.photos/seed/alex/200'
  });
  const [activeMeeting, setActiveMeeting] = useState<GroupMeeting | null>(null);
  const [lang, setLang] = useState<Language>('ua');
  const [userCoords, setUserCoords] = useState<Coordinates | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserCoords({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  }, []);

  const t = translations[lang];

  const handleOnboardingComplete = (analysis: AnalysisResult) => {
    const updatedUser: UserProfile = { 
      ...user, 
      archetype: analysis.archetype, 
      alcoholPreference: analysis.alcoholPreference,
      interests: analysis.interests
    };
    setUser(updatedUser);
    setCurrentView('home');
    
    // Logic: Find compatible group based on archetype and alcohol preference
    const compatibleVenues = MOCK_PARTNERS.filter(v => v.allowsAlcohol === analysis.alcoholPreference);
    const selectedVenue = compatibleVenues.length > 0 ? compatibleVenues[0] : MOCK_PARTNERS[0];

    setTimeout(() => {
      setActiveMeeting({
        id: 'meet_123',
        title: lang === 'ua' ? `Група: ${t.archetypes[analysis.archetype]} (${analysis.alcoholPreference ? 'з алкоголем' : 'без алкоголю'})` : `${analysis.archetype} Tribe (${analysis.alcoholPreference ? 'Alcohol Friendly' : 'Alcohol Free'})`,
        members: [
          updatedUser,
          { id: 'u2', name: 'Sarah', archetype: analysis.archetype, interests: ['Travel', 'Books'], avatar: 'https://picsum.photos/seed/sarah/200', location: { lat: 50.4451, lng: 30.5214 }, alcoholPreference: analysis.alcoholPreference },
          { id: 'u3', name: 'Mike', archetype: analysis.archetype, interests: ['Fitness', 'Music'], avatar: 'https://picsum.photos/seed/mike/200', location: { lat: 50.4551, lng: 30.5284 }, alcoholPreference: analysis.alcoholPreference }
        ],
        location: selectedVenue,
        time: lang === 'ua' ? 'Сьогодні, 19:30' : 'Today, 19:30',
        status: 'pending',
        iceBreakers: [],
        totalBudget: 1500,
        currentPool: 500,
        alcoholFriendly: analysis.alcoholPreference
      });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <Header lang={lang} setLang={setLang} />
      
      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {currentView === 'onboarding' && (
          <Onboarding onComplete={handleOnboardingComplete} lang={lang} />
        )}
        
        {currentView === 'home' && (
          <Dashboard 
            user={user} 
            activeMeeting={activeMeeting} 
            userCoords={userCoords}
            onOpenChat={() => setCurrentView('chat')}
            lang={lang}
          />
        )}

        {currentView === 'chat' && activeMeeting && (
          <GroupChat 
            meeting={activeMeeting} 
            currentUser={user}
            onBack={() => setCurrentView('home')}
            lang={lang}
          />
        )}

        {currentView === 'explore' && (
          <LocationExplorer locations={MOCK_PARTNERS} userCoords={userCoords} lang={lang} />
        )}

        {currentView === 'profile' && (
          <div className="flex flex-col items-center pt-8 text-center space-y-4">
            <div className="relative">
               <img src={user.avatar} className="w-32 h-32 rounded-full border-4 border-white shadow-xl" alt="Profile" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <p className="text-indigo-600 font-medium">{t.archetypes[user.archetype]}</p>
              <p className="text-xs text-slate-400 mt-1">{user.alcoholPreference ? (lang === 'ua' ? 'Віддає перевагу алкоголю' : 'Alcohol Friendly') : (lang === 'ua' ? 'Без алкоголю' : 'Alcohol Free')}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {user.interests.map(i => <span key={i} className="px-2 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-600">#{i}</span>)}
            </div>
            <div className="w-full space-y-2 px-4">
               <button className="w-full py-3 bg-white border border-slate-200 rounded-xl font-semibold shadow-sm text-sm">
                  {lang === 'ua' ? 'Редагувати профіль' : 'Edit Profile'}
               </button>
               <button className="w-full py-3 text-red-600 font-semibold text-sm" onClick={() => window.location.reload()}>
                  {lang === 'ua' ? 'Вийти' : 'Sign Out'}
               </button>
            </div>
          </div>
        )}
      </main>

      {currentView !== 'onboarding' && (
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
          <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center transition-colors ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <HomeIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{t.nav.home}</span>
          </button>
          <button onClick={() => setCurrentView('explore')} className={`flex flex-col items-center transition-colors ${currentView === 'explore' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <MapPinIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{t.nav.explore}</span>
          </button>
          <button onClick={() => setCurrentView('chat')} className={`flex flex-col items-center transition-colors ${currentView === 'chat' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <ChatBubbleLeftRightIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{t.nav.groups}</span>
          </button>
          <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center transition-colors ${currentView === 'profile' ? 'text-indigo-600' : 'text-slate-400'}`}>
            <UserCircleIcon className="w-6 h-6" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">{t.nav.profile}</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;
