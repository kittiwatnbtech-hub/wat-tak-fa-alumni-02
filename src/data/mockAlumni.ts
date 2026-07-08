/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlumniProfile, ActivityLog } from '../types';

export const INITIAL_ALUMNI: AlumniProfile[] = [
  {
    id: 'real-1',
    fullname: 'สุวภัทร จันแดง',
    nickname: 'เต้',
    phone: '081-445-5667',
    lineid: 'tae_suwaphat',
    generation: 4,
    academic_year: 2542,
    occupation: 'ธุรกิจส่วนตัว',
    address: 'ต.วัดตากฟ้า อ.ตาคลี จ.นครปฐม',
    status: 'approved',
    province: 'นครปฐม',
    email: 'suwaphat.j@email.com',
    imageUrl: '/src/assets/images/suwaphat_jandeng_1783423084680.jpg',
    createdAt: '2026-06-15T08:00:00.000Z'
  },
  {
    id: 'real-2',
    fullname: 'วิบูลย์ หงษ์ยนต์',
    nickname: 'บู๊',
    phone: '089-112-2334',
    lineid: 'boo_wiboon',
    generation: 4,
    academic_year: 2542,
    occupation: 'ผู้ประกอบการ',
    address: 'อ.เมือง จ.นครสวรรค์ 60000',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'wiboon.h@email.com',
    imageUrl: '/src/assets/images/wiboon_hongyon_1783423125459.jpg',
    createdAt: '2026-06-16T09:30:00.000Z'
  },
  {
    id: 'real-3',
    fullname: 'ณัฐพงษ์ เปี่ยมสุข',
    nickname: 'เบิร์ด',
    phone: '084-556-6778',
    lineid: 'bird_nattapong',
    generation: 4,
    academic_year: 2542,
    occupation: 'วิศวกรโรงงาน',
    address: 'จ.พระนครศรีอยุธยา',
    status: 'approved',
    province: 'พระนครศรีอยุธยา',
    email: 'nattapong.p@email.com',
    imageUrl: '/src/assets/images/nattapong_piemsuk_1783423142039.jpg',
    createdAt: '2026-06-17T11:45:00.000Z'
  },
  {
    id: 'real-4',
    fullname: 'ธนินท์ รัตนเดช',
    nickname: 'เอก',
    phone: '082-334-4556',
    lineid: 'aek_thanin',
    generation: 4,
    academic_year: 2542,
    occupation: 'ผู้จัดการโครงการ',
    address: 'เขตจตุจักร กรุงเทพมหานคร',
    status: 'approved',
    province: 'กรุงเทพมหานคร',
    email: 'thanin.r@email.com',
    imageUrl: '/src/assets/images/alumni_gen4_glasses_1783423187761.jpg',
    createdAt: '2026-06-18T14:20:00.000Z'
  },
  {
    id: 'real-5',
    fullname: 'สมเจตน์ เจริญสุข',
    nickname: 'เจต',
    phone: '085-667-7889',
    lineid: 'jet_somjet',
    generation: 7,
    academic_year: 2545,
    occupation: 'สถาปนิกอิสระ',
    address: 'อ.เมือง จ.เชียงใหม่ 50000',
    status: 'approved',
    province: 'เชียงใหม่',
    email: 'somjet.j@email.com',
    imageUrl: '/src/assets/images/alumni_gen7_long_hair_1783423173525.jpg',
    createdAt: '2026-06-19T10:15:00.000Z'
  },
  {
    id: 'real-6',
    fullname: 'อภิชาติ ทองดี',
    nickname: 'ตั้ม',
    phone: '086-778-8990',
    lineid: 'tum_apichart',
    generation: 8,
    academic_year: 2546,
    occupation: 'นักออกแบบสื่อสร้างสรรค์',
    address: 'อ.ตาคลี จ.นครสวรรค์ 60140',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'apichart.t@email.com',
    imageUrl: '/src/assets/images/alumni_gen8_cap_1783423157376.jpg',
    createdAt: '2026-06-20T16:40:00.000Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-4',
    adminName: 'ระบบ',
    action: 'อนุมัติการลงทะเบียนศิษย์เก่า: คุณสุวภัทร จันแดง (รุ่น 4)',
    timestamp: 'เมื่อวานนี้',
    type: 'approve'
  },
  {
    id: 'log-3',
    adminName: 'ระบบ',
    action: 'อนุมัติการลงทะเบียนศิษย์เก่า: คุณวิบูลย์ หงษ์ยนต์ (รุ่น 4)',
    timestamp: 'เมื่อวานนี้',
    type: 'approve'
  },
  {
    id: 'log-2',
    adminName: 'ระบบ',
    action: 'อนุมัติการลงทะเบียนศิษย์เก่า: คุณณัฐพงษ์ เปี่ยมสุข (รุ่น 4)',
    timestamp: 'เมื่อวานนี้',
    type: 'approve'
  },
  {
    id: 'log-1',
    adminName: 'ระบบอัตโนมัติ',
    action: 'เปิดระบบลงทะเบียนศิษย์เก่า โรงเรียนศรีนภเขตวิทยา วัดตากฟ้า ออนไลน์',
    timestamp: '3 วันที่แล้ว',
    type: 'register'
  }
];

