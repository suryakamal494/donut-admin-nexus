// Student Test Questions Data
// Comprehensive mock data for all 9 question types

export type QuestionType =
  | "mcq_single"
  | "mcq_multiple"
  | "integer"
  | "fill_blank"
  | "matrix_match"
  | "assertion_reasoning"
  | "paragraph"
  | "short_answer"
  | "long_answer";

export type QuestionStatus =
  | "not_visited"
  | "not_answered"
  | "answered"
  | "marked_review"
  | "answered_marked";

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Only for answer checking
}

export interface MatrixColumn {
  id: string;
  text: string;
}

export interface MatrixRow {
  id: string;
  text: string;
  correctMatch?: string; // Column ID
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  subject: string;
  chapter?: string;
  topic?: string;
  text: string;
  imageUrl?: string;
  marks: number;
  negativeMarks?: number;
  difficulty?: "easy" | "medium" | "hard";
  status: QuestionStatus;
  timeSpent?: number; // seconds
  sectionId?: string;
}

export interface MCQSingleQuestion extends BaseQuestion {
  type: "mcq_single";
  options: QuestionOption[];
  selectedOption?: string;
}

export interface MCQMultipleQuestion extends BaseQuestion {
  type: "mcq_multiple";
  options: QuestionOption[];
  selectedOptions?: string[];
  partialMarking?: boolean;
}

export interface IntegerQuestion extends BaseQuestion {
  type: "integer";
  minValue?: number;
  maxValue?: number;
  correctAnswer?: number;
  enteredValue?: number;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: "fill_blank";
  blanks: { id: string; correctAnswer?: string; enteredAnswer?: string }[];
}

export interface MatrixMatchQuestion extends BaseQuestion {
  type: "matrix_match";
  rows: MatrixRow[];
  columns: MatrixColumn[];
  matches?: Record<string, string>; // rowId -> columnId
}

export interface AssertionReasoningQuestion extends BaseQuestion {
  type: "assertion_reasoning";
  assertion: string;
  reason: string;
  options: QuestionOption[];
  selectedOption?: string;
}

export interface ParagraphQuestion extends BaseQuestion {
  type: "paragraph";
  paragraphId: string;
  paragraphText: string;
  options?: QuestionOption[];
  selectedOption?: string;
}

export interface ShortAnswerQuestion extends BaseQuestion {
  type: "short_answer";
  wordLimit?: number;
  answer?: string;
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: "long_answer";
  wordLimit?: number;
  answer?: string;
}

export type TestQuestion =
  | MCQSingleQuestion
  | MCQMultipleQuestion
  | IntegerQuestion
  | FillBlankQuestion
  | MatrixMatchQuestion
  | AssertionReasoningQuestion
  | ParagraphQuestion
  | ShortAnswerQuestion
  | LongAnswerQuestion;

// Section structure for multi-section tests
export interface TestSection {
  id: string;
  name: string;
  subject: string;
  questionCount: number;
  maxQuestions?: number; // For optional sections
  isOptional?: boolean;
  timeLimit?: number; // Section-specific time in minutes
  instructions?: string;
}

// Complete test structure
export interface TestStructure {
  id: string;
  name: string;
  pattern: string;
  totalQuestions: number;
  totalMarks: number;
  duration: number;
  sections: TestSection[];
  questions: TestQuestion[];
  allowBackNavigation: boolean;
  allowMarkForReview: boolean;
  showCalculator: boolean;
}

// ============================================
// SAMPLE QUESTIONS - All 9 Types
// ============================================

