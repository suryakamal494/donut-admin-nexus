// Lesson Bundles - Helper Functions

import type { LessonBundle, BundleContentItem, TeacherScreenshot, HomeworkItem, AIPathItem, ChallengeItem } from "./types";
import { lessonBundles } from "./bundles";
import { bundleContentItems, teacherScreenshots } from "./content";
import { homeworkItems, aiPathItems, challengeItems } from "./learning";

// Get lesson bundles for a specific chapter
export const getLessonBundlesByChapter = (chapterId: string): LessonBundle[] => {
  return lessonBundles.filter(bundle => bundle.chapterId === chapterId);
};

// Get a specific lesson bundle by ID
export const getLessonBundleById = (bundleId: string): LessonBundle | undefined => {
  return lessonBundles.find(bundle => bundle.id === bundleId);
};

// Get content items for a specific bundle
export const getContentByBundle = (bundleId: string): BundleContentItem[] => {
  return bundleContentItems
    .filter(item => item.bundleId === bundleId)
    .sort((a, b) => a.order - b.order);
};

// Get a specific content item by ID
export const getContentById = (contentId: string): BundleContentItem | undefined => {
  return bundleContentItems.find(item => item.id === contentId);
};

// Get screenshots for a specific bundle
export const getScreenshotsByBundle = (bundleId: string): TeacherScreenshot[] => {
  return teacherScreenshots.filter(ss => ss.bundleId === bundleId);
};

// Get homework for a specific chapter
export const getHomeworkByChapter = (chapterId: string): HomeworkItem[] => {
  return homeworkItems.filter(hw => hw.chapterId === chapterId);
};

// Get AI path items for a specific chapter
export const getAIPathByChapter = (chapterId: string): AIPathItem[] => {
  return aiPathItems.filter(item => item.chapterId === chapterId);
};

// Get challenges for a specific chapter
export const getChallengesByChapter = (chapterId: string): ChallengeItem[] => {
  return challengeItems.filter(c => c.chapterId === chapterId);
};
