// Mock Data for DonutAI Super Admin

export interface Institute {
  id: string;
  name: string;
  code: string;
  adminName: string;
  adminEmail: string;
  plan: "basic" | "pro" | "enterprise";
  status: "active" | "inactive" | "pending";
  students: number;
  teachers: number;
  createdAt: string;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: string;
  class: string;
  course: string;
  status: "active" | "inactive";
  joinedAt: string;
}

export interface DashboardStats {
  totalInstitutes: number;
  instituteGrowth: number;
  activeStudents: number;
  studentGrowth: number;
  activeTeachers: number;
  teacherGrowth: number;
  monthlyRevenue: number;
  revenueGrowth: number;
}

export interface ChartData {
  name: string;
  value?: number;
  [key: string]: string | number;
}

export const mockInstitutes: Institute[] = [
  { id: "1", name: "Delhi Public School", code: "DPS001", adminName: "Rajesh Kumar", adminEmail: "rajesh@dps.edu", plan: "enterprise", status: "active", students: 2500, teachers: 150, createdAt: "2024-01-15", expiresAt: "2025-01-15" },
  { id: "2", name: "Ryan International", code: "RYN002", adminName: "Priya Sharma", adminEmail: "priya@ryan.edu", plan: "pro", status: "active", students: 1800, teachers: 95, createdAt: "2024-02-20", expiresAt: "2025-02-20" },
  { id: "3", name: "Kendriya Vidyalaya", code: "KV003", adminName: "Amit Patel", adminEmail: "amit@kv.edu", plan: "enterprise", status: "active", students: 3200, teachers: 180, createdAt: "2024-01-05", expiresAt: "2025-01-05" },
  { id: "4", name: "DAV Public School", code: "DAV004", adminName: "Sunita Reddy", adminEmail: "sunita@dav.edu", plan: "basic", status: "active", students: 850, teachers: 45, createdAt: "2024-03-10", expiresAt: "2025-03-10" },
  { id: "5", name: "St. Xavier's High", code: "SXH005", adminName: "John D'Souza", adminEmail: "john@xavier.edu", plan: "pro", status: "inactive", students: 1200, teachers: 70, createdAt: "2024-02-01", expiresAt: "2024-12-01" },
  { id: "6", name: "Army Public School", code: "APS006", adminName: "Col. Verma", adminEmail: "verma@aps.edu", plan: "enterprise", status: "active", students: 2100, teachers: 120, createdAt: "2024-01-20", expiresAt: "2025-01-20" },
  { id: "7", name: "Modern School", code: "MOD007", adminName: "Neha Gupta", adminEmail: "neha@modern.edu", plan: "basic", status: "pending", students: 0, teachers: 0, createdAt: "2024-12-15", expiresAt: "2025-12-15" },
  { id: "8", name: "Bal Bharati Public", code: "BBP008", adminName: "Vikram Singh", adminEmail: "vikram@bbp.edu", plan: "pro", status: "active", students: 1650, teachers: 85, createdAt: "2024-02-28", expiresAt: "2025-02-28" },
  { id: "9", name: "Springdales School", code: "SPR009", adminName: "Anjali Kapoor", adminEmail: "anjali@spring.edu", plan: "enterprise", status: "active", students: 2800, teachers: 165, createdAt: "2024-01-10", expiresAt: "2025-01-10" },
  { id: "10", name: "The Heritage School", code: "THS010", adminName: "Rahul Mehta", adminEmail: "rahul@heritage.edu", plan: "pro", status: "active", students: 1400, teachers: 78, createdAt: "2024-03-01", expiresAt: "2025-03-01" },
];

export const mockUsers: User[] = [
  { id: "1", name: "Arjun Verma", email: "arjun@gmail.com", mobile: "9876543210", role: "Student", class: "Class 12", course: "JEE", status: "active", joinedAt: "2024-06-15" },
  { id: "2", name: "Priya Singh", email: "priya@gmail.com", mobile: "9876543211", role: "Student", class: "Class 11", course: "NEET", status: "active", joinedAt: "2024-07-20" },
  { id: "3", name: "Rahul Kumar", email: "rahul@gmail.com", mobile: "9876543212", role: "Teacher", class: "-", course: "JEE", status: "active", joinedAt: "2024-01-10" },
  { id: "4", name: "Sneha Patel", email: "sneha@gmail.com", mobile: "9876543213", role: "Student", class: "Class 12", course: "CBSE", status: "inactive", joinedAt: "2024-08-05" },
  { id: "5", name: "Amit Shah", email: "amit@gmail.com", mobile: "9876543214", role: "Parent", class: "-", course: "-", status: "active", joinedAt: "2024-09-01" },
];