export const THAI_PROVINCES = [
  'กรุงเทพมหานคร',
  'กระบี่',
  'กาญจนบุรี',
  'กาฬสินธุ์',
  'กำแพงเพชร',
  'ขอนแก่น',
  'จันทบุรี',
  'ฉะเชิงเทรา',
  'ชลบุรี',
  'ชัยนาท',
  'ชัยภูมิ',
  'ชุมพร',
  'เชียงราย',
  'เชียงใหม่',
  'ตรัง',
  'ตราด',
  'ตาก',
  'นครนายก',
  'นครปฐม',
  'นครพนม',
  'นครราชสีมา',
  'นครศรีธรรมราช',
  'นครสวรรค์',
  'นนทบุรี',
  'นราธิวาส',
  'น่าน',
  'บึงกาฬ',
  'บุรีรัมย์',
  'ปทุมธานี',
  'ประจวบคีรีขันธ์',
  'ปราจีนบุรี',
  'ปัตตานี',
  'พระนครศรีอยุธยา',
  'พะเยา',
  'พังงา',
  'พัทลุง',
  'พิจิตร',
  'พิษณุโลก',
  'เพชรบุรี',
  'เพชรบูรณ์',
  'แพร่',
  'ภูเก็ต',
  'มหาสารคาม',
  'มุกดาหาร',
  'แม่ฮ่องสอน',
  'ยโสธร',
  'ยะลา',
  'ร้อยเอ็ด',
  'ระนอง',
  'ระยอง',
  'ราชบุรี',
  'ลพบุรี',
  'ลำปาง',
  'ลำพูน',
  'เลย',
  'ศรีสะเกษ',
  'สกลนคร',
  'สงขลา',
  'สตูล',
  'สมุทรปราการ',
  'สมุทรสงคราม',
  'สมุทรสาคร',
  'สระแก้ว',
  'สระบุรี',
  'สิงห์บุรี',
  'สุโขทัย',
  'สุพรรณบุรี',
  'สุราษฎร์ธานี',
  'สุรินทร์',
  'หนองคาย',
  'หนองบัวลำภู',
  'อ่างทอง',
  'อำนาจเจริญ',
  'อุดรธานี',
  'อุตรดิตถ์',
  'อุทัยธานี',
  'อุบลราชธานี'
];

// Generation comparison helper functions based on the official table
export const ENTRY_YEARS = Array.from({ length: 2569 - 2539 + 1 }, (_, i) => 2539 + i);

export function getAvailableGrades(year: number): string[] {
  const grades = ['ม.1'];
  if (year >= 2540) grades.push('ม.2');
  if (year >= 2541) grades.push('ม.3');
  if (year >= 2552) grades.push('ม.4');
  if (year >= 2553) grades.push('ม.5');
  if (year >= 2554) grades.push('ม.6');
  
  if (year >= 2539 && year <= 2551) {
    grades.push('จบ ม.3 มาแล้วต่อ กศน.');
  }
  return grades;
}

export function calculateGeneration(year: number, entryGrade: string): number {
  switch (entryGrade) {
    case 'ม.1':
    case 'จบ ม.3 มาแล้วต่อ กศน.':
      return year - 2538;
    case 'ม.2':
      return year - 2539;
    case 'ม.3':
      return year - 2540;
    case 'ม.4':
      return year - 2541;
    case 'ม.5':
      return year - 2542;
    case 'ม.6':
      return year - 2543;
    default:
      return year - 2538;
  }
}

export function getEntryGrade(year: number, generation: number): string {
  if (generation === year - 2538) return 'ม.1';
  if (generation === year - 2539) return 'ม.2';
  if (generation === year - 2540) return 'ม.3';
  if (generation === year - 2541) return 'ม.4';
  if (generation === year - 2542) return 'ม.5';
  if (generation === year - 2543) return 'ม.6';
  
  // Fallback to closest matching
  const available = getAvailableGrades(year);
  return available[0] || 'ม.1';
}

