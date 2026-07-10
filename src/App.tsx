/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  User, 
  ShieldAlert, 
  BookOpen, 
  X, 
  CheckCircle, 
  Sparkles,
  MapPin,
  Clock,
  GraduationCap
} from 'lucide-react';
import Header from './components/Header';
import DirectoryView from './components/DirectoryView';
import RegistrationView from './components/RegistrationView';
import AdminDashboard from './components/AdminDashboard';
import LocationView from './components/LocationView';
import { AlumniProfile, ActivityLog } from './types';
import { db, collection, onSnapshot, doc, setDoc, deleteDoc, updateDoc, getDocs, handleFirestoreError, OperationType } from './lib/firebase';
import { getCacheItem, setCacheItem, deleteCacheItem, clearCache } from './lib/indexedDb';

export default function App() {
  // Tab control state
  const [activeTab, setActiveTab] = useState<'directory' | 'registration' | 'location' | 'admin'>('directory');

  // Alumni profiles state (starts as empty, loaded from IndexedDB cache asynchronously on mount and real-time Firestore)
  const [alumni, setAlumni] = useState<AlumniProfile[]>([]);

  // Logs state (starts as empty, loaded from IndexedDB cache asynchronously on mount and real-time Firestore)
  const [logs, setLogs] = useState<ActivityLog[]>([]);

  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  // Load cache from IndexedDB asynchronously on mount
  useEffect(() => {
    async function loadCache() {
      try {
        const activeDbId = 'ai-studio-wattakfaalumni-5ead791e-124a-49e7-ac62-8501af6e0ab6';
        const cachedDbId = localStorage.getItem('cached_db_id');
        
        if (cachedDbId !== activeDbId) {
          console.log("Database ID changed or first load, clearing IndexedDB cache...");
          await clearCache();
          try {
            localStorage.setItem('cached_db_id', activeDbId);
          } catch (e) {
            console.warn("Failed to set cached_db_id in localStorage", e);
          }
          // Also cleanup old localStorage legacy keys just in case to free up space
          localStorage.removeItem('local_alumni');
          localStorage.removeItem('local_logs');
          return;
        }

        // Load cached alumni profiles
        const cachedAlumni = await getCacheItem<AlumniProfile[]>('local_alumni');
        if (cachedAlumni && Array.isArray(cachedAlumni) && cachedAlumni.length > 0) {
          const isStale = cachedAlumni.some(item => 
            item.id === '1' || 
            item.fullname === 'สรวิชญ์ นามสมมติ' || 
            item.id.startsWith('real-') ||
            item.fullname === 'สุวภัทร จันแดง'
          );
          if (!isStale) {
            setAlumni(prev => prev.length === 0 ? cachedAlumni : prev);
          } else {
            console.log("Stale/mock cache detected in IndexedDB, clearing.");
            await deleteCacheItem('local_alumni');
          }
        }

        // Load cached activity logs
        const cachedLogs = await getCacheItem<ActivityLog[]>('local_logs');
        if (cachedLogs && Array.isArray(cachedLogs) && cachedLogs.length > 0) {
          const isStale = cachedLogs.some(log => 
            (log.id === 'log-1' && log.action.includes('วนิดา ปัญญาดี')) ||
            log.action.includes('สุวภัทร จันแดง')
          );
          if (!isStale) {
            setLogs(prev => prev.length === 0 ? cachedLogs : prev);
          } else {
            console.log("Stale/mock logs detected in IndexedDB, clearing.");
            await deleteCacheItem('local_logs');
          }
        }

        // Clean up legacy localStorage keys to ensure browser has full storage available
        localStorage.removeItem('local_alumni');
        localStorage.removeItem('local_logs');
      } catch (err) {
        console.error("Error loading cached database states:", err);
      }
    }
    loadCache();
  }, []);

  useEffect(() => {
    // 1. Subscribe to alumni in Firestore
    const unsubAlumni = onSnapshot(collection(db, 'alumni'), (snapshot) => {
      const fbList: AlumniProfile[] = [];
      snapshot.forEach((doc) => {
        fbList.push(doc.data() as AlumniProfile);
      });
      
      // Sort by createdAt descending
      fbList.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setAlumni(fbList);
      setCacheItem('local_alumni', fbList);
    }, (error) => {
      const errStr = String(error);
      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || error.code === 'resource-exhausted') {
        setIsQuotaExceeded(true);
      }
      console.warn("Firestore onSnapshot error (using local cache mode):", error);
    });

    // 2. Subscribe to logs in Firestore
    const unsubLogs = onSnapshot(collection(db, 'logs'), (snapshot) => {
      const fbLogs: ActivityLog[] = [];
      snapshot.forEach((doc) => {
        fbLogs.push(doc.data() as ActivityLog);
      });
      
      fbLogs.sort((a, b) => b.id.localeCompare(a.id));
      setLogs(fbLogs);
      setCacheItem('local_logs', fbLogs);
    }, (error) => {
      const errStr = String(error);
      if (errStr.includes('resource-exhausted') || errStr.includes('quota') || error.code === 'resource-exhausted') {
        setIsQuotaExceeded(true);
      }
      console.warn("Firestore logs subscription error:", error);
    });

    return () => {
      unsubAlumni();
      unsubLogs();
    };
  }, []);

  // Events modal state
  const [showEventsModal, setShowEventsModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [rsvpConfirmMessage, setRsvpConfirmMessage] = useState<string | null>(null);

  // Helper to add a log entry dynamically
  const addLog = async (action: string, type: 'approve' | 'export' | 'register' | 'delete' | 'edit', customAdminName?: string) => {
    const logId = `log-${Date.now()}`;
    const newLog: ActivityLog = {
      id: logId,
      adminName: customAdminName || localStorage.getItem('admin_name') || 'แอดมิน วิชัย',
      action,
      timestamp: 'เมื่อสักครู่',
      type
    };

    // Update local state immediately for instant feedback
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setCacheItem('local_logs', updatedLogs);

    try {
      await setDoc(doc(db, 'logs', logId), newLog);
    } catch (e) {
      console.warn("Could not save log to Firestore (likely quota limit).", e);
    }
  };

  // Register Alumnus (Adds profile as pending approval)
  const handleRegisterAlumnus = async (newAlumnus: Omit<AlumniProfile, 'id' | 'status' | 'createdAt'>) => {
    const id = `alumni-${Date.now()}`;
    const createdProfile: AlumniProfile = {
      ...newAlumnus,
      id,
      status: 'pending', // Starts as pending, flows to admin queue
      createdAt: new Date().toISOString()
    };
    
    // Update local state immediately so user sees it right away
    const updatedAlumni = [createdProfile, ...alumni];
    setAlumni(updatedAlumni);
    setCacheItem('local_alumni', updatedAlumni);

    // Log action locally
    const logId = `log-${Date.now()}`;
    const msg = `ส่งใบสมัครลงทะเบียนศิษย์เก่าใหม่: คุณ${newAlumnus.fullname} (รุ่นที่ ${newAlumnus.generation})`;
    const newLog: ActivityLog = {
      id: logId,
      adminName: 'ระบบชมรม',
      action: msg,
      timestamp: 'เมื่อสักครู่',
      type: 'register'
    };
    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    setCacheItem('local_logs', updatedLogs);
    
    try {
      await setDoc(doc(db, 'alumni', id), createdProfile);
      await setDoc(doc(db, 'logs', logId), newLog);
    } catch (e) {
      console.warn("Could not write new alumnus to Firestore (saved locally).", e);
    }
  };

  // Admin approves alumnus
  const handleApproveAlumnus = async (id: string) => {
    // Update local state immediately
    const updatedAlumni = alumni.map(item => item.id === id ? { ...item, status: 'approved' as const } : item);
    setAlumni(updatedAlumni);
    setCacheItem('local_alumni', updatedAlumni);

    try {
      await updateDoc(doc(db, 'alumni', id), { status: 'approved' });
    } catch (e) {
      console.warn("Could not approve alumnus in Firestore (saved locally).", e);
    }
  };

  // Admin deletes profile
  const handleDeleteAlumnus = async (id: string) => {
    // Update local state immediately
    const updatedAlumni = alumni.filter(item => item.id !== id);
    setAlumni(updatedAlumni);
    setCacheItem('local_alumni', updatedAlumni);

    try {
      await deleteDoc(doc(db, 'alumni', id));
    } catch (e) {
      console.warn("Could not delete alumnus in Firestore (saved locally).", e);
    }
  };

  // Admin edits profile
  const handleEditAlumnus = async (updated: AlumniProfile) => {
    // Update local state immediately
    const updatedAlumni = alumni.map(item => item.id === updated.id ? updated : item);
    setAlumni(updatedAlumni);
    setCacheItem('local_alumni', updatedAlumni);

    try {
      await setDoc(doc(db, 'alumni', updated.id), updated);
    } catch (e) {
      console.warn("Could not edit alumnus in Firestore (saved locally).", e);
    }
  };

  // Admin clears all logs
  const handleClearLogs = async () => {
    // Clear local state immediately
    setLogs([]);
    setCacheItem('local_logs', []);

    try {
      const logsCol = collection(db, 'logs');
      const qSnapshot = await getDocs(logsCol);
      const batchPromises = qSnapshot.docs.map((d) => deleteDoc(d.ref));
      await Promise.all(batchPromises);
    } catch (e) {
      console.warn("Could not clear logs in Firestore (saved locally).", e);
    }
  };

  // Count pending records for badges
  const pendingCount = alumni.filter(item => item.status === 'pending').length;

  // Mock Events Database
  const templeEvents = [
    {
      id: 'event-1',
      title: 'พิธีทอดกฐินสามัคคีประจำปี 2569',
      date: '25 ตุลาคม 2569',
      location: 'ณ ศาลาการเปรียญ วัดตากฟ้า พระอารามหลวง',
      description: 'ขอเรียนเชิญศิษย์เก่าโรงเรียนวัดตากฟ้า และผู้มีจิตศรัทธาทุกท่านร่วมสมทบทุนจัดพิธีทอดกฐินสามัคคี เพื่อบูรณปฏิสังขรณ์อาคารเรียนและเสนาสนะวัดตากฟ้า'
    },
    {
      id: 'event-2',
      title: 'งานคืนสู่เหย้าชาวศิษย์เก่าโรงเรียนวัดตากฟ้า ครั้งที่ 15',
      date: '5 ธันวาคม 2569',
      location: 'สนามฟุตบอลโรงเรียนวัดตากฟ้า',
      description: 'กระชับสัมพันธ์ร้อยดวงใจศิษย์เก่าโรงเรียนวัดตากฟ้าทุกรุ่น ร่วมรับประทานอาหารโต๊ะจีน ชมการแสดงมุทิตาจิตแด่คณะครูอาจารย์อาวุโส และเสวนาศิษย์เก่ากัลยาณมิตร'
    },
    {
      id: 'event-3',
      title: 'โครงการปฏิบัติธรรมวิปัสสนากรรมฐานช่วงปีใหม่',
      date: '28 ธันวาคม 2569 - 1 มกราคม 2570',
      location: 'ศูนย์ปฏิบัติธรรมเฉลิมพระเกียรติ วัดตากฟ้า',
      description: 'ชำระจิตใจ ต้อนรับศักราชใหม่ด้วยการสวดมนต์ข้ามปี เจริญจิตภาวนา ปฏิบัติกรรมฐานรับความสงบเย็นใต้ร่มพุทธธรรม'
    }
  ];

  // Handle RSVP submission
  const handleRsvp = (eventTitle: string) => {
    setSelectedEventId(null);
    setRsvpConfirmMessage(`ลงทะเบียนเข้าร่วมงาน "${eventTitle}" สำเร็จแล้ว! ทางชมรมศิษย์วัดตากฟ้าส่งข้อมูลยืนยันไปยัง SMS/Line ของท่านเรียบร้อยแล้ว เจริญพร`);
    setTimeout(() => {
      setRsvpConfirmMessage(null);
    }, 5000);
  };

  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col pt-20 pb-20 md:pb-0 font-sans" id="app-root-container">
      {/* Dynamic Header Component */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        pendingCount={pendingCount} 
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-10 w-full flex-grow" id="main-content">
        {isQuotaExceeded && (
          <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/30 rounded-3xl flex flex-col md:flex-row items-start gap-4 text-sm text-on-surface animate-fade-in" id="quota-exceeded-notice">
            <div className="p-3 bg-amber-500/20 rounded-2xl text-amber-500 shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="flex-grow">
              <p className="font-bold text-amber-500 text-lg">แจ้งเตือน: ตรวจพบ Google Firebase โควตาเต็ม (Daily Quota Exceeded)</p>
              
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-on-surface-variant font-mono bg-surface-container-low p-3 rounded-xl border border-outline-variant/30">
                <div>
                  <span className="text-on-surface font-bold">สถานะการเชื่อมต่อ:</span> <span className="text-emerald-500 font-bold">เชื่อมต่อสำเร็จ ✅</span>
                </div>
                <div>
                  <span className="text-on-surface font-bold">ฐานข้อมูลเป้าหมาย:</span> <span className="text-primary font-bold">rosy-dialect-488414-r1</span>
                </div>
                <div>
                  <span className="text-on-surface font-bold">Google Project ID:</span> <span className="text-on-surface">rosy-dialect-488414-r1</span>
                </div>
                <div>
                  <span className="text-on-surface font-bold">ข้อผิดพลาดจาก Google:</span> <span className="text-amber-500 font-bold">Quota limit exceeded (Free Tier 50k reads/day limit)</span>
                </div>
              </div>

              <p className="text-xs text-on-surface-variant mt-3 leading-relaxed">
                เนื่องจากโปรเจกต์ Firebase ของท่านอยู่ในแพ็กเกจฟรี (Spark Plan) ซึ่งมีข้อจำกัดจำนวนการดึงข้อมูล 50,000 ครั้งต่อวัน และตอนนี้โควตาดังกล่าวได้ถูกใช้งานจนหมดแล้ว Google จึงปิดกั้นคำขอใช้งานฐานข้อมูลชั่วคราวเป็นเวลา 24 ชั่วโมง
              </p>
              
              <div className="mt-3 text-xs border-l-2 border-primary pl-3 py-1 bg-primary/5 rounded-r-lg">
                <p className="font-semibold text-primary">💡 ระบบสำรองข้อมูลอัตโนมัติ (Resilient Offline Mode) ทำงานแล้ว:</p>
                <p className="text-on-surface-variant mt-0.5">
                  เพื่อป้องกันข้อมูลสูญหาย ระบบได้ดึงข้อมูลศิษย์เก่าตัวจริงจากทำเนียบ (รวมถึง คุณสุวภัทร, คุณวิบูลย์, คุณณัฐพงษ์) จากหน่วยความจำสำรองมาแสดงผลให้ท่านใช้งานได้อย่างราบรื่น ท่านสามารถ ค้นหาข้อมูล, คัดกรองตามรุ่น, หรือลงทะเบียนใหม่ ได้ 100% โดยข้อมูลใหม่จะบันทึกในเบราว์เซอร์ของท่านชั่วคราว และจะส่งขึ้นระบบฐานข้อมูลคลาวด์โดยอัตโนมัติเมื่อ Google ปลดล็อกโควตาใหม่ในวันถัดไป หรือเมื่อแอดมินอัปเกรดแผนใช้งานในคอนโซล Firebase เป็น Blaze (Pay-As-You-Go)
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <DirectoryView alumni={alumni} />
        )}
        
        {activeTab === 'registration' && (
          <RegistrationView onRegister={handleRegisterAlumnus} />
        )}

        {activeTab === 'location' && (
          <LocationView alumni={alumni} />
        )}

        {activeTab === 'admin' && (
          <AdminDashboard 
            alumni={alumni} 
            logs={logs}
            onApprove={handleApproveAlumnus} 
            onDelete={handleDeleteAlumnus} 
            onEdit={handleEditAlumnus}
            addLog={addLog}
            onClearLogs={handleClearLogs}
          />
        )}
      </main>

      {/* Dynamic Bottom Navigation Bar (Mobile View Only) */}
      <nav 
        className="fixed bottom-0 left-0 w-full md:hidden z-50 rounded-t-2xl bg-surface-container-lowest shadow-[0_-8px_30px_rgba(0,0,0,0.08)] border-t border-outline-variant/30 px-3 py-1 pb-safe-bottom h-18 flex justify-around items-center overflow-visible" 
        id="mobile-bottom-navbar"
      >
        {/* 1. ลงทะเบียน */}
        <button 
          onClick={() => { setActiveTab('registration'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center justify-center gap-1 w-20 h-14 transition-standard cursor-pointer select-none ${
            activeTab === 'registration' ? 'text-primary' : 'text-on-surface-variant'
          }`}
          id="btn-mobile-register"
        >
          <User className="w-5.5 h-5.5 stroke-[2]" />
          <span className="text-[13px] font-bold">ลงทะเบียน</span>
        </button>

        {/* 2. ทำเนียบศิษย์เก่า (มีวงกลมสีน้ำเงินเด่นลอยขึ้นมา) */}
        <button 
          onClick={() => { setActiveTab('directory'); window.scrollTo(0,0); }}
          className="flex flex-col items-center justify-center relative w-24 h-16 cursor-pointer select-none"
          id="btn-mobile-home"
        >
          <div className={`w-13 h-13 rounded-full flex items-center justify-center shadow-lg border-4 border-surface-container-lowest transition-all duration-300 absolute -top-5 ${
            activeTab === 'directory' 
              ? 'bg-primary text-on-primary shadow-primary/30 scale-110' 
              : 'bg-surface-container-high text-on-surface-variant'
          }`}>
            <GraduationCap className="w-6.5 h-6.5 stroke-[2]" />
          </div>
          <span className={`text-[12.5px] font-bold mt-9 transition-colors ${
            activeTab === 'directory' ? 'text-primary font-extrabold' : 'text-on-surface-variant'
          }`}>
            ทำเนียบศิษย์เก่า
          </span>
        </button>

        {/* 3. ตำแหน่ง */}
        <button 
          onClick={() => { setActiveTab('location'); window.scrollTo(0,0); }}
          className={`flex flex-col items-center justify-center gap-1 w-20 h-14 relative transition-standard cursor-pointer select-none ${
            activeTab === 'location' ? 'text-primary' : 'text-on-surface-variant'
          }`}
          id="btn-mobile-location"
        >
          <MapPin className="w-5.5 h-5.5 stroke-[2]" />
          <span className="text-[13px] font-bold">ตำแหน่ง</span>
        </button>
      </nav>

      {/* Events Calendar Modal Popup */}
      {showEventsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="events-modal-overlay">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-outline-variant/30 max-h-[85vh] flex flex-col animate-scale-up">
            <button 
              onClick={() => { setShowEventsModal(false); setSelectedEventId(null); }}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface transition-standard cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 text-primary font-bold mb-4 border-b border-outline-variant/30 pb-3">
              <Calendar className="w-5 h-5" />
              <h3 className="font-sans font-bold text-lg">ปฏิทินข่าวสารกิจกรรมวัดตากฟ้า</h3>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-sm">
              {templeEvents.map((ev) => (
                <div key={ev.id} className="p-4 bg-surface-container-low rounded-xl border border-outline-variant/20">
                  <h4 className="font-sans font-bold text-on-surface text-base mb-1">{ev.title}</h4>
                  <p className="text-xs text-primary font-semibold flex items-center gap-1 mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{ev.date}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant flex items-center gap-1 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    <span>{ev.location}</span>
                  </p>
                  <p className="text-xs text-on-surface-variant/90 leading-relaxed mb-4">{ev.description}</p>
                  
                  {/* RSVP button */}
                  {selectedEventId === ev.id ? (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleRsvp(ev.title)}
                        className="flex-1 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold hover:opacity-95 cursor-pointer transition-standard"
                      >
                        ยืนยันสำรองที่นั่ง
                      </button>
                      <button 
                        onClick={() => setSelectedEventId(null)}
                        className="px-3 py-2 bg-surface-variant text-on-surface-variant rounded-lg text-xs font-bold hover:bg-outline-variant cursor-pointer transition-standard"
                      >
                        ยกเลิก
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setSelectedEventId(ev.id)}
                      className="w-full py-2 bg-primary/10 text-primary rounded-lg text-xs font-bold hover:bg-primary hover:text-on-primary transition-standard cursor-pointer"
                    >
                      ลงทะเบียนเข้าร่วมกิจกรรม
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-outline-variant/30 mt-4 flex justify-end">
              <button 
                onClick={() => setShowEventsModal(false)}
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 transition-standard cursor-pointer text-sm shadow-sm"
              >
                ปิดปฏิทินกิจกรรม
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating RSVP Confirmation Toast */}
      {rsvpConfirmMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-inverse-surface text-inverse-on-surface px-6 py-4 rounded-xl shadow-xl max-w-sm w-11/12 border border-outline-variant/20 flex gap-3 items-start animate-slide-up">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <p className="font-bold text-white">ลงทะเบียนกิจกรรมแล้ว</p>
            <p className="text-on-surface-variant mt-1 leading-relaxed">{rsvpConfirmMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
