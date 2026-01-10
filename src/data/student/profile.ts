// Student Profile Data - Completely separate from other modules

export interface StudentProfile {
  id: string;
  name: string;
  grade: string;
  streak: number;
  avatar: string | null;
}

export const studentProfile: StudentProfile = {
  id: "student-001",
  name: "Arjun Sharma",
  grade: "Class 10",
  streak: 12,
  avatar: null,
};