export const mockDashboardStats: DashboardStats = {
  totalInstitutes: 156,
  instituteGrowth: 12.5,
  activeStudents: 45280,
  studentGrowth: 8.3,
  activeTeachers: 2840,
  teacherGrowth: 5.7,
  monthlyRevenue: 2850000,
  revenueGrowth: 15.2,
};

export const monthlyGrowthData: ChartData[] = [
  { name: "Jan", institutes: 120, students: 35000, revenue: 1800000 },
  { name: "Feb", institutes: 128, students: 37500, revenue: 2000000 },
  { name: "Mar", institutes: 135, students: 39000, revenue: 2150000 },
  { name: "Apr", institutes: 140, students: 40500, revenue: 2300000 },
  { name: "May", institutes: 145, students: 42000, revenue: 2500000 },
  { name: "Jun", institutes: 148, students: 43500, revenue: 2650000 },
  { name: "Jul", institutes: 152, students: 44200, revenue: 2750000 },
  { name: "Aug", institutes: 156, students: 45280, revenue: 2850000 },
];

export const revenueByTierData: ChartData[] = [
  { name: "Basic", value: 450000, color: "hsl(var(--donut-teal))" },
  { name: "Pro", value: 1200000, color: "hsl(var(--donut-orange))" },
  { name: "Enterprise", value: 1200000, color: "hsl(var(--donut-coral))" },
];

export const userDistributionData: ChartData[] = [
  { name: "Students", value: 45280, color: "hsl(var(--donut-coral))" },
  { name: "Teachers", value: 2840, color: "hsl(var(--donut-orange))" },
  { name: "Parents", value: 12500, color: "hsl(var(--donut-teal))" },
  { name: "Admins", value: 320, color: "hsl(var(--donut-purple))" },
];

export const recentActivities = [
  { id: 1, type: "institute", message: "Modern School registered for Basic plan", time: "2 minutes ago", icon: "building" },
  { id: 2, type: "user", message: "150 new students joined Ryan International", time: "15 minutes ago", icon: "users" },
  { id: 3, type: "payment", message: "DPS renewed Enterprise subscription - ₹2,50,000", time: "1 hour ago", icon: "credit-card" },
  { id: 4, type: "content", message: "25 new questions added to JEE Physics bank", time: "2 hours ago", icon: "file-text" },
  { id: 5, type: "exam", message: "Grand Test #45 completed by 2,800 students", time: "3 hours ago", icon: "clipboard" },
];

// Parameter Data
export const classes = [
  { id: "1", name: "Class 6", code: "C6", order: 1 },
  { id: "2", name: "Class 7", code: "C7", order: 2 },
  { id: "3", name: "Class 8", code: "C8", order: 3 },
  { id: "4", name: "Class 9", code: "C9", order: 4 },
  { id: "5", name: "Class 10", code: "C10", order: 5 },
  { id: "6", name: "Class 11", code: "C11", order: 6 },
  { id: "7", name: "Class 12", code: "C12", order: 7 },
];

export const courses = [
  { id: "1", name: "JEE Main", code: "JEE", description: "Joint Entrance Examination Main" },
  { id: "2", name: "JEE Advanced", code: "JEEA", description: "Joint Entrance Examination Advanced" },
  { id: "3", name: "NEET", code: "NEET", description: "National Eligibility cum Entrance Test" },
  { id: "4", name: "CBSE Board", code: "CBSE", description: "Central Board of Secondary Education" },
  { id: "5", name: "ICSE Board", code: "ICSE", description: "Indian Certificate of Secondary Education" },
  { id: "6", name: "State Board", code: "STATE", description: "Various State Board Examinations" },
];