export const sampleMCQSingle: MCQSingleQuestion[] = [
  {
    id: "q1",
    type: "mcq_single",
    subject: "physics",
    chapter: "Laws of Motion",
    topic: "Newton's Laws",
    text: "A block of mass 5 kg is placed on a frictionless surface. A force of 20 N is applied horizontally. What is the acceleration of the block?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "2 m/s²" },
      { id: "b", text: "4 m/s²", isCorrect: true },
      { id: "c", text: "5 m/s²" },
      { id: "d", text: "10 m/s²" },
    ],
  },
  {
    id: "q2",
    type: "mcq_single",
    subject: "physics",
    chapter: "Laws of Motion",
    topic: "Friction",
    text: "The coefficient of static friction between two surfaces is 0.5. If a block of mass 10 kg is placed on an inclined plane at 30°, will it slide?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    status: "not_visited",
    options: [
      { id: "a", text: "Yes, it will slide", isCorrect: true },
      { id: "b", text: "No, it will remain stationary" },
      { id: "c", text: "It depends on the surface area" },
      { id: "d", text: "Cannot be determined" },
    ],
  },
  {
    id: "q3",
    type: "mcq_single",
    subject: "chemistry",
    chapter: "Atomic Structure",
    topic: "Quantum Numbers",
    text: "Which of the following sets of quantum numbers is not possible for an electron?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    status: "not_visited",
    options: [
      { id: "a", text: "n=3, l=2, m=1, s=+½" },
      { id: "b", text: "n=2, l=2, m=0, s=-½", isCorrect: true },
      { id: "c", text: "n=4, l=0, m=0, s=+½" },
      { id: "d", text: "n=3, l=1, m=-1, s=-½" },
    ],
  },
  {
    id: "q4",
    type: "mcq_single",
    subject: "mathematics",
    chapter: "Quadratic Equations",
    topic: "Roots",
    text: "If α and β are roots of x² - 5x + 6 = 0, find the value of α² + β².",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "11" },
      { id: "b", text: "13", isCorrect: true },
      { id: "c", text: "25" },
      { id: "d", text: "36" },
    ],
  },
  {
    id: "q5",
    type: "mcq_single",
    subject: "biology",
    chapter: "Cell Biology",
    topic: "Cell Organelles",
    text: "Which organelle is known as the 'powerhouse of the cell'?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "Nucleus" },
      { id: "b", text: "Ribosome" },
      { id: "c", text: "Mitochondria", isCorrect: true },
      { id: "d", text: "Golgi apparatus" },
    ],
  },
];

export const sampleMCQMultiple: MCQMultipleQuestion[] = [
  {
    id: "q6",
    type: "mcq_multiple",
    subject: "physics",
    chapter: "Thermodynamics",
    topic: "Laws of Thermodynamics",
    text: "Which of the following statements about entropy are correct? (Select all that apply)",
    marks: 4,
    negativeMarks: 2,
    difficulty: "hard",
    status: "not_visited",
    partialMarking: true,
    options: [
      { id: "a", text: "Entropy is a state function", isCorrect: true },
      { id: "b", text: "Entropy always increases in an isolated system", isCorrect: true },
      { id: "c", text: "Entropy can be negative" },
      { id: "d", text: "Entropy has units of J/K", isCorrect: true },
    ],
  },
  {
    id: "q7",
    type: "mcq_multiple",
    subject: "chemistry",
    chapter: "Chemical Bonding",
    topic: "Hybridization",
    text: "Which of the following molecules exhibit sp³ hybridization? (Select all that apply)",
    marks: 4,
    negativeMarks: 2,
    difficulty: "medium",
    status: "not_visited",
    partialMarking: true,
    options: [
      { id: "a", text: "CH₄", isCorrect: true },
      { id: "b", text: "NH₃", isCorrect: true },
      { id: "c", text: "BF₃" },
      { id: "d", text: "H₂O", isCorrect: true },
    ],
  },
  {
    id: "q8",
    type: "mcq_multiple",
    subject: "mathematics",
    chapter: "Calculus",
    topic: "Limits",
    text: "For which values does the limit exist at x = 0? (Select all that apply)",
    marks: 4,
    negativeMarks: 2,
    difficulty: "hard",
    status: "not_visited",
    partialMarking: true,
    options: [
      { id: "a", text: "f(x) = sin(x)/x", isCorrect: true },
      { id: "b", text: "f(x) = 1/x" },
      { id: "c", text: "f(x) = |x|/x" },
      { id: "d", text: "f(x) = x·sin(1/x)", isCorrect: true },
    ],
  },
];

