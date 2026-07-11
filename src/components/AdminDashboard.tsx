/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Download, 
  Search, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Mail,
  UserCheck,
  Lock,
  LogIn,
  Camera
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { AlumniProfile, ActivityLog } from '../types';
import { ENTRY_YEARS, getAvailableGrades, calculateGeneration, getEntryGrade, THAI_PROVINCES, resolveImageUrl } from '../data/mockAlumni';
import { compressImage } from '../lib/imageUtils';
import ImageCropModal from './ImageCropModal';

// Helper to categorize alumni occupations into groups for the bar chart
const getOccupationGroup = (occupation: string): string => {
  if (!occupation) return 'อื่นๆ';
  
  const occ = occupation.trim();
  
  if (occ.includes('พระภิกษุ') || occ.includes('พระ') || occ.includes('สามเณร')) {
    return 'พระภิกษุ';
  }
  if (occ.includes('รับราชการ') || occ.includes('ตำรวจ') || occ.includes('ทหาร') || occ.includes('ครู') || occ.includes('อาจารย์') || occ.includes('แพทย์') || occ.includes('พยาบาล') || occ.includes('ราชการ') || occ.includes('นักวิชาการ')) {
    return 'รับราชการ';
  }
  if (occ.includes('ทำงานเอกชน') || occ.includes('บริษัท') || occ.includes('วิศวกร') || occ.includes('พนักงาน') || occ.includes('ผู้จัดการ') || occ.includes('โปรแกรมเมอร์') || occ.includes('ดีเวลลอปเปอร์') || occ.includes('เอกชน')) {
    return 'ทำงานเอกชน';
  }
  if (occ.includes('ธุรกิจส่วนตัว') || occ.includes('เจ้าของ') || occ.includes('ค้าขาย') || occ.includes('ขายของ') || occ.includes('ธุรกิจ') || occ.includes('เกษตร') || occ.includes('ทำสวน') || occ.includes('ทำนา')) {
    return 'ธุรกิจส่วนตัว';
  }
  if (occ.includes('งานอิสระ') || occ.includes('ฟรีแลนซ์') || occ.includes('อิสระ') || occ.includes('รับจ้าง') || occ.includes('ดีไซเนอร์') || occ.includes('ศิลปิน')) {
    return 'งานอิสระ';
  }
  
  return 'อื่นๆ';
};

