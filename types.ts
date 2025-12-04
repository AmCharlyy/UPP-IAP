export enum UserRole {
  STUDENT = 'student',
  PROFESSOR = 'professor',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Career {
  id: string;
  name: string;
  code: string; // e.g., "ISO", "IM", "LTF"
  level: 'Ingeniería' | 'Licenciatura' | 'Maestría';
  coordinator: string;
  totalStudents: number;
  totalGroups: number;
  color: string;
}

export interface Professor {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  department: string;
  status: 'active' | 'sabbatical' | 'inactive';
  contractType: 'PA' | 'PTC';
  coursesCount: number;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  subject: string;
  details: string;
  type?: 'class' | 'break' | 'office';
  day?: number; // 1 = Monday, 5 = Friday
}

export interface NotificationItem {
  id: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
  date?: string;
}

export interface Course {
  id: string;
  name: string;
  careerId: string; // Link to Career
  professorId?: string;
  professorName?: string; 
  group: string;
  credits: number;
  classroom: string;
  term: number; // Cuatrimestre (1-10)
  capacity: number;
  status: 'active' | 'closed';
  studentsCount?: number;
}

export interface CurriculumSubject {
  id: string;
  name: string;
  code: string; // Internal Code e.g. "ISO-101"
  credits: number;
  term: number;
  careerId: string;
}

export interface StudentRecord {
  id: string;
  enrollmentId: string; // Matricula
  name: string;
  email: string; // Added email field explicitly
  careerId: string;
  programName: string; // e.g. Ing Software
  term: number; // Cuatrimestre
  group: string; // e.g. "A", "B"
  average: number;
  status: 'regular' | 'irregular' | 'baja';
}

export interface HistoryGrade {
  id: string;
  subjectName: string;
  score: number;
  term: number;
  type: 'Ordinario' | 'Extraordinario';
  credits: number;
}