export const sampleIntegerQuestions: IntegerQuestion[] = [
  {
    id: "q9",
    type: "integer",
    subject: "physics",
    chapter: "Kinematics",
    topic: "Projectile Motion",
    text: "A ball is thrown at 45° with speed 20 m/s. Find the maximum height reached (in meters). Take g = 10 m/s².",
    marks: 4,
    difficulty: "medium",
    status: "not_visited",
    minValue: 0,
    maxValue: 999,
    correctAnswer: 10,
  },
  {
    id: "q10",
    type: "integer",
    subject: "chemistry",
    chapter: "Mole Concept",
    topic: "Molecular Mass",
    text: "Calculate the number of moles in 180 grams of water (H₂O). Enter as a whole number.",
    marks: 4,
    difficulty: "easy",
    status: "not_visited",
    minValue: 0,
    maxValue: 999,
    correctAnswer: 10,
  },
  {
    id: "q11",
    type: "integer",
    subject: "mathematics",
    chapter: "Permutations",
    topic: "Factorial",
    text: "Find the number of ways to arrange 5 different books on a shelf.",
    marks: 4,
    difficulty: "easy",
    status: "not_visited",
    minValue: 0,
    maxValue: 999,
    correctAnswer: 120,
  },
];

export const sampleFillBlanks: FillBlankQuestion[] = [
  {
    id: "q12",
    type: "fill_blank",
    subject: "physics",
    chapter: "Units",
    topic: "SI Units",
    text: "The SI unit of force is _____ and the SI unit of work is _____.",
    marks: 4,
    difficulty: "easy",
    status: "not_visited",
    blanks: [
      { id: "b1", correctAnswer: "Newton" },
      { id: "b2", correctAnswer: "Joule" },
    ],
  },
  {
    id: "q13",
    type: "fill_blank",
    subject: "chemistry",
    chapter: "Periodic Table",
    topic: "Elements",
    text: "The atomic number of Carbon is _____ and its electronic configuration is _____.",
    marks: 4,
    difficulty: "easy",
    status: "not_visited",
    blanks: [
      { id: "b1", correctAnswer: "6" },
      { id: "b2", correctAnswer: "2,4" },
    ],
  },
];

export const sampleMatrixMatch: MatrixMatchQuestion[] = [
  {
    id: "q14",
    type: "matrix_match",
    subject: "physics",
    chapter: "Mechanics",
    topic: "Physical Quantities",
    text: "Match the following physical quantities with their dimensions:",
    marks: 4,
    negativeMarks: 2,
    difficulty: "medium",
    status: "not_visited",
    rows: [
      { id: "r1", text: "Force", correctMatch: "c1" },
      { id: "r2", text: "Energy", correctMatch: "c2" },
      { id: "r3", text: "Power", correctMatch: "c3" },
      { id: "r4", text: "Momentum", correctMatch: "c4" },
    ],
    columns: [
      { id: "c1", text: "[MLT⁻²]" },
      { id: "c2", text: "[ML²T⁻²]" },
      { id: "c3", text: "[ML²T⁻³]" },
      { id: "c4", text: "[MLT⁻¹]" },
    ],
  },
  {
    id: "q15",
    type: "matrix_match",
    subject: "chemistry",
    chapter: "Organic Chemistry",
    topic: "Functional Groups",
    text: "Match the organic compounds with their functional groups:",
    marks: 4,
    negativeMarks: 2,
    difficulty: "medium",
    status: "not_visited",
    rows: [
      { id: "r1", text: "Ethanol", correctMatch: "c1" },
      { id: "r2", text: "Acetic acid", correctMatch: "c2" },
      { id: "r3", text: "Acetone", correctMatch: "c3" },
      { id: "r4", text: "Ethanal", correctMatch: "c4" },
    ],
    columns: [
      { id: "c1", text: "Hydroxyl (-OH)" },
      { id: "c2", text: "Carboxyl (-COOH)" },
      { id: "c3", text: "Ketone (C=O)" },
      { id: "c4", text: "Aldehyde (-CHO)" },
    ],
  },
];