interface AdminDashboardProps {
  alumni: AlumniProfile[];
  logs: ActivityLog[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (updatedAlumnus: AlumniProfile) => void;
  addLog: (action: string, type: 'approve' | 'export' | 'register' | 'delete' | 'edit', adminName?: string) => void;
  onClearLogs?: () => Promise<void> | void;
}

export default function AdminDashboard({ 
  alumni, 
  logs, 
  onApprove, 
  onDelete, 
  onEdit,
  addLog,
  onClearLogs
}: AdminDashboardProps) {
  // Local admin UI states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [selectedGenFilter, setSelectedGenFilter] = useState<string>('all');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Edit Alumnus state
  const [editingAlumnus, setEditingAlumnus] = useState<AlumniProfile | null>(null);
  const editFileInputRef = React.useRef<HTMLInputElement>(null);
  const [tempEditImageSrc, setTempEditImageSrc] = useState<string | null>(null);
  const [isEditCropModalOpen, setIsEditCropModalOpen] = useState(false);

  // Custom confirmation modal for delete
  const [deleteConfirmAlumnus, setDeleteConfirmAlumnus] = useState<AlumniProfile | null>(null);

  // Custom confirmation state for clearing logs
  const [showClearLogsConfirm, setShowClearLogsConfirm] = useState(false);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin authorization states
  const [isAuthorized, setIsAuthorized] = useState(() => localStorage.getItem('admin_authorized') === 'true');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [currentAdminName, setCurrentAdminName] = useState(() => localStorage.getItem('admin_name') || 'แอดมิน วิชัย');

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Available admin accounts (saran, kla, and default admin)
    const adminAccounts = [
      { u: 'admin', p: 'admin1234', name: 'แอดมิน ระบบ' },
      { u: 'saran', p: 'saran12345', name: 'แอดมิน ศรัณย์' },
      { u: 'kla', p: 'kla12345', name: 'แอดมิน กล้า' }
    ];

    const match = adminAccounts.find(acc => acc.u === username.trim() && acc.p === password);
    if (match) {
      try {
        localStorage.setItem('admin_authorized', 'true');
        localStorage.setItem('admin_name', match.name);
      } catch (e) {
        console.warn("Failed to cache admin auth state in localStorage:", e);
      }
      setIsAuthorized(true);
      setCurrentAdminName(match.name);
      setLoginError('');
      triggerToast(`ยินดีต้อนรับ ${match.name} เข้าสู่ระบบสำเร็จแล้ว!`);
    } else {
      setLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authorized');
    localStorage.removeItem('admin_name');
    setIsAuthorized(false);
    setUsername('');
    setPassword('');
    triggerToast('ออกจากระบบแอดมินเรียบร้อยแล้ว');
  };

  // Trigger Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Extract unique generations and provinces dynamically for filters
  const generationsList = useMemo(() => {
    const list = Array.from(new Set(alumni.map(item => item.generation)));
    return list.sort((a, b) => a - b);
  }, [alumni]);

  const provincesList = useMemo(() => {
    const list = Array.from(new Set(alumni.map(item => item.province || 'นครสวรรค์')));
    return list.sort((a, b) => a.localeCompare(b, 'th'));
  }, [alumni]);

  // Filter & Search alumni for table representation
  const filteredAlumni = useMemo(() => {
    return alumni.filter(item => {
      const matchQuery = 
        item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.province && item.province.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.generation.toString().includes(searchQuery);

      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      
      const matchGen = selectedGenFilter === 'all' || item.generation.toString() === selectedGenFilter;
      
      const matchProvince = selectedProvinceFilter === 'all' || (item.province || 'นครสวรรค์') === selectedProvinceFilter;

      return matchQuery && matchStatus && matchGen && matchProvince;
    }).sort((a, b) => {
      const yearA = a.academic_year;
      const yearB = b.academic_year;
      return sortOrder === 'desc' ? yearB - yearA : yearA - yearB;
    });
  }, [alumni, searchQuery, statusFilter, selectedGenFilter, selectedProvinceFilter, sortOrder]);

  // Statistics Calculation
  const stats = useMemo(() => {
    const total = alumni.length;
    const pending = alumni.filter(item => item.status === 'pending').length;
    const approvedCount = alumni.filter(item => item.status === 'approved').length;
    const approvedPercent = total > 0 ? Math.round((approvedCount / total) * 100) : 0;
    return {
      total,
      pending,
      approvedCount,
      approvedPercent
    };
  }, [alumni]);

  // Group occupations for chart representation
  const occupationChartData = useMemo(() => {
    const groups = {
      'พระภิกษุ': 0,
      'รับราชการ': 0,
      'ทำงานเอกชน': 0,
      'ธุรกิจส่วนตัว': 0,
      'งานอิสระ': 0,
      'อื่นๆ': 0
    };

    alumni.forEach(item => {
      const group = getOccupationGroup(item.occupation);
      if (group in groups) {
        groups[group as keyof typeof groups]++;
      } else {
        groups['อื่นๆ']++;
      }
    });

    return Object.entries(groups).map(([name, count]) => ({
      name,
      count
    }));
  }, [alumni]);

  const BAR_COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#6b7280'];

  // Group provinces for donut chart representation showing actual provinces of registered members
  const provinceChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumni.forEach(item => {
      const province = item.province || 'ไม่ระบุ';
      counts[province] = (counts[province] || 0) + 1;
    });

    // Sort by count descending
    const sortedProvinces = Object.entries(counts)
      .sort((a, b) => b[1] - a[1]);

    return sortedProvinces.map(([name, count]) => ({ name, count }));
  }, [alumni]);

  const DONUT_COLORS = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

  // Group dhamma education levels for representation showing actual registered levels
  const dhammaEducationChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumni.forEach(item => {
      const level = item.dhammaEducation || 'ไม่มี / ไม่ระบุ';
      counts[level] = (counts[level] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [alumni]);

  const DHAMMA_COLORS = ['#f43f5e', '#d97706', '#2563eb', '#16a34a', '#8b5cf6', '#ec4899', '#64748b'];

  // Group secular education levels for representation showing actual registered levels
  const secularEducationChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    alumni.forEach(item => {
      const level = item.secularEducation || 'ไม่ระบุ';
      counts[level] = (counts[level] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [alumni]);

  const SECULAR_COLORS = ['#0d9488', '#3b82f6', '#4f46e5', '#9333ea', '#f59e0b', '#84cc16', '#4b5563'];

  // Pagination bounds
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage) || 1;
  const paginatedAlumni = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAlumni.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAlumni, currentPage]);

  // Handle Approve
  const handleApproveAction = (id: string, name: string) => {
    onApprove(id);
    addLog(`อนุมัติการลงทะเบียนใหม่ของ คุณ${name}`, 'approve', currentAdminName);
    triggerToast(`อนุมัติการลงทะเบียนของคุณ ${name} สำเร็จแล้ว`);
  };

  // Handle Delete
  const handleDeleteAction = (alumnus: AlumniProfile) => {
    onDelete(alumnus.id);
    addLog(`ลบโปรไฟล์ศิษย์เก่า คุณ${alumnus.fullname}`, 'delete', currentAdminName);
    triggerToast(`ลบโปรไฟล์คุณ ${alumnus.fullname} สำเร็จแล้ว`);
    setDeleteConfirmAlumnus(null);
  };

  // Handle Export to Excel (Generates and downloads a real compliant CSV)
  const handleExportCSV = () => {
    addLog('มีการส่งออกข้อมูล Excel ไฟล์ Alumni_List_2026.csv', 'export', currentAdminName);
    
    // Construct CSV Header and Rows
    const headers = ['ชื่อ-นามสกุล', 'ชื่อเล่น', 'เบอร์โทรศัพท์', 'Line ID', 'รุ่นที่', 'ปีการศึกษา', 'อาชีพ', 'จังหวัด', 'สถานะ'];
    const csvRows = [headers.join(',')];

    alumni.forEach(item => {
      const row = [
        `"${item.fullname}"`,
        `"${item.nickname || '-'}"`,
        `"${item.phone}"`,
        `"${item.lineid || '-'}"`,
        `"${item.generation}"`,
        `"${item.academic_year}"`,
        `"${item.occupation}"`,
        `"${item.province}"`,
        `"${item.status === 'approved' ? 'ยืนยันแล้ว' : 'รอตรวจสอบ'}"`
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n'); // Add UTF-8 BOM for Thai language compatibility in Excel
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Alumni_List_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('ส่งออกข้อมูลประวัติศิษย์เก่าเป็นไฟล์ CSV สำเร็จแล้ว!');
  };

  // Handle Edit Alumnus submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlumnus) {
      onEdit(editingAlumnus);
      addLog(`แก้ไขข้อมูลประวัติศิษย์เก่า คุณ${editingAlumnus.fullname}`, 'edit', currentAdminName);
      triggerToast(`แก้ไขข้อมูลของ คุณ${editingAlumnus.fullname} สำเร็จแล้ว`);
      setEditingAlumnus(null);
    }
  };

  // Handle Clear Logs action
  const handleClearLogsAction = async () => {
    if (onClearLogs) {
      try {
        await onClearLogs();
        addLog('ล้างประวัติการทำงาน (System Audit Logs) ทั้งหมดเพื่อเริ่มต้นระบบใหม่', 'delete', currentAdminName);
        triggerToast('ล้างประวัติการทำงานทั้งหมดสำเร็จแล้ว');
      } catch (err) {
        console.error("Error clearing logs:", err);
        triggerToast('เกิดข้อผิดพลาดในการล้างประวัติการทำงาน');
      }
    }
    setShowClearLogsConfirm(false);
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-12 animate-fade-in" id="admin-login-view">
        <div className="bg-surface-container-lowest rounded-3xl p-8 md:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-outline-variant/30 text-center">
          
          {/* Logo Frame */}
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="font-display-lg text-2xl font-bold text-on-surface mb-2">
            สำหรับแอดมิน
          </h2>
          <p className="font-sans text-xs text-on-surface-variant/80 mb-8 leading-relaxed">
            กรุณากรอกข้อมูลประจำตัวผู้ดูแลระบบชมรมศิษย์วัดตากฟ้า เพื่อเข้าใช้งานแดชบอร์ดจัดการข้อมูล
          </p>

          {loginError && (
            <div className="mb-6 p-4 bg-error-container/20 border border-error/30 text-error rounded-xl text-xs flex gap-2.5 items-start text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span className="font-semibold leading-relaxed">{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1" htmlFor="login-username">
                ชื่อผู้ใช้งาน
              </label>
              <input 
                id="login-username"
                type="text" 
                required
                placeholder="เช่น admin"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans text-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-on-surface-variant px-1" htmlFor="login-password">
                รหัสผ่านเข้าระบบ
              </label>
              <input 
                id="login-password"
                type="password" 
                required
                placeholder="ป้อนรหัสผ่านสำหรับแอดมิน"
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 mt-6 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 cursor-pointer transition-standard shadow-md flex items-center justify-center gap-2 text-sm animate-scale-up"
              id="login-submit-btn"
            >
              <LogIn className="w-4 h-4" />
              <span>เข้าสู่ระบบแอดมิน</span>
            </button>
          </form>



          <p className="text-[10px] text-outline mt-8 font-medium">
            ระบบความปลอดภัยควบคุมภายในโดย ชมรมศิษย์วัดตากฟ้า
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" id="admin-dashboard-container">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6" id="dashboard-header-block">
        <div>
          <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-2">
            ระบบจัดการสำหรับแอดมิน
          </h2>
          <p className="font-sans text-base text-on-surface-variant">
            จัดการข้อมูลศิษย์เก่าและติดตามสถานะการลงทะเบียน คัดกรอง คัดลอก และอนุมัติโปรไฟล์
          </p>
        </div>
        
        {/* Actions Button Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto" id="dashboard-header-actions">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-surface-container-high hover:bg-surface-variant text-on-surface-variant px-5 py-3 rounded-xl font-bold border border-outline-variant/30 transition-standard cursor-pointer text-xs"
            id="admin-logout-btn"
          >
            ออกจากระบบ
          </button>

          {/* Export to CSV (Excel compatible) Button */}
          <button 
            onClick={handleExportCSV}
            className="group relative flex items-center gap-2.5 bg-primary text-on-primary px-6 py-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-standard active:scale-[0.98] cursor-pointer text-xs"
            id="export-csv-btn"
          >
            <Download className="w-5 h-5" />
            <span>Export to Excel</span>
            <div className="absolute -top-2 -right-2 bg-error text-on-error text-[10px] font-bold px-2 py-0.5 rounded-full scale-0 group-hover:scale-100 transition-transform">
              XLSX
            </div>
          </button>
        </div>
      </div>

      {/* Quick Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10" id="stats-bento-grid">
        {/* Stat Card 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col gap-2">
          <span className="text-secondary text-sm font-semibold">รวมศิษย์เก่าทั้งหมด</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-bold text-primary font-display-lg">
              {stats.total}
            </span>
            <span className="text-primary text-xs font-bold bg-primary-container/15 px-2 py-0.5 rounded-full">
              รวมทุกรุ่น
            </span>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col gap-2">
          <span className="text-secondary text-sm font-semibold">รอดำเนินการ</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-bold text-tertiary font-display-lg">
              {stats.pending}
            </span>
            {stats.pending > 0 ? (
              <span className="text-error text-xs font-extrabold bg-error-container/15 px-2 py-0.5 rounded-full animate-pulse">
                ด่วน
              </span>
            ) : (
              <span className="text-success text-xs font-semibold bg-success-container/15 px-2 py-0.5 rounded-full">
                ครบถ้วน
              </span>
            )}
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col gap-2">
          <span className="text-secondary text-sm font-semibold">อนุมัติสำเร็จแล้ว</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-bold text-primary font-display-lg">
              {stats.approvedCount}
            </span>
            <span className="text-secondary text-xs font-bold bg-secondary-container/15 px-2 py-0.5 rounded-full">
              {stats.approvedPercent}% ของทั้งหมด
            </span>
          </div>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col gap-2">
          <span className="text-secondary text-sm font-semibold">จำนวนรุ่นที่พบ</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl md:text-4xl font-bold text-primary font-display-lg">
              {generationsList.length}
            </span>
            <span className="text-primary text-xs font-bold bg-primary-container/15 px-2 py-0.5 rounded-full">
              รุ่นที่ลงทะเบียน
            </span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10" id="dashboard-charts-grid">
        {/* Occupation Distribution Bar Chart Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20" id="occupation-chart-card">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h3 className="font-sans font-bold text-lg text-primary">สัดส่วนกลุ่มอาชีพของศิษย์เก่า</h3>
              <p className="font-sans text-xs text-on-surface-variant mt-1">
                แผนภูมิแท่งแสดงจำนวนการประกอบอาชีพในแต่ละกลุ่มอ้างอิงตามข้อมูลจริงของศิษย์เก่าในระบบ
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-xs font-bold text-primary">
              <span>รวมที่ระบุอาชีพ: {alumni.filter(a => a.occupation).length} คน</span>
            </div>
          </div>

          {/* Recharts Container */}
          <div className="w-full h-80" id="occupation-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={occupationChartData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0, 0, 0, 0.05)" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'currentColor', opacity: 0.8, fontSize: 12, fontFamily: 'sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  allowDecimals={false}
                  tick={{ fill: 'currentColor', opacity: 0.8, fontSize: 11, fontFamily: 'sans-serif' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-surface-container-high p-3 rounded-xl shadow-lg border border-outline-variant/30 text-xs text-on-surface">
                          <p className="font-bold mb-1">{data.name}</p>
                          <p className="text-primary font-bold">จำนวน: {data.count} คน</p>
                          <p className="text-[10px] text-outline mt-0.5">
                            คิดเป็น {((data.count / (alumni.length || 1)) * 100).toFixed(1)}% ของทั้งหมด
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="count" 
                  radius={[8, 8, 0, 0]} 
                  maxBarSize={60}
                >
                  {occupationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Province Distribution Donut Chart Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col justify-between" id="province-chart-card">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-primary">สัดส่วนจังหวัดที่อยู่ปัจจุบัน</h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  แผนภูมิโดนัทแสดงการกระจายตัวของศิษย์เก่าในแต่ละจังหวัด (แสดง 5 อันดับแรกและอื่นๆ)
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-xs font-bold text-primary shrink-0">
                <span>รวม {provincesList.length} จังหวัด</span>
              </div>
            </div>

            {/* Recharts Donut Container */}
            <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-6" id="province-chart-wrapper">
              <div className="w-full sm:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={provinceChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {provinceChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-surface-container-high p-3 rounded-xl shadow-lg border border-outline-variant/30 text-xs text-on-surface">
                              <p className="font-bold mb-1">{data.name}</p>
                              <p className="text-primary font-bold">จำนวน: {data.count} คน</p>
                              <p className="text-[10px] text-outline mt-0.5">
                                คิดเป็น {((data.count / (alumni.length || 1)) * 100).toFixed(1)}% ของทั้งหมด
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-center max-h-64 overflow-y-auto pr-2">
                {provinceChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} 
                      />
                      <span className="text-on-surface font-sans truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-outline font-bold text-right ml-2 shrink-0">
                      {entry.count} คน ({((entry.count / (alumni.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dhamma Education Distribution Donut Chart Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col justify-between animate-fade-in" id="dhamma-education-chart-card">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-primary">สัดส่วนวุฒิการศึกษาทางธรรมสูงสุด</h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  แผนภูมิโดนัทแสดงสัดส่วนวุฒิการศึกษาทางธรรมสูงสุดของกลุ่มศิษย์เก่าในระบบ
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-xs font-bold text-primary shrink-0">
                <span>รวม {dhammaEducationChartData.length} กลุ่มวุฒิ</span>
              </div>
            </div>

            {/* Recharts Donut Container */}
            <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-6" id="dhamma-chart-wrapper">
              <div className="w-full sm:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dhammaEducationChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {dhammaEducationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={DHAMMA_COLORS[index % DHAMMA_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-surface-container-high p-3 rounded-xl shadow-lg border border-outline-variant/30 text-xs text-on-surface">
                              <p className="font-bold mb-1">{data.name}</p>
                              <p className="text-primary font-bold">จำนวน: {data.count} คน</p>
                              <p className="text-[10px] text-outline mt-0.5">
                                คิดเป็น {((data.count / (alumni.length || 1)) * 100).toFixed(1)}% ของทั้งหมด
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-center max-h-64 overflow-y-auto pr-2">
                {dhammaEducationChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: DHAMMA_COLORS[index % DHAMMA_COLORS.length] }} 
                      />
                      <span className="text-on-surface font-sans truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-outline font-bold text-right ml-2 shrink-0">
                      {entry.count} คน ({((entry.count / (alumni.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Secular Education Distribution Donut Chart Card */}
        <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 flex flex-col justify-between animate-fade-in" id="secular-education-chart-card">
          <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h3 className="font-sans font-bold text-lg text-primary">สัดส่วนวุฒิการศึกษาทางโลกสูงสุด</h3>
                <p className="font-sans text-xs text-on-surface-variant mt-1">
                  แผนภูมิโดนัทแสดงสัดส่วนวุฒิการศึกษาทางโลกสูงสุดที่ศิษย์เก่าสำเร็จการศึกษา
                </p>
              </div>
              <div className="flex items-center gap-2 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10 text-xs font-bold text-primary shrink-0">
                <span>รวม {secularEducationChartData.length} กลุ่มวุฒิ</span>
              </div>
            </div>

            {/* Recharts Donut Container */}
            <div className="w-full h-80 flex flex-col sm:flex-row items-center justify-center gap-6" id="secular-chart-wrapper">
              <div className="w-full sm:w-1/2 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={secularEducationChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {secularEducationChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SECULAR_COLORS[index % SECULAR_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-surface-container-high p-3 rounded-xl shadow-lg border border-outline-variant/30 text-xs text-on-surface">
                              <p className="font-bold mb-1">{data.name}</p>
                              <p className="text-primary font-bold">จำนวน: {data.count} คน</p>
                              <p className="text-[10px] text-outline mt-0.5">
                                คิดเป็น {((data.count / (alumni.length || 1)) * 100).toFixed(1)}% ของทั้งหมด
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Custom Legend */}
              <div className="flex flex-col gap-2 w-full sm:w-1/2 justify-center max-h-64 overflow-y-auto pr-2">
                {secularEducationChartData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-3 h-3 rounded-full shrink-0" 
                        style={{ backgroundColor: SECULAR_COLORS[index % SECULAR_COLORS.length] }} 
                      />
                      <span className="text-on-surface font-sans truncate" title={entry.name}>
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-outline font-bold text-right ml-2 shrink-0">
                      {entry.count} คน ({((entry.count / (alumni.length || 1)) * 100).toFixed(1)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Database Table Container */}
      <div className="bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20 overflow-hidden mb-10" id="alumni-table-card">
        
        {/* Search, Filter & Sort Controls Panel */}
        <div className="p-5 border-b border-outline-variant/30 flex flex-col gap-4 bg-surface-container-low/10">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Table Search */}
            <div className="relative flex-1 max-w-full lg:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
              <input 
                className="w-full pl-10 pr-4 py-2.5 bg-surface-container-low/60 border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-standard font-sans text-sm"
                placeholder="ค้นหาชื่อ, รุ่น หรือจังหวัด..."
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                id="table-search-input"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Dropdown Filters (รุ่น / จังหวัด) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Generation Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-outline">รุ่น:</span>
                <select
                  value={selectedGenFilter}
                  onChange={(e) => { setSelectedGenFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-on-surface"
                >
                  <option value="all">ทั้งหมด</option>
                  {generationsList.map(gen => (
                    <option key={gen} value={gen.toString()}>รุ่น {gen}</option>
                  ))}
                </select>
              </div>

              {/* Province Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-outline">จังหวัด:</span>
                <select
                  value={selectedProvinceFilter}
                  onChange={(e) => { setSelectedProvinceFilter(e.target.value); setCurrentPage(1); }}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer text-on-surface"
                >
                  <option value="all">ทั้งหมด</option>
                  {provincesList.map(prov => (
                    <option key={prov} value={prov}>{prov}</option>
                  ))}
                </select>
              </div>

              {/* Reset Filter Button if any is set */}
              {(selectedGenFilter !== 'all' || selectedProvinceFilter !== 'all' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    setSelectedGenFilter('all');
                    setSelectedProvinceFilter('all');
                    setSearchQuery('');
                    setCurrentPage(1);
                  }}
                  className="text-xs text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> ล้างตัวกรอง
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
            {/* Quick status filter and Sort toggles */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto" id="table-filter-toggles">
              {/* Status filters */}
              <div className="flex bg-surface-container-low p-1 rounded-xl border border-outline-variant/30 text-xs">
                <button 
                  onClick={() => { setStatusFilter('all'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-standard ${
                    statusFilter === 'all' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  ทั้งหมด
                </button>
                <button 
                  onClick={() => { setStatusFilter('approved'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-standard ${
                    statusFilter === 'approved' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  อนุมัติแล้ว
                </button>
                <button 
                  onClick={() => { setStatusFilter('pending'); setCurrentPage(1); }}
                  className={`px-3 py-1.5 rounded-lg font-bold cursor-pointer transition-standard ${
                    statusFilter === 'pending' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  รอตรวจ
                </button>
              </div>

              {/* Sort Order Button */}
              <button 
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="flex items-center justify-center gap-2 px-4 py-2 border border-outline-variant rounded-xl hover:bg-surface-container-low transition-standard cursor-pointer text-xs font-bold"
                title="เรียงตามปีการศึกษา"
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-primary" />
                <span>ปีการศึกษา ({sortOrder === 'desc' ? 'ล่าสุด' : 'เก่าสุด'})</span>
              </button>
            </div>

            <div className="text-xs text-outline font-medium self-end sm:self-center">
              พบศิษย์เก่า {filteredAlumni.length} คน จากตัวกรองปัจจุบัน
            </div>
          </div>
        </div>

        {/* Desktop Data Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse" id="alumni-admin-table">
            <thead>
              <tr className="bg-surface-container-low/75 border-b border-outline-variant/30 text-xs text-secondary font-bold select-none">
                <th className="px-6 py-4">รายชื่อศิษย์เก่า</th>
                <th className="px-6 py-4">รุ่นที่</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4">จังหวัด</th>
                <th className="px-6 py-4">เบอร์โทรศัพท์</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {paginatedAlumni.length > 0 ? (
                paginatedAlumni.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-surface-container/30 transition-standard group text-sm"
                  >
                    {/* Alumnus Name with Avatar Badge */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 border border-outline-variant/20">
                          <img 
                            src={item.imageUrl
                              ? resolveImageUrl(item.imageUrl)
                              : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.fullname)}`
                            } 
                            alt={item.fullname} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div>
                          <div className="font-bold text-on-surface line-clamp-1">{item.fullname}</div>
                        </div>
                      </div>
                    </td>

                    {/* Generation */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 bg-surface-container-high text-on-surface rounded-full text-xs font-bold">
                        รุ่น {item.generation}
                      </span>
                    </td>

                    {/* Status Badge with Interactive Approve command */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 px-2.5 py-1.5 rounded-full border border-primary/25 shadow-sm">
                          <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span className="whitespace-nowrap">ยืนยันแล้ว</span>
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleApproveAction(item.id, item.fullname)}
                          className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white border border-red-600 px-2.5 py-1.5 rounded-full text-xs font-bold animate-pulse hover:animate-none cursor-pointer transition-standard whitespace-nowrap shadow-sm hover:shadow-md"
                          title="คลิกเพื่ออนุมัติทันที"
                        >
                          <UserCheck className="w-3.5 h-3.5 shrink-0 text-white" />
                          <span className="whitespace-nowrap">รออนุมัติ</span>
                        </button>
                      )}
                    </td>

                    {/* Province */}
                    <td className="px-6 py-4 text-on-surface-variant font-medium whitespace-nowrap">
                      {item.province || 'นครสวรรค์'}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-4 text-on-surface-variant font-semibold whitespace-nowrap">
                      {item.phone}
                    </td>

                    {/* Controls Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex gap-1">
                        <button 
                          onClick={() => setEditingAlumnus(item)}
                          className="p-1.5 text-outline hover:text-primary hover:bg-primary-container/10 rounded-lg transition-standard cursor-pointer"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirmAlumnus(item)}
                          className="p-1.5 text-outline hover:text-error hover:bg-error-container/10 rounded-lg transition-standard cursor-pointer"
                          title="ลบรายชื่อ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-outline">
                    <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="font-semibold text-sm">ไม่พบรายชื่อในระบบฐานข้อมูลแอดมิน</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards List Layout */}
        <div className="block md:hidden divide-y divide-outline-variant/15" id="alumni-mobile-list">
          {paginatedAlumni.length > 0 ? (
            paginatedAlumni.map((item) => (
              <div 
                key={item.id}
                className="p-5 flex flex-col gap-4 bg-surface-container-lowest hover:bg-surface-container/10 transition-standard"
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0 border border-outline-variant/20 shadow-sm">
                      <img 
                        src={item.imageUrl
                          ? resolveImageUrl(item.imageUrl)
                          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.fullname)}`
                        } 
                        alt={item.fullname} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-base text-on-surface truncate">{item.fullname}</div>
                      {item.nickname && (
                        <p className="text-xs text-on-surface-variant font-medium">ชื่อเล่น: {item.nickname}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions (Edit / Delete) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => setEditingAlumnus(item)}
                      className="p-2 text-outline hover:text-primary hover:bg-primary-container/10 rounded-xl transition-standard cursor-pointer"
                      title="แก้ไขข้อมูล"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setDeleteConfirmAlumnus(item)}
                      className="p-2 text-outline hover:text-error hover:bg-error-container/10 rounded-xl transition-standard cursor-pointer"
                      title="ลบรายชื่อ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sub-badges (Generation / Status) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1.5 bg-surface-container-high text-on-surface rounded-full text-xs font-bold whitespace-nowrap">
                    รุ่น {item.generation}
                  </span>
                  
                  {item.status === 'approved' ? (
                    <span className="inline-flex items-center gap-1.5 text-primary text-xs font-bold bg-primary/10 px-2.5 py-1.5 rounded-full border border-primary/25 shadow-sm whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      <span className="whitespace-nowrap">ยืนยันแล้ว</span>
                    </span>
                  ) : (
                    <button 
                      onClick={() => handleApproveAction(item.id, item.fullname)}
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white border border-red-600 px-3 py-1.5 rounded-full text-xs font-extrabold animate-pulse hover:animate-none cursor-pointer transition-standard shadow-sm active:scale-95 whitespace-nowrap"
                      title="คลิกเพื่ออนุมัติทันที"
                    >
                      <UserCheck className="w-3.5 h-3.5 shrink-0 text-white" />
                      <span className="whitespace-nowrap">คลิกเพื่ออนุมัติ</span>
                    </button>
                  )}
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant/10 text-xs text-on-surface-variant font-medium">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider">จังหวัด</span>
                    <span className="text-on-surface font-semibold">{item.province || 'นครสวรรค์'}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-outline font-bold uppercase tracking-wider">เบอร์โทรศัพท์</span>
                    <a href={`tel:${item.phone}`} className="text-primary font-bold hover:underline select-all">{item.phone}</a>
                  </div>
                  {item.occupation && (
                    <div className="col-span-2 flex flex-col gap-0.5">
                      <span className="text-[10px] text-outline font-bold uppercase tracking-wider">อาชีพ</span>
                      <span className="text-on-surface">{item.occupation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-outline">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-sm">ไม่พบรายชื่อในระบบฐานข้อมูลแอดมิน</p>
            </div>
          )}
        </div>

        {/* Table Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between bg-surface-container-low/30 gap-4" id="table-pagination">
            <span className="text-xs text-on-surface-variant select-none">
              แสดง {(currentPage - 1) * itemsPerPage + 1} ถึง {Math.min(currentPage * itemsPerPage, filteredAlumni.length)} จากทั้งหมด {filteredAlumni.length} รายการ
            </span>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer text-outline disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-standard cursor-pointer ${
                    currentPage === page 
                      ? 'bg-primary text-on-primary' 
                      : 'border border-outline-variant hover:bg-surface-container'
                  }`}
                >
                  {page}
                </button>
              ))}

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-colors disabled:opacity-50 cursor-pointer text-outline disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* System Audit Logs Section */}
      <div className="mt-10" id="audit-logs-panel">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
          <h3 className="font-sans font-bold text-xl text-primary flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>ประวัติการทำงานล่าสุด (System Audit Logs)</span>
          </h3>
          {logs.length > 0 && onClearLogs && (
            <button
              onClick={() => setShowClearLogsConfirm(true)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-error/10 hover:bg-error/15 text-error border border-error/25 hover:border-error/35 rounded-xl text-xs font-bold transition-standard cursor-pointer"
              title="ล้างประวัติการทำงานทั้งหมด"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ล้างประวัติทั้งหมด</span>
            </button>
          )}
        </div>
        <div className="space-y-3.5">
          {logs.length > 0 ? (
            logs.slice(0, 8).map((log) => (
              <div 
                key={log.id}
                className="flex items-center gap-4 p-4 bg-surface-container/60 rounded-xl border border-outline-variant/15 hover:border-outline-variant/35 transition-standard"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  log.type === 'approve' ? 'bg-primary-container/20 text-primary' :
                  log.type === 'export' ? 'bg-green-100 text-green-700' :
                  log.type === 'register' ? 'bg-warning/10 text-warning' : 'bg-secondary-container text-secondary'
                }`}>
                  {log.type === 'approve' && <CheckCircle className="w-4 h-4" />}
                  {log.type === 'export' && <Download className="w-4 h-4" />}
                  {log.type === 'register' && <RefreshCw className="w-4 h-4 animate-spin-slow" />}
                  {log.type !== 'approve' && log.type !== 'export' && log.type !== 'register' && <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface truncate">
                    <strong className="font-bold">{log.adminName}</strong> {log.action}
                  </p>
                  <p className="text-[10px] text-outline mt-0.5">{log.timestamp}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center bg-surface-container/30 border border-dashed border-outline-variant/40 rounded-xl text-outline animate-fade-in">
              <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-xs">ยังไม่มีประวัติการทำงานใดๆ ในระบบขณะนี้</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Alert Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-inverse-surface text-inverse-on-surface px-5 py-3 rounded-xl shadow-xl z-50 flex items-center gap-3 animate-slide-up border border-outline-variant/20">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-sm font-semibold font-sans">{toastMessage}</span>
        </div>
      )}

      {/* Alumnus Edit Modal */}
      {editingAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="edit-modal-overlay">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full shadow-2xl relative border border-outline-variant/30 animate-scale-up flex flex-col max-h-[90vh]">
            {/* Modal Header (Fixed) */}
            <div className="flex justify-between items-center p-6 pb-4 border-b border-outline-variant/30 shrink-0">
              <h3 className="font-sans font-bold text-lg text-primary flex items-center gap-2">
                <Edit3 className="w-5 h-5" />
                <span>แก้ไขข้อมูลประวัติศิษย์เก่า</span>
              </h3>
              <button 
                onClick={() => setEditingAlumnus(null)}
                className="p-1.5 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form wrapping scrollable content and fixed footer */}
            <form onSubmit={handleEditSubmit} className="flex-1 flex flex-col overflow-hidden min-h-0">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm scrollbar-thin">
                <div className="grid grid-cols-2 gap-4">
                  {/* Profile Image Edit */}
                  <div className="col-span-2 flex flex-col items-center gap-2 pb-2" id="edit-profile-image-section">
                    <div 
                      className="relative group cursor-pointer" 
                      onClick={() => editFileInputRef.current?.click()}
                      title="คลิกเพื่อเปลี่ยนรูปภาพ"
                    >
                      <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-dashed border-outline hover:border-primary flex items-center justify-center overflow-hidden transition-standard shadow-sm">
                        {editingAlumnus.imageUrl ? (
                          <img 
                            src={resolveImageUrl(editingAlumnus.imageUrl)} 
                            alt="Profile Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <img 
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(editingAlumnus.fullname)}`}
                            alt="Generated Avatar" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        )}
                      </div>
                      <div className="absolute bottom-0 right-0 bg-primary text-on-primary p-2 rounded-full shadow-lg active:scale-90 transition-standard">
                        <Camera className="w-3.5 h-3.5" />
                      </div>
                      <input 
                        type="file" 
                        ref={editFileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              const rawBase64 = reader.result as string;
                              setTempEditImageSrc(rawBase64);
                              setIsEditCropModalOpen(true);
                              if (editFileInputRef.current) {
                                editFileInputRef.current.value = '';
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        id="edit-profile-picture-input"
                      />
                    </div>
                    <span className="text-[11px] text-outline font-semibold font-sans">คลิกที่รูปภาพเพื่อแก้ไขรูปภาพโปรไฟล์</span>
                  </div>

                  {/* Full name */}
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline">ชื่อ-นามสกุล</label>
                    <input 
                      type="text" 
                      required
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.fullname}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, fullname: e.target.value })}
                    />
                  </div>

                  {/* Nickname */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline">ชื่อเล่น</label>
                    <input 
                      type="text" 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.nickname || ''}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, nickname: e.target.value })}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline">เบอร์โทรศัพท์</label>
                    <input 
                      type="text" 
                      required
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.phone}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, phone: e.target.value })}
                    />
                  </div>

                  {/* Academic Year Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline font-sans">ปีการศึกษาที่เข้าเรียน</label>
                    <select 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 bg-surface cursor-pointer font-sans text-sm"
                      value={editingAlumnus.academic_year}
                      onChange={(e) => {
                        const yr = parseInt(e.target.value) || 2560;
                        const currentGrade = editingAlumnus.entry_grade || getEntryGrade(editingAlumnus.academic_year, editingAlumnus.generation);
                        const availableGrades = getAvailableGrades(yr);
                        const nextGrade = availableGrades.includes(currentGrade) ? currentGrade : availableGrades[0];
                        const nextGen = calculateGeneration(yr, nextGrade);
                        setEditingAlumnus({ 
                          ...editingAlumnus, 
                          academic_year: yr, 
                          entry_grade: nextGrade,
                          generation: nextGen 
                        });
                      }}
                    >
                      {[...ENTRY_YEARS].reverse().map((yr) => (
                        <option key={yr} value={yr}>พ.ศ. {yr}</option>
                      ))}
                    </select>
                  </div>

                  {/* Entry Grade Level Selector */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline font-sans">ระดับชั้นเมื่อแรกเข้าศึกษา</label>
                    <select 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 bg-surface cursor-pointer font-sans text-sm"
                      value={editingAlumnus.entry_grade || getEntryGrade(editingAlumnus.academic_year, editingAlumnus.generation)}
                      onChange={(e) => {
                        const grade = e.target.value;
                        const nextGen = calculateGeneration(editingAlumnus.academic_year, grade);
                        setEditingAlumnus({ 
                          ...editingAlumnus, 
                          entry_grade: grade,
                          generation: nextGen 
                        });
                      }}
                    >
                      {getAvailableGrades(editingAlumnus.academic_year).map((grade) => {
                        const label = grade === 'จบ ม.3 มาแล้วต่อ กศน.' ? grade : `เข้าเรียนชั้น ${grade}`;
                        return (
                          <option key={grade} value={grade}>{label}</option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Calculated Generation Display */}
                  <div className="col-span-2 mt-1">
                    <div className="p-3 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between text-xs">
                      <span className="font-semibold text-primary">คำนวณรุ่นศิษย์เก่าอัตโนมัติ:</span>
                      <span className="font-extrabold text-primary font-sans text-sm">ศิษย์เก่า รุ่นที่ {editingAlumnus.generation}</span>
                    </div>
                  </div>

                  {/* Dhamma Education */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline font-sans">วุฒิการศึกษาทางธรรมสูงสุด</label>
                    <input 
                      type="text" 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.dhammaEducation || ''}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, dhammaEducation: e.target.value })}
                    />
                  </div>

                  {/* Secular Education */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline font-sans">วุฒิการศึกษาทางโลกสูงสุด</label>
                    <input 
                      type="text" 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.secularEducation || ''}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, secularEducation: e.target.value })}
                    />
                  </div>

                  {/* Province Selector */}
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline font-sans">จังหวัดที่อยู่ปัจจุบัน</label>
                    <select 
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 bg-surface cursor-pointer font-sans text-sm"
                      value={editingAlumnus.province || 'นครสวรรค์'}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, province: e.target.value })}
                    >
                      {THAI_PROVINCES.map((prov) => (
                        <option key={prov} value={prov}>{prov}</option>
                      ))}
                    </select>
                  </div>

                  {/* Occupation */}
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline">อาชีพปัจจุบัน</label>
                    <input 
                      type="text" 
                      required
                      className="h-10 px-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25"
                      value={editingAlumnus.occupation || ''}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, occupation: e.target.value })}
                    />
                  </div>

                  {/* Address */}
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-outline">ที่อยู่ / พำนัก</label>
                    <textarea 
                      rows={2}
                      required
                      className="p-3 border border-outline-variant rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/25 resize-none"
                      value={editingAlumnus.address || ''}
                      onChange={(e) => setEditingAlumnus({ ...editingAlumnus, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Sticky Footer Actions (Fixed) */}
              <div className="p-6 pt-4 border-t border-outline-variant/30 flex gap-3 justify-end bg-surface-container-lowest shrink-0 rounded-b-2xl">
                <button 
                  type="button" 
                  onClick={() => setEditingAlumnus(null)}
                  className="px-5 py-2 bg-surface-container-high text-on-surface-variant rounded-xl font-semibold hover:bg-surface-variant cursor-pointer transition-standard"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 cursor-pointer transition-standard"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteConfirmAlumnus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="delete-confirmation-modal">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-outline-variant/30 text-center animate-scale-up">
            <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-on-surface mb-2">ยืนยันการลบรายชื่อ</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              คุณต้องการลบข้อมูลประวัติของ <span className="font-bold text-on-surface text-error">คุณ{deleteConfirmAlumnus.fullname}</span> (รุ่นที่ {deleteConfirmAlumnus.generation}) ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmAlumnus(null)}
                className="flex-1 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl font-semibold hover:bg-surface-variant cursor-pointer transition-standard text-sm"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => handleDeleteAction(deleteConfirmAlumnus)}
                className="flex-1 py-2.5 bg-error text-on-error rounded-xl font-bold hover:bg-error/90 cursor-pointer transition-standard text-sm shadow-md"
              >
                ยืนยันลบข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Clear Logs Confirmation Modal */}
      {showClearLogsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="clear-logs-confirmation-modal">
          <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-sm w-full shadow-2xl relative border border-outline-variant/30 text-center animate-scale-up">
            <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-sans font-bold text-lg text-on-surface mb-2">ยืนยันการล้างประวัติทั้งหมด</h3>
            <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
              คุณต้องการ <span className="font-bold text-error">ล้างประวัติการทำงาน (System Audit Logs) ทั้งหมด</span> ออกจากฐานข้อมูลใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้
            </p>
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setShowClearLogsConfirm(false)}
                className="flex-1 py-2.5 bg-surface-container-high text-on-surface-variant rounded-xl font-semibold hover:bg-surface-variant cursor-pointer transition-standard text-sm"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleClearLogsAction}
                className="flex-1 py-2.5 bg-error text-on-error rounded-xl font-bold hover:bg-error/90 cursor-pointer transition-standard text-sm shadow-md"
              >
                ยืนยันล้างข้อมูล
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Photo Crop Modal */}
      {tempEditImageSrc && (
        <ImageCropModal
          isOpen={isEditCropModalOpen}
          onClose={() => {
            setIsEditCropModalOpen(false);
            setTempEditImageSrc(null);
          }}
          imageSrc={tempEditImageSrc}
          onCropComplete={(croppedBase64) => {
            setEditingAlumnus((prev) => prev ? { ...prev, imageUrl: croppedBase64 } : null);
          }}
        />
      )}
    </div>
  );
}
