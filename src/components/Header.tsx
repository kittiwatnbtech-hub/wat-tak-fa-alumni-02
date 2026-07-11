/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GraduationCap } from 'lucide-react';

interface HeaderProps {
  activeTab: 'directory' | 'registration' | 'location' | 'admin';
  setActiveTab: (tab: 'directory' | 'registration' | 'location' | 'admin') => void;
  pendingCount: number;
}

export default function Header({ activeTab, setActiveTab, pendingCount }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/30 shadow-sm">
      <div className="flex justify-between items-center px-6 lg:px-8 py-3 max-w-7xl mx-auto">
        {/* Brand Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group"
          onClick={() => setActiveTab('directory')}
          id="brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-standard">
            <GraduationCap className="w-6 h-6 stroke-[2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-display-lg text-lg md:text-xl font-bold text-primary tracking-tight leading-tight">
              ทำเนียบศิษย์เก่า
            </span>
            <span className="text-[10px] md:text-xs text-on-surface-variant font-semibold tracking-wide">
              โรงเรียนศรีนภเขตวิทยา วัดตากฟ้า
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8" id="desktop-nav">
          <button
            onClick={() => setActiveTab('directory')}
            className={`font-sans font-semibold py-1 text-lg transition-standard border-b-2 cursor-pointer ${
              activeTab === 'directory'
                ? 'text-primary border-primary'
                : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
            }`}
            id="nav-directory"
          >
            ทําเนียบศิษย์เก่า
          </button>
          <button
            onClick={() => setActiveTab('registration')}
            className={`font-sans font-semibold py-1 text-lg transition-standard border-b-2 cursor-pointer ${
              activeTab === 'registration'
                ? 'text-primary border-primary'
                : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
            }`}
            id="nav-register"
          >
            ลงทะเบียนศิษย์เก่า
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`font-sans font-semibold py-1 text-lg relative transition-standard border-b-2 cursor-pointer ${
              activeTab === 'location'
                ? 'text-primary border-primary'
                : 'text-secondary border-transparent hover:text-primary hover:border-outline-variant'
            }`}
            id="nav-location"
          >
            ตำแหน่ง
          </button>
        </nav>

        {/* Utility / Right-Side Icons */}
        <div className="flex items-center gap-4" id="utility-group">
          
          {/* Avatar frame changes contextually */}
          <div className="relative">
            <div 
              className="w-10 h-10 rounded-full border-2 border-primary-container overflow-hidden bg-primary/10 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary/20 transition-standard select-none"
              onClick={() => setActiveTab(activeTab === 'admin' ? 'directory' : 'admin')}
              title={activeTab === 'admin' ? "สลับไปหน้าทำเนียบ" : "สลับไปหน้าระบบแอดมิน"}
              id="header-avatar"
            >
              <svg 
                className={`w-full h-full p-1 transition-all duration-300 ${
                  activeTab === 'admin' ? 'text-primary' : 'text-on-surface-variant'
                }`} 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                id="avatar-icon-svg"
              >
                {/* Head */}
                <circle cx="50" cy="32" r="18" stroke="currentColor" strokeWidth="8" />
                {/* Shoulders */}
                <path d="M14 86C14 66 29 55 50 55C71 55 86 66 86 86" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
              </svg>
            </div>
            
            {pendingCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 flex h-5.5 min-w-5.5 px-1.5 items-center justify-center rounded-full bg-red-500 text-[10.5px] font-bold text-white shadow-md border-2 border-surface-container-lowest animate-pulse pointer-events-none"
                id="admin-pending-badge"
              >
                {pendingCount}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