export const sampleAssertionReasoning: AssertionReasoningQuestion[] = [
  {
    id: "q16",
    type: "assertion_reasoning",
    subject: "physics",
    chapter: "Electrostatics",
    topic: "Electric Field",
    text: "Choose the correct option based on the Assertion and Reason given below:",
    assertion: "Electric field inside a conductor is always zero in electrostatic equilibrium.",
    reason: "Charges in a conductor redistribute themselves on the surface.",
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    status: "not_visited",
    options: [
      { id: "a", text: "Both A and R are true, and R is the correct explanation of A", isCorrect: true },
      { id: "b", text: "Both A and R are true, but R is not the correct explanation of A" },
      { id: "c", text: "A is true but R is false" },
      { id: "d", text: "A is false but R is true" },
    ],
  },
  {
    id: "q17",
    type: "assertion_reasoning",
    subject: "biology",
    chapter: "Genetics",
    topic: "DNA Replication",
    text: "Choose the correct option based on the Assertion and Reason given below:",
    assertion: "DNA replication is called semi-conservative.",
    reason: "Each new DNA molecule has one old strand and one new strand.",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "Both A and R are true, and R is the correct explanation of A", isCorrect: true },
      { id: "b", text: "Both A and R are true, but R is not the correct explanation of A" },
      { id: "c", text: "A is true but R is false" },
      { id: "d", text: "A is false but R is true" },
    ],
  },
];

// Paragraph for paragraph-based questions
export const sampleParagraph = {
  id: "para1",
  text: `A car starts from rest and accelerates uniformly at 2 m/s² for 10 seconds. It then moves with constant velocity for the next 20 seconds. Finally, it decelerates uniformly and comes to rest in 5 seconds. The total distance covered by the car during this journey can be calculated using equations of motion.`,
};

export const sampleParagraphQuestions: ParagraphQuestion[] = [
  {
    id: "q18",
    type: "paragraph",
    subject: "physics",
    chapter: "Kinematics",
    topic: "Motion",
    paragraphId: "para1",
    paragraphText: sampleParagraph.text,
    text: "What is the velocity of the car at the end of the acceleration phase?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "10 m/s" },
      { id: "b", text: "20 m/s", isCorrect: true },
      { id: "c", text: "30 m/s" },
      { id: "d", text: "40 m/s" },
    ],
  },
  {
    id: "q19",
    type: "paragraph",
    subject: "physics",
    chapter: "Kinematics",
    topic: "Motion",
    paragraphId: "para1",
    paragraphText: sampleParagraph.text,
    text: "What is the distance covered during the constant velocity phase?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "easy",
    status: "not_visited",
    options: [
      { id: "a", text: "200 m" },
      { id: "b", text: "300 m" },
      { id: "c", text: "400 m", isCorrect: true },
      { id: "d", text: "500 m" },
    ],
  },
  {
    id: "q20",
    type: "paragraph",
    subject: "physics",
    chapter: "Kinematics",
    topic: "Motion",
    paragraphId: "para1",
    paragraphText: sampleParagraph.text,
    text: "What is the deceleration of the car during the final phase?",
    marks: 4,
    negativeMarks: 1,
    difficulty: "medium",
    status: "not_visited",
    options: [
      { id: "a", text: "2 m/s²" },
      { id: "b", text: "4 m/s²", isCorrect: true },
      { id: "c", text: "5 m/s²" },
      { id: "d", text: "10 m/s²" },
    ],
  },
];

