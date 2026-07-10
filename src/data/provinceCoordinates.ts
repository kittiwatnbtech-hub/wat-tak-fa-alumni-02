/**
 * Relative coordinates (X, Y in percentage 0-100) for all 77 provinces of Thailand
 * calibrated for a standard bounding container of a Thailand map.
 */
export interface ProvinceCoordinate {
  name: string;
  x: number; // percentage from left
  y: number; // percentage from top
  region: 'North' | 'Northeast' | 'Central' | 'East' | 'South';
}

export const PROVINCE_COORDINATES: Record<string, ProvinceCoordinate> = {
  'เชียงราย': { name: 'เชียงราย', x: 34, y: 8, region: 'North' },
  'แม่ฮ่องสอน': { name: 'แม่ฮ่องสอน', x: 14, y: 14, region: 'North' },
  'เชียงใหม่': { name: 'เชียงใหม่', x: 23, y: 15, region: 'North' },
  'พะเยา': { name: 'พะเยา', x: 38, y: 13, region: 'North' },
  'น่าน': { name: 'น่าน', x: 44, y: 14, region: 'North' },
  'ลำพูน': { name: 'ลำพูน', x: 25, y: 20, region: 'North' },
  'ลำปาง': { name: 'ลำปาง', x: 31, y: 20, region: 'North' },
  'แพร่': { name: 'แพร่', x: 39, y: 21, region: 'North' },
  'อุตรดิตถ์': { name: 'อุตรดิตถ์', x: 42, y: 25, region: 'North' },
  'ตาก': { name: 'ตาก', x: 21, y: 31, region: 'North' },
  'สุโขทัย': { name: 'สุโขทัย', x: 34, y: 29, region: 'North' },
  'พิษณุโลก': { name: 'พิษณุโลก', x: 41, y: 30, region: 'North' },
  'พิจิตร': { name: 'พิจิตร', x: 39, y: 35, region: 'North' },
  'กำแพงเพชร': { name: 'กำแพงเพชร', x: 29, y: 35, region: 'North' },
  'เพชรบูรณ์': { name: 'เพชรบูรณ์', x: 47, y: 33, region: 'North' },
  'นครสวรรค์': { name: 'นครสวรรค์', x: 35, y: 41, region: 'Central' },
  'อุทัยธานี': { name: 'อุทัยธานี', x: 28, y: 44, region: 'Central' },

  // Northeast (Isan)
  'เลย': { name: 'เลย', x: 52, y: 26, region: 'Northeast' },
  'หนองคาย': { name: 'หนองคาย', x: 60, y: 23, region: 'Northeast' },
  'บึงกาฬ': { name: 'บึงกาฬ', x: 68, y: 21, region: 'Northeast' },
  'หนองบัวลำภู': { name: 'หนองบัวลำภู', x: 56, y: 29, region: 'Northeast' },
  'อุดรธานี': { name: 'อุดรธานี', x: 61, y: 28, region: 'Northeast' },
  'สกลนคร': { name: 'สกลนคร', x: 71, y: 29, region: 'Northeast' },
  'นครพนม': { name: 'นครพนม', x: 78, y: 27, region: 'Northeast' },
  'มุกดาหาร': { name: 'มุกดาหาร', x: 77, y: 36, region: 'Northeast' },
  'กาฬสินธุ์': { name: 'กาฬสินธุ์', x: 67, y: 33, region: 'Northeast' },
  'ขอนแก่น': { name: 'ขอนแก่น', x: 59, y: 34, region: 'Northeast' },
  'ชัยภูมิ': { name: 'ชัยภูมิ', x: 51, y: 38, region: 'Northeast' },
  'มหาสารคาม': { name: 'มหาสารคาม', x: 63, y: 38, region: 'Northeast' },
  'ร้อยเอ็ด': { name: 'ร้อยเอ็ด', x: 68, y: 38, region: 'Northeast' },
  'ยโสธร': { name: 'ยโสธร', x: 73, y: 39, region: 'Northeast' },
  'อำนาจเจริญ': { name: 'อำนาจเจริญ', x: 79, y: 39, region: 'Northeast' },
  'อุบลราชธานี': { name: 'อุบลราชธานี', x: 81, y: 43, region: 'Northeast' },
  'ศรีสะเกษ': { name: 'ศรีสะเกษ', x: 73, y: 45, region: 'Northeast' },
  'สุรินทร์': { name: 'สุรินทร์', x: 67, y: 45, region: 'Northeast' },
  'บุรีรัมย์': { name: 'บุรีรัมย์', x: 61, y: 45, region: 'Northeast' },
  'นครราชสีมา': { name: 'นครราชสีมา', x: 54, y: 45, region: 'Northeast' },

  // Central & East
  'ชัยนาท': { name: 'ชัยนาท', x: 35, y: 47, region: 'Central' },
  'สิงห์บุรี': { name: 'สิงห์บุรี', x: 37, y: 49, region: 'Central' },
  'ลพบุรี': { name: 'ลพบุรี', x: 42, y: 46, region: 'Central' },
  'สระบุรี': { name: 'สระบุรี', x: 44, y: 51, region: 'Central' },
  'อ่างทอง': { name: 'อ่างทอง', x: 37, y: 51, region: 'Central' },
  'พระนครศรีอยุธยา': { name: 'พระนครศรีอยุธยา', x: 39, y: 53, region: 'Central' },
  'สุพรรณบุรี': { name: 'สุพรรณบุรี', x: 33, y: 51, region: 'Central' },
  'นครนายก': { name: 'นครนายก', x: 46, y: 53, region: 'Central' },
  'ปทุมธานี': { name: 'ปทุมธานี', x: 40, y: 54, region: 'Central' },
  'นนทบุรี': { name: 'นนทบุรี', x: 39, y: 55, region: 'Central' },
  'กรุงเทพมหานคร': { name: 'กรุงเทพมหานคร', x: 40, y: 57, region: 'Central' },
  'สมุทรปราการ': { name: 'สมุทรปราการ', x: 42, y: 58, region: 'Central' },
  'สมุทรสาคร': { name: 'สมุทรสาคร', x: 37, y: 58, region: 'Central' },
  'สมุทรสงคราม': { name: 'สมุทรสงคราม', x: 34, y: 59, region: 'Central' },
  'นครปฐม': { name: 'นครปฐม', x: 35, y: 55, region: 'Central' },
  'กาญจนบุรี': { name: 'กาญจนบุรี', x: 26, y: 51, region: 'Central' },
  'ราชบุรี': { name: 'ราชบุรี', x: 29, y: 57, region: 'Central' },
  'เพชรบุรี': { name: 'เพชรบุรี', x: 29, y: 62, region: 'Central' },
  'ประจวบคีรีขันธ์': { name: 'ประจวบคีรีขันธ์', x: 28, y: 69, region: 'Central' },

  // Eastern
  'ปราจีนบุรี': { name: 'ปราจีนบุรี', x: 49, y: 54, region: 'East' },
  'สระแก้ว': { name: 'สระแก้ว', x: 55, y: 55, region: 'East' },
  'ฉะเชิงเทรา': { name: 'ฉะเชิงเทรา', x: 46, y: 57, region: 'East' },
  'ชลบุรี': { name: 'ชลบุรี', x: 46, y: 61, region: 'East' },
  'ระยอง': { name: 'ระยอง', x: 49, y: 64, region: 'East' },
  'จันทบุรี': { name: 'จันทบุรี', x: 54, y: 63, region: 'East' },
  'ตราด': { name: 'ตราด', x: 58, y: 66, region: 'East' },

  // Southern
  'ชุมพร': { name: 'ชุมพร', x: 26, y: 76, region: 'South' },
  'ระนอง': { name: 'ระนอง', x: 22, y: 79, region: 'South' },
  'สุราษฎร์ธานี': { name: 'สุราษฎร์ธานี', x: 28, y: 81, region: 'South' },
  'พังงา': { name: 'พังงา', x: 22, y: 85, region: 'South' },
  'กระบี่': { name: 'กระบี่', x: 26, y: 87, region: 'South' },
  'ภูเก็ต': { name: 'ภูเก็ต', x: 20, y: 88, region: 'South' },
  'นครศรีธรรมราช': { name: 'นครศรีธรรมราช', x: 33, y: 84, region: 'South' },
  'ตรัง': { name: 'ตรัง', x: 29, y: 90, region: 'South' },
  'พัทลุง': { name: 'พัทลุง', x: 32, y: 89, region: 'South' },
  'สงขลา': { name: 'สงขลา', x: 35, y: 91, region: 'South' },
  'สตูล': { name: 'สตูล', x: 30, y: 92, region: 'South' },
  'ปัตตานี': { name: 'ปัตตานี', x: 40, y: 92, region: 'South' },
  'ยะลา': { name: 'ยะลา', x: 38, y: 95, region: 'South' },
  'นราธิวาส': { name: 'นราธิวาส', x: 42, y: 94, region: 'South' },
};
