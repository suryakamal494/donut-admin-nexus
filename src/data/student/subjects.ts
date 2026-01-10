// Student Subjects Data - Completely separate from other modules

export type SubjectStatus = 
  | "in-progress" 
  | "just-started" 
  | "doing-well" 
  | "needs-attention" 
  | "almost-done" 
  | "on-track";

export interface StudentSubject {
  id: string;
  name: string;
  icon: string;
  progress: number;
  status: SubjectStatus;
  color: string;
  chaptersTotal: number;
  chaptersCompleted: number;
}

export const studentSubjects: StudentSubject[] = [
  { 
    id: "math", 
    name: "Mathematics", 
    icon: "Calculator", 
    progress: 45, 
    status: "in-progress", 
    color: "blue",
    chaptersTotal: 6,
    chaptersCompleted: 3
  },
  { 
    id: "physics", 
    name: "Physics", 
    icon: "Atom", 
    progress: 15, 
    status: "just-started", 
    color: "purple",
    chaptersTotal: 5,
    chaptersCompleted: 1
  },
  { 
    id: "chemistry", 
    name: "Chemistry", 
    icon: "FlaskConical", 
    progress: 78, 
    status: "doing-well", 
    color: "green",
    chaptersTotal: 5,
    chaptersCompleted: 4
  },
  { 
    id: "biology", 
    name: "Biology", 
    icon: "Leaf", 
    progress: 25, 
    status: "needs-attention", 
    color: "red",
    chaptersTotal: 6,
    chaptersCompleted: 2
  },
  { 
    id: "english", 
    name: "English", 
    icon: "BookOpen", 
    progress: 88, 
    status: "almost-done", 
    color: "amber",
    chaptersTotal: 4,
    chaptersCompleted: 4
  },
  { 
    id: "cs", 
    name: "Computer Science", 
    icon: "Code", 
    progress: 55, 
    status: "on-track", 
    color: "cyan",
    chaptersTotal: 5,
    chaptersCompleted: 3
  },
];
