// Timetable Module Data Types and Mock Data

// NEW: Break Configuration for multiple breaks support
export interface BreakConfig {
  id: string;
  name: string;          // "Short Break", "Lunch Break", "Snacks Break"
  afterPeriod: number;   // After which period this break occurs
  duration: number;      // Duration in minutes
}

export interface PeriodStructure {
  id: string;
  periodsPerDay: number;
  breaks: BreakConfig[];  // Multiple breaks support (replaces breakAfterPeriod)
  workingDays: string[];
  timeMapping: { period: number; startTime: string; endTime: string }[];
  useTimeMapping: boolean; // Toggle for time-based or period-number display
  isConfigured: boolean;
}

// NEW: Period Types (Library, Lab, Sports, etc.)
export interface PeriodType {
  id: string;
  name: string;
  icon: string;
  color: string;
  requiresTeacher: boolean;
  isDouble: boolean;
  isDefault: boolean;
}

// NEW: Academic Term
export interface AcademicTerm {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

// NEW: Batch Exam Schedule
export interface BatchExamSchedule {
  id: string;
  batchId: string;
  batchName: string;
  termId: string;
  examType: 'weekly' | 'monthly' | 'terminal' | 'annual';
  dates: string[];
  recurringDay?: string;
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
  periodType?: string;
  facilityId?: string;
  facilityName?: string;
  substituteTeacherId?: string;
  substituteTeacherName?: string;
  isSubstituted?: boolean;
}

export interface TimetableConflict {
  type: 'teacher_clash' | 'batch_clash' | 'overload' | 'constraint_violation' | 'facility_conflict' | 'preference_warning';
  severity: 'error' | 'warning';
  message: string;
  day: string;
  periodNumber: number;
  teacherId?: string;
  batchId?: string;
  facilityId?: string;
}

// NEW: Teacher Availability Constraints
export interface TeacherConstraint {
  teacherId: string;
  maxPeriodsPerDay: number;
  maxConsecutivePeriods: number;
  unavailableDays: string[];
  unavailablePeriods: { day: string; period: number }[];
  timeWindow?: {
    startPeriod: number;
    endPeriod: number;
  };
  preferenceLevel: 'hard' | 'soft';
}

// NEW: Facility/Resource Management
export interface Facility {
  id: string;
  name: string;
  type: 'lab' | 'sports' | 'special' | 'classroom';
  capacity?: number;
  duration: number; // Periods required (1 or 2)
  allowedClasses: string[];
  linkedPeriodType?: string;
  availability?: {
    days: string[];
    periods?: { start: number; end: number };
  };
}

// NEW: Teacher Absence for Substitution Management
export interface TeacherAbsence {
  id: string;
  teacherId: string;
  teacherName: string;
  date: string;
  absenceType: 'full_day' | 'partial';
  periods?: number[];
  reason?: string;
  createdAt: string;
}

// NEW: Substitution Assignment
export interface SubstitutionAssignment {
  id: string;
  absenceId: string;
  originalTeacherId: string;
  substituteTeacherId: string;
  substituteTeacherName: string;
  date: string;
  period: number;
  batchId: string;
  batchName: string;
  subject: string;
  status: 'pending' | 'assigned' | 'confirmed';
  isTemporary: boolean;
}

// Default period structure
export const defaultPeriodStructure: PeriodStructure = {
  id: 'ps-1',
  periodsPerDay: 8,
  breaks: [
    { id: 'break-1', name: 'Short Break', afterPeriod: 2, duration: 15 },
    { id: 'break-2', name: 'Lunch Break', afterPeriod: 4, duration: 30 },
    { id: 'break-3', name: 'Snacks Break', afterPeriod: 6, duration: 15 },
  ],
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  timeMapping: [
    { period: 1, startTime: '08:00', endTime: '08:45' },
    { period: 2, startTime: '08:45', endTime: '09:30' },
    { period: 3, startTime: '09:45', endTime: '10:30' },
    { period: 4, startTime: '10:30', endTime: '11:15' },
    { period: 5, startTime: '11:45', endTime: '12:30' },
    { period: 6, startTime: '12:30', endTime: '13:15' },
    { period: 7, startTime: '13:30', endTime: '14:15' },
    { period: 8, startTime: '14:15', endTime: '15:00' },
  ],
  useTimeMapping: true,
  isConfigured: true,
};

// Teacher loads with availability - 10 teachers with proper batch/subject assignments
export const teacherLoads: TeacherLoad[] = [
  {
    teacherId: 'teacher-1',
    teacherName: 'Dr. Rajesh Kumar',
    subjects: ['phy'],
    periodsPerWeek: 25,
    assignedPeriods: 18,
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
    assignedPeriods: 22,
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
    assignedPeriods: 14,
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
    assignedPeriods: 16,
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
    assignedPeriods: 20,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'English' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'English' },
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'English' },
    ],
  },
  {
    teacherId: 'teacher-6',
    teacherName: 'Mrs. Kavita Nair',
    subjects: ['hin'],
    periodsPerWeek: 24,
    assignedPeriods: 16,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Hindi' },
      { batchId: 'batch-4', batchName: 'Class 9 - Section B', subject: 'Hindi' },
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Hindi' },
    ],
  },
  {
    teacherId: 'teacher-7',
    teacherName: 'Mr. Arun Mehta',
    subjects: ['sst'],
    periodsPerWeek: 22,
    assignedPeriods: 14,
    avoidFirstPeriod: true,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Social Studies' },
      { batchId: 'batch-3', batchName: 'Class 9 - Section A', subject: 'Social Studies' },
    ],
  },
  {
    teacherId: 'teacher-8',
    teacherName: 'Dr. Sneha Reddy',
    subjects: ['cs'],
    periodsPerWeek: 18,
    assignedPeriods: 12,
    avoidFirstPeriod: false,
    avoidLastPeriod: true,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Computer Science' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Computer Science' },
    ],
  },
  {
    teacherId: 'teacher-9',
    teacherName: 'Mr. Rahul Saxena',
    subjects: ['eco'],
    periodsPerWeek: 16,
    assignedPeriods: 10,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    allowedBatches: [
      { batchId: 'batch-1', batchName: 'Class 10 - Section A', subject: 'Economics' },
      { batchId: 'batch-2', batchName: 'Class 10 - Section B', subject: 'Economics' },
    ],
  },
  {
    teacherId: 'teacher-10',
    teacherName: 'Mrs. Geeta Iyer',
    subjects: ['sci'],
    periodsPerWeek: 26,
    assignedPeriods: 18,
    avoidFirstPeriod: false,
    avoidLastPeriod: false,
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    allowedBatches: [
      { batchId: 'batch-5', batchName: 'Class 8 - Section A', subject: 'Science' },
    ],
  },
];