export const subjects = [
  { id: "1", name: "Physics", code: "PHY", courseIds: ["1", "2", "3"] },
  { id: "2", name: "Chemistry", code: "CHE", courseIds: ["1", "2", "3"] },
  { id: "3", name: "Mathematics", code: "MAT", courseIds: ["1", "2", "4", "5"] },
  { id: "4", name: "Biology", code: "BIO", courseIds: ["3"] },
  { id: "5", name: "English", code: "ENG", courseIds: ["4", "5", "6"] },
];

export const chapters = [
  { id: "1", name: "Mechanics", subjectId: "1", order: 1 },
  { id: "2", name: "Thermodynamics", subjectId: "1", order: 2 },
  { id: "3", name: "Electrostatics", subjectId: "1", order: 3 },
  { id: "4", name: "Organic Chemistry", subjectId: "2", order: 1 },
  { id: "5", name: "Inorganic Chemistry", subjectId: "2", order: 2 },
  { id: "6", name: "Calculus", subjectId: "3", order: 1 },
  { id: "7", name: "Algebra", subjectId: "3", order: 2 },
];

export const topics = [
  { id: "1", name: "Newton's Laws of Motion", chapterId: "1", order: 1 },
  { id: "2", name: "Work, Energy & Power", chapterId: "1", order: 2 },
  { id: "3", name: "Laws of Thermodynamics", chapterId: "2", order: 1 },
  { id: "4", name: "Coulomb's Law", chapterId: "3", order: 1 },
  { id: "5", name: "Hydrocarbons", chapterId: "4", order: 1 },
];

// Roles Data
export const roleTypes = [
  { id: "1", name: "Super Admin", description: "Full system access", level: 1 },
  { id: "2", name: "Institute Admin", description: "Institute level management", level: 2 },
  { id: "3", name: "Teacher", description: "Content and student management", level: 3 },
  { id: "4", name: "Student", description: "Learning access", level: 4 },
  { id: "5", name: "Parent", description: "View student progress", level: 5 },
];

// Questions Data
export interface Question {
  id: string;
  type: "mcq" | "multiple" | "assertion" | "paragraph" | "numerical" | "fill" | "short" | "long";
  subject: string;
  chapter: string;
  topic: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  solution?: string;
  hint?: string;
  marks: number;
  negativeMarks: number;
  createdAt: string;
}

export const mockQuestions: Question[] = [
  { id: "1", type: "mcq", subject: "Physics", chapter: "Mechanics", topic: "Newton's Laws", difficulty: "medium", question: "A body of mass 5 kg is moving with velocity 10 m/s. What is its momentum?", options: ["50 kg·m/s", "25 kg·m/s", "100 kg·m/s", "500 kg·m/s"], correctAnswer: "50 kg·m/s", marks: 4, negativeMarks: 1, createdAt: "2024-10-15" },
  { id: "2", type: "numerical", subject: "Physics", chapter: "Thermodynamics", topic: "Laws of Thermodynamics", difficulty: "hard", question: "Calculate the work done when 2 moles of an ideal gas expands isothermally at 300K from 10L to 20L.", correctAnswer: "3456", marks: 4, negativeMarks: 0, createdAt: "2024-10-16" },
  { id: "3", type: "mcq", subject: "Chemistry", chapter: "Organic Chemistry", topic: "Hydrocarbons", difficulty: "easy", question: "Which of the following is a saturated hydrocarbon?", options: ["Ethene", "Ethyne", "Ethane", "Benzene"], correctAnswer: "Ethane", marks: 4, negativeMarks: 1, createdAt: "2024-10-17" },
  { id: "4", type: "multiple", subject: "Mathematics", chapter: "Calculus", topic: "Derivatives", difficulty: "medium", question: "Which of the following functions have a derivative at x=0?", options: ["f(x) = |x|", "f(x) = x²", "f(x) = sin(x)", "f(x) = 1/x"], correctAnswer: ["f(x) = x²", "f(x) = sin(x)"], marks: 4, negativeMarks: 1, createdAt: "2024-10-18" },
];

