/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AlumniProfile, ActivityLog } from '../types';

export const INITIAL_ALUMNI: AlumniProfile[] = [
  {
    id: '1',
    fullname: 'สรวิชญ์ นามสมมติ',
    nickname: 'ต้น',
    phone: '081-234-5678',
    lineid: '@ton_sorawit',
    generation: 28,
    academic_year: 2555,
    occupation: 'วิศวกรซอฟต์แวร์',
    address: '123/4 หมู่ 1 ต.วัดตากฟ้า อ.ตาคลี จ.นครสวรรค์ 60140',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'somchai.r@email.com',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcnk5TAYoOewNO1EZlxear5VI93RY4-Ko3WuIzRFu8Ujpo9eGsooCAemMCRKQCKaHS35Vg2g2BaOUqj9istj-ZDq8YS-it9j-CE7XW3-YWIQ6bIXayLOBvhG9uoJnYi7p84fz4lEpN9xbIZ9kBb2H55p1Sk0xCtiS_WoFOZZizgxVlmXAIjf_HHY-rrbF_fp2oQFUEGRTiKEdzAs681duUUeck_Zv8y3UtXZoznXqNeivjDdey3aYcEX-zVvCK5s_bdyCMQb-Y05NU',
    createdAt: '2026-06-01T10:00:00.000Z'
  },
  {
    id: '2',
    fullname: 'พิมพ์ชนก วงศ์สว่าง',
    nickname: 'พิมพ์',
    phone: '089-876-5432',
    lineid: '@pim_wongsawang',
    generation: 32,
    academic_year: 2559,
    occupation: 'นักวิชาการศึกษา',
    address: '456 ซอยสุขุมวิท 23 แขวงคลองเตยเหนือ เขตวัฒนา กรุงเทพฯ 10110',
    status: 'approved',
    province: 'กรุงเทพฯ',
    email: 'wanida.p@email.com',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDR8lIXm0K7OknpxGoYkhotEimtlmVD0Ip23qiyp-GoP5V5QCfmi3ZDt-Q07rpIq9Vm2joY4QjHgtnPGsozzErs8Mvdl6iS3ZvA_nXGqS0_b4Li1bpN_-1lc-J3e0maopgSnjXNnPR7MR9DKOEp4gD1-W3URdX83nRJaV67KcWx-j7FMsCVIFXm6zNvYYX9kCIDauCQLFuzQzD77fWcBb493vbESoQ8r193-_5p9SsXmUBiDwJz1pQuWPA_8Ak6LFQicsFk1ng3G_e',
    createdAt: '2026-06-02T11:30:00.000Z'
  },
  {
    id: '3',
    fullname: 'พระกิตติศักดิ์ วิมโล',
    nickname: '-',
    phone: '084-555-0199',
    lineid: '',
    generation: 25,
    academic_year: 2552,
    occupation: 'พระภิกษุ (เจ้าอาวาสวัดเครือข่าย)',
    address: 'วัดตากฟ้า พระอารามหลวง ต.วัดตากฟ้า อ.ตาคลี จ.นครสวรรค์ 60140',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'kittisak.v@temple.org',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA21gWrLvOqH2T_mbh8w1IzwS2Fwb6N08OjuTb75lj4TCfGjFcz_INztk-SaMNSRnyDSW0ByzQrkIbSn1XYUCPfuLVtUbC7mvRFe0YuvAusEZKeHA3eww9MXtfbGRwin0sOqb7hhS4YwBFDM9uh-985BB8idEXXj8n3zx-7bry8AePOV-o6teF7zQRee8YJuH4YSJnu1owNv6O-VDWAbaHiiXp2iWhS1_9Mh0ANNkjcwCjMPHLc4WdhdJ2oweyW_8G8E8F56GKVqFVj',
    createdAt: '2026-06-03T09:15:00.000Z'
  },
  {
    id: '4',
    fullname: 'ชัยวัฒน์ กุลเลิศ',
    nickname: 'ชัย',
    phone: '086-444-1234',
    lineid: '@chai_kullert',
    generation: 12,
    academic_year: 2539,
    occupation: 'ผู้จัดการอาวุโสฝ่ายพัฒนาธุรกิจ',
    address: '789/10 ถ.ลาดพร้าว แขวงจอมพล เขตจตุจักร กรุงเทพฯ 10900',
    status: 'approved',
    province: 'กรุงเทพฯ',
    email: 'chaiwat.k@enterprise.com',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJAeZLDXQuwPIzcEq1PBaK1epBH-2QzlizSWkAhwFCL8MOjBhubE4xIi55dt7V63vCr5P5uPgA13mM9CDJm7Ei3KHFXlDchBGQTupXpO3yknf_ejbYNIl7XGBm4OrhoKnWqyvHlamBI52IHH_21tn1_vLiS21R-2DxkgGZe-MmOgaqxE1QB7nqY4AsXujOmQUWCXZCjS4DSdyjz-gkkU06-3JDPxMquqK_P6RtHy2hQWcnA1PO1UfJlNasli0GFDHhp0aUrWaJ1xEd',
    createdAt: '2026-06-04T15:20:00.000Z'
  },
  {
    id: '5',
    fullname: 'ธนากร เมธาวี',
    nickname: 'เกรท',
    phone: '085-777-8899',
    lineid: '@great_thanakorn',
    generation: 35,
    academic_year: 2562,
    occupation: 'นักพัฒนาอิสระ (Tech-Wear Designer)',
    address: '22/9 ถ.สุเทพ อ.เมือง จ.เชียงใหม่ 50200',
    status: 'approved',
    province: 'เชียงใหม่',
    email: 'thanakorn.g@email.com',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAu_rBAWttDZJqIQqz1pmbscL8JPt625LscQEEyw1hwKeAxWOVT3jkbNf6h2Y51rV3dP3p-VGNib2QvgoyEDqYT8Q7-4eaDrk0BLRBJ7f7nDELpCRAo6bE5qRIqHjcznYhhuA0pPK4avtJFbJXitqD1mvpDwU7SzxDcvXjUtQIsGWx80G7rxw6DPAVyZFwol-NOXK3EReyBmKSMy2W-u6VS_kSy-09v2PIaK57F8hlk3Sj03UxZyQXHF778GaUhBvN_842rEY6k9cSA',
    createdAt: '2026-06-05T08:45:00.000Z'
  },
  {
    id: '6',
    fullname: 'พญ. วริศรา มั่นคง',
    nickname: 'หญิง',
    phone: '082-111-2222',
    lineid: '@dr_ying_warisara',
    generation: 22,
    academic_year: 2549,
    occupation: 'แพทย์ผู้เชี่ยวชาญด้านเวชศาสตร์ป้องกัน',
    address: 'โรงพยาบาลศูนย์พญาไท ถ.พญาไท เขตราชเทวี กรุงเทพฯ 10400',
    status: 'approved',
    province: 'กรุงเทพฯ',
    email: 'warisara.doc@hospital.go.th',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALdRBlqN4FlLmVVReRXyR3h7sF_ucoRlmYJJ6aHB4w9SO6Tff26L8200wY_7GLtSIucoH8V80dAc8EptptPyaaDhvcW-0Txi0h_jd4lAFL7jdB7KPtcrMIuFw8KO0wj94NYilh-EDdETRv1pnTAG5zIfM11UQoinMyIy0ZtlXNhkhuMyvsa5DWV5BXpblTckhu7FQjf3mXW2dpfHi61MROdbmFaJrEk4Ln5TPgr4tOeybjcGgouqu1JKDrC9ner8CqRIEa94-yMNle',
    createdAt: '2026-06-06T14:10:00.000Z'
  },
  {
    id: '7',
    fullname: 'สมชาย รักธรรม',
    nickname: 'ชาย',
    phone: '081-345-6789',
    lineid: '@somchai_rak',
    generation: 45,
    academic_year: 2560,
    occupation: 'ทนายความอิสระ',
    address: '88/1 ถ.สวรรค์วิถี อ.เมือง จ.นครสวรรค์ 60000',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'somchai.r@email.com',
    imageUrl: '',
    createdAt: '2026-06-07T16:50:00.000Z'
  },
  {
    id: '8',
    fullname: 'วนิดา ปัญญาดี',
    nickname: 'วนิ',
    phone: '089-876-5432',
    lineid: '@wanida_p',
    generation: 48,
    academic_year: 2565,
    occupation: 'นักวิจัยนโยบายสาธารณะ',
    address: '99 ซอยอารีย์ 4 เขตพญาไท กรุงเทพฯ 10400',
    status: 'pending',
    province: 'กรุงเทพฯ',
    email: 'wanida.p@email.com',
    imageUrl: '',
    createdAt: '2026-07-06T00:43:00.000Z'
  },
  {
    id: '9',
    fullname: 'ประเสริฐ แก้วดี',
    nickname: 'เสริฐ',
    phone: '082-111-2222',
    lineid: '@prasert_kaew',
    generation: 32,
    academic_year: 2559,
    occupation: 'ผู้ประกอบการธุรกิจส่งออกเซรามิก',
    address: '12 หมู่ 5 ต.บ้านโป่ง อ.หางดง จ.เชียงใหม่ 50230',
    status: 'approved',
    province: 'เชียงใหม่',
    email: 'prasert.k@email.com',
    imageUrl: '',
    createdAt: '2026-06-09T10:05:00.000Z'
  },
  {
    id: '10',
    fullname: 'ณัฐพงษ์ ศรีสุวรรณ',
    nickname: 'นัท',
    phone: '083-999-8811',
    lineid: '@nut_nattapong',
    generation: 34,
    academic_year: 2560,
    occupation: 'ข้าราชการครูโรงเรียนมัธยมวิทยา',
    address: '15/2 หมู่ 3 ต.คลองพลู อ.หนองบัว จ.นครสวรรค์ 60110',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'nattapong.s@school.ac.th',
    imageUrl: '',
    createdAt: '2026-06-10T11:15:00.000Z'
  },
  {
    id: '11',
    fullname: 'ร้อยตำรวจเอก ธัญญานันท์ มหาสมุทร',
    nickname: 'ผู้กองนนท์',
    phone: '081-777-6655',
    lineid: '@non_thanya',
    generation: 18,
    academic_year: 2545,
    occupation: 'ข้าราชการตำรวจ (ร.ต.อ.)',
    address: 'สถานีตำรวจภูธรตาคลี ถ.ตาคลี อ.ตาคลี จ.นครสวรรค์ 60140',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'thanya_police@royalthaipolice.go.th',
    imageUrl: '',
    createdAt: '2026-06-11T13:40:00.000Z'
  },
  {
    id: '12',
    fullname: 'กิตติพงษ์ แก้วมณี',
    nickname: 'พงษ์',
    phone: '088-333-4411',
    lineid: '@pong_kitti',
    generation: 34,
    academic_year: 2560,
    occupation: 'เจ้าหน้าที่ไอทีโรงพยาบาลชุมชน',
    address: '56 ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น 40000',
    status: 'approved',
    province: 'ขอนแก่น',
    email: 'kittipong.k@hospital.go.th',
    imageUrl: '',
    createdAt: '2026-06-12T14:00:00.000Z'
  },
  {
    id: '13',
    fullname: 'วิชัย โพธิ์ทอง',
    nickname: 'ชัย',
    phone: '081-999-5555',
    lineid: '@wichai_admin',
    generation: 15,
    academic_year: 2542,
    occupation: 'หัวหน้าฝ่ายประชาสัมพันธ์และแอดมินชมรม',
    address: 'ชมรมศิษย์วัดตากฟ้า อ.ตาคลี จ.นครสวรรค์ 60140',
    status: 'approved',
    province: 'นครสวรรค์',
    email: 'wichai.p@wattakfa.org',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQ6Yzh9ZsU-K3YMu9JcmvmePM9kc7TYkU45xivJwhqSUWyqfuqRD56wJO8oIVOOErjf5NTtd-kwDl_-4PYoVkq_Vsh_iAhx7bT6pqLXrOcrJZDHiMmDp9oGQyl9JFonk5EvUPziG6OPCQrn5Msxue_ac_8gYAlp2CTJumipKHvYiwdD_vRwwDNqmnIgpRx-fnFE-fBqFy4txF9MVYMqVZlKyQ6G84V_pOgyWK753HKKdUzFk9q8p1hN_Y_OAJmA2rFmvJSQvulKKaP',
    createdAt: '2026-06-13T15:30:00.000Z'
  }
];

