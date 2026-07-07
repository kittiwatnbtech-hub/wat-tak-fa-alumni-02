/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  Send, 
  Camera, 
  X,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AlumniProfile } from '../types';
import { THAI_PROVINCES, ENTRY_YEARS, getAvailableGrades, calculateGeneration } from '../data/mockAlumni';

interface RegistrationViewProps {
  onRegister: (newAlumnus: Omit<AlumniProfile, 'id' | 'status' | 'createdAt'>) => void;
}

export default function RegistrationView({ onRegister }: RegistrationViewProps) {
  // Form fields state
  const [fullname, setFullname] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [lineid, setLineid] = useState('');
  const [academicYear, setAcademicYear] = useState('2560');
  const [entryGrade, setEntryGrade] = useState('ม.1');
  const [occupationGroup, setOccupationGroup] = useState('');
  const [occupationDetail, setOccupationDetail] = useState('');
  const [address, setAddress] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('นครสวรรค์');
  const [agreement, setAgreement] = useState(false);
  
  // Image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate generation based on year and entry class
  const currentGen = calculateGeneration(parseInt(academicYear), entryGrade);

  // File Change Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreement) {
      setErrorMessage('กรุณายินยอมเงื่อนไขนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA) เพื่อลงทะเบียน');
      return;
    }

    if (!occupationGroup) {
      setErrorMessage('กรุณาเลือกกลุ่มอาชีพของคุณเพื่อระบุประวัติการทำงาน');
      return;
    }

    setIsSubmitting(true);

    const finalOccupation = occupationDetail.trim() 
      ? `${occupationGroup} (${occupationDetail.trim()})` 
      : occupationGroup;

    // Simulate Network Request
    setTimeout(() => {
      onRegister({
        fullname,
        nickname,
        phone,
        lineid,
        generation: currentGen,
        academic_year: parseInt(academicYear) || 2560,
        occupation: finalOccupation,
        address: `${address} จ.${selectedProvince}`,
        province: selectedProvince,
        imageUrl: imagePreview || ''
      });

      setIsSubmitting(false);
      setShowSuccessModal(true);

      // Clear Form
      handleReset();
    }, 1500);
  };

  // Reset Handler
  const handleReset = () => {
    setFullname('');
    setNickname('');
    setPhone('');
    setLineid('');
    setAcademicYear('2560');
    setEntryGrade('ม.1');
    setOccupationGroup('');
    setOccupationDetail('');
    setAddress('');
    setSelectedProvince('นครสวรรค์');
    setAgreement(false);
    setImagePreview(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="animate-fade-in max-w-4xl mx-auto" id="registration-container">
      {/* Page Title Section */}
      <div className="mb-10 text-center" id="registration-header">
        <h1 className="font-display-lg text-3xl md:text-5xl font-bold text-on-background mb-3">
          ลงทะเบียนศิษย์เก่า
        </h1>
        <p className="font-sans text-sm md:text-base text-on-surface-variant max-w-xl mx-auto leading-relaxed">
          ยินดีต้อนรับเข้าสู่ระบบเครือข่ายศิษย์เก่าโรงเรียนศรีนภเขตวิทยา (วัดตากฟ้า พระอารามหลวง) เพื่อเชื่อมความสัมพันธ์ระหว่างรุ่นพี่และรุ่นน้อง
        </p>
      </div>

      {/* Main Registration Form Card */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-surface-container-lowest rounded-2xl p-6 md:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant/20"
        id="registration-form"
      >
        {/* Profile Picture Upload Section */}
        <div className="flex flex-col items-center mb-10" id="profile-picture-uploader">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div 
              className={`w-32 h-32 md:w-36 md:h-36 rounded-full bg-surface-container-high border-2 flex items-center justify-center overflow-hidden transition-standard ${
                imagePreview ? 'border-solid border-primary' : 'border-dashed border-outline hover:border-primary'
              }`}
              id="avatar-preview-frame"
            >
              {imagePreview ? (
                <img 
                  src={imagePreview} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <User className="w-16 h-16 text-outline group-hover:text-primary transition-standard" />
              )}
            </div>
            
            {/* Camera Floating Action Icon */}
            <div className="absolute bottom-0 right-0 bg-primary text-on-primary p-2.5 rounded-full shadow-lg active:scale-90 transition-standard">
              <Camera className="w-4 h-4" />
            </div>

            {/* Hidden Input File */}
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              id="profile-picture-input"
            />
          </div>
          <p className="font-sans text-xs mt-3 text-on-surface-variant font-medium select-none">
            รูปภาพโปรโฟล์ (รูปภาพตัวจริง เห็นใบหน้าชัด )
          </p>
        </div>

        {/* Inputs Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="form-fields-grid">
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="fullname">
              ชื่อ - นามสกุล <span className="text-error">*</span>
            </label>
            <input 
              id="fullname"
              type="text" 
              required
              placeholder="ระบุชื่อและนามสกุล"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

          {/* Nickname */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="nickname">
              ชื่อเล่น
            </label>
            <input 
              id="nickname"
              type="text" 
              placeholder="ระบุชื่อเล่น"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">
              เบอร์โทรศัพท์ <span className="text-error">*</span>
            </label>
            <input 
              id="phone"
              type="tel" 
              required
              placeholder="08X-XXX-XXXX"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Line ID */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="lineid">
              Line ID
            </label>
            <input 
              id="lineid"
              type="text" 
              placeholder="@username"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans"
              value={lineid}
              onChange={(e) => setLineid(e.target.value)}
            />
          </div>

          {/* Academic Year Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="academicYear">
              ปีการศึกษาที่เข้าเรียน <span className="text-error">*</span>
            </label>
            <select 
              id="academicYear"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans cursor-pointer"
              value={academicYear}
              onChange={(e) => {
                const yr = e.target.value;
                setAcademicYear(yr);
                const available = getAvailableGrades(parseInt(yr));
                if (!available.includes(entryGrade)) {
                  setEntryGrade(available[0]);
                }
              }}
            >
              {[...ENTRY_YEARS].reverse().map((yr) => (
                <option key={yr} value={yr}>พ.ศ. {yr}</option>
              ))}
            </select>
          </div>

          {/* Entry Grade Level Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="entryGrade">
              ระดับชั้นเมื่อเริ่มเข้าศึกษา <span className="text-error">*</span>
            </label>
            <select 
              id="entryGrade"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans cursor-pointer"
              value={entryGrade}
              onChange={(e) => setEntryGrade(e.target.value)}
            >
              {getAvailableGrades(parseInt(academicYear)).map((grade) => (
                <option key={grade} value={grade}>เข้าเรียนชั้น {grade}</option>
              ))}
            </select>
          </div>

          {/* Calculated Generation Display (Bento Banner) */}
          <div className="col-span-1 md:col-span-2">
            <div className="p-5 bg-primary text-on-primary rounded-2xl flex items-center justify-center mt-2 shadow-md">
              <span className="font-sans font-bold text-xl md:text-2xl text-center">
                คุณเป็นศิษย์เก่า รุ่นที่ {currentGen}
              </span>
            </div>
          </div>

          {/* Province selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="province">
              จังหวัดที่อยู่ปัจจุบัน <span className="text-error">*</span>
            </label>
            <select 
              id="province"
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans cursor-pointer"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              {THAI_PROVINCES.map((prov) => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          {/* Occupation Group Select */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="occupation-group">
              อาชีพปัจจุบัน <span className="text-error">*</span>
            </label>
            <select
              id="occupation-group"
              required
              className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans cursor-pointer"
              value={occupationGroup}
              onChange={(e) => {
                setOccupationGroup(e.target.value);
                setOccupationDetail(''); // Reset detail when category changes
              }}
            >
              <option value="">-- เลือกกลุ่มอาชีพ --</option>
              <option value="พระภิกษุ">พระภิกษุ</option>
              <option value="รับราชการ">รับราชการ</option>
              <option value="ทำงานเอกชน">ทำงานเอกชน</option>
              <option value="ธุรกิจส่วนตัว">ธุรกิจส่วนตัว</option>
              <option value="งานอิสระ">งานอิสระ</option>
              <option value="อื่นๆ">อื่นๆ</option>
            </select>
          </div>

          {/* Occupation Detail (Conditional Input) */}
          {occupationGroup && (
            <div className="flex flex-col gap-2 animate-fade-in">
              <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="occupation-detail">
                รายละเอียดอาชีพ / ตำแหน่ง <span className="text-error">*</span>
              </label>
              <input 
                id="occupation-detail"
                type="text" 
                required
                placeholder={
                  occupationGroup === 'พระภิกษุ' ? 'เช่น พระลูกวัด, เจ้าอาวาส, สามเณร' :
                  occupationGroup === 'รับราชการ' ? 'เช่น ตำรวจ, ทหาร, ครู, แพทย์, พยาบาล' :
                  occupationGroup === 'ทำงานเอกชน' ? 'เช่น พนักงานออฟฟิศ, วิศวกร, นักพัฒนาซอฟต์แวร์' :
                  occupationGroup === 'ธุรกิจส่วนตัว' ? 'เช่น ร้านค้าขาย, ค้าขายออนไลน์, ทำเกษตรกรรม' :
                  occupationGroup === 'งานอิสระ' ? 'เช่น ช่างภาพ, ยูทูปเบอร์, นักแสดง, นายหน้า' :
                  'ระบุอาชีพหรือตำแหน่งงานปัจจุบันของคุณ'
                }
                className="w-full h-12 px-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans"
                value={occupationDetail}
                onChange={(e) => setOccupationDetail(e.target.value)}
              />
            </div>
          )}

          {/* Contact Address */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="address">
              ที่อยู่สำหรับติดต่อ <span className="text-error">*</span>
            </label>
            <textarea 
              id="address"
              required
              rows={3}
              placeholder="ระบุบ้านเลขที่ หมู่ที่ แขวง/ตำบล เขต/อำเภอ"
              className="w-full p-4 rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-surface-bright transition-standard outline-none font-sans resize-none"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
        </div>

        {/* PDPA Agreement */}
        <div className="mt-6 flex items-start gap-3" id="pdpa-checkbox-container">
          <input 
            type="checkbox" 
            id="agreement"
            className="mt-1 w-5 h-5 rounded text-primary focus:ring-primary border-outline-variant cursor-pointer"
            checked={agreement}
            onChange={(e) => setAgreement(e.target.checked)}
          />
          <label className="text-xs md:text-sm text-on-surface-variant cursor-pointer select-none leading-relaxed" htmlFor="agreement">
            ข้าพเจ้ายินยอมให้ชมรมศิษย์วัดตากฟ้าฯ เก็บรวบรวมข้อมูลเพื่อประโยชน์ในการจัดกิจกรรมของชมรม ตามนโยบายคุ้มครองข้อมูลส่วนบุคคล (PDPA)
          </label>
        </div>

        {/* Error Banner if validation fails */}
        {errorMessage && (
          <div className="mt-6 p-4 bg-error-container/20 border border-error/30 text-error rounded-xl text-sm flex gap-2.5 items-start text-left animate-fade-in" id="register-error-banner">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {/* Buttons Action Group */}
        <div className="mt-10" id="form-actions-group">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary text-on-primary h-14 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-95 active:scale-[0.99] transition-standard shadow-md disabled:opacity-50 cursor-pointer select-none"
            id="submit-register-btn"
          >
            {isSubmitting ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-on-primary border-t-transparent animate-spin inline-block"></span>
                <span>กำลังส่งข้อมูล...</span>
              </>
            ) : (
              <>
                <span>ลงทะเบียน</span>
                <Send className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-inverse-surface/40 backdrop-blur-sm animate-fade-in" id="success-modal-overlay">
          <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative border border-outline-variant/30 animate-scale-up">
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-surface-container-high text-outline hover:text-on-surface transition-standard cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4 border border-green-200">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="font-sans font-bold text-xl text-on-surface mb-2">ลงทะเบียนเสร็จสิ้น!</h3>
            <p className="font-sans text-sm text-on-surface-variant mb-6 leading-relaxed">
              ส่งข้อมูลของคุณเข้าระบบแล้วเรียบร้อย แอดมินชมรมจะทำการตรวจสอบข้อมูลของคุณเพื่อยืนยันประวัติศิษย์เก่าต่อไป
            </p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-95 transition-standard cursor-pointer shadow-sm"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
