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

// Chapters (Dependent on Class + Subject)
export const chapters = [
  // Class 10 - Physics
  { id: "1", name: "Light - Reflection and Refraction", classId: "5", subjectId: "1", order: 1 },
  { id: "2", name: "Electricity", classId: "5", subjectId: "1", order: 2 },
  { id: "3", name: "Magnetic Effects of Electric Current", classId: "5", subjectId: "1", order: 3 },
  { id: "4", name: "Sources of Energy", classId: "5", subjectId: "1", order: 4 },
  
  // Class 11 - Physics
  { id: "5", name: "Units and Measurements", classId: "6", subjectId: "1", order: 1 },
  { id: "6", name: "Motion in a Straight Line", classId: "6", subjectId: "1", order: 2 },
  { id: "7", name: "Laws of Motion", classId: "6", subjectId: "1", order: 3 },
  { id: "8", name: "Work, Energy and Power", classId: "6", subjectId: "1", order: 4 },
  
  // Class 12 - Physics
  { id: "9", name: "Electric Charges and Fields", classId: "7", subjectId: "1", order: 1 },
  { id: "10", name: "Electrostatic Potential and Capacitance", classId: "7", subjectId: "1", order: 2 },
  { id: "11", name: "Current Electricity", classId: "7", subjectId: "1", order: 3 },
  { id: "12", name: "Ray Optics and Optical Instruments", classId: "7", subjectId: "1", order: 4 },
  
  // Class 10 - Mathematics
  { id: "13", name: "Real Numbers", classId: "5", subjectId: "3", order: 1 },
  { id: "14", name: "Polynomials", classId: "5", subjectId: "3", order: 2 },
  { id: "15", name: "Pair of Linear Equations", classId: "5", subjectId: "3", order: 3 },
  { id: "16", name: "Quadratic Equations", classId: "5", subjectId: "3", order: 4 },
  
  // Class 11 - Mathematics
  { id: "17", name: "Sets", classId: "6", subjectId: "3", order: 1 },
  { id: "18", name: "Relations and Functions", classId: "6", subjectId: "3", order: 2 },
  { id: "19", name: "Trigonometric Functions", classId: "6", subjectId: "3", order: 3 },
  
  // Class 12 - Mathematics
  { id: "20", name: "Matrices", classId: "7", subjectId: "3", order: 1 },
  { id: "21", name: "Determinants", classId: "7", subjectId: "3", order: 2 },
  { id: "22", name: "Integrals", classId: "7", subjectId: "3", order: 3 },
  
  // Class 10 - Chemistry
  { id: "23", name: "Chemical Reactions and Equations", classId: "5", subjectId: "2", order: 1 },
  { id: "24", name: "Acids, Bases and Salts", classId: "5", subjectId: "2", order: 2 },
  
  // Class 11 - Chemistry
  { id: "25", name: "Some Basic Concepts of Chemistry", classId: "6", subjectId: "2", order: 1 },
  { id: "26", name: "Structure of Atom", classId: "6", subjectId: "2", order: 2 },
];

