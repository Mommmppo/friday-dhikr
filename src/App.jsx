import { useState, useEffect } from 'react';
import { isFriday, getCurrentFridayDocId, incrementUserDhikr, subscribeToGlobalCount, subscribeToLeaderboard, subscribeToPersonalCount, getFridayDocRef } from './firebase';
import { getDoc } from 'firebase/firestore';
import Onboarding from './components/Onboarding';
import Arena from './components/Arena';
import Leaderboard from './components/Leaderboard';
import LockScreen from './components/LockScreen';
import MotivationalQuotes from './components/MotivationalQuotes';
import InviteSection from './components/InviteSection';

function App() {
  const [userName, setUserName] = useState(localStorage.getItem('dhikrUserName') || '');
  const [activeIsFriday, setActiveIsFriday] = useState(isFriday());
  
  // State for counters
  const [globalCount, setGlobalCount] = useState(0);
  const [personalCount, setPersonalCount] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [lastFridayCount, setLastFridayCount] = useState(0);

  // Inviter Logic
  const [inviterName, setInviterName] = useState(() => {
    // 1. Try URL parameters
    const params = new URLSearchParams(window.location.search);
    const urlInviter = params.get('inviter');
    if (urlInviter) {
      localStorage.setItem('dhikrInviterName', urlInviter);
      return urlInviter;
    }
    // 2. Fallback to localStorage
    return localStorage.getItem('dhikrInviterName') || '';
  });

  useEffect(() => {
    // Clean up URL after grabbing the parameter to keep it looking clean
    if (window.location.search.includes('inviter=')) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    // If it's not Friday, attempt to get last Friday's count
    if (!activeIsFriday) {
      const getLastFridayId = () => {
        const d = new Date();
        while (d.getDay() !== 5) {
          d.setDate(d.getDate() - 1);
        }
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();
        return `friday-${dd}-${mm}-${yyyy}`;
      };

      const fetchLastFriday = async () => {
        try {
          const docRef = getFridayDocRef(getLastFridayId());
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setLastFridayCount(snap.data().totalCount || 0);
          }
        } catch (e) {
          console.log("Could not fetch last Friday's data.", e);
        }
      };
      
      fetchLastFriday();
      return;
    }

    // It is Friday!
    const docId = getCurrentFridayDocId();
    
    const unsubGlobal = subscribeToGlobalCount(docId, setGlobalCount);
    const unsubLeaderboard = subscribeToLeaderboard(docId, setLeaderboard);
    
    let unsubPersonal = () => {};
    if (userName) {
      unsubPersonal = subscribeToPersonalCount(docId, userName, setPersonalCount);
    }

    return () => {
      unsubGlobal();
      unsubLeaderboard();
      unsubPersonal();
    };
  }, [activeIsFriday, userName]);

  const handleIncrement = () => {
    // Optimistic UI update could go here, but real-time is fast enough for MVP.
    setPersonalCount(prev => prev + 1);
    incrementUserDhikr(userName);
  };

  if (!activeIsFriday) {
    return <LockScreen lastFridayCount={lastFridayCount} />;
  }

  if (!userName) {
    return <Onboarding onStart={setUserName} inviterName={inviterName} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-glow blur-[120px] rounded-full pointer-events-none opacity-20" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-glow blur-[120px] rounded-full pointer-events-none opacity-20" />

      <main className="relative z-10 w-full min-h-screen pt-8 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          
          {/* Right Column: Leaderboard (order 2 on mobile, lg:col-span-3) */}
          <div className="order-2 lg:order-1 lg:col-span-3 h-full max-h-[80vh] lg:sticky lg:top-8">
            <Leaderboard 
              leaderboard={leaderboard} 
              currentUserName={userName} 
              inviterName={inviterName}
            />
          </div>

          {/* Center Column: Arena & Quotes (order 1 on mobile, lg:col-span-6) */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center space-y-8">
            <Arena 
              personalCount={personalCount} 
              globalCount={globalCount} 
              onIncrement={handleIncrement} 
            />
            <MotivationalQuotes />
          </div>

          {/* Left Column: Invite Section (order 3 on mobile, lg:col-span-3) */}
          <div className="order-3 lg:order-3 lg:col-span-3">
            <InviteSection currentUserName={userName} />
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