export const INITIAL_LOGS: ActivityLog[] = [
  {
    id: 'log-4',
    adminName: 'แอดมิน วิชัย',
    action: 'อนุมัติการลงทะเบียนใหม่ของ คุณสรวิชญ์ นามสมมติ (รุ่น 28)',
    timestamp: '2 นาทีที่แล้ว',
    type: 'approve'
  },
  {
    id: 'log-3',
    adminName: 'แอดมิน วิชัย',
    action: 'มีการส่งออกข้อมูล Excel ไฟล์ Alumni_List_2026.csv',
    timestamp: '15 นาทีที่แล้ว',
    type: 'export'
  },
  {
    id: 'log-2',
    adminName: 'แอดมิน วิชัย',
    action: 'อัปเดตข้อมูลประวัติศิษย์เก่า คุณสมชาย รักธรรม (รุ่น 45)',
    timestamp: '1 ชั่วโมงที่แล้ว',
    type: 'edit'
  },
  {
    id: 'log-1',
    adminName: 'ระบบอัตโนมัติ',
    action: 'มีผู้ส่งใบสมัครลงทะเบียนใหม่: คุณวนิดา ปัญญาดี (รุ่น 48)',
    timestamp: '2 ชั่วโมงที่แล้ว',
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
  return grades;
}

export function calculateGeneration(year: number, entryGrade: string): number {
  switch (entryGrade) {
    case 'ม.1':
      return year >= 2539 ? year - 2538 : 1;
    case 'ม.2':
      return year >= 2540 ? year - 2539 : 1;
    case 'ม.3':
      return year >= 2541 ? year - 2540 : 1;
    case 'ม.4':
      return year >= 2552 ? year - 2541 : 11;
    case 'ม.5':
      return year >= 2553 ? year - 2542 : 11;
    case 'ม.6':
      return year >= 2554 ? year - 2543 : 11;
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

