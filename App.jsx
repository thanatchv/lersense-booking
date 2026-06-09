```react
import React, { useState, useEffect } from 'react';
import { User, Phone, MapPin, Clock, Calendar, CheckCircle, AlertTriangle, UserCircle, Users, Sun, Moon, MessageCircle, ShieldCheck, Star, Mail, Home } from 'lucide-react';

// --- Mock Data ---
const SERVICES = [
  { id: 'S1', name: 'นวดไทย (Thai Massage)', duration: 60, price: 500 },
  { id: 'S2', name: 'นวดน้ำมันอโรม่า (Aroma Oil)', duration: 90, price: 1200 },
  { id: 'S3', name: 'นวดคอบ่าไหล่ (Neck & Shoulder)', duration: 60, price: 600 },
];

const LOCATIONS = [
  { id: 'L1', name: 'สาขาหลัก (รับบริการที่ร้าน)', type: 'in-store' },
  { id: 'L2', name: 'นอกสถานที่ (Delivery)', type: 'off-site' },
];

const STAFF = [
  { id: 'random', name: '✨ สุ่มพนักงานที่เหมาะสม' },
  { id: 'ST1', name: 'หมอเอ (เชี่ยวชาญนวดไทย)' },
  { id: 'ST2', name: 'หมอบี (เชี่ยวชาญอโรม่า)' },
];

export default function App() {
  // App States: 'LOGIN', 'REGISTER', 'BOOKING', 'SUCCESS'
  const [step, setStep] = useState('LOGIN'); 
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({ isOpen: false, title: '', message: '' });
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // User Profile State (Simulating Member DB)
  const [userProfile, setUserProfile] = useState(null);
  const [lineProfile, setLineProfile] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '', // Used for registration
    lastName: '', // Used for registration
    email: '', // Used for registration
    phone: '', // Used for registration
    dob: '', // Used for registration
    address: '', // Used for registration
    serviceId: '',
    locationId: '',
    staffId: 'random',
    pax: '1',
    date: '',
    time: '',
    healthRisks: { pregnant: false, highBp: false, surgery: false },
    equipments: { mat: false, towel: false },
    pdpaConsent: false
  });

  const [endTime, setEndTime] = useState('ยังไม่ได้เลือก');

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  // Initialize Theme based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('health_')) {
      const key = name.replace('health_', '');
      setFormData(prev => ({ ...prev, healthRisks: { ...prev.healthRisks, [key]: checked } }));
    } else if (name.startsWith('equip_')) {
      const key = name.replace('equip_', '');
      setFormData(prev => ({ ...prev, equipments: { ...prev.equipments, [key]: checked } }));
    } else if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Calculate End Time when Service or Time changes
  useEffect(() => {
    if (formData.serviceId && formData.time) {
      const service = SERVICES.find(s => s.id === formData.serviceId);
      if (service) {
        const [hours, minutes] = formData.time.split(':').map(Number);
        const dateObj = new Date();
        dateObj.setHours(hours, minutes + service.duration);
        
        const endH = String(dateObj.getHours()).padStart(2, '0');
        const endM = String(dateObj.getMinutes()).padStart(2, '0');
        setEndTime(`${service.duration} นาที • เสร็จประมาณ ${endH}:${endM}`);
      }
    } else {
      setEndTime('ยังไม่ได้เลือก');
    }
  }, [formData.serviceId, formData.time]);

  const isOffSite = LOCATIONS.find(l => l.id === formData.locationId)?.type === 'off-site';

  // --- Auth Flow Methods ---
  const handleLineLogin = () => {
    setLoading(true);
    // Simulate checking database via Supabase API
    setTimeout(() => {
      setLoading(false);
      
      // Simulate pulling LINE profile from liff.getProfile()
      setLineProfile({
        displayName: 'ธนัช จงวรรธนะหิรัญ',
        pictureUrl: 'https://ui-avatars.com/api/?name=Thanat+J&background=00c300&color=fff&size=150'
      });
      // Pre-fill name from LINE profile
      setFormData(prev => ({ ...prev, firstName: 'ธนัช', lastName: 'จงวรรธนะหิรัญ' }));
      
      // Simulate user not found in DB, redirect to register
      setStep('REGISTER');
    }, 1200);
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate saving new member to database
    setTimeout(() => {
      setLoading(false);
      setUserProfile({
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        tier: 'Classic Member',
        points: 0
      });
      setStep('BOOKING');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1200);
  };

  const handleLogout = () => {
    setUserProfile(null);
    setStep('LOGIN');
  };

  // --- Booking Flow Method ---
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // 1. Check Health Risks
    const { pregnant, highBp, surgery } = formData.healthRisks;
    if (pregnant || highBp || surgery) {
      setModal({
        isOpen: true,
        title: 'ไม่สามารถทำรายการได้',
        message: 'เนื่องจากท่านมีปัญหาสุขภาพที่อยู่ในกลุ่มเสี่ยง เพื่อความปลอดภัยสูงสุด กรุณาติดต่อแอดมินเพื่อประเมินการรับบริการครับ'
      });
      return;
    }

    // 2. Mock API Call
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('SUCCESS');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  return (
    <div className={`min-h-screen pb-32 transition-colors duration-500 app-container ${isDarkMode ? 'dark' : 'light'}`}>
      
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
          --bottom-bar: linear-gradient(to top, #efe8f6 0%, rgba(239, 232, 246, 0.9) 30%, transparent 100%);
          --btn-icon: hover:bg-black/10;
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
          --bottom-bar: linear-gradient(to top, #0f0a14 0%, rgba(15, 10, 20, 0.9) 30%, transparent 100%);
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
        
        .input-shell {
          background: var(--bg-input);
          border: 1px solid var(--border-input);
          box-shadow: inset 0 1px 0 var(--border-glass);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: 0.22s ease;
        }
        
        .input-shell:focus-within {
          transform: translateY(-1px);
          border-color: rgba(159,122,234,0.45);
          box-shadow: 0 0 0 4px rgba(159,122,234,0.15), inset 0 1px 0 var(--border-glass);
          background: var(--bg-input-focus);
        }
        
        .form-element {
          width: 100%;
          background: transparent;
          border: none;
          outline: none;
          padding: 14px;
          min-height: 52px;
          color: var(--text-main);
          font-size: 0.96rem;
        }
        
        select.form-element {
          appearance: none;
          background-image: linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%);
          background-position: calc(100% - 18px) calc(50% - 3px), calc(100% - 12px) calc(50% - 3px);
          background-size: 6px 6px, 6px 6px;
          background-repeat: no-repeat;
          padding-right: 36px;
        }
        
        select.form-element option {
          background: ${isDarkMode ? '#1f2937' : '#ffffff'};
          color: ${isDarkMode ? '#f3f4f6' : '#1f2937'};
        }
        
        .btn-gold {
          background: linear-gradient(180deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02)), linear-gradient(135deg, #d6b067 0%, #bf8d39 100%);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.35), 0 10px 24px rgba(191, 141, 57, 0.32);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        
        .btn-gold:active { transform: translateY(1px) scale(0.995); }
        
        .btn-line {
          background: linear-gradient(180deg, #10d061 0%, #06b755 100%);
          border: 1px solid rgba(6,199,85,0.18);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 10px 24px rgba(6,183,85,0.24);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .btn-line:active { transform: translateY(1px) scale(0.995); }

        .checkbox-item {
          background: var(--bg-element);
          border: 1px solid var(--border-glass);
          transition: background 0.2s;
        }
        .checkbox-item:hover {
          background: var(--bg-element-hover);
        }
        
        ::-webkit-calendar-picker-indicator {
          filter: ${isDarkMode ? 'invert(1)' : 'invert(0)'};
        }
      `}</style>

      {/* --- Modal / Loading Overlay --- */}
      {(loading || modal.isOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md">
          {loading ? (
            <div className="glass-panel p-6 rounded-3xl flex flex-col items-center">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-4 font-medium" style={{ color: 'var(--text-main)' }}>กำลังโหลดข้อมูล...</p>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl max-w-sm w-full text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>{modal.title}</h3>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>{modal.message}</p>
              <button 
                onClick={() => setModal({ isOpen: false, title: '', message: '' })}
                className="w-full btn-gold py-3 rounded-2xl text-white font-semibold"
              >
                ตกลง
              </button>
            </div>
          )}
        </div>
      )}

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
              <p className="text-[10px] uppercase tracking-widest font-semibold mt-0.5" style={{ color: 'var(--text-heading)', opacity: 0.9 }}>Enterprise</p>
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

        {/* ================= STEP: LOGIN ================= */}
        {step === 'LOGIN' && (
          <div className="animate-fade-in flex flex-col items-center justify-center pt-10 pb-8 text-center">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500 to-yellow-600 p-[2px] shadow-xl mb-8">
               <div className="w-full h-full bg-gradient-to-br from-purple-400 to-yellow-500 rounded-[22px] flex items-center justify-center text-white font-bold text-5xl">L</div>
            </div>
            <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>ยินดีต้อนรับสู่ Lersense</h2>
            <p className="text-sm mb-8 px-4" style={{ color: 'var(--text-muted)' }}>
              กรุณาเข้าสู่ระบบเพื่อดำเนินการจองคิว และสะสมคะแนนสมาชิก Lersense Points สำหรับสิทธิพิเศษมากมาย
            </p>
            <div className="w-full max-w-sm glass-panel p-6 rounded-3xl">
              <button 
                onClick={handleLineLogin}
                className="w-full btn-line py-4 rounded-2xl text-white font-bold flex items-center justify-center gap-2 text-lg"
              >
                <MessageCircle className="w-6 h-6" /> เข้าสู่ระบบด้วย LINE
              </button>
              <p className="text-xs mt-4" style={{ color: 'var(--text-muted)' }}>
                การเข้าสู่ระบบถือว่าท่านยอมรับข้อตกลงและเงื่อนไขการให้บริการ
              </p>
            </div>
          </div>
        )}

        {/* ================= STEP: REGISTER ================= */}
        {step === 'REGISTER' && (
          <div className="animate-fade-in">
            <div className="mb-6 px-2 text-center">
              <h2 className="text-2xl font-bold leading-tight tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                ลงทะเบียนสมาชิก
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                กรุณากรอกข้อมูลที่จำเป็นเพื่อเชื่อมต่อกับ LINE
              </p>
            </div>

            <form onSubmit={handleRegister} className="glass-panel rounded-[28px] overflow-hidden p-6">
              
              {/* LINE Profile Linked Info */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl shadow-inner transition-colors" 
                   style={{ background: isDarkMode ? 'rgba(0,195,0,0.1)' : 'rgba(0,195,0,0.05)', border: '1px solid rgba(0,195,0,0.2)' }}>
                <img src={lineProfile?.pictureUrl} alt="LINE Avatar" className="w-12 h-12 rounded-full border-2 border-[#00c300] shadow-sm" />
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>เชื่อมต่อด้วยบัญชี LINE</p>
                  <p className="font-bold text-sm text-[#00c300]">{lineProfile?.displayName}</p>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>ชื่อ</label>
                    <div className="input-shell rounded-2xl flex items-center pl-3">
                      <User className="w-5 h-5 opacity-50" style={{ color: 'var(--text-main)' }} />
                      <input type="text" name="firstName" required placeholder="สมชาย" 
                        className="form-element pl-2" value={formData.firstName} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>นามสกุล</label>
                    <div className="input-shell rounded-2xl flex items-center pl-3">
                      <input type="text" name="lastName" required placeholder="ชอบนวด" 
                        className="form-element px-2" value={formData.lastName} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>อีเมล</label>
                  <div className="input-shell rounded-2xl flex items-center pl-3">
                    <Mail className="w-5 h-5 opacity-50" style={{ color: 'var(--text-main)' }} />
                    <input type="email" name="email" required placeholder="example@email.com"
                      className="form-element pl-2" value={formData.email} onChange={handleChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>เบอร์โทรศัพท์</label>
                    <div className="input-shell rounded-2xl flex items-center pl-3">
                      <Phone className="w-5 h-5 opacity-50" style={{ color: 'var(--text-main)' }} />
                      <input type="tel" name="phone" required placeholder="08X-XXX" pattern="[0-9]{10}"
                        className="form-element pl-2" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>วัน/เดือน/ปีเกิด</label>
                    <div className="input-shell rounded-2xl flex items-center pl-3 pr-3">
                      <input type="date" name="dob" required
                        className="form-element px-2 w-full" value={formData.dob} onChange={handleChange} />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm pl-1 font-medium" style={{ color: 'var(--text-heading)' }}>ที่อยู่</label>
                  <div className="input-shell rounded-2xl flex items-start pl-3">
                    <Home className="w-5 h-5 opacity-50 mt-[14px]" style={{ color: 'var(--text-main)' }} />
                    <textarea name="address" required placeholder="บ้านเลขที่, ถนน, ซอย, จังหวัด, รหัสไปรษณีย์..."
                      className="form-element pl-2 resize-none" rows="3" style={{ minHeight: '90px' }} 
                      value={formData.address} onChange={handleChange}></textarea>
                  </div>
                </div>

                {/* PDPA Consent */}
                <div className="mt-2 p-4 rounded-2xl" style={{ background: 'var(--bg-element)', border: '1px solid var(--border-glass)' }}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" name="pdpaConsent" required checked={formData.pdpaConsent} onChange={handleChange} className="w-5 h-5 accent-purple-600 rounded mt-0.5" />
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      <strong style={{ color: 'var(--text-main)' }}>การให้ความยินยอม (PDPA)</strong><br/>
                      ข้าพเจ้ายินยอมให้ Lersense เก็บ รวบรวม และใช้ข้อมูลส่วนบุคคล เพื่อวัตถุประสงค์ในการจองคิว ให้บริการ และติดต่อกลับตามนโยบายความเป็นส่วนตัวของบริษัท
                    </div>
                  </label>
                </div>

                <button type="submit" className="w-full btn-gold py-4 rounded-2xl text-white font-bold text-lg mt-2">
                  ยืนยันการสมัครสมาชิก
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= STEP: BOOKING FORM ================= */}
        {step === 'BOOKING' && (
          <div className="animate-fade-in">
            {/* Hero */}
            <div className="mb-6 px-2">
              <div className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full mb-3 backdrop-blur-md shadow-sm"
                   style={{ background: 'var(--bg-element)', border: '1px solid var(--border-glass)', color: 'var(--text-heading)' }}>
                <span>✨</span> จองคิวง่าย • ยืนยันรวดเร็ว • ปลอดภัย
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-tight mb-2" style={{ color: 'var(--text-main)' }}>
                เลือกบริการ นัดเวลา<br/>จองได้ในไม่กี่ขั้นตอน
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="glass-panel rounded-[28px] overflow-hidden">
              
              {/* Section 1: User Info (Read Only from Profile) */}
              <div className="p-5 border-b relative z-10" style={{ borderColor: 'var(--border-glass)' }}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                    <ShieldCheck className="w-5 h-5" style={{ color: 'var(--text-heading)' }} /> บัญชีผู้จอง
                  </h3>
                  <button type="button" onClick={handleLogout} className="text-xs px-3 py-1 rounded-full underline" style={{ color: 'var(--text-muted)' }}>
                    ออกจากระบบ
                  </button>
                </div>
                
                {/* Member Profile Card */}
                <div className="flex items-center gap-4 p-4 rounded-2xl shadow-inner" style={{ background: 'var(--bg-input)' }}>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/20">
                    {userProfile?.name.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>{userProfile?.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{userProfile?.phone}</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-sm">
                      <Star className="w-3 h-3 fill-white" /> {userProfile?.tier}
                    </span>
                    <span className="text-[10px] mt-1" style={{ color: 'var(--text-muted)' }}>{userProfile?.points} pts</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Booking Details */}
              <div className="p-5 border-b relative z-10" style={{ borderColor: 'var(--border-glass)' }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                  <MapPin className="w-5 h-5" style={{ color: 'var(--text-heading)' }} /> รายละเอียดการจอง
                </h3>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>บริการ (Service)</label>
                    <div className="input-shell rounded-2xl">
                      <select name="serviceId" required className="form-element" value={formData.serviceId} onChange={handleChange}>
                        <option value="" disabled>เลือกบริการ</option>
                        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.name} • {s.duration} นาที • {s.price} ฿</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>สถานที่ (Location)</label>
                    <div className="input-shell rounded-2xl">
                      <select name="locationId" required className="form-element" value={formData.locationId} onChange={handleChange}>
                        <option value="" disabled>เลือกสถานที่</option>
                        {LOCATIONS.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>พนักงาน</label>
                      <div className="input-shell rounded-2xl">
                        <select name="staffId" required className="form-element" value={formData.staffId} onChange={handleChange}>
                          {STAFF.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>จำนวนคน</label>
                      <div className="input-shell rounded-2xl flex items-center pl-3">
                        <Users className="w-4 h-4 opacity-50" style={{ color: 'var(--text-main)' }} />
                        <select name="pax" required className="form-element pl-2" value={formData.pax} onChange={handleChange}>
                          {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num} ท่าน</option>)}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Date & Time */}
              <div className="p-5 border-b relative z-10" style={{ borderColor: 'var(--border-glass)' }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-heading)' }}>
                  <Calendar className="w-5 h-5" style={{ color: 'var(--text-heading)' }} /> วันและเวลา
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>วันที่ใช้บริการ</label>
                    <div className="input-shell rounded-2xl">
                      <input type="date" name="date" required min={today} className="form-element" value={formData.date} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs pl-1" style={{ color: 'var(--text-muted)' }}>เวลาเริ่มต้น</label>
                    <div className="input-shell rounded-2xl">
                      <input type="time" name="time" required className="form-element" value={formData.time} onChange={handleChange} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center rounded-2xl p-3 text-sm"
                     style={{ background: 'var(--bg-element)', border: '1px solid var(--border-glass)', color: 'var(--text-muted)' }}>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> เวลาที่ใช้</span>
                  <strong style={{ color: 'var(--text-heading)' }}>{endTime}</strong>
                </div>
              </div>

              {/* Section 4: Health & Equipment */}
              <div className="p-5 relative z-10" style={{ background: isDarkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)' }}>
                <h3 className="font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>คัดกรองสุขภาพ (Safety First)</h3>
                <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>กรุณาเลือกหากท่านมีภาวะดังต่อไปนี้</p>
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    { id: 'pregnant', label: 'ตั้งครรภ์ (Pregnant)' },
                    { id: 'highBp', label: 'ความดันโลหิตสูง / โรคหัวใจ' },
                    { id: 'surgery', label: 'เพิ่งได้รับการผ่าตัดภายใน 6 เดือน' }
                  ].map(risk => (
                    <label key={risk.id} className="checkbox-item flex items-center gap-3 p-3 rounded-2xl cursor-pointer">
                      <input type="checkbox" name={`health_${risk.id}`} checked={formData.healthRisks[risk.id]} onChange={handleChange} className="w-5 h-5 accent-purple-600 rounded" />
                      <span className="text-sm" style={{ color: 'var(--text-main)' }}>{risk.label}</span>
                    </label>
                  ))}
                </div>

                {isOffSite && (
                  <div className="mt-6 pt-4 border-t animate-fade-in" style={{ borderColor: 'var(--border-glass)' }}>
                    <h3 className="font-semibold mb-1" style={{ color: 'var(--text-heading)' }}>อุปกรณ์ที่มี (สำหรับนอกสถานที่)</h3>
                    <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>หากไม่มี พนักงานจะเตรียมไปให้ (อาจมีค่าบริการ)</p>
                    <div className="flex flex-col gap-2">
                      <label className="checkbox-item flex items-center gap-3 p-3 rounded-2xl cursor-pointer">
                        <input type="checkbox" name="equip_mat" checked={formData.equipments.mat} onChange={handleChange} className="w-5 h-5 accent-purple-600 rounded" />
                        <span className="text-sm" style={{ color: 'var(--text-main)' }}>มีเบาะนวด / ที่นอนพร้อม</span>
                      </label>
                      <label className="checkbox-item flex items-center gap-3 p-3 rounded-2xl cursor-pointer">
                        <input type="checkbox" name="equip_towel" checked={formData.equipments.towel} onChange={handleChange} className="w-5 h-5 accent-purple-600 rounded" />
                        <span className="text-sm" style={{ color: 'var(--text-main)' }}>มีผ้าเช็ดตัวขนาดใหญ่</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </form>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 p-4 pb-safe pointer-events-none" style={{ background: 'var(--bottom-bar)' }}>
              <div className="max-w-lg mx-auto p-2 rounded-[24px] shadow-lg pointer-events-auto"
                   style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-glass)' }}>
                <button onClick={handleBookingSubmit} className="w-full btn-gold py-4 rounded-[18px] text-white font-bold text-lg">
                  บันทึกการจอง (Confirm Booking)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= STEP: SUCCESS ================= */}
        {step === 'SUCCESS' && (
          <div className="glass-panel rounded-[28px] p-8 text-center animate-fade-in mt-10">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl p-[1px] shadow-lg mb-6">
               <div className="w-full h-full bg-gradient-to-br from-green-300/40 to-emerald-500/40 rounded-[23px] flex items-center justify-center backdrop-blur-md">
                 <CheckCircle className="w-10 h-10 text-white" />
               </div>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>บันทึกการจองสำเร็จ</h2>
            <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: 'var(--text-muted)' }}>
              ระบบได้รับข้อมูลเรียบร้อยแล้ว กรุณาชำระค่ามัดจำผ่าน LINE เพื่อยืนยันคิวของคุณ (Hold Time 15 นาที)
            </p>
            
            <div className="p-4 rounded-2xl mb-6 text-sm flex justify-between items-center" 
                 style={{ background: isDarkMode ? 'rgba(216, 179, 106, 0.15)' : 'rgba(216, 179, 106, 0.2)', border: '1px solid rgba(216, 179, 106, 0.3)', color: isDarkMode ? '#fcd34d' : '#92400e' }}>
              <div className="text-left">
                 <p className="font-semibold mb-0.5">ยอดมัดจำรวม</p>
                 <span className="text-xs opacity-80">(มัดจำ 200 บาท x {formData.pax} ท่าน)</span>
              </div>
              <strong className="text-xl">{formData.pax * 200} ฿</strong>
            </div>

            <button 
              onClick={() => alert('จะทำการเปิด LINE Bot และส่งข้อความอัตโนมัติ เพื่อเชื่อม Stripe Payment Intent')}
              className="w-full btn-gold py-4 rounded-2xl text-white font-bold"
            >
              💳 ดำเนินการชำระเงิน
            </button>
            <button 
              onClick={() => setStep('BOOKING')}
              className="w-full mt-3 py-3 text-sm transition-colors"
              style={{ color: 'var(--text-muted)' }}
              onMouseOver={(e) => e.target.style.color = 'var(--text-main)'}
              onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}
            >
              กลับไปหน้าจองคิว
            </button>
          </div>
        )}

      </div>
    </div>
  );
}






```
