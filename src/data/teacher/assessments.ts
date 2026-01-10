// Teacher Assessments Mock Data
import { TeacherAssessment } from './types';
import { formatDate, today } from './helpers';

// Sample assessments
export const teacherAssessments: TeacherAssessment[] = [
  {
    id: "assess-1",
    title: "Laws of Motion Quiz",
    type: "quiz",
    subject: "Physics",
    batchId: "batch-10a",
    batchName: "10A",
    className: "Class 10",
    questionCount: 10,
    duration: 15,
    status: "scheduled",
    scheduledFor: formatDate(today),
    createdAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "assess-2",
    title: "Electromagnetic Induction Test",
    type: "test",
    subject: "Physics",
    batchId: "batch-11a",
    batchName: "11A",
    className: "Class 11",
    questionCount: 25,
    duration: 45,
    status: "draft",
    createdAt: "2024-01-04T14:00:00Z",
  },
];
