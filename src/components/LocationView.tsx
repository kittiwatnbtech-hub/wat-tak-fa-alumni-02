import React, { useState, useMemo, useEffect } from 'react';
import * as d3 from 'd3';
import { 
  MapPin, 
  Search, 
  Users, 
  BookOpen, 
  GraduationCap, 
  Phone, 
  MessageSquare, 
  Briefcase, 
  ZoomIn, 
  ZoomOut, 
  RefreshCw,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus
} from 'lucide-react';
import { AlumniProfile } from '../types';
import { PROVINCE_COORDINATES } from '../data/provinceCoordinates';
import { resolveImageUrl } from '../data/mockAlumni';
import thailandGeoJson from '../data/thailand-provinces.json';

interface LocationViewProps {
  alumni: AlumniProfile[];
}

// Comprehensive mapping from English spelling variants to Thai province names
const ENGLISH_TO_THAI_PROVINCES: Record<string, string> = {
  'Bangkok': 'กรุงเทพมหานคร',
  'Krung Thep Maha Nakhon': 'กรุงเทพมหานคร',
  'Chiang Mai': 'เชียงใหม่',
  'Chiang Rai': 'เชียงราย',
  'Nakhon Sawan': 'นครสวรรค์',
  'Phrae': 'แพร่',
  'Nan': 'น่าน',
  'Phayao': 'พะเยา',
  'Mae Hong Son': 'แม่ฮ่องสอน',
  'Lampang': 'ลำปาง',
  'Lamphun': 'ลำพูน',
  'Uttaradit': 'อุตรดิตถ์',
  'Sukhothai': 'สุโขทัย',
  'Phitsanulok': 'พิษณุโลก',
  'Kamphaeng Phet': 'กำแพงเพชร',
  'Phichit': 'พิจิตร',
  'Phetchabun': 'เพชรบูรณ์',
  'Uthai Thani': 'อุทัยธานี',
  'Nong Khai': 'หนองคาย',
  'Loei': 'เลย',
  'Udon Thani': 'อุดรธานี',
  'Nakhon Phanom': 'นครพนม',
  'Sakon Nakhon': 'สกลนคร',
  'Mukdahan': 'มุกดาหาร',
  'Nong Bua Lam Phu': 'หนองบัวลำภู',
  'Nongbua Lamphu': 'หนองบัวลำภู',
  'Kalasin': 'กาฬสินธุ์',
  'Khon Kaen': 'ขอนแก่น',
  'Chaiyaphum': 'ชัยภูมิ',
  'Maha Sarakham': 'มหาสารคาม',
  'Roi Et': 'ร้อยเอ็ด',
  'Yasothon': 'ยโสธร',
  'Amnat Charoen': 'อำนาจเจริญ',
  'Ubon Ratchathani': 'อุบลราชธานี',
  'Si Sa Ket': 'ศรีสะเกษ',
  'Sisaket': 'ศรีสะเกษ',
  'Surin': 'สุรินทร์',
  'Buri Ram': 'บุรีรัมย์',
  'Buriram': 'บุรีรัมย์',
  'Nakhon Ratchasima': 'นครราชสีมา',
  'Chai Nat': 'ชัยนาท',
  'Chainat': 'ชัยนาท',
  'Sing Buri': 'สิงห์บุรี',
  'Singburi': 'สิงห์บุรี',
  'Lop Buri': 'ลพบุรี',
  'Lopburi': 'ลพบุรี',
  'Saraburi': 'สระบุรี',
  'Ang Thong': 'อ่างทอง',
  'Phra Nakhon Si Ayutthaya': 'พระนครศรีอยุธยา',
  'Ayutthaya': 'พระนครศรีอยุธยา',
  'Suphan Buri': 'สุพรรณบุรี',
  'Suphanburi': 'สุพรรณบุรี',
  'Nakhon Nayok': 'นครนายก',
  'Pathum Thani': 'ปทุมธานี',
  'Nonthaburi': 'นนทบุรี',
  'Samut Prakan': 'สมุทรปราการ',
  'Samut Sakhon': 'สมุทรสาคร',
  'Samut Songkhram': 'สมุทรสงคราม',
  'Nakhon Pathom': 'นครปฐม',
  'Kanchanaburi': 'กาญจนบุรี',
  'Ratchaburi': 'ราชบุรี',
  'Phetchaburi': 'เพชรบุรี',
  'Prachuap Khiri Khan': 'ประจวบคีรีขันธ์',
  'Prachin Buri': 'ปราจีนบุรี',
  'Prachinburi': 'ปราจีนบุรี',
  'Sa Kaeo': 'สระแก้ว',
  'Sakaeo': 'สระแก้ว',
  'Chachoengsao': 'ฉะเชิงเทรา',
  'Chon Buri': 'ชลบุรี',
  'Chonburi': 'ชลบุรี',
  'Rayong': 'ระยอง',
  'Chanthaburi': 'จันทบุรี',
  'Trat': 'ตราด',
  'Chumphon': 'ชุมพร',
  'Ranong': 'ระนอง',
  'Surat Thani': 'สุราษฎร์ธานี',
  'Phang-nga': 'พังงา',
  'Phangnga': 'พังงา',
  'Phuket': 'ภูเก็ต',
  'Krabi': 'กระบี่',
  'Nakhon Si Thammarat': 'นครศรีธรรมราช',
  'Trang': 'ตรัง',
  'Phatthalung': 'พัทลุง',
  'Satun': 'สตูล',
  'Songkhla': 'สงขลา',
  'Pattani': 'ปัตตานี',
  'Yala': 'ยะลา',
  'Narathiwat': 'นราธิวาส',
  'Bueng Kan': 'บึงกาฬ',
  'Buengkan': 'บึงกาฬ'
};