// Comprehensive timetable entries - 80+ entries covering all batches and days
export const timetableEntries: TimetableEntry[] = [
  // ========================
  // BATCH 1: Class 10 - Section A (Mon-Sat, 6-7 periods/day)
  // ========================
  // Monday
  { id: 'e-1-1', day: 'Monday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-2', day: 'Monday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-3', day: 'Monday', periodNumber: 3, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-4', day: 'Monday', periodNumber: 5, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-5', day: 'Monday', periodNumber: 6, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-6', day: 'Monday', periodNumber: 7, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'lab', facilityId: 'lab-computer', facilityName: 'Computer Lab' },
  
  // Tuesday
  { id: 'e-1-7', day: 'Tuesday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-8', day: 'Tuesday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-9', day: 'Tuesday', periodNumber: 3, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-10', day: 'Tuesday', periodNumber: 5, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-11', day: 'Tuesday', periodNumber: 6, subjectId: 'phy', subjectName: 'Physics Lab', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'lab', facilityId: 'lab-physics', facilityName: 'Physics Lab' },
  
  // Wednesday
  { id: 'e-1-12', day: 'Wednesday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-13', day: 'Wednesday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-14', day: 'Wednesday', periodNumber: 3, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-15', day: 'Wednesday', periodNumber: 5, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-16', day: 'Wednesday', periodNumber: 6, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-17', day: 'Wednesday', periodNumber: 7, subjectId: 'lib', subjectName: 'Library', teacherId: '', teacherName: '', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'library', facilityId: 'room-library', facilityName: 'Library' },
  
  // Thursday
  { id: 'e-1-18', day: 'Thursday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-19', day: 'Thursday', periodNumber: 2, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-20', day: 'Thursday', periodNumber: 3, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-21', day: 'Thursday', periodNumber: 5, subjectId: 'che', subjectName: 'Chemistry Lab', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'lab', facilityId: 'lab-chemistry', facilityName: 'Chemistry Lab' },
  { id: 'e-1-22', day: 'Thursday', periodNumber: 6, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  
  // Friday
  { id: 'e-1-23', day: 'Friday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-24', day: 'Friday', periodNumber: 2, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-25', day: 'Friday', periodNumber: 3, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-26', day: 'Friday', periodNumber: 5, subjectId: 'bio', subjectName: 'Biology Lab', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'lab', facilityId: 'lab-biology', facilityName: 'Biology Lab' },
  { id: 'e-1-27', day: 'Friday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-28', day: 'Friday', periodNumber: 7, subjectId: 'spo', subjectName: 'Sports', teacherId: '', teacherName: '', batchId: 'batch-1', batchName: 'Class 10 - Section A', periodType: 'sports', facilityId: 'sports-field', facilityName: 'Sports Field' },
  
  // Saturday
  { id: 'e-1-29', day: 'Saturday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-30', day: 'Saturday', periodNumber: 2, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-31', day: 'Saturday', periodNumber: 3, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  { id: 'e-1-32', day: 'Saturday', periodNumber: 5, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-1', batchName: 'Class 10 - Section A' },
  
  // ========================
  // BATCH 2: Class 10 - Section B (Mon-Sat)
  // ========================
  // Monday
  { id: 'e-2-1', day: 'Monday', periodNumber: 1, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-2', day: 'Monday', periodNumber: 2, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-3', day: 'Monday', periodNumber: 3, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-4', day: 'Monday', periodNumber: 5, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-5', day: 'Monday', periodNumber: 6, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Tuesday
  { id: 'e-2-6', day: 'Tuesday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-7', day: 'Tuesday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-8', day: 'Tuesday', periodNumber: 3, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-9', day: 'Tuesday', periodNumber: 5, subjectId: 'phy', subjectName: 'Physics Lab', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B', periodType: 'lab', facilityId: 'lab-physics', facilityName: 'Physics Lab' },
  { id: 'e-2-10', day: 'Tuesday', periodNumber: 6, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Wednesday
  { id: 'e-2-11', day: 'Wednesday', periodNumber: 1, subjectId: 'cs', subjectName: 'Computer Science', teacherId: 'teacher-8', teacherName: 'Dr. Sneha Reddy', batchId: 'batch-2', batchName: 'Class 10 - Section B', periodType: 'lab', facilityId: 'lab-computer', facilityName: 'Computer Lab' },
  { id: 'e-2-12', day: 'Wednesday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-13', day: 'Wednesday', periodNumber: 3, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-14', day: 'Wednesday', periodNumber: 5, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-15', day: 'Wednesday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Thursday
  { id: 'e-2-16', day: 'Thursday', periodNumber: 1, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-17', day: 'Thursday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-18', day: 'Thursday', periodNumber: 3, subjectId: 'che', subjectName: 'Chemistry Lab', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B', periodType: 'lab', facilityId: 'lab-chemistry', facilityName: 'Chemistry Lab' },
  { id: 'e-2-19', day: 'Thursday', periodNumber: 5, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-20', day: 'Thursday', periodNumber: 6, subjectId: 'eco', subjectName: 'Economics', teacherId: 'teacher-9', teacherName: 'Mr. Rahul Saxena', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Friday
  { id: 'e-2-21', day: 'Friday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-22', day: 'Friday', periodNumber: 2, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-23', day: 'Friday', periodNumber: 3, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-24', day: 'Friday', periodNumber: 5, subjectId: 'lib', subjectName: 'Library', teacherId: '', teacherName: '', batchId: 'batch-2', batchName: 'Class 10 - Section B', periodType: 'library', facilityId: 'room-library', facilityName: 'Library' },
  { id: 'e-2-25', day: 'Friday', periodNumber: 6, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  
  // Saturday
  { id: 'e-2-26', day: 'Saturday', periodNumber: 1, subjectId: 'che', subjectName: 'Chemistry', teacherId: 'teacher-3', teacherName: 'Mr. Suresh Verma', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-27', day: 'Saturday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-28', day: 'Saturday', periodNumber: 3, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-2', batchName: 'Class 10 - Section B' },
  { id: 'e-2-29', day: 'Saturday', periodNumber: 5, subjectId: 'spo', subjectName: 'Sports', teacherId: '', teacherName: '', batchId: 'batch-2', batchName: 'Class 10 - Section B', periodType: 'sports', facilityId: 'sports-field', facilityName: 'Sports Field' },
  
  // ========================
  // BATCH 3: Class 9 - Section A (Mon-Sat)
  // ========================
  // Monday
  { id: 'e-3-1', day: 'Monday', periodNumber: 3, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-2', day: 'Monday', periodNumber: 4, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-3', day: 'Monday', periodNumber: 5, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-4', day: 'Monday', periodNumber: 6, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-5', day: 'Monday', periodNumber: 7, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // Tuesday
  { id: 'e-3-6', day: 'Tuesday', periodNumber: 3, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-7', day: 'Tuesday', periodNumber: 4, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-8', day: 'Tuesday', periodNumber: 5, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-9', day: 'Tuesday', periodNumber: 6, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // Wednesday
  { id: 'e-3-10', day: 'Wednesday', periodNumber: 3, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-11', day: 'Wednesday', periodNumber: 4, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-12', day: 'Wednesday', periodNumber: 5, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-13', day: 'Wednesday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // Thursday
  { id: 'e-3-14', day: 'Thursday', periodNumber: 3, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-15', day: 'Thursday', periodNumber: 4, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-16', day: 'Thursday', periodNumber: 5, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-17', day: 'Thursday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // Friday
  { id: 'e-3-18', day: 'Friday', periodNumber: 3, subjectId: 'bio', subjectName: 'Biology Lab', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-3', batchName: 'Class 9 - Section A', periodType: 'lab', facilityId: 'lab-biology', facilityName: 'Biology Lab' },
  { id: 'e-3-19', day: 'Friday', periodNumber: 4, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-20', day: 'Friday', periodNumber: 5, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-21', day: 'Friday', periodNumber: 6, subjectId: 'spo', subjectName: 'Sports', teacherId: '', teacherName: '', batchId: 'batch-3', batchName: 'Class 9 - Section A', periodType: 'sports', facilityId: 'sports-indoor', facilityName: 'Indoor Court' },
  
  // Saturday
  { id: 'e-3-22', day: 'Saturday', periodNumber: 1, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-23', day: 'Saturday', periodNumber: 2, subjectId: 'phy', subjectName: 'Physics', teacherId: 'teacher-1', teacherName: 'Dr. Rajesh Kumar', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  { id: 'e-3-24', day: 'Saturday', periodNumber: 3, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-3', batchName: 'Class 9 - Section A' },
  
  // ========================
  // BATCH 4: Class 9 - Section B (Mon-Sat)
  // ========================
  // Monday
  { id: 'e-4-1', day: 'Monday', periodNumber: 5, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-2', day: 'Monday', periodNumber: 6, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-3', day: 'Monday', periodNumber: 7, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // Tuesday
  { id: 'e-4-4', day: 'Tuesday', periodNumber: 5, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-5', day: 'Tuesday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-6', day: 'Tuesday', periodNumber: 7, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // Wednesday
  { id: 'e-4-7', day: 'Wednesday', periodNumber: 5, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-8', day: 'Wednesday', periodNumber: 6, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-9', day: 'Wednesday', periodNumber: 7, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // Thursday
  { id: 'e-4-10', day: 'Thursday', periodNumber: 5, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-11', day: 'Thursday', periodNumber: 6, subjectId: 'bio', subjectName: 'Biology Lab', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B', periodType: 'lab', facilityId: 'lab-biology', facilityName: 'Biology Lab' },
  { id: 'e-4-12', day: 'Thursday', periodNumber: 7, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // Friday
  { id: 'e-4-13', day: 'Friday', periodNumber: 5, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-14', day: 'Friday', periodNumber: 6, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-15', day: 'Friday', periodNumber: 7, subjectId: 'lib', subjectName: 'Library', teacherId: '', teacherName: '', batchId: 'batch-4', batchName: 'Class 9 - Section B', periodType: 'library', facilityId: 'room-library', facilityName: 'Library' },
  
  // Saturday
  { id: 'e-4-16', day: 'Saturday', periodNumber: 1, subjectId: 'bio', subjectName: 'Biology', teacherId: 'teacher-4', teacherName: 'Ms. Anjali Gupta', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-17', day: 'Saturday', periodNumber: 2, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  { id: 'e-4-18', day: 'Saturday', periodNumber: 3, subjectId: 'mat', subjectName: 'Mathematics', teacherId: 'teacher-2', teacherName: 'Mrs. Priya Sharma', batchId: 'batch-4', batchName: 'Class 9 - Section B' },
  
  // ========================
  // BATCH 5: Class 8 - Section A (Mon-Sat)
  // ========================
  // Monday
  { id: 'e-5-1', day: 'Monday', periodNumber: 6, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-2', day: 'Monday', periodNumber: 7, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-3', day: 'Monday', periodNumber: 8, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  
  // Tuesday
  { id: 'e-5-4', day: 'Tuesday', periodNumber: 6, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-5', day: 'Tuesday', periodNumber: 7, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-6', day: 'Tuesday', periodNumber: 8, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  
  // Wednesday
  { id: 'e-5-7', day: 'Wednesday', periodNumber: 6, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-8', day: 'Wednesday', periodNumber: 7, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-9', day: 'Wednesday', periodNumber: 8, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  
  // Thursday
  { id: 'e-5-10', day: 'Thursday', periodNumber: 6, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-11', day: 'Thursday', periodNumber: 7, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-12', day: 'Thursday', periodNumber: 8, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  
  // Friday
  { id: 'e-5-13', day: 'Friday', periodNumber: 6, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-14', day: 'Friday', periodNumber: 7, subjectId: 'sst', subjectName: 'Social Studies', teacherId: 'teacher-7', teacherName: 'Mr. Arun Mehta', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-15', day: 'Friday', periodNumber: 8, subjectId: 'spo', subjectName: 'Sports', teacherId: '', teacherName: '', batchId: 'batch-5', batchName: 'Class 8 - Section A', periodType: 'sports', facilityId: 'sports-field', facilityName: 'Sports Field' },
  
  // Saturday
  { id: 'e-5-16', day: 'Saturday', periodNumber: 1, subjectId: 'sci', subjectName: 'Science', teacherId: 'teacher-10', teacherName: 'Mrs. Geeta Iyer', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-17', day: 'Saturday', periodNumber: 2, subjectId: 'eng', subjectName: 'English', teacherId: 'teacher-5', teacherName: 'Mr. Vikram Singh', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-18', day: 'Saturday', periodNumber: 3, subjectId: 'hin', subjectName: 'Hindi', teacherId: 'teacher-6', teacherName: 'Mrs. Kavita Nair', batchId: 'batch-5', batchName: 'Class 8 - Section A' },
  { id: 'e-5-19', day: 'Saturday', periodNumber: 5, subjectId: 'lib', subjectName: 'Library', teacherId: '', teacherName: '', batchId: 'batch-5', batchName: 'Class 8 - Section A', periodType: 'library', facilityId: 'room-library', facilityName: 'Library' },
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
  lib: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100' },
  spo: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
};

// Holidays for the academic year - Comprehensive 2025 list
export const academicHolidays = [
  { date: '2025-01-14', name: 'Makar Sankranti' },
  { date: '2025-01-26', name: 'Republic Day' },
  { date: '2025-03-14', name: 'Holi' },
  { date: '2025-03-31', name: 'Eid-ul-Fitr' },
  { date: '2025-04-14', name: 'Ambedkar Jayanti' },
  { date: '2025-04-18', name: 'Good Friday' },
  { date: '2025-05-01', name: 'May Day' },
  { date: '2025-05-12', name: 'Buddha Purnima' },
  { date: '2025-06-07', name: 'Eid-ul-Adha' },
  { date: '2025-08-15', name: 'Independence Day' },
  { date: '2025-08-16', name: 'Janmashtami' },
  { date: '2025-10-02', name: 'Gandhi Jayanti' },
  { date: '2025-10-20', name: 'Dussehra' },
  { date: '2025-10-24', name: 'Diwali' },
  { date: '2025-11-05', name: 'Guru Nanak Jayanti' },
  { date: '2025-12-25', name: 'Christmas' },
];

// Period Types
export const defaultPeriodTypes: PeriodType[] = [
  { id: 'regular', name: 'Regular Class', icon: 'BookOpen', color: 'bg-blue-100 text-blue-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'library', name: 'Library', icon: 'Library', color: 'bg-amber-100 text-amber-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'lab', name: 'Lab', icon: 'FlaskConical', color: 'bg-purple-100 text-purple-700', requiresTeacher: true, isDouble: true, isDefault: true },
  { id: 'sports', name: 'Sports', icon: 'Dumbbell', color: 'bg-green-100 text-green-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'activity', name: 'Activity', icon: 'Palette', color: 'bg-pink-100 text-pink-700', requiresTeacher: true, isDouble: false, isDefault: true },
  { id: 'assembly', name: 'Assembly', icon: 'Users', color: 'bg-slate-100 text-slate-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'free', name: 'Free Period', icon: 'Coffee', color: 'bg-gray-100 text-gray-700', requiresTeacher: false, isDouble: false, isDefault: true },
  { id: 'exam', name: 'Exam', icon: 'FileEdit', color: 'bg-red-100 text-red-700', requiresTeacher: true, isDouble: true, isDefault: true },
];

// Academic Terms
export const academicTerms: AcademicTerm[] = [
  { id: 'term-1', name: 'Term 1', startDate: '2025-04-01', endDate: '2025-09-30' },
  { id: 'term-2', name: 'Term 2', startDate: '2025-10-01', endDate: '2026-03-31' },
];

// Batch Exam Schedules (sample)
export const batchExamSchedules: BatchExamSchedule[] = [
  { id: 'sch-1', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'weekly', dates: [], recurringDay: 'Saturday' },
  { id: 'sch-2', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'monthly', dates: ['2025-04-28', '2025-05-26', '2025-06-30'] },
  { id: 'sch-3', batchId: 'batch-1', batchName: 'Class 10 - Section A', termId: 'term-1', examType: 'terminal', dates: ['2025-09-15', '2025-09-16', '2025-09-17'] },
];

// Default Facilities
export const defaultFacilities: Facility[] = [
  // Labs
  { id: 'lab-physics', name: 'Physics Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-chemistry', name: 'Chemistry Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-biology', name: 'Biology Lab', type: 'lab', capacity: 30, duration: 2, allowedClasses: ['Class 8', 'Class 9', 'Class 10'], linkedPeriodType: 'lab' },
  { id: 'lab-computer', name: 'Computer Lab', type: 'lab', capacity: 40, duration: 1, allowedClasses: ['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'] },
  
  // Sports
  { id: 'sports-field', name: 'Sports Field', type: 'sports', capacity: 60, duration: 1, allowedClasses: [], linkedPeriodType: 'sports' },
  { id: 'sports-indoor', name: 'Indoor Court', type: 'sports', capacity: 30, duration: 1, allowedClasses: [] },
  
  // Special Rooms
  { id: 'room-library', name: 'Library', type: 'special', capacity: 40, duration: 1, allowedClasses: [], linkedPeriodType: 'library' },
  { id: 'room-art', name: 'Art Room', type: 'special', capacity: 30, duration: 1, allowedClasses: [] },
  { id: 'room-music', name: 'Music Room', type: 'special', capacity: 25, duration: 1, allowedClasses: [] },
  { id: 'room-auditorium', name: 'Auditorium', type: 'special', capacity: 200, duration: 2, allowedClasses: [] },
  
  // Classrooms
  { id: 'classroom-a1', name: 'Classroom A1', type: 'classroom', capacity: 40, duration: 1, allowedClasses: [] },
  { id: 'classroom-a2', name: 'Classroom A2', type: 'classroom', capacity: 40, duration: 1, allowedClasses: [] },
  { id: 'classroom-b1', name: 'Classroom B1', type: 'classroom', capacity: 35, duration: 1, allowedClasses: [] },
];

// Comprehensive Teacher Constraints - All 10 teachers with various constraint types
export const defaultTeacherConstraints: TeacherConstraint[] = [
  { 
    teacherId: 'teacher-1',  // Dr. Rajesh Kumar
    maxPeriodsPerDay: 5, 
    maxConsecutivePeriods: 3, 
    unavailableDays: [], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-2',  // Mrs. Priya Sharma - No Saturday
    maxPeriodsPerDay: 6, 
    maxConsecutivePeriods: 4, 
    unavailableDays: ['Saturday'], 
    unavailablePeriods: [], 
    preferenceLevel: 'hard' 
  },
  { 
    teacherId: 'teacher-3',  // Mr. Suresh Verma - Morning only (P1-P4)
    maxPeriodsPerDay: 4, 
    maxConsecutivePeriods: 2, 
    unavailableDays: [], 
    unavailablePeriods: [],
    timeWindow: { startPeriod: 1, endPeriod: 4 },
    preferenceLevel: 'hard' 
  },
  { 
    teacherId: 'teacher-4',  // Ms. Anjali Gupta
    maxPeriodsPerDay: 5, 
    maxConsecutivePeriods: 3, 
    unavailableDays: [], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-5',  // Mr. Vikram Singh
    maxPeriodsPerDay: 6, 
    maxConsecutivePeriods: 4, 
    unavailableDays: [], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-6',  // Mrs. Kavita Nair - Unavailable Wed, Fri
    maxPeriodsPerDay: 4, 
    maxConsecutivePeriods: 3, 
    unavailableDays: ['Wednesday'], 
    unavailablePeriods: [{ day: 'Friday', period: 8 }], 
    preferenceLevel: 'hard' 
  },
  { 
    teacherId: 'teacher-7',  // Mr. Arun Mehta - Afternoon only (P5-P8)
    maxPeriodsPerDay: 3, 
    maxConsecutivePeriods: 2, 
    unavailableDays: [], 
    unavailablePeriods: [],
    timeWindow: { startPeriod: 5, endPeriod: 8 },
    preferenceLevel: 'hard' 
  },
  { 
    teacherId: 'teacher-8',  // Dr. Sneha Reddy
    maxPeriodsPerDay: 4, 
    maxConsecutivePeriods: 3, 
    unavailableDays: [], 
    unavailablePeriods: [{ day: 'Monday', period: 8 }, { day: 'Friday', period: 8 }], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-9',  // Mr. Rahul Saxena - No Saturday
    maxPeriodsPerDay: 5, 
    maxConsecutivePeriods: 3, 
    unavailableDays: ['Saturday'], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
  { 
    teacherId: 'teacher-10',  // Mrs. Geeta Iyer
    maxPeriodsPerDay: 6, 
    maxConsecutivePeriods: 4, 
    unavailableDays: [], 
    unavailablePeriods: [], 
    preferenceLevel: 'soft' 
  },
];

// Sample Teacher Absences - Pre-populated for demo (Jan 6-8, 2025)
export const sampleTeacherAbsences: TeacherAbsence[] = [
  {
    id: 'absence-demo-1',
    teacherId: 'teacher-1',
    teacherName: 'Dr. Rajesh Kumar',
    date: '2025-01-06', // Monday
    absenceType: 'full_day',
    reason: 'Medical appointment',
    createdAt: '2025-01-05T10:00:00Z',
  },
  {
    id: 'absence-demo-2',
    teacherId: 'teacher-2',
    teacherName: 'Mrs. Priya Sharma',
    date: '2025-01-07', // Tuesday
    absenceType: 'partial',
    periods: [1, 2, 3],
    reason: 'Family emergency',
    createdAt: '2025-01-06T18:00:00Z',
  },
  {
    id: 'absence-demo-3',
    teacherId: 'teacher-3',
    teacherName: 'Mr. Suresh Verma',
    date: '2025-01-08', // Wednesday
    absenceType: 'full_day',
    reason: 'Conference attendance',
    createdAt: '2025-01-05T09:00:00Z',
  },
];

// Sample Substitution Assignments - One pre-assigned for demo
export const sampleSubstitutionAssignments: SubstitutionAssignment[] = [
  {
    id: 'sub-demo-1',
    absenceId: 'absence-demo-3',
    originalTeacherId: 'teacher-3',
    substituteTeacherId: 'teacher-9',
    substituteTeacherName: 'Mr. Rahul Saxena',
    date: '2025-01-08',
    period: 1,
    batchId: 'batch-1',
    batchName: 'Class 10 - Section A',
    subject: 'Chemistry',
    status: 'assigned',
    isTemporary: true,
  },
];