export const sampleShortAnswer: ShortAnswerQuestion[] = [
  {
    id: "q21",
    type: "short_answer",
    subject: "physics",
    chapter: "Laws of Motion",
    topic: "Newton's Laws",
    text: "State Newton's Third Law of Motion and give one real-life example.",
    marks: 3,
    difficulty: "easy",
    status: "not_visited",
    wordLimit: 50,
  },
  {
    id: "q22",
    type: "short_answer",
    subject: "chemistry",
    chapter: "Chemical Reactions",
    topic: "Types of Reactions",
    text: "Define a redox reaction. Give an example with balanced equation.",
    marks: 3,
    difficulty: "medium",
    status: "not_visited",
    wordLimit: 75,
  },
];

export const sampleLongAnswer: LongAnswerQuestion[] = [
  {
    id: "q23",
    type: "long_answer",
    subject: "physics",
    chapter: "Thermodynamics",
    topic: "Heat Engines",
    text: "Explain the working of a Carnot engine with a neat diagram. Derive the expression for its efficiency.",
    marks: 6,
    difficulty: "hard",
    status: "not_visited",
    wordLimit: 250,
  },
];

// ============================================
// COMPLETE SAMPLE TEST
// ============================================

export const sampleTestSections: TestSection[] = [
  {
    id: "sec-phy",
    name: "Physics",
    subject: "physics",
    questionCount: 30,
    instructions: "Answer all questions. Each question carries equal marks.",
  },
  {
    id: "sec-chem",
    name: "Chemistry",
    subject: "chemistry",
    questionCount: 30,
    instructions: "Answer all questions. Each question carries equal marks.",
  },
  {
    id: "sec-math",
    name: "Mathematics",
    subject: "mathematics",
    questionCount: 30,
    instructions: "Answer all questions. Each question carries equal marks.",
  },
];

// All questions combined for testing
export const allSampleQuestions: TestQuestion[] = [
  ...sampleMCQSingle,
  ...sampleMCQMultiple,
  ...sampleIntegerQuestions,
  ...sampleFillBlanks,
  ...sampleMatrixMatch,
  ...sampleAssertionReasoning,
  ...sampleParagraphQuestions,
  ...sampleShortAnswer,
  ...sampleLongAnswer,
];

// Sample complete test structure
export const sampleTest: TestStructure = {
  id: "sample-test-1",
  name: "JEE Main Mock Test",
  pattern: "jee_main",
  totalQuestions: 90,
  totalMarks: 300,
  duration: 180,
  sections: sampleTestSections,
  questions: allSampleQuestions,
  allowBackNavigation: true,
  allowMarkForReview: true,
  showCalculator: true,
};

// Question type labels for display
export const questionTypeLabels: Record<QuestionType, string> = {
  mcq_single: "Single Choice",
  mcq_multiple: "Multiple Choice",
  integer: "Numerical",
  fill_blank: "Fill in the Blanks",
  matrix_match: "Matrix Match",
  assertion_reasoning: "Assertion-Reasoning",
  paragraph: "Paragraph Based",
  short_answer: "Short Answer",
  long_answer: "Long Answer",
};

// Question status colors
export const questionStatusColors: Record<QuestionStatus, { bg: string; text: string; label: string }> = {
  not_visited: { bg: "bg-muted", text: "text-muted-foreground", label: "Not Visited" },
  not_answered: { bg: "bg-red-100", text: "text-red-600", label: "Not Answered" },
  answered: { bg: "bg-green-100", text: "text-green-600", label: "Answered" },
  marked_review: { bg: "bg-purple-100", text: "text-purple-600", label: "Marked for Review" },
  answered_marked: { bg: "bg-purple-100", text: "text-purple-600", label: "Answered & Marked" },
};
