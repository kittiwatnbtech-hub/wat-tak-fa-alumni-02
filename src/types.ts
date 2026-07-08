/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AlumniProfile {
  id: string;
  fullname: string;
  nickname: string;
  phone: string;
  lineid: string;
  generation: number;
  academic_year: number;
  occupation: string;
  address: string;
  status: 'approved' | 'pending';
  province: string;
  email?: string;
  imageUrl: string;
  createdAt: string;
  dhammaEducation?: string;
  secularEducation?: string;
  entry_grade?: string;
}

export interface ActivityLog {
  id: string;
  adminName: string;
  action: string;
  timestamp: string;
  type: 'approve' | 'export' | 'register' | 'delete' | 'edit';
}

export interface FilterState {
  searchQuery: string;
  generation: string;
  year: string;
}