function normalizeProvinceName(name: string): string {
  if (!name) return '';
  let cleaned = name.trim();
  if (cleaned.startsWith('จังหวัด')) {
    cleaned = cleaned.substring(6);
  }
  if (cleaned === 'กรุงเทพฯ' || cleaned === 'กรุงเทพ' || cleaned.includes('กรุงเทพมหานคร')) {
    return 'กรุงเทพมหานคร';
  }
  return cleaned;
}

function translateEnglishToThaiProvince(engName: string): string {
  if (!engName) return '';
  const cleaned = engName.trim();
  
  // Robust case-insensitive and space/hyphen/underscore-insensitive matching
  const cleanStr = (s: string) => s.replace(/[\s\-_]/g, '').toLowerCase();
  const cleanedInput = cleanStr(cleaned);
  
  const foundKey = Object.keys(ENGLISH_TO_THAI_PROVINCES).find(
    k => cleanStr(k) === cleanedInput
  );
  if (foundKey) {
    return ENGLISH_TO_THAI_PROVINCES[foundKey];
  }
  return cleaned;
}

function findProvinceName(properties: any): string {
  if (!properties) return '';
  const thaiKeys = ['pro_th', 'pv_th', 'name_th', 'PROVINCE_TH', 'province_th', 'PV_NAME_TH'];
  for (const key of thaiKeys) {
    if (properties[key] && typeof properties[key] === 'string') {
      return normalizeProvinceName(properties[key]);
    }
  }
  for (const key of Object.keys(properties)) {
    const val = properties[key];
    if (typeof val === 'string' && /[\u0e00-\u0e7f]/.test(val)) {
      return normalizeProvinceName(val);
    }
  }
  const englishKeys = ['CHA_NE', 'name', 'NAME_1', 'pro_en', 'province_en', 'name_en', 'NAME_ASCI'];
  for (const key of englishKeys) {
    if (properties[key] && typeof properties[key] === 'string') {
      return translateEnglishToThaiProvince(properties[key]);
    }
  }
  return '';
}