// Topics (Dependent on Chapter)
export const topics = [
  // Light - Reflection and Refraction (Class 10 Physics)
  { id: "1", name: "Reflection of Light", chapterId: "1", order: 1 },
  { id: "2", name: "Spherical Mirrors", chapterId: "1", order: 2 },
  { id: "3", name: "Image Formation by Spherical Mirrors", chapterId: "1", order: 3 },
  { id: "4", name: "Refraction of Light", chapterId: "1", order: 4 },
  { id: "5", name: "Refraction by Spherical Lenses", chapterId: "1", order: 5 },
  
  // Electricity (Class 10 Physics)
  { id: "6", name: "Electric Current and Circuit", chapterId: "2", order: 1 },
  { id: "7", name: "Electric Potential and Potential Difference", chapterId: "2", order: 2 },
  { id: "8", name: "Ohm's Law", chapterId: "2", order: 3 },
  { id: "9", name: "Resistance and Resistivity", chapterId: "2", order: 4 },
  { id: "10", name: "Heating Effect of Electric Current", chapterId: "2", order: 5 },
  
  // Units and Measurements (Class 11 Physics)
  { id: "11", name: "The International System of Units", chapterId: "5", order: 1 },
  { id: "12", name: "Measurement of Length", chapterId: "5", order: 2 },
  { id: "13", name: "Significant Figures", chapterId: "5", order: 3 },
  
  // Electric Charges and Fields (Class 12 Physics)
  { id: "14", name: "Electric Charges", chapterId: "9", order: 1 },
  { id: "15", name: "Coulomb's Law", chapterId: "9", order: 2 },
  { id: "16", name: "Electric Field", chapterId: "9", order: 3 },
  
  // Real Numbers (Class 10 Mathematics)
  { id: "17", name: "Euclid's Division Lemma", chapterId: "13", order: 1 },
  { id: "18", name: "Fundamental Theorem of Arithmetic", chapterId: "13", order: 2 },
  { id: "19", name: "Irrational Numbers", chapterId: "13", order: 3 },
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

// Content Data - Enhanced with real URLs
export type ContentType = "video" | "pdf" | "ppt" | "iframe" | "animation" | "image" | "audio" | "scorm";

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  subject: string;
  subjectId: string;
  chapter: string;
  chapterId: string;
  topic: string;
  topicId?: string;
  classId: string;
  className: string;
  description: string;
  duration?: number;
  size?: string;
  url: string;
  thumbnailUrl?: string;
  embedUrl?: string;
  visibility: "public" | "private" | "restricted";
  status: "published" | "draft" | "archived";
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  viewCount: number;
  downloadCount: number;
}

