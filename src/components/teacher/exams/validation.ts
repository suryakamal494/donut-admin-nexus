import { z } from "zod";

// Exam Name Validation
export const examNameSchema = z
  .string()
  .trim()
  .min(1, { message: "Exam name is required" })
  .max(100, { message: "Exam name must be less than 100 characters" })
  .regex(/^[a-zA-Z0-9\s\-_.()]+$/, { 
    message: "Exam name can only contain letters, numbers, spaces, and basic punctuation" 
  });

// Subject Selection Validation
export const subjectsSchema = z
  .array(z.string())
  .min(1, { message: "Please select at least one subject" });

// Custom Config Validation
export const customConfigSchema = z.object({
  totalQuestions: z
    .number()
    .min(5, { message: "Minimum 5 questions required" })
    .max(200, { message: "Maximum 200 questions allowed" }),
  duration: z
    .number()
    .min(5, { message: "Minimum 5 minutes required" })
    .max(300, { message: "Maximum 5 hours allowed" }),
  marksPerQuestion: z
    .number()
    .min(1, { message: "Minimum 1 mark per question" })
    .max(10, { message: "Maximum 10 marks per question" }),
  negativeMarks: z
    .number()
    .min(0, { message: "Negative marks cannot be negative" })
    .max(10, { message: "Maximum 10 negative marks" }),
});

// Creation Method Validation
export const aiConfigSchema = z.object({
  easyPercent: z.number().min(0).max(100),
  mediumPercent: z.number().min(0).max(100),
  hardPercent: z.number().min(0).max(100),
  selectedCognitiveTypes: z
    .array(z.string())
    .min(1, { message: "Select at least one question type" }),
}).refine(data => data.easyPercent + data.mediumPercent + data.hardPercent === 100, {
  message: "Difficulty percentages must sum to 100%",
});

export const pdfUploadSchema = z.object({
  file: z.custom<File>((val) => val instanceof File, { message: "Please upload a PDF file" })
    .refine((file) => file.type === "application/pdf", { message: "Only PDF files are allowed" })
    .refine((file) => file.size <= 50 * 1024 * 1024, { message: "File must be less than 50MB" }),
});

export const questionBankSchema = z.object({
  selectedQuestionIds: z
    .array(z.string())
    .min(1, { message: "Select at least one question" }),
});

// Schedule Validation
export const scheduleSchema = z.object({
  date: z.date().optional(),
  time: z.string().optional(),
}).refine(
  (data) => {
    if (data.date && data.time) {
      const scheduled = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      scheduled.setHours(hours, minutes);
      return scheduled > new Date();
    }
    return true;
  },
  { message: "Scheduled time must be in the future" }
);

// Full Exam Creation Schema
export const examCreationSchema = z.object({
  examName: examNameSchema,
  subjects: subjectsSchema,
  pattern: z.enum(["custom", "jee_main", "jee_advanced", "neet"]),
  uiType: z.enum(["platform", "real_exam"]),
});

// Validation helper types
export type ExamNameError = z.inferFlattenedErrors<typeof examNameSchema>;
export type SubjectsError = z.inferFlattenedErrors<typeof subjectsSchema>;
export type CustomConfigError = z.inferFlattenedErrors<typeof customConfigSchema>;

// Validation helper functions
export const validateExamName = (name: string) => {
  const result = examNameSchema.safeParse(name);
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || "Invalid exam name",
  };
};

export const validateSubjects = (subjects: string[]) => {
  const result = subjectsSchema.safeParse(subjects);
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || "Invalid subjects",
  };
};

export const validateCustomConfig = (config: z.infer<typeof customConfigSchema>) => {
  const result = customConfigSchema.safeParse(config);
  return {
    isValid: result.success,
    errors: result.success ? {} : result.error.flatten().fieldErrors,
  };
};
