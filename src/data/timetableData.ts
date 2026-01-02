// Timetable Module Data Types and Mock Data

export interface PeriodStructure {
  id: string;
  periodsPerDay: number;
  breakAfterPeriod: number;
  workingDays: string[];
  timeMapping: { period: number; startTime: string; endTime: string }[];
  isConfigured: boolean;
}

export interface TeacherLoad {
  teacherId: string;
  teacherName: string;
  subjects: string[];
  periodsPerWeek: number;
  assignedPeriods: number;
  avoidFirstPeriod: boolean;
  avoidLastPeriod: boolean;
  workingDays: string[];
  allowedBatches: { batchId: string; batchName: string; subject: string }[];
}

export interface TimetableEntry {
  id: string;
  day: string;
  periodNumber: number;
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  batchId: string;
  batchName: string;
}

export interface TimetableConflict {
  type: 'teacher_clash' | 'batch_clash' | 'overload';
  message: string;
  day: string;
  periodNumber: number;
  teacherId?: string;
  batchId?: string;
}

// Default period structure
export const defaultPeriodStructure: PeriodStructure = {
  id: 'ps-1',
  periodsPerDay: 8,
  breakAfterPeriod: 4,
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  timeMapping: [
    { period: 1, startTime: '08:00', endTime: '08:45' },
    { period: 2, startTime: '08:45', endTime: '09:30' },
    { period: 3, startTime: '09:30', endTime: '10:15' },
    { period: 4, startTime: '10:15', endTime: '11:00' },
    { period: 5, startTime: '11:30', endTime: '12:15' },
    { period: 6, startTime: '12:15', endTime: '13:00' },
    { period: 7, startTime: '14:00', endTime: '14:45' },
    { period: 8, startTime: '14:45', endTime: '15:30' },
  ],
  isConfigured: true,
};

// Teacher loads with availability
export const teacherLoads: TeacherLoad[] = [
  {
    teacherId: 'teacher-1',
    teacherName: 'Dr. Rajesh Kumar',
    subjects: ['phy'],
    periodsPerWeek: 25,
    assignedPeriods: 12,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Physics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Physics' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Physics' },
    ],
  },
  {
    teacherId: 'teacher-2',
    teacherName: 'Mrs. Priya Sharma',
    subjects: ['mat'],
    periodsPerWeek: 30,
    assignedPeriods: 18,
    avoidFirstPeriod: true,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Mathematics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Mathematics' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Mathematics' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Mathematics' },
    ],
  },
  {
    teacherId: 'teacher-3',
    teacherName: 'Mr. Suresh Verma',
    subjects: ['che'],
    periodsPerWeek: 20,
    assignedPeriods: 10,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Chemistry' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Chemistry' },
    ],
  },
  {
    teacherId: 'teacher-4',
    teacherName: 'Ms. Anjali Gupta',
    subjects: ['bio'],
    periodsPerWeek: 22,
    assignedPeriods: 8,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Biology' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Biology' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Biology' },
    ],
  },
  {
    teacherId: 'teacher-5',
    teacherName: 'Mr. Vikram Singh',
    subjects: ['eng'],
    periodsPerWeek: 28,
    assignedPeriods: 15,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'English' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'English' },
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'English' },
    ],
  },
];

// Existing timetable entries (sample data)
export const timetableEntries: TimetableEntry[] = [
  { id: 'entry-1', day: 'Monday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-2', day: 'Monday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-3', day: 'Monday', periodNumber: 3, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-4', day: 'Monday', periodNumber: 5, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-5', day: 'Tuesday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-6', day: 'Tuesday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-7', day: 'Tuesday', periodNumber: 3, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-8', day: 'Wednesday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-9', day: 'Wednesday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-10', day: 'Thursday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'entry-11', day: 'Friday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  // Batch 2 entries
  { id: 'entry-12', day: 'Monday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'entry-13', day: 'Monday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
];

// Subject colors for visual display
export const subjectColors: Record<string, { bg: string; text: string; border: string }> = {
  mat: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  phy: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  che: { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  bio: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
  eng: { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  hin: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
  sci: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  sst: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  cs: { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
  eco: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
};

// Holidays for the academic year
export const academicHolidays = [
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-03-14', name: 'Holi' },
  { date: '2025-04-14', name: 'Ambedkar Jayanti' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-10-24', name: 'Diwali' },
  { date: '2025-12-25', name: 'Christmas' },
];