export const mockContent: Content[] = [
  // VIDEO CONTENT (4 items) - Real YouTube educational videos
  {
    id: "v1",
    title: "Newton's Laws of Motion - Complete Explanation",
    type: "video",
    subject: "Physics",
    subjectId: "1",
    chapter: "Laws of Motion",
    chapterId: "7",
    topic: "Newton's Laws",
    classId: "6",
    className: "Class 11",
    description: "Comprehensive explanation of all three Newton's laws with real-world examples and problem-solving techniques",
    duration: 18,
    url: "https://www.youtube.com/watch?v=kKKM8Y-u7ds",
    embedUrl: "https://www.youtube.com/embed/kKKM8Y-u7ds",
    thumbnailUrl: "https://img.youtube.com/vi/kKKM8Y-u7ds/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-15",
    updatedAt: "2024-10-01",
    createdBy: "Admin",
    viewCount: 12580,
    downloadCount: 0,
  },
  {
    id: "v2",
    title: "Thermodynamics - First Law Explained",
    type: "video",
    subject: "Physics",
    subjectId: "1",
    chapter: "Thermodynamics",
    chapterId: "8",
    topic: "First Law",
    classId: "6",
    className: "Class 11",
    description: "Deep dive into the first law of thermodynamics with practical applications",
    duration: 22,
    url: "https://www.youtube.com/watch?v=Xb05CaG7TsQ",
    embedUrl: "https://www.youtube.com/embed/Xb05CaG7TsQ",
    thumbnailUrl: "https://img.youtube.com/vi/Xb05CaG7TsQ/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-20",
    updatedAt: "2024-09-20",
    createdBy: "Admin",
    viewCount: 8420,
    downloadCount: 0,
  },
  {
    id: "v3",
    title: "Introduction to Calculus - Limits and Derivatives",
    type: "video",
    subject: "Mathematics",
    subjectId: "3",
    chapter: "Calculus",
    chapterId: "22",
    topic: "Limits",
    classId: "7",
    className: "Class 12",
    description: "Visual introduction to limits and derivatives with beautiful animations by 3Blue1Brown",
    duration: 17,
    url: "https://www.youtube.com/watch?v=WUvTyaaNkzM",
    embedUrl: "https://www.youtube.com/embed/WUvTyaaNkzM",
    thumbnailUrl: "https://img.youtube.com/vi/WUvTyaaNkzM/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-05",
    updatedAt: "2024-10-05",
    createdBy: "Admin",
    viewCount: 15340,
    downloadCount: 0,
  },
  {
    id: "v4",
    title: "Chemical Bonding - Ionic and Covalent",
    type: "video",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Chemical Bonding",
    chapterId: "26",
    topic: "Types of Bonds",
    classId: "6",
    className: "Class 11",
    description: "Understanding ionic and covalent bonds with molecular visualizations",
    duration: 14,
    url: "https://www.youtube.com/watch?v=QqjcCvzWwww",
    embedUrl: "https://www.youtube.com/embed/QqjcCvzWwww",
    thumbnailUrl: "https://img.youtube.com/vi/QqjcCvzWwww/maxresdefault.jpg",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-10",
    updatedAt: "2024-10-10",
    createdBy: "Admin",
    viewCount: 6780,
    downloadCount: 0,
  },

  // PDF CONTENT (4 items) - Real educational PDFs
  {
    id: "p1",
    title: "NCERT Physics Class 11 - Laws of Motion",
    type: "pdf",
    subject: "Physics",
    subjectId: "1",
    chapter: "Laws of Motion",
    chapterId: "7",
    topic: "Complete Chapter",
    classId: "6",
    className: "Class 11",
    description: "Official NCERT textbook chapter on Laws of Motion with solved examples",
    size: "3.2 MB",
    url: "https://ncert.nic.in/textbook/pdf/keph105.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-08-15",
    updatedAt: "2024-08-15",
    createdBy: "Admin",
    viewCount: 4520,
    downloadCount: 1890,
  },
  {
    id: "p2",
    title: "JEE Main 2024 Question Paper with Solutions",
    type: "pdf",
    subject: "Physics",
    subjectId: "1",
    chapter: "All Chapters",
    chapterId: "0",
    topic: "Previous Year Paper",
    classId: "7",
    className: "Class 12",
    description: "Complete JEE Main 2024 paper with detailed step-by-step solutions",
    size: "8.5 MB",
    url: "https://www.embibe.com/exams/jee-main-question-paper/",
    thumbnailUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-01",
    updatedAt: "2024-09-01",
    createdBy: "Admin",
    viewCount: 18920,
    downloadCount: 7650,
  },
  {
    id: "p3",
    title: "Organic Chemistry - Reaction Mechanisms",
    type: "pdf",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Organic Reactions",
    chapterId: "25",
    topic: "Reaction Mechanisms",
    classId: "7",
    className: "Class 12",
    description: "Comprehensive guide to organic reaction mechanisms with arrow pushing",
    size: "4.1 MB",
    url: "https://ncert.nic.in/textbook/pdf/lech202.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-10",
    updatedAt: "2024-09-10",
    createdBy: "Admin",
    viewCount: 5670,
    downloadCount: 2340,
  },
  {
    id: "p4",
    title: "Mathematics Formula Handbook",
    type: "pdf",
    subject: "Mathematics",
    subjectId: "3",
    chapter: "All Chapters",
    chapterId: "0",
    topic: "Formula Reference",
    classId: "7",
    className: "Class 12",
    description: "Complete formula reference for JEE Mathematics covering all topics",
    size: "2.8 MB",
    url: "https://ncert.nic.in/textbook/pdf/lemh1dd.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-15",
    updatedAt: "2024-09-15",
    createdBy: "Admin",
    viewCount: 9870,
    downloadCount: 4560,
  },

  // PPT CONTENT (3 items) - Google Slides presentations
  {
    id: "ppt1",
    title: "Electromagnetic Induction - Complete Lecture",
    type: "ppt",
    subject: "Physics",
    subjectId: "1",
    chapter: "Electromagnetic Induction",
    chapterId: "11",
    topic: "Faraday's Laws",
    classId: "7",
    className: "Class 12",
    description: "Detailed presentation on electromagnetic induction with animations",
    size: "15.2 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vRjfWw5zHJx6Fwt_cGKWZ0A7x_mK9vXyO5z6rZDjh2rN0sH8yQ6T1jK3qM9xN5wL7aS2vB4nF8dC1eR/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRjfWw5zHJx6Fwt_cGKWZ0A7x_mK9vXyO5z6rZDjh2rN0sH8yQ6T1jK3qM9xN5wL7aS2vB4nF8dC1eR/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-01",
    updatedAt: "2024-10-01",
    createdBy: "Admin",
    viewCount: 3450,
    downloadCount: 890,
  },
  {
    id: "ppt2",
    title: "Periodic Table Trends",
    type: "ppt",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Periodic Classification",
    chapterId: "26",
    topic: "Periodic Trends",
    classId: "6",
    className: "Class 11",
    description: "Visual guide to periodic trends including electronegativity and atomic radius",
    size: "12.8 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vT6xYhJ2sB8F7cK4dN9xL3mP5aR2qW7zX1oY8iU3tE6vF4jH9gN2bM7wQ5sK1cL8dA3nO6pS4rV9eT/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vT6xYhJ2sB8F7cK4dN9xL3mP5aR2qW7zX1oY8iU3tE6vF4jH9gN2bM7wQ5sK1cL8dA3nO6pS4rV9eT/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-05",
    updatedAt: "2024-10-05",
    createdBy: "Admin",
    viewCount: 2890,
    downloadCount: 720,
  },
  {
    id: "ppt3",
    title: "Coordinate Geometry Masterclass",
    type: "ppt",
    subject: "Mathematics",
    subjectId: "3",
    chapter: "Coordinate Geometry",
    chapterId: "20",
    topic: "Straight Lines",
    classId: "6",
    className: "Class 11",
    description: "Complete coordinate geometry concepts with problem-solving strategies",
    size: "9.5 MB",
    url: "https://docs.google.com/presentation/d/e/2PACX-1vR2wA3xY4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU/pub",
    embedUrl: "https://docs.google.com/presentation/d/e/2PACX-1vR2wA3xY4bC5dE6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY6zA7bC8dE9fG0hI1jK2lM3nO4pQ5rS6tU/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400",
    visibility: "public",
    status: "draft",
    createdAt: "2024-10-08",
    updatedAt: "2024-10-08",
    createdBy: "Admin",
    viewCount: 1560,
    downloadCount: 340,
  },

  // IFRAME/INTERACTIVE CONTENT (3 items) - Real simulations
  {
    id: "i1",
    title: "Forces and Motion - Interactive Simulation",
    type: "iframe",
    subject: "Physics",
    subjectId: "1",
    chapter: "Laws of Motion",
    chapterId: "7",
    topic: "Forces",
    classId: "6",
    className: "Class 11",
    description: "PhET interactive simulation for understanding forces, friction, and motion",
    url: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-25",
    updatedAt: "2024-09-25",
    createdBy: "Admin",
    viewCount: 7890,
    downloadCount: 0,
  },
  {
    id: "i2",
    title: "Graphing Calculator - Desmos",
    type: "iframe",
    subject: "Mathematics",
    subjectId: "3",
    chapter: "Functions",
    chapterId: "18",
    topic: "Graph Plotting",
    classId: "6",
    className: "Class 11",
    description: "Interactive graphing calculator for visualizing mathematical functions",
    url: "https://www.desmos.com/calculator",
    embedUrl: "https://www.desmos.com/calculator",
    thumbnailUrl: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-28",
    updatedAt: "2024-09-28",
    createdBy: "Admin",
    viewCount: 11230,
    downloadCount: 0,
  },
  {
    id: "i3",
    title: "Molecule Shapes - 3D Visualization",
    type: "iframe",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Chemical Bonding",
    chapterId: "26",
    topic: "VSEPR Theory",
    classId: "6",
    className: "Class 11",
    description: "PhET simulation for exploring molecular geometry and VSEPR theory",
    url: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/molecule-shapes/latest/molecule-shapes-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-02",
    updatedAt: "2024-10-02",
    createdBy: "Admin",
    viewCount: 5670,
    downloadCount: 0,
  },

  // ANIMATION CONTENT (3 items) - HTML5 animations
  {
    id: "a1",
    title: "Wave Motion Animation",
    type: "animation",
    subject: "Physics",
    subjectId: "1",
    chapter: "Waves",
    chapterId: "8",
    topic: "Wave Properties",
    classId: "6",
    className: "Class 11",
    description: "Interactive HTML5 animation showing transverse and longitudinal waves",
    duration: 5,
    url: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/wave-on-a-string/latest/wave-on-a-string-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-03",
    updatedAt: "2024-10-03",
    createdBy: "Admin",
    viewCount: 4560,
    downloadCount: 0,
  },
  {
    id: "a2",
    title: "Projectile Motion Simulator",
    type: "animation",
    subject: "Physics",
    subjectId: "1",
    chapter: "Motion in a Plane",
    chapterId: "6",
    topic: "Projectile Motion",
    classId: "6",
    className: "Class 11",
    description: "Visualize projectile trajectories with adjustable angle and velocity",
    duration: 8,
    url: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/projectile-motion/latest/projectile-motion-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-04",
    updatedAt: "2024-10-04",
    createdBy: "Admin",
    viewCount: 6780,
    downloadCount: 0,
  },
  {
    id: "a3",
    title: "Balancing Chemical Equations",
    type: "animation",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Chemical Reactions",
    chapterId: "23",
    topic: "Equation Balancing",
    classId: "5",
    className: "Class 10",
    description: "Interactive game to practice balancing chemical equations",
    duration: 10,
    url: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html",
    embedUrl: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations_en.html",
    thumbnailUrl: "https://phet.colorado.edu/sims/html/balancing-chemical-equations/latest/balancing-chemical-equations-600.png",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-06",
    updatedAt: "2024-10-06",
    createdBy: "Admin",
    viewCount: 8920,
    downloadCount: 0,
  },

  // IMAGE CONTENT (3 items) - Educational diagrams
  {
    id: "img1",
    title: "Human Heart Anatomy Diagram",
    type: "image",
    subject: "Biology",
    subjectId: "4",
    chapter: "Circulation",
    chapterId: "0",
    topic: "Heart Structure",
    classId: "5",
    className: "Class 10",
    description: "Detailed labeled diagram of the human heart showing all chambers and valves",
    url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-18",
    updatedAt: "2024-09-18",
    createdBy: "Admin",
    viewCount: 3450,
    downloadCount: 1230,
  },
  {
    id: "img2",
    title: "Electromagnetic Spectrum Chart",
    type: "image",
    subject: "Physics",
    subjectId: "1",
    chapter: "Electromagnetic Waves",
    chapterId: "12",
    topic: "EM Spectrum",
    classId: "7",
    className: "Class 12",
    description: "Complete electromagnetic spectrum from radio waves to gamma rays",
    url: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-22",
    updatedAt: "2024-09-22",
    createdBy: "Admin",
    viewCount: 2890,
    downloadCount: 890,
  },
  {
    id: "img3",
    title: "Periodic Table - High Resolution",
    type: "image",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Periodic Classification",
    chapterId: "26",
    topic: "Periodic Table",
    classId: "6",
    className: "Class 11",
    description: "High-resolution periodic table with electron configurations",
    url: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=1200",
    thumbnailUrl: "https://images.unsplash.com/photo-1628863353691-0071c8c1874c?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-09-25",
    updatedAt: "2024-09-25",
    createdBy: "Admin",
    viewCount: 5670,
    downloadCount: 2340,
  },

  // AUDIO CONTENT (2 items) - Educational audio
  {
    id: "aud1",
    title: "Physics Concepts Podcast - Relativity",
    type: "audio",
    subject: "Physics",
    subjectId: "1",
    chapter: "Modern Physics",
    chapterId: "0",
    topic: "Special Relativity",
    classId: "7",
    className: "Class 12",
    description: "Audio explanation of Einstein's special theory of relativity",
    duration: 25,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400",
    visibility: "public",
    status: "published",
    createdAt: "2024-10-07",
    updatedAt: "2024-10-07",
    createdBy: "Admin",
    viewCount: 1890,
    downloadCount: 560,
  },
  {
    id: "aud2",
    title: "Chemistry Mnemonics - Audio Guide",
    type: "audio",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "All Chapters",
    chapterId: "0",
    topic: "Memory Techniques",
    classId: "6",
    className: "Class 11",
    description: "Audio mnemonics for remembering chemistry concepts and formulas",
    duration: 18,
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    thumbnailUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    visibility: "public",
    status: "draft",
    createdAt: "2024-10-09",
    updatedAt: "2024-10-09",
    createdBy: "Admin",
    viewCount: 980,
    downloadCount: 340,
  },

  // SCORM CONTENT (2 items) - Learning packages
  {
    id: "scorm1",
    title: "Complete Physics Course - Module 1",
    type: "scorm",
    subject: "Physics",
    subjectId: "1",
    chapter: "Mechanics",
    chapterId: "7",
    topic: "Complete Module",
    classId: "6",
    className: "Class 11",
    description: "SCORM-compliant learning package for mechanics fundamentals",
    size: "45 MB",
    url: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=400",
    visibility: "restricted",
    status: "published",
    createdAt: "2024-10-10",
    updatedAt: "2024-10-10",
    createdBy: "Admin",
    viewCount: 2340,
    downloadCount: 890,
  },
  {
    id: "scorm2",
    title: "Chemistry Lab Virtual Experience",
    type: "scorm",
    subject: "Chemistry",
    subjectId: "2",
    chapter: "Practical Chemistry",
    chapterId: "0",
    topic: "Virtual Labs",
    classId: "6",
    className: "Class 11",
    description: "Interactive virtual chemistry lab with experiments and assessments",
    size: "120 MB",
    url: "#",
    thumbnailUrl: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400",
    visibility: "restricted",
    status: "published",
    createdAt: "2024-10-12",
    updatedAt: "2024-10-12",
    createdBy: "Admin",
    viewCount: 1560,
    downloadCount: 450,
  },
];

