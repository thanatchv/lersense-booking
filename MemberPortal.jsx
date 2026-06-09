```react
import React, { useState, useEffect } from 'react';
import { User, Gift, Clock, MapPin, ChevronRight, Star, CalendarHeart, Award, History, Ticket, Sun, Moon } from 'lucide-react';

// --- Mock Data ---
const USER_PROFILE = {
  name: 'ธนัช จงวรรธนะหิรัญ',
  tier: 'Gold Member',
  points: 1250,
  nextTierPoints: 2000,
  avatar: 'https://ui-avatars.com/api/?name=Thanat+J&background=b794f4&color=fff&size=150'
};

const UPCOMING_BOOKING = {
  id: 'BK-20260615-01',
  service: 'นวดน้ำมันอโรม่า (Aroma Oil)',
  date: '15 มิ.ย. 2026',
  time: '14:00 - 15:30',
  location: 'สาขาหลัก (รับบริการที่ร้าน)',
  status: 'confirmed',
  staff: 'หมอบี'
};

const BOOKING_HISTORY = [
  {
    id: 'BK-20260510-04',
    service: 'นวดไทย (Thai Massage)',
    date: '10 พ.ค. 2026',
    duration: '60 นาที',
    status: 'completed',
    pointsEarned: 50
  },
  {
    id: 'BK-20260402-11',
    service: 'นวดคอบ่าไหล่',
    date: '2 เม.ย. 2026',
    duration: '90 นาที',
    status: 'completed',
    pointsEarned: 80
  }
];

export default function MemberPortal() {
  const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' or 'rewards'
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize Theme based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const progressPercent = (USER_PROFILE.points / USER_PROFILE.nextTierPoints) * 100;

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-500 app-container ${isDarkMode ? 'dark' : 'light'}`}>
      
      {/* --- Dynamic CSS Variables for Theming --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

        .app-container {
          font-family: 'Noto Sans Thai', sans-serif;
          color-scheme: light;
          --bg-gradient: radial-gradient(circle at 10% 20%, rgba(183, 148, 244, 0.35), transparent 30%), radial-gradient(circle at 90% 15%, rgba(216, 179, 106, 0.18), transparent 28%), radial-gradient(circle at 85% 85%, rgba(159, 122, 234, 0.20), transparent 25%), linear-gradient(180deg, #f8f5fc 0%, #f3edf9 45%, #efe8f6 100%);
          --text-main: #1f2937;
          --text-muted: #4b5563;
          --text-heading: #4c1d95;
          --bg-glass: linear-gradient(180deg, rgba(255,255,255,0.66), rgba(255,255,255,0.42));
          --border-glass: rgba(255, 255, 255, 0.42);
          --shadow-glass: 0 18px 50px rgba(84, 52, 125, 0.16);
          --bg-input: rgba(255,255,255,0.42);
          --border-input: rgba(255, 255, 255, 0.45);
          --bg-input-focus: rgba(255,255,255,0.60);
          --bg-element: rgba(255,255,255,0.3);
          --bg-element-hover: rgba(255,255,255,0.5);
        }
        
        .app-container.dark {
          color-scheme: dark;
          --bg-gradient: radial-gradient(circle at 10% 20%, rgba(139, 92, 246, 0.15), transparent 30%), radial-gradient(circle at 90% 15%, rgba(216, 179, 106, 0.1), transparent 28%), radial-gradient(circle at 85% 85%, rgba(139, 92, 246, 0.1), transparent 25%), linear-gradient(180deg, #1e1528 0%, #160f1d 45%, #0f0a14 100%);
          --text-main: #f3f4f6;
          --text-muted: #9ca3af;
          --text-heading: #d8b4fe;
          --bg-glass: linear-gradient(180deg, rgba(40, 25, 60, 0.45), rgba(20, 10, 30, 0.6));
          --border-glass: rgba(255, 255, 255, 0.08);
          --shadow-glass: 0 18px 50px rgba(0, 0, 0, 0.5);
          --bg-input: rgba(0, 0, 0, 0.25);
          --border-input: rgba(255, 255, 255, 0.05);
          --bg-input-focus: rgba(0,0,0,0.4);
          --bg-element: rgba(255,255,255,0.05);
          --bg-element-hover: rgba(255,255,255,0.1);
        }

        .app-container {
          background: var(--bg-gradient);
          color: var(--text-main);
        }
        
        .glass-panel {
          background: var(--bg-glass);
          border: 1px solid var(--border-glass);
          box-shadow: var(--shadow-glass);
          backdrop-filter: blur(24px) saturate(160%);
          -webkit-backdrop-filter: blur(24px) saturate(160%);
          transition: all 0.3s ease;
        }

        .tab-btn {
          transition: all 0.2s ease;
        }
        .tab-active {
          background: var(--bg-input-focus);
          color: var(--text-heading);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: 1px solid var(--border-glass);
        }
        .tab-inactive {
          color: var(--text-muted);
          background: transparent;
          border: 1px solid transparent;
        }
        
        .list-item-hover:hover {
          background: var(--bg-element-hover);
        }
      `}</style>

      {/* --- Seamless Fade Topbar --- */}
      {/* 1. Blur Background Layer (Fade to transparent) */}
      <div className="fixed top-0 left-0 right-0 z-40 h-28 pointer-events-none transition-colors duration-500" 
           style={{
             backdropFilter: 'blur(20px)',
             WebkitBackdropFilter: 'blur(20px)',
             maskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
             WebkitMaskImage: 'linear-gradient(to bottom, black 30%, transparent 100%)',
             background: isDarkMode 
               ? 'linear-gradient(to bottom, rgba(30, 21, 40, 0.9) 0%, rgba(30, 21, 40, 0) 100%)'
               : 'linear-gradient(to bottom, rgba(248, 245, 252, 0.95) 0%, rgba(248, 245, 252, 0) 100%)'
           }}>
      </div>

      {/* 2. Topbar Content Layer */}
      <div className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 pl-1">
            <div className="w-10 h-10 rounded-[16px] bg-gradient-to-br from-purple-500 to-yellow-600 p-[1px] shadow-sm relative overflow-hidden flex-shrink-0">
               <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-transparent"></div>
               <div className="w-full h-full bg-gradient-to-br from-purple-400 to-yellow-500 rounded-[15px] flex items-center justify-center text-white font-bold text-lg shadow-inner">L</div>
            </div>
            <div className="flex flex-col justify-center drop-shadow-sm">
              <h1 className="font-bold text-[16px] leading-tight tracking-wide" style={{ color: 'var(--text-main)' }}>Lersense Spa</h1>
              <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--text-heading)', opacity: 0.9 }}>Member Portal</p>
            </div>
          </div>
          <button 
            onClick={toggleTheme} 
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-sm backdrop-blur-md"
            style={{ background: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.6)', border: '1px solid var(--border-glass)' }}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-purple-700" />}
          </button>
        </div>
      </div>

      {/* --- Main Content --- */}
      <div className="max-w-lg mx-auto px-4 pt-24 relative z-30">
        
        {/* --- Profile Header --- */}
        <div className="glass-panel rounded-[28px] p-6 mb-6 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            <img src={USER_PROFILE.avatar} alt="Profile" className="w-16 h-16 rounded-2xl shadow-md object-cover" style={{ border: '2px solid var(--border-glass)' }} />
            <div className="flex-1">
              <h1 className="font-bold text-xl" style={{ color: 'var(--text-main)' }}>{USER_PROFILE.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase tracking-wider shadow-sm">
                  <Star className="w-3 h-3 fill-white" /> {USER_PROFILE.tier}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#f3e8ff', color: 'var(--text-heading)' }}>ยืนยันตัวตนแล้ว</span>
              </div>
            </div>
          </div>

          {/* Points Progress */}
          <div className="mt-6 rounded-2xl p-4 transition-colors" style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>คะแนนสะสม (Lersense Points)</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold" style={{ color: 'var(--text-heading)' }}>{USER_PROFILE.points.toLocaleString()}</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-heading)', opacity: 0.8 }}>pts</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>อีก {(USER_PROFILE.nextTierPoints - USER_PROFILE.points).toLocaleString()} คะแนน</p>
                <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>เพื่อเลื่อนเป็น <strong style={{ color: 'var(--text-main)' }}>Platinum</strong></p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full rounded-full h-2.5 mb-1 overflow-hidden" style={{ background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(139, 92, 246, 0.2)' }}>
              <div 
                className="bg-gradient-to-r from-purple-500 to-yellow-500 h-2.5 rounded-full" 
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* --- Navigation Tabs --- */}
        <div className="flex p-1 rounded-2xl mb-6 shadow-inner" style={{ background: 'var(--bg-element)', border: '1px solid var(--border-glass)' }}>
          <button 
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold tab-btn ${activeTab === 'bookings' ? 'tab-active' : 'tab-inactive'}`}
          >
            <History className="w-4 h-4" /> ประวัติการจอง
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold tab-btn ${activeTab === 'rewards' ? 'tab-active' : 'tab-inactive'}`}
          >
            <Gift className="w-4 h-4" /> สิทธิพิเศษ
          </button>
        </div>

        {/* --- Content Area --- */}
        {activeTab === 'bookings' && (
          <div className="animate-fade-in">
            
            {/* Upcoming Booking */}
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2 pl-1" style={{ color: 'var(--text-main)' }}>
              <CalendarHeart className="w-4 h-4" style={{ color: 'var(--text-heading)' }} /> นัดหมายที่กำลังจะมาถึง
            </h2>
            <div className="glass-panel rounded-3xl p-5 mb-8" style={{ borderLeft: '4px solid #a855f7' }}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-lg" style={{ background: isDarkMode ? 'rgba(34, 197, 94, 0.2)' : '#dcfce7', color: isDarkMode ? '#4ade80' : '#15803d' }}>
                  ยืนยันคิวแล้ว
                </span>
                <span className="text-xs font-mono opacity-60" style={{ color: 'var(--text-muted)' }}>{UPCOMING_BOOKING.id}</span>
              </div>
              <h3 className="font-bold text-lg mb-1" style={{ color: 'var(--text-main)' }}>{UPCOMING_BOOKING.service}</h3>
              
              <div className="flex flex-col gap-2 mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" style={{ color: 'var(--text-heading)', opacity: 0.7 }} /> 
                  <span><strong style={{ color: 'var(--text-main)' }}>{UPCOMING_BOOKING.date}</strong> | {UPCOMING_BOOKING.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--text-heading)', opacity: 0.7 }} /> 
                  <span>{UPCOMING_BOOKING.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" style={{ color: 'var(--text-heading)', opacity: 0.7 }} /> 
                  <span>ผู้ให้บริการ: <strong style={{ color: 'var(--text-main)' }}>{UPCOMING_BOOKING.staff}</strong></span>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        style={{ background: 'var(--bg-element)', border: '1px solid var(--border-glass)', color: 'var(--text-main)' }}>
                  เลื่อนคิว
                </button>
                <button className="flex-1 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md transition-colors"
                        style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7e22ce 100%)' }}>
                  นำทางไปร้าน
                </button>
              </div>
            </div>

            {/* Booking History */}
            <h2 className="text-sm font-bold mb-3 flex items-center gap-2 pl-1" style={{ color: 'var(--text-main)' }}>
              <History className="w-4 h-4 opacity-60" style={{ color: 'var(--text-muted)' }} /> ประวัติการใช้บริการ
            </h2>
            <div className="flex flex-col gap-3">
              {BOOKING_HISTORY.map((booking) => (
                <div key={booking.id} className="rounded-2xl p-4 flex items-center justify-between cursor-pointer list-item-hover transition-colors"
                     style={{ background: 'var(--bg-input)', border: '1px solid var(--border-glass)' }}>
                  <div>
                    <h4 className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{booking.service}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{booking.date} • {booking.duration}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                          style={{ background: isDarkMode ? 'rgba(139, 92, 246, 0.2)' : '#f3e8ff', color: 'var(--text-heading)' }}>
                      +{booking.pointsEarned} pts
                    </span>
                    <ChevronRight className="w-4 h-4 inline-block ml-1 opacity-50" style={{ color: 'var(--text-muted)' }} />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* --- Rewards Tab Content --- */}
        {activeTab === 'rewards' && (
          <div className="animate-fade-in flex flex-col gap-4">
            
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden border border-white/10">
              <Ticket className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
              <h3 className="font-bold text-lg mb-1 relative z-10">แลกส่วนลด 100 บาท</h3>
              <p className="text-purple-200 text-xs mb-4 relative z-10">ใช้เป็นส่วนลดสำหรับบริการนวดทุกประเภท</p>
              <button className="bg-white text-purple-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm relative z-10 hover:bg-gray-50 transition-colors">
                ใช้ 500 คะแนน
              </button>
            </div>

            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-3xl p-5 text-white shadow-lg relative overflow-hidden border border-white/10">
              <Award className="absolute -right-4 -bottom-4 w-24 h-24 text-white opacity-10" />
              <h3 className="font-bold text-lg mb-1 relative z-10">ฟรี นวดคอบ่าไหล่ 30 นาที</h3>
              <p className="text-yellow-100 text-xs mb-4 relative z-10">เพิ่มเวลาความสุข (สำหรับจอง 90 นาทีขึ้นไป)</p>
              <button className="bg-white text-yellow-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm relative z-10 hover:bg-gray-50 transition-colors">
                ใช้ 1,200 คะแนน
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}


```