// Exams Data
export interface Exam {
  id: string;
  name: string;
  type: "chapter" | "topic" | "subject" | "grand" | "previous" | "live";
  subject: string;
  duration: number;
  totalMarks: number;
  totalQuestions: number;
  status: "draft" | "scheduled" | "live" | "completed";
  startDate?: string;
  endDate?: string;
  assignedBatches: string[];
  createdAt: string;
}

export const mockExams: Exam[] = [
  { id: "1", name: "JEE Physics Chapter Test - Mechanics", type: "chapter", subject: "Physics", duration: 60, totalMarks: 100, totalQuestions: 25, status: "completed", startDate: "2024-10-01", endDate: "2024-10-01", assignedBatches: ["JEE-2025-A", "JEE-2025-B"], createdAt: "2024-09-25" },
  { id: "2", name: "NEET Grand Test #12", type: "grand", subject: "All", duration: 180, totalMarks: 720, totalQuestions: 180, status: "scheduled", startDate: "2024-12-20", assignedBatches: ["NEET-2025"], createdAt: "2024-12-01" },
  { id: "3", name: "Chemistry Weekly Quiz", type: "topic", subject: "Chemistry", duration: 30, totalMarks: 40, totalQuestions: 10, status: "live", assignedBatches: ["JEE-2025-A"], createdAt: "2024-12-10" },
];

// Content Data
export interface Content {
  id: string;
  title: string;
  type: "video" | "pdf" | "ppt" | "doc" | "html" | "iframe";
  subject: string;
  chapter: string;
  topic: string;
  description: string;
  duration?: number;
  size?: string;
  url: string;
  createdAt: string;
}

export const mockContent: Content[] = [
  { id: "1", title: "Newton's Laws Explained", type: "video", subject: "Physics", chapter: "Mechanics", topic: "Newton's Laws", description: "Comprehensive video on Newton's three laws of motion", duration: 45, url: "#", createdAt: "2024-09-15" },
  { id: "2", title: "Organic Chemistry Notes", type: "pdf", subject: "Chemistry", chapter: "Organic Chemistry", topic: "Hydrocarbons", description: "Complete notes for hydrocarbon chapter", size: "2.5 MB", url: "#", createdAt: "2024-09-20" },
  { id: "3", title: "Calculus Formulas", type: "ppt", subject: "Mathematics", chapter: "Calculus", topic: "Derivatives", description: "All important formulas for derivatives", size: "5.2 MB", url: "#", createdAt: "2024-10-01" },
];

// Institute Tiers
export interface InstituteTier {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: {
    name: string;
    included: boolean;
    limit?: number;
  }[];
  maxStudents: number;
  maxTeachers: number;
  color: string;
}

export const instituteTiers: InstituteTier[] = [
  {
    id: "basic",
    name: "Basic",
    price: 9999,
    billingCycle: "monthly",
    maxStudents: 500,
    maxTeachers: 25,
    color: "donut-teal",
    features: [
      { name: "Student Management", included: true },
      { name: "Basic Reports", included: true },
      { name: "Question Bank Access", included: true, limit: 1000 },
      { name: "Content Library", included: true, limit: 50 },
      { name: "AI Question Generator", included: false },
      { name: "Live Exams", included: false },
      { name: "Advanced Analytics", included: false },
      { name: "Custom Branding", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 24999,
    billingCycle: "monthly",
    maxStudents: 2000,
    maxTeachers: 100,
    color: "donut-orange",
    features: [
      { name: "Student Management", included: true },
      { name: "Basic Reports", included: true },
      { name: "Question Bank Access", included: true, limit: 10000 },
      { name: "Content Library", included: true, limit: 500 },
      { name: "AI Question Generator", included: true, limit: 100 },
      { name: "Live Exams", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Branding", included: false },
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 49999,
    billingCycle: "monthly",
    maxStudents: -1,
    maxTeachers: -1,
    color: "donut-coral",
    features: [
      { name: "Student Management", included: true },
      { name: "Basic Reports", included: true },
      { name: "Question Bank Access", included: true },
      { name: "Content Library", included: true },
      { name: "AI Question Generator", included: true },
      { name: "Live Exams", included: true },
      { name: "Advanced Analytics", included: true },
      { name: "Custom Branding", included: true },
    ],
  },
];