// Institute Tiers - Feature Categories
export type FeatureCategory = "content" | "questions" | "exams" | "analytics" | "customization" | "support";
export type FeatureType = "boolean" | "limit" | "value";

export interface TierFeature {
  id: string;
  name: string;
  category: FeatureCategory;
  type: FeatureType;
  included: boolean;
  value?: string | number;
}

export interface InstituteTier {
  id: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  maxStudents: number;
  maxTeachers: number;
  color: string;
  features: TierFeature[];
}

// Master list of all features for tier management
export const masterFeatureList: Omit<TierFeature, "included" | "value">[] = [
  // Content Management
  { id: "content_library", name: "Content Library", category: "content", type: "limit" },
  { id: "video_storage", name: "Video Storage", category: "content", type: "limit" },
  { id: "pdf_notes", name: "PDF Notes Access", category: "content", type: "boolean" },
  { id: "unlimited_downloads", name: "Unlimited Downloads", category: "content", type: "boolean" },
  
  // Question Bank
  { id: "question_bank", name: "Question Bank Access", category: "questions", type: "value" },
  { id: "ai_generator", name: "AI Question Generator", category: "questions", type: "limit" },
  { id: "grand_test_bank", name: "Grand Test Bank", category: "questions", type: "boolean" },
  
  // Exams & Assessments
  { id: "live_exams", name: "Live Assessments", category: "exams", type: "value" },
  { id: "exam_recording", name: "Exam Recording", category: "exams", type: "boolean" },
  { id: "previous_papers", name: "Previous Year Papers", category: "exams", type: "value" },
  { id: "proctoring", name: "AI Proctoring", category: "exams", type: "boolean" },
  
  // Analytics & Reports
  { id: "analytics", name: "Analytics Dashboard", category: "analytics", type: "value" },
  { id: "student_reports", name: "Student Performance Reports", category: "analytics", type: "value" },
  { id: "export_reports", name: "Export Reports", category: "analytics", type: "boolean" },
  
  // Customization
  { id: "custom_branding", name: "Custom Branding", category: "customization", type: "value" },
  { id: "white_label", name: "White-labeling", category: "customization", type: "boolean" },
  { id: "api_access", name: "API Access", category: "customization", type: "boolean" },
  
  // Support
  { id: "support", name: "Support", category: "support", type: "value" },
  { id: "dedicated_manager", name: "Dedicated Account Manager", category: "support", type: "boolean" },
  { id: "training", name: "Training Sessions", category: "support", type: "limit" },
];