export default function LocationView({ alumni }: LocationViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'North' | 'Northeast' | 'Central' | 'East' | 'South'>('All');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  // GeoJSON state loaded statically
  const [geoJson, setGeoJson] = useState<any>(thailandGeoJson);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // No longer need to fetch from remote URL as it's fully bundled locally
  useEffect(() => {
    // Keep a simple check to ensure we have the static data set correctly
    if (thailandGeoJson) {
      setGeoJson(thailandGeoJson);
      setIsLoading(false);
    } else {
      setLoadError('Failed to load local map coordinates');
    }
  }, []);

  // Filter approved alumni
  const approvedAlumni = useMemo(() => {
    return alumni.filter(item => item.status === 'approved');
  }, [alumni]);

  // Group approved alumni by province
  const alumniByProvince = useMemo(() => {
    const groups: Record<string, AlumniProfile[]> = {};
    approvedAlumni.forEach(item => {
      const prov = normalizeProvinceName(item.province);
      if (!groups[prov]) {
        groups[prov] = [];
      }
      groups[prov].push(item);
    });
    return groups;
  }, [approvedAlumni]);

  // Provinces that have registered alumni
  const activeProvinces = useMemo(() => {
    return Object.keys(alumniByProvince).sort((a, b) => alumniByProvince[b].length - alumniByProvince[a].length);
  }, [alumniByProvince]);

  // Viewport sizes for D3 projection inside our responsive viewBox
  const mapWidth = 500;
  const mapHeight = 650;

  // D3 Projection and Path Generator
  const { projection, pathGenerator } = useMemo(() => {
    if (!geoJson) return { projection: null, pathGenerator: null };
    const proj = d3.geoMercator().fitSize([mapWidth, mapHeight], geoJson);
    const pathGen = d3.geoPath().projection(proj);
    return { projection: proj, pathGenerator: pathGen };
  }, [geoJson]);

  // Mapping over the GeoJSON features and preparing layout data
  const provinceMapData = useMemo(() => {
    if (!geoJson || !projection) return [];
    return geoJson.features.map((feature: any) => {
      const name = findProvinceName(feature.properties);
      const centroid = d3.geoPath().projection(projection).centroid(feature);
      const region = PROVINCE_COORDINATES[name]?.region || 'Central';
      
      const x = centroid && !isNaN(centroid[0]) ? (centroid[0] / mapWidth) * 100 : 0;
      const y = centroid && !isNaN(centroid[1]) ? (centroid[1] / mapHeight) * 100 : 0;

      return {
        name,
        feature,
        x,
        y,
        region,
        members: alumniByProvince[name] || []
      };
    });
  }, [geoJson, projection, alumniByProvince]);

  // Filtered provinces list on the right panel based on search and region
  const filteredActiveProvinces = useMemo(() => {
    return activeProvinces.filter(provName => {
      const coord = PROVINCE_COORDINATES[provName];
      const matchesRegion = selectedRegion === 'All' || coord?.region === selectedRegion;
      const members = alumniByProvince[provName] || [];
      const matchesSearch = provName.includes(searchQuery) || 
        members.some(m => 
          m.fullname.toLowerCase().includes(searchQuery.toLowerCase()) || 
          m.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
          String(m.generation).includes(searchQuery)
        );
      return matchesRegion && matchesSearch;
    });
  }, [selectedRegion, searchQuery, alumniByProvince, activeProvinces]);

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.3, 5));
  const handleZoomOut = () => {
    setZoomLevel(prev => {
      const nextZoom = Math.max(prev - 0.3, 1);
      if (nextZoom === 1) setPanOffset({ x: 0, y: 0 });
      return nextZoom;
    });
  };
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedProvince(null);
  };

  // Drag & Pan support
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  // Region names mapping
  const regionNames = {
    'All': 'ทั้งหมด',
    'North': 'ภาคเหนือ',
    'Northeast': 'ภาคตะวันออกเฉียงเหนือ',
    'Central': 'ภาคกลาง',
    'East': 'ภาคตะวันออก',
    'South': 'ภาคใต้'
  };

  return (
    <div className="space-y-8 animate-fade-in" id="location-view-container">
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: interactive map controls & the map itself */}
        <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 p-6 shadow-sm space-y-6" id="interactive-map-panel">
          
          {/* Filters & Control bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Region Selectors */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(regionNames) as Array<keyof typeof regionNames>).map((regKey) => (
                <button
                  key={regKey}
                  type="button"
                  onClick={() => setSelectedRegion(regKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-standard border ${
                    selectedRegion === regKey
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  {regionNames[regKey]}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Map Visual Stage */}
          <div 
            className="relative overflow-hidden bg-slate-950/[0.03] dark:bg-slate-950/20 border border-outline-variant/20 rounded-2xl h-[560px] md:h-[650px] w-full flex items-center justify-center select-none shadow-inner" 
            id="map-stage"
            onWheel={(e) => {
              // Smooth mouse wheel zoom support
              const delta = e.deltaY;
              setZoomLevel(prev => {
                const scale = delta < 0 ? 1.15 : 0.85;
                const nextZoom = Math.max(1, Math.min(5, prev * scale));
                if (nextZoom === 1) {
                  setPanOffset({ x: 0, y: 0 });
                }
                return nextZoom;
              });
            }}
          >
            
            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 dark:bg-slate-950/60 backdrop-blur-xs z-40">
                <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                <span className="mt-3 text-sm font-bold text-on-surface-variant font-sans">กำลังดาวน์โหลดแผนที่ประเทศไทยแบบตอบโต้...</span>
              </div>
            )}



            {/* Map Container Aspect Scaler */}
            <div
              className={`absolute inset-0 transition-transform duration-200 ease-out ${
                zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
              }`}
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
                transformOrigin: 'center center',
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#003fb1_1.2px,transparent_1.2px)] [background-size:20px_20px] pointer-events-none" />

              {/* Thailand Official GeoJSON / SVG Interactive Paths */}
              {!isLoading && provinceMapData.length > 0 && (
                <svg 
                  viewBox={`0 0 ${mapWidth} ${mapHeight}`}
                  className="w-full h-full p-6 drop-shadow-[0_8px_16px_rgba(0,0,0,0.04)]"
                  id="thailand-vector-svg"
                >
                  <g className="map-paths">
                    {provinceMapData.map((prov) => {
                      const isSelected = selectedProvince === prov.name;
                      const isHovered = hoveredProvince === prov.name;
                      const hasMembers = prov.members.length > 0;
                      
                      // Render path
                      const d = pathGenerator ? pathGenerator(prov.feature) : '';
                      if (!d) return null;

                      // Region filtering
                      const isRegionMuted = selectedRegion !== 'All' && prov.region !== selectedRegion;

                      // Dynamic visual coloring - strictly utilizing beautiful sky blue #7ac4eb
                      let fillClass = 'fill-slate-100/60 dark:fill-slate-900/30';
                      let strokeClass = 'stroke-slate-200 dark:stroke-slate-800/80 stroke-[0.5]';

                      if (hasMembers) {
                        fillClass = 'fill-[#7ac4eb] hover:fill-[#5fb6e5] dark:fill-[#7ac4eb]/40 dark:hover:fill-[#7ac4eb]/60';
                        strokeClass = 'stroke-[#5eb2dc] dark:stroke-[#7ac4eb]/50 stroke-[0.8]';
                      }

                      if (isSelected) {
                        fillClass = 'fill-[#5fb6e5] dark:fill-[#7ac4eb]/70';
                        strokeClass = 'stroke-[#38bdf8] dark:stroke-[#7ac4eb]/80 stroke-[1.5]';
                      } else if (isHovered) {
                        if (hasMembers) {
                          fillClass = 'fill-[#5fb6e5] dark:fill-[#7ac4eb]/60';
                          strokeClass = 'stroke-[#38bdf8] dark:stroke-[#7ac4eb]/80 stroke-[1.2]';
                        } else {
                          fillClass = 'fill-slate-200/80 dark:fill-slate-800/60';
                          strokeClass = 'stroke-slate-300 dark:stroke-slate-700 stroke-[0.8]';
                        }
                      }

                      if (isRegionMuted) {
                        fillClass = 'fill-slate-50/10 dark:fill-slate-900/10 opacity-30';
                        strokeClass = 'stroke-slate-200/20 dark:stroke-slate-800/10';
                      }

                      return (
                        <path
                          key={prov.name}
                          d={d}
                          className={`transition-all duration-200 cursor-pointer ${fillClass} ${strokeClass}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isRegionMuted) return;
                            setSelectedProvince(isSelected ? null : prov.name);
                          }}
                          onMouseEnter={() => {
                            if (!isRegionMuted) setHoveredProvince(prov.name);
                          }}
                          onMouseLeave={() => setHoveredProvince(null)}
                        />
                      );
                    })}
                  </g>
                </svg>
              )}

              {/* Dynamic Pins Overlay - Only visible when hovering or selecting a province to keep the map clean */}
              {!isLoading && (
                <div className="absolute inset-0 pointer-events-none" id="pins-overlay">
                  {provinceMapData
                    .filter(prov => {
                      const isActive = hoveredProvince === prov.name || (!hoveredProvince && selectedProvince === prov.name);
                      return isActive && prov.members.length > 0;
                    })
                    .map((prov) => {
                      const isSelected = selectedProvince === prov.name;
                      const isHovered = hoveredProvince === prov.name;

                      // Hide pin if current region filter is active and doesn't match
                      if (selectedRegion !== 'All' && prov.region !== selectedRegion) {
                        return null;
                      }

                      const memberCount = prov.members.length;

                      return (
                        <div
                          key={prov.name}
                          className="absolute -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto"
                          style={{ left: `${prov.x}%`, top: `${prov.y}%` }}
                        >
                          {/* Pulsing hot wave indicator in matching blue theme color */}
                          <span className="absolute -inset-4 rounded-full bg-[#7ac4eb]/30 scale-95 animate-ping opacity-70 pointer-events-none" />

                          <button
                            type="button"
                            onClick={() => setSelectedProvince(isSelected ? null : prov.name)}
                            onMouseEnter={() => setHoveredProvince(prov.name)}
                            onMouseLeave={() => setHoveredProvince(null)}
                            className={`relative flex items-center justify-center rounded-full border-2 border-white transition-all duration-300 shadow-lg ${
                              isSelected 
                                ? 'w-11 h-11 bg-[#0b2545] border-[#7ac4eb] text-white ring-4 ring-[#7ac4eb]/40 scale-110 z-30 font-extrabold' 
                                : 'w-10 h-10 bg-[#005fb8] hover:bg-[#004b93] text-white scale-105 z-30 font-bold'
                            } overflow-visible cursor-pointer`}
                          >
                            {/* Inner member count number */}
                            <span className="font-sans text-xs font-black tracking-tight text-white">
                              {memberCount}
                            </span>

                            {/* Floating mini-label showing province name */}
                            <div className="absolute top-full mt-1.5 bg-slate-900/95 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-lg pointer-events-none whitespace-nowrap transition-opacity duration-200">
                              {prov.name} ({memberCount} ท่าน)
                            </div>
                          </button>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Floating Zoom Controls directly inside the map stage */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-outline-variant/30 shadow-lg z-30 pointer-events-auto">
              <button
                type="button"
                onClick={handleZoomIn}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant/20 hover:text-primary transition-standard text-lg font-black shadow-xs cursor-pointer"
                title="ขยาย (+)"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleZoomOut}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant/20 hover:text-primary transition-standard text-lg font-black shadow-xs cursor-pointer"
                title="ย่อ (-)"
              >
                <Minus className="w-5 h-5 stroke-[2.5]" />
              </button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface hover:bg-surface-variant text-on-surface border border-outline-variant/20 hover:text-primary transition-standard text-xs font-bold shadow-xs cursor-pointer"
                title="รีเซ็ตตำแหน่ง"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Province List summary & Member list for selected province */}
        <div className="lg:col-span-4 space-y-6">
          {/* Province Directory Panel / Members List Panel */}
          <div className="bg-surface-container-lowest rounded-3xl border border-[#7ac4eb]/30 p-6 shadow-sm space-y-4">
            
            {/* If a province is selected, show its registered members list directly! */}
            {selectedProvince ? (
              <div className="space-y-4 animate-scale-up">
                {/* Header with back button */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <div>
                    <h4 className="font-display-md text-base font-extrabold text-on-surface">
                      ศิษย์เก่าในจังหวัด "{selectedProvince}"
                    </h4>
                    <p className="text-xs text-outline font-sans mt-0.5">
                      มีผู้ลงทะเบียนทั้งหมด {alumniByProvince[selectedProvince]?.length || 0} คน
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvince(null);
                      setSearchQuery('');
                    }}
                    className="text-xs font-bold text-primary hover:text-primary-dark transition-standard flex items-center gap-1 bg-primary/10 px-2.5 py-1.5 rounded-full cursor-pointer"
                  >
                    <span>← กลับ</span>
                  </button>
                </div>

                {/* Local search within this province members */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาชื่อ/รุ่น ในจังหวัดนี้..."
                    className="w-full h-11 pl-10 pr-4 bg-surface-container-low hover:bg-surface-container-medium focus:bg-surface-container-lowest border border-outline-variant/30 focus:border-primary rounded-2xl font-sans text-xs outline-none transition-standard"
                  />
                  <Search className="w-4 h-4 text-outline absolute left-3.5 top-3.5" />
                </div>

                {/* Members Cards in Selected Province */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {(() => {
                    const members = alumniByProvince[selectedProvince] || [];
                    const filteredMembers = members.filter(member => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase();
                      return (
                        member.fullname.toLowerCase().includes(q) ||
                        (member.nickname && member.nickname.toLowerCase().includes(q)) ||
                        member.generation.toString().includes(q) ||
                        member.academic_year?.toLowerCase().includes(q) ||
                        (member.occupation && member.occupation.toLowerCase().includes(q))
                      );
                    });

                    if (filteredMembers.length === 0) {
                      return (
                        <div className="text-center py-12 text-sm text-outline font-sans bg-surface-container-low/30 rounded-2xl border border-dashed border-outline-variant/20">
                          ไม่พบสมาชิกที่สอดคล้องกับตัวค้นหา
                        </div>
                      );
                    }

                    return filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/20 hover:border-[#7ac4eb]/45 hover:shadow-xs transition-standard relative overflow-hidden flex flex-col gap-3"
                      >
                        {/* Top profile brief */}
                        <div className="flex gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-surface-container-medium border border-outline-variant/40 shrink-0 shadow-sm">
                            <img
                              src={resolveImageUrl(member.imageUrl)}
                              alt={member.fullname}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h5 className="font-sans font-extrabold text-sm text-on-surface leading-tight truncate">
                                {member.fullname}
                              </h5>
                              {member.nickname && (
                                <span className="text-[11px] bg-primary/10 text-primary font-bold px-1.5 py-0.2 rounded-md">
                                  ({member.nickname})
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-outline font-bold mt-1">
                              ศิษย์เก่าวัดตากฟ้า รุ่นที่ {member.generation} ({member.academic_year})
                            </p>
                          </div>
                        </div>

                        {/* Meta info details */}
                        <div className="grid grid-cols-1 gap-2 border-t border-outline-variant/10 pt-3 text-xs text-on-surface-variant font-sans">
                          {member.occupation && (
                            <div className="flex items-start gap-2">
                              <Briefcase className="w-3.5 h-3.5 text-outline shrink-0 mt-0.5" />
                              <span>อาชีพหลัก: <strong>{member.occupation}</strong></span>
                            </div>
                          )}
                          
                          {member.dhammaEducation && (
                            <div className="flex items-start gap-2">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>การศึกษาทางธรรม: <strong>{member.dhammaEducation}</strong></span>
                            </div>
                          )}

                          {member.secularEducation && (
                            <div className="flex items-start gap-2">
                              <GraduationCap className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                              <span>การศึกษาทางโลก: <strong>{member.secularEducation}</strong></span>
                            </div>
                          )}

                          {/* Contact row */}
                          <div className="flex gap-2 flex-wrap pt-1 border-t border-outline-variant/10">
                            {member.phone && (
                              <div className="flex items-center gap-1 text-[11px] bg-surface-container-high px-2 py-1 rounded-lg border border-outline-variant/15 text-on-surface-variant font-semibold">
                                <Phone className="w-3 h-3 text-outline" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                            {member.lineid && (
                              <div className="flex items-center gap-1 text-[11px] bg-surface-container-high px-2 py-1 rounded-lg border border-outline-variant/15 text-on-surface-variant font-semibold">
                                <MessageSquare className="w-3 h-3 text-emerald-500" />
                                <span>Line: {member.lineid}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            ) : (
              // If no province selected, show the active provinces list with the search box
              <>
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหาตามชื่อ/รุ่น/จังหวัด..."
                    className="w-full h-12 pl-11 pr-4 bg-surface-container-low hover:bg-surface-container-medium focus:bg-surface-container-lowest border border-outline-variant/30 focus:border-primary rounded-2xl font-sans text-sm outline-none transition-standard"
                  />
                  <Search className="w-5 h-5 text-outline absolute left-4 top-3.5" />
                </div>

                {/* List Header */}
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3">
                  <h3 className="font-display-md text-base font-bold text-on-surface flex items-center gap-2">
                    <Users className="w-4.5 h-4.5 text-primary" />
                    <span>จังหวัดที่มีสมาชิกศิษย์เก่า</span>
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
                    {activeProvinces.length} จังหวัด
                  </span>
                </div>

                {/* Collapsible scroll directory */}
                <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                  {filteredActiveProvinces.length === 0 ? (
                    <div className="text-center py-8 text-sm text-outline font-sans">
                      ไม่พบจังหวัดที่สอดคล้องกับตัวกรอง
                    </div>
                  ) : (
                    filteredActiveProvinces.map(provName => {
                      const members = alumniByProvince[provName] || [];
                      const isSelected = selectedProvince === provName;
                      const coord = PROVINCE_COORDINATES[provName];

                      return (
                        <button
                          key={provName}
                          type="button"
                          onClick={() => {
                            setSelectedProvince(isSelected ? null : provName);
                            // Center map to that province coordinates if loaded
                            const mappedProv = provinceMapData.find(p => p.name === provName);
                            if (mappedProv && mappedProv.x > 0) {
                              setZoomLevel(1.6);
                              setPanOffset({
                                x: (250 - (mappedProv.x / 100) * mapWidth) * 1.6,
                                y: (325 - (mappedProv.y / 100) * mapHeight) * 1.6
                              });
                            }
                          }}
                          className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-standard text-left cursor-pointer ${
                            isSelected 
                              ? 'bg-primary/5 border-primary/40 shadow-sm' 
                              : 'bg-surface-container-low/50 border-outline-variant/10 hover:bg-surface-container-low'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-sans text-sm font-bold text-on-surface">{provName}</p>
                              <p className="text-[11px] text-outline">{regionNames[coord?.region || 'Central']}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <span className="font-sans text-xs font-extrabold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                              {members.length} ท่าน
                            </span>
                            <ChevronRight className="w-4 h-4 text-outline" />
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
