// Lesson Bundles - Bundle Data

import type { LessonBundle } from "./types";

export const lessonBundles: LessonBundle[] = [
  // Math - Chapter 1: Number Systems
  {
    id: "bundle-math-ch1-1",
    chapterId: "math-ch1",
    title: "Real Numbers Introduction",
    description: "Understanding the number system hierarchy and properties of real numbers",
    teacherName: "Mrs. Sharma",
    date: "2024-01-15",
    duration: "45 min",
    isViewed: true,
    contentSummary: [
      { type: "video", count: 2 },
      { type: "pdf", count: 1 },
      { type: "quiz", count: 1 },
    ],
    hasScreenshots: true,
  },
  {
    id: "bundle-math-ch1-2",
    chapterId: "math-ch1",
    title: "Rational & Irrational Numbers",
    description: "Deep dive into properties and examples of rational and irrational numbers",
    teacherName: "Mrs. Sharma",
    date: "2024-01-17",
    duration: "50 min",
    isViewed: true,
    contentSummary: [
      { type: "video", count: 1 },
      { type: "pdf", count: 2 },
      { type: "simulation", count: 1 },
    ],
    hasScreenshots: false,
  },
  {
    id: "bundle-math-ch1-3",
    chapterId: "math-ch1",
    title: "Euclid's Division Lemma",
    description: "Algorithm for finding HCF and its applications",
    teacherName: "Mrs. Sharma",
    date: "2024-01-19",
    duration: "40 min",
    isViewed: false,
    contentSummary: [
      { type: "video", count: 1 },
      { type: "pdf", count: 1 },
      { type: "quiz", count: 2 },
    ],
    hasScreenshots: true,
  },

  // Physics - Chapter 1: Light Reflection
  {
    id: "bundle-physics-ch1-1",
    chapterId: "physics-ch1",
    title: "Laws of Reflection",
    description: "Understanding how light reflects from plane surfaces",
    teacherName: "Mr. Verma",
    date: "2024-01-14",
    duration: "55 min",
    isViewed: true,
    contentSummary: [
      { type: "video", count: 2 },
      { type: "simulation", count: 1 },
      { type: "pdf", count: 1 },
    ],
    hasScreenshots: true,
  },
  {
    id: "bundle-physics-ch1-2",
    chapterId: "physics-ch1",
    title: "Spherical Mirrors",
    description: "Concave and convex mirrors - image formation and ray diagrams",
    teacherName: "Mr. Verma",
    date: "2024-01-16",
    duration: "60 min",
    isViewed: false,
    contentSummary: [
      { type: "video", count: 3 },
      { type: "pdf", count: 2 },
      { type: "quiz", count: 1 },
    ],
    hasScreenshots: false,
  },

  // Chemistry - Chapter 1: Chemical Reactions
  {
    id: "bundle-chem-ch1-1",
    chapterId: "chem-ch1",
    title: "Types of Chemical Reactions",
    description: "Combination, decomposition, displacement reactions with examples",
    teacherName: "Dr. Patel",
    date: "2024-01-13",
    duration: "50 min",
    isViewed: true,
    contentSummary: [
      { type: "video", count: 2 },
      { type: "pdf", count: 1 },
      { type: "simulation", count: 2 },
    ],
    hasScreenshots: true,
  },
];