export const featureCategoryLabels: Record<FeatureCategory, string> = {
  content: "Content Management",
  questions: "Question Bank",
  exams: "Exams & Assessments",
  analytics: "Analytics & Reports",
  customization: "Customization",
  support: "Support",
};

export const featureCategoryIcons: Record<FeatureCategory, string> = {
  content: "library",
  questions: "help-circle",
  exams: "clipboard-list",
  analytics: "bar-chart-3",
  customization: "palette",
  support: "headphones",
};

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
      { id: "content_library", name: "Content Library", category: "content", type: "limit", included: true, value: "50 items" },
      { id: "video_storage", name: "Video Storage", category: "content", type: "limit", included: false },
      { id: "pdf_notes", name: "PDF Notes Access", category: "content", type: "boolean", included: true },
      { id: "unlimited_downloads", name: "Unlimited Downloads", category: "content", type: "boolean", included: false },
      { id: "question_bank", name: "Question Bank Access", category: "questions", type: "value", included: true, value: "Basic" },
      { id: "ai_generator", name: "AI Question Generator", category: "questions", type: "limit", included: false },
      { id: "grand_test_bank", name: "Grand Test Bank", category: "questions", type: "boolean", included: false },
      { id: "live_exams", name: "Live Assessments", category: "exams", type: "value", included: false },
      { id: "exam_recording", name: "Exam Recording", category: "exams", type: "boolean", included: false },
      { id: "previous_papers", name: "Previous Year Papers", category: "exams", type: "value", included: true, value: "Limited" },
      { id: "proctoring", name: "AI Proctoring", category: "exams", type: "boolean", included: false },
      { id: "analytics", name: "Analytics Dashboard", category: "analytics", type: "value", included: true, value: "Basic" },
      { id: "student_reports", name: "Student Performance Reports", category: "analytics", type: "value", included: true, value: "Weekly" },
      { id: "export_reports", name: "Export Reports", category: "analytics", type: "boolean", included: false },
      { id: "custom_branding", name: "Custom Branding", category: "customization", type: "value", included: false },
      { id: "white_label", name: "White-labeling", category: "customization", type: "boolean", included: false },
      { id: "api_access", name: "API Access", category: "customization", type: "boolean", included: false },
      { id: "support", name: "Support", category: "support", type: "value", included: true, value: "Email" },
      { id: "dedicated_manager", name: "Dedicated Account Manager", category: "support", type: "boolean", included: false },
      { id: "training", name: "Training Sessions", category: "support", type: "limit", included: false },
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
      { id: "content_library", name: "Content Library", category: "content", type: "limit", included: true, value: "500 items" },
      { id: "video_storage", name: "Video Storage", category: "content", type: "limit", included: true, value: "10 GB" },
      { id: "pdf_notes", name: "PDF Notes Access", category: "content", type: "boolean", included: true },
      { id: "unlimited_downloads", name: "Unlimited Downloads", category: "content", type: "boolean", included: false },
      { id: "question_bank", name: "Question Bank Access", category: "questions", type: "value", included: true, value: "Full" },
      { id: "ai_generator", name: "AI Question Generator", category: "questions", type: "limit", included: true, value: "100/month" },
      { id: "grand_test_bank", name: "Grand Test Bank", category: "questions", type: "boolean", included: false },
      { id: "live_exams", name: "Live Assessments", category: "exams", type: "value", included: true, value: "Standard" },
      { id: "exam_recording", name: "Exam Recording", category: "exams", type: "boolean", included: false },
      { id: "previous_papers", name: "Previous Year Papers", category: "exams", type: "value", included: true, value: "Full" },
      { id: "proctoring", name: "AI Proctoring", category: "exams", type: "boolean", included: false },
      { id: "analytics", name: "Analytics Dashboard", category: "analytics", type: "value", included: true, value: "Advanced" },
      { id: "student_reports", name: "Student Performance Reports", category: "analytics", type: "value", included: true, value: "Daily" },
      { id: "export_reports", name: "Export Reports", category: "analytics", type: "boolean", included: true },
      { id: "custom_branding", name: "Custom Branding", category: "customization", type: "value", included: true, value: "Basic" },
      { id: "white_label", name: "White-labeling", category: "customization", type: "boolean", included: false },
      { id: "api_access", name: "API Access", category: "customization", type: "boolean", included: false },
      { id: "support", name: "Support", category: "support", type: "value", included: true, value: "Priority" },
      { id: "dedicated_manager", name: "Dedicated Account Manager", category: "support", type: "boolean", included: false },
      { id: "training", name: "Training Sessions", category: "support", type: "limit", included: true, value: "2 sessions" },
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
      { id: "content_library", name: "Content Library", category: "content", type: "limit", included: true, value: "Unlimited" },
      { id: "video_storage", name: "Video Storage", category: "content", type: "limit", included: true, value: "Unlimited" },
      { id: "pdf_notes", name: "PDF Notes Access", category: "content", type: "boolean", included: true },
      { id: "unlimited_downloads", name: "Unlimited Downloads", category: "content", type: "boolean", included: true },
      { id: "question_bank", name: "Question Bank Access", category: "questions", type: "value", included: true, value: "Full + Grand" },
      { id: "ai_generator", name: "AI Question Generator", category: "questions", type: "limit", included: true, value: "Unlimited" },
      { id: "grand_test_bank", name: "Grand Test Bank", category: "questions", type: "boolean", included: true },
      { id: "live_exams", name: "Live Assessments", category: "exams", type: "value", included: true, value: "Advanced + Recording" },
      { id: "exam_recording", name: "Exam Recording", category: "exams", type: "boolean", included: true },
      { id: "previous_papers", name: "Previous Year Papers", category: "exams", type: "value", included: true, value: "Full + Analysis" },
      { id: "proctoring", name: "AI Proctoring", category: "exams", type: "boolean", included: true },
      { id: "analytics", name: "Analytics Dashboard", category: "analytics", type: "value", included: true, value: "Full Dashboard" },
      { id: "student_reports", name: "Student Performance Reports", category: "analytics", type: "value", included: true, value: "Real-time" },
      { id: "export_reports", name: "Export Reports", category: "analytics", type: "boolean", included: true },
      { id: "custom_branding", name: "Custom Branding", category: "customization", type: "value", included: true, value: "Full" },
      { id: "white_label", name: "White-labeling", category: "customization", type: "boolean", included: true },
      { id: "api_access", name: "API Access", category: "customization", type: "boolean", included: true },
      { id: "support", name: "Support", category: "support", type: "value", included: true, value: "24/7 Dedicated" },
      { id: "dedicated_manager", name: "Dedicated Account Manager", category: "support", type: "boolean", included: true },
      { id: "training", name: "Training Sessions", category: "support", type: "limit", included: true, value: "Unlimited" },
    ],
  },
];