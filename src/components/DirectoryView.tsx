/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Users, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Phone, 
  Mail, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { AlumniProfile } from '../types';
import { getEntryGrade } from '../data/mockAlumni';

interface DirectoryViewProps {
  alumni: AlumniProfile[];
}

export default function DirectoryView({ alumni }: DirectoryViewProps) {
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGen, setSelectedGen] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected Profile for Detailed View / Chat Drawer
  const [selectedAlumnus, setSelectedAlumnus] = useState<AlumniProfile | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Only show approved alumni in public directory
  const approvedAlumni = useMemo(() => {
    return alumni.filter(item => item.status === 'approved');
  }, [alumni]);

  // Extract unique generations and years for dropdowns
  const uniqueGenerations = useMemo(() => {
    const gens = approvedAlumni.map(a => a.generation);
    return Array.from(new Set(gens)).sort((a: number, b: number) => b - a);
  }, [approvedAlumni]);

  const uniqueYears = useMemo(() => {
    const years = approvedAlumni.map(a => a.academic_year);
    return Array.from(new Set(years)).sort((a: number, b: number) => b - a);
  }, [approvedAlumni]);

  // Filter alumni based on user criteria
  const filteredAlumni = useMemo(() => {
    return approvedAlumni.filter(item => {
      const matchQuery = 
        item.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.occupation && item.occupation.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.province && item.province.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchGen = selectedGen === '' || item.generation.toString() === selectedGen;
      const matchYear = selectedYear === '' || item.academic_year.toString() === selectedYear;

      return matchQuery && matchGen && matchYear;
    });
  }, [approvedAlumni, searchQuery, selectedGen, selectedYear]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredAlumni.length / itemsPerPage) || 1;
  const paginatedAlumni = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAlumni.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAlumni, currentPage]);

  // Handle Tag click helper
  const handleTagClick = (type: 'gen' | 'year' | 'province', value: string) => {
    setCurrentPage(1);
    if (type === 'gen') {
      setSelectedGen(value);
      setSelectedYear('');
      setSearchQuery('');
    } else if (type === 'year') {
      setSelectedYear(value);
      setSelectedGen('');
      setSearchQuery('');
    } else if (type === 'province') {
      setSearchQuery(value);
      setSelectedGen('');
      setSelectedYear('');
    }
  };

  // Open Profile Drawer
  const openChat = (alumnus: AlumniProfile) => {
    setSelectedAlumnus(alumnus);
    setIsChatOpen(true);
  };

  return (
    <div className="animate-fade-in" id="directory-container">
      {/* Hero Header Section */}
      <section className="mb-5 md:mb-8" id="directory-hero">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-primary mb-3">
              ทำเนียบศิษย์เก่า
            </h1>
            <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              ค้นหาและเชื่อมต่อกับกัลยาณมิตร รุ่นพี่ และรุ่นน้องในเครือข่ายศิษย์เก่าโรงเรียนวัดตากฟ้า พระอารามหลวง
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary font-semibold bg-primary-container/10 px-4 py-2.5 rounded-full" id="member-counter-badge">
            <Users className="w-5 h-5" />
            <span className="font-sans text-sm md:text-base font-medium">
              สมาชิกทั้งหมด {approvedAlumni.length} ท่าน
            </span>
          </div>
        </div>
      </section>

      {/* Search & Filter Bar Card */}
      <section className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl shadow-sm p-3.5 md:p-6 mb-6 md:mb-10" id="search-filters-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 md:left-4 top-1/2 -translate-y-1/2 text-outline w-4 h-4 md:w-5 md:h-5" />
            <input 
              className="w-full pl-10 md:pl-12 pr-4 py-2.5 md:py-3.5 bg-surface-container-low border-none rounded-xl focus:ring-2 focus:ring-primary/20 focus:outline-none font-sans text-sm md:text-base transition-standard"
              placeholder="ค้นหาชื่อ, นามสกุล, ชื่อเล่น หรืออาชีพ..."
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              id="directory-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-outline hover:text-primary cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns side-by-side on mobile */}
          <div className="md:col-span-6 grid grid-cols-2 gap-2.5">
            {/* Generation Filter Dropdown */}
            <div className="relative">
              <select 
                className="w-full appearance-none bg-surface-container-low border-none rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 pr-8 md:pr-10 focus:ring-2 focus:ring-primary/20 focus:outline-none font-sans text-sm md:text-base text-on-surface-variant transition-standard cursor-pointer"
                value={selectedGen}
                onChange={(e) => {
                  setSelectedGen(e.target.value);
                  setCurrentPage(1);
                }}
                id="generation-filter-select"
              >
                <option value="">เลือกรุ่น</option>
                {uniqueGenerations.map(gen => (
                  <option key={gen} value={gen.toString()}>รุ่นที่ {gen}</option>
                ))}
              </select>
              <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>

            {/* Year Filter Dropdown */}
            <div className="relative">
              <select 
                className="w-full appearance-none bg-surface-container-low border-none rounded-xl px-3 md:px-4 py-2.5 md:py-3.5 pr-8 md:pr-10 focus:ring-2 focus:ring-primary/20 focus:outline-none font-sans text-sm md:text-base text-on-surface-variant transition-standard cursor-pointer"
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                id="year-filter-select"
              >
                <option value="">เลือก ปี พ.ศ.</option>
                {uniqueYears.map(year => (
                  <option key={year} value={year.toString()}>{year}</option>
                ))}
              </select>
              <div className="absolute right-2.5 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline">
                <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Alumni Profiles Grid */}
      {paginatedAlumni.length > 0 ? (
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-4.5 mb-12" id="alumni-cards-grid">
          {paginatedAlumni.map((item) => (
            <div 
              key={item.id}
              className="profile-card group bg-surface-container-lowest rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.04)] overflow-hidden border border-outline-variant/20 transition-standard hover:shadow-lg flex flex-col h-full"
              id={`alumni-card-${item.id}`}
            >
              {/* Image Frame */}
              <div 
                className="aspect-[4/5] overflow-hidden relative bg-surface-container-high cursor-pointer"
                onClick={() => openChat(item)}
              >
                <img 
                  className="profile-image w-full h-full object-cover transition-standard duration-500 bg-primary/5" 
                  src={item.imageUrl
                    ? item.imageUrl 
                    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.fullname)}`
                  } 
                  alt={item.fullname}
                  referrerPolicy="no-referrer"
                />
                {/* Generation Pill Overlay */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-primary font-bold text-[11px] md:text-xs shadow-sm">
                    รุ่น {item.generation}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 md:p-6 flex flex-col flex-grow justify-between">
                <div>
                  <h3 
                    onClick={() => openChat(item)}
                    className="font-sans text-base md:text-lg font-bold text-on-surface group-hover:text-primary transition-standard cursor-pointer line-clamp-1"
                    title={item.fullname}
                  >
                    {item.fullname}
                  </h3>
                  <p className="text-on-surface-variant text-sm mt-1">
                    ชื่อเล่น: {item.nickname || '-'}
                  </p>
                  <p className="text-on-surface-variant text-xs flex items-center gap-1 mt-1 opacity-80">
                    <MapPin className="w-3.5 h-3.5 text-outline" />
                    {item.province || 'นครสวรรค์'}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-outline-variant/30 flex justify-between items-center">
                  <span className="text-xs text-outline font-medium">
                    พ.ศ. {item.academic_year}
                  </span>
                  <button 
                    onClick={() => openChat(item)}
                    className="w-8 h-8 rounded-full bg-primary/5 hover:bg-primary/10 text-primary flex items-center justify-center transition-standard cursor-pointer"
                    title={`คุยกับคุณ ${item.fullname}`}
                  >
                    <MessageSquare className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="bg-surface-container-lowest border border-outline-variant/20 rounded-2xl py-16 px-6 text-center shadow-sm mb-12" id="no-results-card">
          <Users className="w-16 h-16 text-outline/40 mx-auto mb-4 stroke-[1.5]" />
          <h3 className="font-sans font-bold text-xl text-on-surface mb-2">ไม่พบข้อมูลศิษย์เก่า</h3>
          <p className="font-sans text-sm text-on-surface-variant max-w-md mx-auto">
            ลองปรับเปลี่ยนคำค้นหา หรือใช้ตัวกรองอื่นๆ เช่นการเลือกปี พ.ศ. หรือรุ่น เพื่อดูรายชื่อทั้งหมด
          </p>
          {(searchQuery || selectedGen || selectedYear) && (
            <button
              onClick={() => {
                setSelectedGen('');
                setSelectedYear('');
                setSearchQuery('');
              }}
              className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-xl font-semibold hover:opacity-90 transition-standard cursor-pointer inline-flex items-center gap-2 shadow-sm"
            >
              แสดงสมาชิกทั้งหมด
            </button>
          )}
        </section>
      )}

      {/* Pagination Container */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mb-12" id="directory-pagination">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-outline hover:bg-surface-container-high disabled:opacity-40 transition-standard cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-xl font-semibold transition-standard cursor-pointer ${
                currentPage === page 
                  ? 'bg-primary text-on-primary shadow-sm' 
                  : 'bg-surface-container-lowest border border-outline-variant/30 hover:bg-surface-container-high'
              }`}
            >
              {page}
            </button>
          ))}

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-lowest border border-outline-variant/30 text-outline hover:bg-surface-container-high disabled:opacity-40 transition-standard cursor-pointer disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Profile Drawer Modal */}
      {isChatOpen && selectedAlumnus && (
        <div className="fixed inset-0 z-50 flex justify-end bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="chat-modal-overlay">
          <div className="w-full max-w-md bg-surface-container-lowest h-full shadow-2xl flex flex-col relative animate-slide-left border-l border-outline-variant/30">
            {/* Header */}
            <div className="p-4 border-b border-outline-variant/40 flex justify-between items-center bg-surface-container-low/50">
              <h3 className="font-sans font-bold text-base text-on-surface">ข้อมูลศิษย์เก่าอย่างละเอียด</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-2 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface transition-standard cursor-pointer"
                id="close-chat-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Container */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* Profile Image & Basic Info Badge */}
              <div className="flex flex-col items-center text-center pb-2 border-b border-outline-variant/20">
                <div className="w-44 h-44 rounded-2xl overflow-hidden bg-primary/5 flex items-center justify-center border-2 border-primary-container/40 shadow-sm mb-4">
                  <img 
                    src={selectedAlumnus.imageUrl
                      ? selectedAlumnus.imageUrl
                      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedAlumnus.fullname)}`
                    } 
                    alt={selectedAlumnus.fullname} 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                </div>
                
                <h4 className="font-sans font-bold text-on-surface text-xl">{selectedAlumnus.fullname}</h4>
                {selectedAlumnus.nickname && (
                  <p className="text-sm text-on-surface-variant font-medium mt-1">ชื่อเล่น: {selectedAlumnus.nickname}</p>
                )}
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                    ศิษย์เก่ารุ่นที่ {selectedAlumnus.generation}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-semibold text-xs border border-outline-variant/20">
                    เข้าเรียน พ.ศ. {selectedAlumnus.academic_year}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-primary/5 text-primary/80 font-semibold text-xs border border-primary/10">
                    {selectedAlumnus.entry_grade || getEntryGrade(selectedAlumnus.academic_year, selectedAlumnus.generation)}
                  </span>
                </div>
              </div>

              {/* Detailed Alumnus Business Card Info */}
              <div className="bg-surface-container-low/60 rounded-2xl p-5 border border-outline-variant/20 flex flex-col gap-4">
                <div className="flex items-center gap-2 text-primary font-bold border-b border-outline-variant/30 pb-3 mb-1">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-semibold">ประวัติและช่องทางการติดต่อ</span>
                </div>
                
                <div className="flex items-start gap-3.5 text-sm">
                  <Briefcase className="w-4 h-4 text-outline mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-outline font-medium">อาชีพปัจจุบัน</p>
                    <p className="font-semibold text-on-surface mt-0.5">{selectedAlumnus.occupation || 'ไม่ได้ระบุ'}</p>
                  </div>
                </div>

                {selectedAlumnus.dhammaEducation && (
                  <div className="flex items-start gap-3.5 text-sm">
                    <span className="w-4 h-4 text-outline mt-0.5 shrink-0 font-bold text-[10px] flex items-center justify-center bg-primary/10 rounded text-primary border border-primary/20 select-none">ธรรม</span>
                    <div>
                      <p className="text-xs text-outline font-medium">วุฒิการศึกษาทางธรรมสูงสุด</p>
                      <p className="font-semibold text-on-surface mt-0.5">{selectedAlumnus.dhammaEducation}</p>
                    </div>
                  </div>
                )}

                {selectedAlumnus.secularEducation && (
                  <div className="flex items-start gap-3.5 text-sm">
                    <span className="w-4 h-4 text-outline mt-0.5 shrink-0 font-bold text-[10px] flex items-center justify-center bg-primary/10 rounded text-primary border border-primary/20 select-none">โลก</span>
                    <div>
                      <p className="text-xs text-outline font-medium">วุฒิการศึกษาทางโลกสูงสุด</p>
                      <p className="font-semibold text-on-surface mt-0.5">{selectedAlumnus.secularEducation}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3.5 text-sm">
                  <MapPin className="w-4 h-4 text-outline mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-outline font-medium">ที่อยู่ / พำนัก</p>
                    <p className="font-medium text-on-surface mt-0.5">{selectedAlumnus.address || 'นครสวรรค์'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 text-sm">
                  <Phone className="w-4 h-4 text-outline mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-outline font-medium">เบอร์โทรศัพท์</p>
                    <p className="font-bold text-primary mt-0.5 text-base">{selectedAlumnus.phone || 'ไม่ได้ระบุ'}</p>
                  </div>
                </div>

                {selectedAlumnus.lineid && (
                  <div className="flex items-start gap-3.5 text-sm">
                    <span className="w-4 h-4 flex items-center justify-center font-bold text-xs text-green-600 bg-green-50 rounded shrink-0">L</span>
                    <div>
                      <p className="text-xs text-outline font-medium">Line ID</p>
                      <p className="font-semibold text-on-surface mt-0.5">{selectedAlumnus.lineid}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Footer */}
            {selectedAlumnus.phone && (
              <div className="p-4 border-t border-outline-variant/40 bg-surface-container-low flex gap-2">
                <a 
                  href={`tel:${selectedAlumnus.phone}`}
                  className="flex-1 bg-primary text-on-primary h-12 rounded-xl hover:opacity-90 active:scale-95 transition-standard cursor-pointer flex items-center justify-center gap-2 font-semibold text-sm"
                  id="call-action-btn"
                >
                  <Phone className="w-4 h-4" />
                  โทรติดต่อทันที
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
