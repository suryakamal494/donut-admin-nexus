// Teacher Homework Mock Data
import { TeacherHomework } from './types';
import { formatDate, today } from './helpers';

// Sample homework
export const teacherHomework: TeacherHomework[] = [
  {
    id: "hw-1",
    title: "Practice Problems - Newton's Laws",
    subject: "Physics",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    dueDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)),
    assignedDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    status: "assigned",
    submissionCount: 12,
    totalStudents: 35,
    linkedLessonPlanId: "lp-1",
  },
  {
    id: "hw-2",
    title: "Numerical Worksheet - Motion",
    subject: "Physics",
    batchId: "batch-10b",
    batchName: "10B",
    className: "Class 10",
    dueDate: formatDate(new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000)),
    assignedDate: formatDate(new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)),
    status: "overdue",
    submissionCount: 28,
    totalStudents: 32,
  },
];
