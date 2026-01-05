// Real CBSE Master Data for Classes 6-12
// Subjects: Mathematics, Physics, Chemistry, History, Hindi
// Supports multilingual (Hindi chapter names in Devanagari with transliteration)

export interface CBSEChapter {
  id: string;
  name: string;
  nameHindi?: string;           // For Hindi subject - Devanagari
  nameTransliterated?: string;  // For Hindi subject - English transliteration
  classId: string;
  subjectId: string;
  order: number;
}

export interface CBSETopic {
  id: string;
  name: string;
  nameHindi?: string;
  chapterId: string;
  order: number;
}

// ============================================
// MATHEMATICS - Classes 6-12 (NCERT)
// ============================================
export const mathematicsChapters: CBSEChapter[] = [
  // Class 6 Mathematics
  { id: "mat-6-1", name: "Knowing Our Numbers", classId: "1", subjectId: "3", order: 1 },
  { id: "mat-6-2", name: "Whole Numbers", classId: "1", subjectId: "3", order: 2 },
  { id: "mat-6-3", name: "Playing with Numbers", classId: "1", subjectId: "3", order: 3 },
  { id: "mat-6-4", name: "Basic Geometrical Ideas", classId: "1", subjectId: "3", order: 4 },
  { id: "mat-6-5", name: "Understanding Elementary Shapes", classId: "1", subjectId: "3", order: 5 },
  { id: "mat-6-6", name: "Integers", classId: "1", subjectId: "3", order: 6 },
  { id: "mat-6-7", name: "Fractions", classId: "1", subjectId: "3", order: 7 },
  { id: "mat-6-8", name: "Decimals", classId: "1", subjectId: "3", order: 8 },
  { id: "mat-6-9", name: "Data Handling", classId: "1", subjectId: "3", order: 9 },
  { id: "mat-6-10", name: "Mensuration", classId: "1", subjectId: "3", order: 10 },
  { id: "mat-6-11", name: "Algebra", classId: "1", subjectId: "3", order: 11 },
  { id: "mat-6-12", name: "Ratio and Proportion", classId: "1", subjectId: "3", order: 12 },
  { id: "mat-6-13", name: "Symmetry", classId: "1", subjectId: "3", order: 13 },
  { id: "mat-6-14", name: "Practical Geometry", classId: "1", subjectId: "3", order: 14 },

  // Class 7 Mathematics
  { id: "mat-7-1", name: "Integers", classId: "2", subjectId: "3", order: 1 },
  { id: "mat-7-2", name: "Fractions and Decimals", classId: "2", subjectId: "3", order: 2 },
  { id: "mat-7-3", name: "Data Handling", classId: "2", subjectId: "3", order: 3 },
  { id: "mat-7-4", name: "Simple Equations", classId: "2", subjectId: "3", order: 4 },
  { id: "mat-7-5", name: "Lines and Angles", classId: "2", subjectId: "3", order: 5 },
  { id: "mat-7-6", name: "The Triangle and Its Properties", classId: "2", subjectId: "3", order: 6 },
  { id: "mat-7-7", name: "Congruence of Triangles", classId: "2", subjectId: "3", order: 7 },
  { id: "mat-7-8", name: "Comparing Quantities", classId: "2", subjectId: "3", order: 8 },
  { id: "mat-7-9", name: "Rational Numbers", classId: "2", subjectId: "3", order: 9 },
  { id: "mat-7-10", name: "Practical Geometry", classId: "2", subjectId: "3", order: 10 },
  { id: "mat-7-11", name: "Perimeter and Area", classId: "2", subjectId: "3", order: 11 },
  { id: "mat-7-12", name: "Algebraic Expressions", classId: "2", subjectId: "3", order: 12 },
  { id: "mat-7-13", name: "Exponents and Powers", classId: "2", subjectId: "3", order: 13 },
  { id: "mat-7-14", name: "Symmetry", classId: "2", subjectId: "3", order: 14 },
  { id: "mat-7-15", name: "Visualising Solid Shapes", classId: "2", subjectId: "3", order: 15 },

  // Class 8 Mathematics
  { id: "mat-8-1", name: "Rational Numbers", classId: "3", subjectId: "3", order: 1 },
  { id: "mat-8-2", name: "Linear Equations in One Variable", classId: "3", subjectId: "3", order: 2 },
  { id: "mat-8-3", name: "Understanding Quadrilaterals", classId: "3", subjectId: "3", order: 3 },
  { id: "mat-8-4", name: "Practical Geometry", classId: "3", subjectId: "3", order: 4 },
  { id: "mat-8-5", name: "Data Handling", classId: "3", subjectId: "3", order: 5 },
  { id: "mat-8-6", name: "Squares and Square Roots", classId: "3", subjectId: "3", order: 6 },
  { id: "mat-8-7", name: "Cubes and Cube Roots", classId: "3", subjectId: "3", order: 7 },
  { id: "mat-8-8", name: "Comparing Quantities", classId: "3", subjectId: "3", order: 8 },
  { id: "mat-8-9", name: "Algebraic Expressions and Identities", classId: "3", subjectId: "3", order: 9 },
  { id: "mat-8-10", name: "Visualising Solid Shapes", classId: "3", subjectId: "3", order: 10 },
  { id: "mat-8-11", name: "Mensuration", classId: "3", subjectId: "3", order: 11 },
  { id: "mat-8-12", name: "Exponents and Powers", classId: "3", subjectId: "3", order: 12 },
  { id: "mat-8-13", name: "Direct and Inverse Proportions", classId: "3", subjectId: "3", order: 13 },
  { id: "mat-8-14", name: "Factorisation", classId: "3", subjectId: "3", order: 14 },
  { id: "mat-8-15", name: "Introduction to Graphs", classId: "3", subjectId: "3", order: 15 },
  { id: "mat-8-16", name: "Playing with Numbers", classId: "3", subjectId: "3", order: 16 },

  // Class 9 Mathematics
  { id: "mat-9-1", name: "Number Systems", classId: "4", subjectId: "3", order: 1 },
  { id: "mat-9-2", name: "Polynomials", classId: "4", subjectId: "3", order: 2 },
  { id: "mat-9-3", name: "Coordinate Geometry", classId: "4", subjectId: "3", order: 3 },
  { id: "mat-9-4", name: "Linear Equations in Two Variables", classId: "4", subjectId: "3", order: 4 },
  { id: "mat-9-5", name: "Introduction to Euclid's Geometry", classId: "4", subjectId: "3", order: 5 },
  { id: "mat-9-6", name: "Lines and Angles", classId: "4", subjectId: "3", order: 6 },
  { id: "mat-9-7", name: "Triangles", classId: "4", subjectId: "3", order: 7 },
  { id: "mat-9-8", name: "Quadrilaterals", classId: "4", subjectId: "3", order: 8 },
  { id: "mat-9-9", name: "Areas of Parallelograms and Triangles", classId: "4", subjectId: "3", order: 9 },
  { id: "mat-9-10", name: "Circles", classId: "4", subjectId: "3", order: 10 },
  { id: "mat-9-11", name: "Constructions", classId: "4", subjectId: "3", order: 11 },
  { id: "mat-9-12", name: "Heron's Formula", classId: "4", subjectId: "3", order: 12 },
  { id: "mat-9-13", name: "Surface Areas and Volumes", classId: "4", subjectId: "3", order: 13 },
  { id: "mat-9-14", name: "Statistics", classId: "4", subjectId: "3", order: 14 },
  { id: "mat-9-15", name: "Probability", classId: "4", subjectId: "3", order: 15 },

  // Class 10 Mathematics
  { id: "mat-10-1", name: "Real Numbers", classId: "5", subjectId: "3", order: 1 },
  { id: "mat-10-2", name: "Polynomials", classId: "5", subjectId: "3", order: 2 },
  { id: "mat-10-3", name: "Pair of Linear Equations in Two Variables", classId: "5", subjectId: "3", order: 3 },
  { id: "mat-10-4", name: "Quadratic Equations", classId: "5", subjectId: "3", order: 4 },
  { id: "mat-10-5", name: "Arithmetic Progressions", classId: "5", subjectId: "3", order: 5 },
  { id: "mat-10-6", name: "Triangles", classId: "5", subjectId: "3", order: 6 },
  { id: "mat-10-7", name: "Coordinate Geometry", classId: "5", subjectId: "3", order: 7 },
  { id: "mat-10-8", name: "Introduction to Trigonometry", classId: "5", subjectId: "3", order: 8 },
  { id: "mat-10-9", name: "Some Applications of Trigonometry", classId: "5", subjectId: "3", order: 9 },
  { id: "mat-10-10", name: "Circles", classId: "5", subjectId: "3", order: 10 },
  { id: "mat-10-11", name: "Constructions", classId: "5", subjectId: "3", order: 11 },
  { id: "mat-10-12", name: "Areas Related to Circles", classId: "5", subjectId: "3", order: 12 },
  { id: "mat-10-13", name: "Surface Areas and Volumes", classId: "5", subjectId: "3", order: 13 },
  { id: "mat-10-14", name: "Statistics", classId: "5", subjectId: "3", order: 14 },
  { id: "mat-10-15", name: "Probability", classId: "5", subjectId: "3", order: 15 },

  // Class 11 Mathematics
  { id: "mat-11-1", name: "Sets", classId: "6", subjectId: "3", order: 1 },
  { id: "mat-11-2", name: "Relations and Functions", classId: "6", subjectId: "3", order: 2 },
  { id: "mat-11-3", name: "Trigonometric Functions", classId: "6", subjectId: "3", order: 3 },
  { id: "mat-11-4", name: "Principle of Mathematical Induction", classId: "6", subjectId: "3", order: 4 },
  { id: "mat-11-5", name: "Complex Numbers and Quadratic Equations", classId: "6", subjectId: "3", order: 5 },
  { id: "mat-11-6", name: "Linear Inequalities", classId: "6", subjectId: "3", order: 6 },
  { id: "mat-11-7", name: "Permutations and Combinations", classId: "6", subjectId: "3", order: 7 },
  { id: "mat-11-8", name: "Binomial Theorem", classId: "6", subjectId: "3", order: 8 },
  { id: "mat-11-9", name: "Sequences and Series", classId: "6", subjectId: "3", order: 9 },
  { id: "mat-11-10", name: "Straight Lines", classId: "6", subjectId: "3", order: 10 },
  { id: "mat-11-11", name: "Conic Sections", classId: "6", subjectId: "3", order: 11 },
  { id: "mat-11-12", name: "Introduction to Three Dimensional Geometry", classId: "6", subjectId: "3", order: 12 },
  { id: "mat-11-13", name: "Limits and Derivatives", classId: "6", subjectId: "3", order: 13 },
  { id: "mat-11-14", name: "Mathematical Reasoning", classId: "6", subjectId: "3", order: 14 },
  { id: "mat-11-15", name: "Statistics", classId: "6", subjectId: "3", order: 15 },
  { id: "mat-11-16", name: "Probability", classId: "6", subjectId: "3", order: 16 },

  // Class 12 Mathematics
  { id: "mat-12-1", name: "Relations and Functions", classId: "7", subjectId: "3", order: 1 },
  { id: "mat-12-2", name: "Inverse Trigonometric Functions", classId: "7", subjectId: "3", order: 2 },
  { id: "mat-12-3", name: "Matrices", classId: "7", subjectId: "3", order: 3 },
  { id: "mat-12-4", name: "Determinants", classId: "7", subjectId: "3", order: 4 },
  { id: "mat-12-5", name: "Continuity and Differentiability", classId: "7", subjectId: "3", order: 5 },
  { id: "mat-12-6", name: "Application of Derivatives", classId: "7", subjectId: "3", order: 6 },
  { id: "mat-12-7", name: "Integrals", classId: "7", subjectId: "3", order: 7 },
  { id: "mat-12-8", name: "Application of Integrals", classId: "7", subjectId: "3", order: 8 },
  { id: "mat-12-9", name: "Differential Equations", classId: "7", subjectId: "3", order: 9 },
  { id: "mat-12-10", name: "Vector Algebra", classId: "7", subjectId: "3", order: 10 },
  { id: "mat-12-11", name: "Three Dimensional Geometry", classId: "7", subjectId: "3", order: 11 },
  { id: "mat-12-12", name: "Linear Programming", classId: "7", subjectId: "3", order: 12 },
  { id: "mat-12-13", name: "Probability", classId: "7", subjectId: "3", order: 13 },
];

// ============================================
// PHYSICS - Classes 11-12 (NCERT)
// ============================================
export const physicsChapters: CBSEChapter[] = [
  // Class 11 Physics
  { id: "phy-11-1", name: "Physical World", classId: "6", subjectId: "1", order: 1 },
  { id: "phy-11-2", name: "Units and Measurements", classId: "6", subjectId: "1", order: 2 },
  { id: "phy-11-3", name: "Motion in a Straight Line", classId: "6", subjectId: "1", order: 3 },
  { id: "phy-11-4", name: "Motion in a Plane", classId: "6", subjectId: "1", order: 4 },
  { id: "phy-11-5", name: "Laws of Motion", classId: "6", subjectId: "1", order: 5 },
  { id: "phy-11-6", name: "Work, Energy and Power", classId: "6", subjectId: "1", order: 6 },
  { id: "phy-11-7", name: "System of Particles and Rotational Motion", classId: "6", subjectId: "1", order: 7 },
  { id: "phy-11-8", name: "Gravitation", classId: "6", subjectId: "1", order: 8 },
  { id: "phy-11-9", name: "Mechanical Properties of Solids", classId: "6", subjectId: "1", order: 9 },
  { id: "phy-11-10", name: "Mechanical Properties of Fluids", classId: "6", subjectId: "1", order: 10 },
  { id: "phy-11-11", name: "Thermal Properties of Matter", classId: "6", subjectId: "1", order: 11 },
  { id: "phy-11-12", name: "Thermodynamics", classId: "6", subjectId: "1", order: 12 },
  { id: "phy-11-13", name: "Kinetic Theory", classId: "6", subjectId: "1", order: 13 },
  { id: "phy-11-14", name: "Oscillations", classId: "6", subjectId: "1", order: 14 },
  { id: "phy-11-15", name: "Waves", classId: "6", subjectId: "1", order: 15 },

  // Class 12 Physics
  { id: "phy-12-1", name: "Electric Charges and Fields", classId: "7", subjectId: "1", order: 1 },
  { id: "phy-12-2", name: "Electrostatic Potential and Capacitance", classId: "7", subjectId: "1", order: 2 },
  { id: "phy-12-3", name: "Current Electricity", classId: "7", subjectId: "1", order: 3 },
  { id: "phy-12-4", name: "Moving Charges and Magnetism", classId: "7", subjectId: "1", order: 4 },
  { id: "phy-12-5", name: "Magnetism and Matter", classId: "7", subjectId: "1", order: 5 },
  { id: "phy-12-6", name: "Electromagnetic Induction", classId: "7", subjectId: "1", order: 6 },
  { id: "phy-12-7", name: "Alternating Current", classId: "7", subjectId: "1", order: 7 },
  { id: "phy-12-8", name: "Electromagnetic Waves", classId: "7", subjectId: "1", order: 8 },
  { id: "phy-12-9", name: "Ray Optics and Optical Instruments", classId: "7", subjectId: "1", order: 9 },
  { id: "phy-12-10", name: "Wave Optics", classId: "7", subjectId: "1", order: 10 },
  { id: "phy-12-11", name: "Dual Nature of Radiation and Matter", classId: "7", subjectId: "1", order: 11 },
  { id: "phy-12-12", name: "Atoms", classId: "7", subjectId: "1", order: 12 },
  { id: "phy-12-13", name: "Nuclei", classId: "7", subjectId: "1", order: 13 },
  { id: "phy-12-14", name: "Semiconductor Electronics: Materials, Devices and Simple Circuits", classId: "7", subjectId: "1", order: 14 },
];

// ============================================
// CHEMISTRY - Classes 11-12 (NCERT)
// ============================================
export const chemistryChapters: CBSEChapter[] = [
  // Class 11 Chemistry
  { id: "che-11-1", name: "Some Basic Concepts of Chemistry", classId: "6", subjectId: "2", order: 1 },
  { id: "che-11-2", name: "Structure of Atom", classId: "6", subjectId: "2", order: 2 },
  { id: "che-11-3", name: "Classification of Elements and Periodicity in Properties", classId: "6", subjectId: "2", order: 3 },
  { id: "che-11-4", name: "Chemical Bonding and Molecular Structure", classId: "6", subjectId: "2", order: 4 },
  { id: "che-11-5", name: "States of Matter", classId: "6", subjectId: "2", order: 5 },
  { id: "che-11-6", name: "Thermodynamics", classId: "6", subjectId: "2", order: 6 },
  { id: "che-11-7", name: "Equilibrium", classId: "6", subjectId: "2", order: 7 },
  { id: "che-11-8", name: "Redox Reactions", classId: "6", subjectId: "2", order: 8 },
  { id: "che-11-9", name: "Hydrogen", classId: "6", subjectId: "2", order: 9 },
  { id: "che-11-10", name: "The s-Block Elements", classId: "6", subjectId: "2", order: 10 },
  { id: "che-11-11", name: "The p-Block Elements", classId: "6", subjectId: "2", order: 11 },
  { id: "che-11-12", name: "Organic Chemistry - Some Basic Principles and Techniques", classId: "6", subjectId: "2", order: 12 },
  { id: "che-11-13", name: "Hydrocarbons", classId: "6", subjectId: "2", order: 13 },
  { id: "che-11-14", name: "Environmental Chemistry", classId: "6", subjectId: "2", order: 14 },

  // Class 12 Chemistry
  { id: "che-12-1", name: "The Solid State", classId: "7", subjectId: "2", order: 1 },
  { id: "che-12-2", name: "Solutions", classId: "7", subjectId: "2", order: 2 },
  { id: "che-12-3", name: "Electrochemistry", classId: "7", subjectId: "2", order: 3 },
  { id: "che-12-4", name: "Chemical Kinetics", classId: "7", subjectId: "2", order: 4 },
  { id: "che-12-5", name: "Surface Chemistry", classId: "7", subjectId: "2", order: 5 },
  { id: "che-12-6", name: "General Principles and Processes of Isolation of Elements", classId: "7", subjectId: "2", order: 6 },
  { id: "che-12-7", name: "The p-Block Elements", classId: "7", subjectId: "2", order: 7 },
  { id: "che-12-8", name: "The d- and f-Block Elements", classId: "7", subjectId: "2", order: 8 },
  { id: "che-12-9", name: "Coordination Compounds", classId: "7", subjectId: "2", order: 9 },
  { id: "che-12-10", name: "Haloalkanes and Haloarenes", classId: "7", subjectId: "2", order: 10 },
  { id: "che-12-11", name: "Alcohols, Phenols and Ethers", classId: "7", subjectId: "2", order: 11 },
  { id: "che-12-12", name: "Aldehydes, Ketones and Carboxylic Acids", classId: "7", subjectId: "2", order: 12 },
  { id: "che-12-13", name: "Amines", classId: "7", subjectId: "2", order: 13 },
  { id: "che-12-14", name: "Biomolecules", classId: "7", subjectId: "2", order: 14 },
  { id: "che-12-15", name: "Polymers", classId: "7", subjectId: "2", order: 15 },
  { id: "che-12-16", name: "Chemistry in Everyday Life", classId: "7", subjectId: "2", order: 16 },
];

// ============================================
// HISTORY - Classes 11-12 (NCERT)
// ============================================
export const historyChapters: CBSEChapter[] = [
  // Class 11 History - Themes in World History
  { id: "his-11-1", name: "From the Beginning of Time", classId: "6", subjectId: "12", order: 1 },
  { id: "his-11-2", name: "Writing and City Life", classId: "6", subjectId: "12", order: 2 },
  { id: "his-11-3", name: "An Empire Across Three Continents", classId: "6", subjectId: "12", order: 3 },
  { id: "his-11-4", name: "The Central Islamic Lands", classId: "6", subjectId: "12", order: 4 },
  { id: "his-11-5", name: "Nomadic Empires", classId: "6", subjectId: "12", order: 5 },
  { id: "his-11-6", name: "The Three Orders", classId: "6", subjectId: "12", order: 6 },
  { id: "his-11-7", name: "Changing Cultural Traditions", classId: "6", subjectId: "12", order: 7 },
  { id: "his-11-8", name: "Confrontation of Cultures", classId: "6", subjectId: "12", order: 8 },
  { id: "his-11-9", name: "The Industrial Revolution", classId: "6", subjectId: "12", order: 9 },
  { id: "his-11-10", name: "Displacing Indigenous Peoples", classId: "6", subjectId: "12", order: 10 },
  { id: "his-11-11", name: "Paths to Modernisation", classId: "6", subjectId: "12", order: 11 },

  // Class 12 History - Themes in Indian History
  { id: "his-12-1", name: "Bricks, Beads and Bones", classId: "7", subjectId: "12", order: 1 },
  { id: "his-12-2", name: "Kings, Farmers and Towns", classId: "7", subjectId: "12", order: 2 },
  { id: "his-12-3", name: "Kinship, Caste and Class", classId: "7", subjectId: "12", order: 3 },
  { id: "his-12-4", name: "Thinkers, Beliefs and Buildings", classId: "7", subjectId: "12", order: 4 },
  { id: "his-12-5", name: "Through the Eyes of Travellers", classId: "7", subjectId: "12", order: 5 },
  { id: "his-12-6", name: "Bhakti-Sufi Traditions", classId: "7", subjectId: "12", order: 6 },
  { id: "his-12-7", name: "An Imperial Capital: Vijayanagara", classId: "7", subjectId: "12", order: 7 },
  { id: "his-12-8", name: "Peasants, Zamindars and the State", classId: "7", subjectId: "12", order: 8 },
  { id: "his-12-9", name: "Kings and Chronicles", classId: "7", subjectId: "12", order: 9 },
  { id: "his-12-10", name: "Colonialism and the Countryside", classId: "7", subjectId: "12", order: 10 },
  { id: "his-12-11", name: "Rebels and the Raj", classId: "7", subjectId: "12", order: 11 },
  { id: "his-12-12", name: "Colonial Cities", classId: "7", subjectId: "12", order: 12 },
  { id: "his-12-13", name: "Mahatma Gandhi and the Nationalist Movement", classId: "7", subjectId: "12", order: 13 },
  { id: "his-12-14", name: "Understanding Partition", classId: "7", subjectId: "12", order: 14 },
  { id: "his-12-15", name: "Framing the Constitution", classId: "7", subjectId: "12", order: 15 },
];

// ============================================
// HINDI - Classes 9-12 (NCERT) - BILINGUAL
// ============================================
export const hindiChapters: CBSEChapter[] = [
  // Class 9 Hindi - Kshitij (क्षितिज)
  { id: "hin-9-1", name: "Do Bailon ki Katha", nameHindi: "दो बैलों की कथा", nameTransliterated: "Do Bailon ki Katha", classId: "4", subjectId: "8", order: 1 },
  { id: "hin-9-2", name: "Lhasa ki Aur", nameHindi: "ल्हासा की ओर", nameTransliterated: "Lhasa ki Aur", classId: "4", subjectId: "8", order: 2 },
  { id: "hin-9-3", name: "Upbhoktavad ki Sanskriti", nameHindi: "उपभोक्तावाद की संस्कृति", nameTransliterated: "Upbhoktavad ki Sanskriti", classId: "4", subjectId: "8", order: 3 },
  { id: "hin-9-4", name: "Sanwale Sapnon ki Yaad", nameHindi: "साँवले सपनों की याद", nameTransliterated: "Sanwale Sapnon ki Yaad", classId: "4", subjectId: "8", order: 4 },
  { id: "hin-9-5", name: "Nana Sahib ki Putri", nameHindi: "नाना साहब की पुत्री देवी मैना को भस्म कर दिया गया", nameTransliterated: "Nana Sahib ki Putri Devi Maina ko Bhasm kar diya gaya", classId: "4", subjectId: "8", order: 5 },
  { id: "hin-9-6", name: "Premchand ke Phate Joote", nameHindi: "प्रेमचंद के फटे जूते", nameTransliterated: "Premchand ke Phate Joote", classId: "4", subjectId: "8", order: 6 },
  { id: "hin-9-7", name: "Mere Bachpan ke Din", nameHindi: "मेरे बचपन के दिन", nameTransliterated: "Mere Bachpan ke Din", classId: "4", subjectId: "8", order: 7 },
  { id: "hin-9-8", name: "Ek Kutta aur Ek Maina", nameHindi: "एक कुत्ता और एक मैना", nameTransliterated: "Ek Kutta aur Ek Maina", classId: "4", subjectId: "8", order: 8 },
  // Kavya Khand (Poetry Section)
  { id: "hin-9-9", name: "Sakhiyan evam Sabad", nameHindi: "साखियाँ एवं सबद", nameTransliterated: "Sakhiyan evam Sabad", classId: "4", subjectId: "8", order: 9 },
  { id: "hin-9-10", name: "Vaakh", nameHindi: "वाख", nameTransliterated: "Vaakh", classId: "4", subjectId: "8", order: 10 },
  { id: "hin-9-11", name: "Savaiye", nameHindi: "सवैये", nameTransliterated: "Savaiye", classId: "4", subjectId: "8", order: 11 },
  { id: "hin-9-12", name: "Kaidi aur Kokila", nameHindi: "कैदी और कोकिला", nameTransliterated: "Kaidi aur Kokila", classId: "4", subjectId: "8", order: 12 },
  { id: "hin-9-13", name: "Gram Shri", nameHindi: "ग्राम श्री", nameTransliterated: "Gram Shri", classId: "4", subjectId: "8", order: 13 },
  { id: "hin-9-14", name: "Chandra Gahna se Lautati Ber", nameHindi: "चंद्र गहना से लौटती बेर", nameTransliterated: "Chandra Gahna se Lautati Ber", classId: "4", subjectId: "8", order: 14 },
  { id: "hin-9-15", name: "Megh Aaye", nameHindi: "मेघ आए", nameTransliterated: "Megh Aaye", classId: "4", subjectId: "8", order: 15 },
  { id: "hin-9-16", name: "Yamraj ki Disha", nameHindi: "यमराज की दिशा", nameTransliterated: "Yamraj ki Disha", classId: "4", subjectId: "8", order: 16 },
  { id: "hin-9-17", name: "Bachche Kaam par ja Rahe Hain", nameHindi: "बच्चे काम पर जा रहे हैं", nameTransliterated: "Bachche Kaam par ja Rahe Hain", classId: "4", subjectId: "8", order: 17 },

  // Class 10 Hindi - Kshitij (क्षितिज)
  { id: "hin-10-1", name: "Surdas ke Pad", nameHindi: "सूरदास के पद", nameTransliterated: "Surdas ke Pad", classId: "5", subjectId: "8", order: 1 },
  { id: "hin-10-2", name: "Ram-Lakshman-Parashuram Samvad", nameHindi: "राम-लक्ष्मण-परशुराम संवाद", nameTransliterated: "Ram-Lakshman-Parashuram Samvad", classId: "5", subjectId: "8", order: 2 },
  { id: "hin-10-3", name: "Aatmakatha", nameHindi: "आत्मकथ्य", nameTransliterated: "Aatmakathya", classId: "5", subjectId: "8", order: 3 },
  { id: "hin-10-4", name: "Utsah aur Att Nahi Rahi", nameHindi: "उत्साह और अट नहीं रही", nameTransliterated: "Utsah aur Att Nahi Rahi", classId: "5", subjectId: "8", order: 4 },
  { id: "hin-10-5", name: "Yeh Danturit Muskaan", nameHindi: "यह दंतुरित मुसकान और फसल", nameTransliterated: "Yeh Danturit Muskaan aur Fasal", classId: "5", subjectId: "8", order: 5 },
  { id: "hin-10-6", name: "Chhaya Mat Chhoona", nameHindi: "छाया मत छूना", nameTransliterated: "Chhaya Mat Chhoona", classId: "5", subjectId: "8", order: 6 },
  { id: "hin-10-7", name: "Kanyadan", nameHindi: "कन्यादान", nameTransliterated: "Kanyadan", classId: "5", subjectId: "8", order: 7 },
  { id: "hin-10-8", name: "Sanskriti", nameHindi: "संस्कृति", nameTransliterated: "Sanskriti", classId: "5", subjectId: "8", order: 8 },
  // Gadya Khand (Prose Section)
  { id: "hin-10-9", name: "Netaji ka Chasma", nameHindi: "नेताजी का चश्मा", nameTransliterated: "Netaji ka Chasma", classId: "5", subjectId: "8", order: 9 },
  { id: "hin-10-10", name: "Balgobin Bhagat", nameHindi: "बालगोबिन भगत", nameTransliterated: "Balgobin Bhagat", classId: "5", subjectId: "8", order: 10 },
  { id: "hin-10-11", name: "Lakhnavi Andaaz", nameHindi: "लखनवी अंदाज़", nameTransliterated: "Lakhnavi Andaaz", classId: "5", subjectId: "8", order: 11 },
  { id: "hin-10-12", name: "Manviya Karuna ki Divya Chamak", nameHindi: "मानवीय करुणा की दिव्या चमक", nameTransliterated: "Manviya Karuna ki Divya Chamak", classId: "5", subjectId: "8", order: 12 },
  { id: "hin-10-13", name: "Ek Kahani Yeh Bhi", nameHindi: "एक कहानी यह भी", nameTransliterated: "Ek Kahani Yeh Bhi", classId: "5", subjectId: "8", order: 13 },
  { id: "hin-10-14", name: "Naubatkhane mein Ibadat", nameHindi: "नौबतखाने में इबादत", nameTransliterated: "Naubatkhane mein Ibadat", classId: "5", subjectId: "8", order: 14 },
  { id: "hin-10-15", name: "Sanskriti", nameHindi: "संस्कृति", nameTransliterated: "Sanskriti", classId: "5", subjectId: "8", order: 15 },

  // Class 11 Hindi - Antra (अंतरा)
  { id: "hin-11-1", name: "Kabir - Sakhiyan", nameHindi: "कबीर - साखियाँ", nameTransliterated: "Kabir - Sakhiyan", classId: "6", subjectId: "8", order: 1 },
  { id: "hin-11-2", name: "Surdas - Pad", nameHindi: "सूरदास - पद", nameTransliterated: "Surdas - Pad", classId: "6", subjectId: "8", order: 2 },
  { id: "hin-11-3", name: "Dev - Kavitt aur Savaiya", nameHindi: "देव - कवित्त और सवैया", nameTransliterated: "Dev - Kavitt aur Savaiya", classId: "6", subjectId: "8", order: 3 },
  { id: "hin-11-4", name: "Sumitranandan Pant - Sandhya Sundari, Parivarthan", nameHindi: "सुमित्रानंदन पंत - संध्या सुंदरी, परिवर्तन", nameTransliterated: "Sumitranandan Pant", classId: "6", subjectId: "8", order: 4 },
  { id: "hin-11-5", name: "Bhawani Prasad Mishra - Geet-Faroosh", nameHindi: "भवानी प्रसाद मिश्र - गीत-फरोश", nameTransliterated: "Bhawani Prasad Mishra - Geet-Faroosh", classId: "6", subjectId: "8", order: 5 },
  { id: "hin-11-6", name: "Trilochan - Champa Kale Kale Akshar Nahi Chinhati", nameHindi: "त्रिलोचन - चंपा काले काले अक्षर नहीं चीन्हती", nameTransliterated: "Trilochan", classId: "6", subjectId: "8", order: 6 },
  { id: "hin-11-7", name: "Dushyant Kumar - Gazal", nameHindi: "दुष्यंत कुमार - गज़ल", nameTransliterated: "Dushyant Kumar - Gazal", classId: "6", subjectId: "8", order: 7 },
  { id: "hin-11-8", name: "Aakash Deep - Goonge", nameHindi: "आकाशदीप - गूंगे", nameTransliterated: "Aakash Deep - Goonge", classId: "6", subjectId: "8", order: 8 },
  { id: "hin-11-9", name: "Saadat Hasan Manto - Vidai Sambhashan", nameHindi: "सआदत हसन मंटो - विदाई संभाषण", nameTransliterated: "Saadat Hasan Manto - Vidai Sambhashan", classId: "6", subjectId: "8", order: 9 },
  { id: "hin-11-10", name: "Krishna Nath - Spiti mein Baarish", nameHindi: "कृष्णनाथ - स्पिति में बारिश", nameTransliterated: "Krishna Nath - Spiti mein Baarish", classId: "6", subjectId: "8", order: 10 },

  // Class 12 Hindi - Antra (अंतरा)
  { id: "hin-12-1", name: "Harishankar Parsai - Suraj ka Byah", nameHindi: "हरिशंकर परसाई - सूरज का ब्याह", nameTransliterated: "Harishankar Parsai - Suraj ka Byah", classId: "7", subjectId: "8", order: 1 },
  { id: "hin-12-2", name: "Raghuvir Sahay - Todti Pathar, Kavita ke Bahane", nameHindi: "रघुवीर सहाय - तोड़ती पत्थर, कविता के बहाने", nameTransliterated: "Raghuvir Sahay", classId: "7", subjectId: "8", order: 2 },
  { id: "hin-12-3", name: "Gajanan Madhav Muktibodh - Satah se Uthata Aadmi", nameHindi: "गजानन माधव मुक्तिबोध - सतह से उठता आदमी", nameTransliterated: "Gajanan Madhav Muktibodh", classId: "7", subjectId: "8", order: 3 },
  { id: "hin-12-4", name: "Shamsher Bahadur Singh - Usha, Baadal ko Ghirte Dekha Hai", nameHindi: "शमशेर बहादुर सिंह - ऊषा, बादल को घिरते देखा है", nameTransliterated: "Shamsher Bahadur Singh", classId: "7", subjectId: "8", order: 4 },
  { id: "hin-12-5", name: "Suryakant Tripathi Nirala - Badal Raag, Geet Gaane do Mujhe", nameHindi: "सूर्यकांत त्रिपाठी निराला - बादल राग, गीत गाने दो मुझे", nameTransliterated: "Suryakant Tripathi Nirala", classId: "7", subjectId: "8", order: 5 },
  { id: "hin-12-6", name: "Tulsidas - Kavitavali, Lakshman Moorchha", nameHindi: "तुलसीदास - कवितावली, लक्ष्मण मूर्छा", nameTransliterated: "Tulsidas - Kavitavali", classId: "7", subjectId: "8", order: 6 },
  { id: "hin-12-7", name: "Firak Gorakhpuri - Rubaiyan, Ghazal", nameHindi: "फ़िराक़ गोरखपुरी - रुबाइयाँ, गज़ल", nameTransliterated: "Firak Gorakhpuri", classId: "7", subjectId: "8", order: 7 },
  { id: "hin-12-8", name: "Umashankar Joshi - Chota Mera Khet, Bagulo ke Pankh", nameHindi: "उमाशंकर जोशी - छोटा मेरा खेत, बगुलों के पंख", nameTransliterated: "Umashankar Joshi", classId: "7", subjectId: "8", order: 8 },
  { id: "hin-12-9", name: "Ramvriksha Benipuri - Shilp Viram", nameHindi: "रामवृक्ष बेनीपुरी - शिल्प विराम", nameTransliterated: "Ramvriksha Benipuri - Shilp Viram", classId: "7", subjectId: "8", order: 9 },
  { id: "hin-12-10", name: "Bhisham Sahni - Joothe Ka Jootha", nameHindi: "भीष्म साहनी - जूठे का जूठा", nameTransliterated: "Bhisham Sahni - Joothe Ka Jootha", classId: "7", subjectId: "8", order: 10 },
];

// ============================================
// TOPICS FOR KEY CHAPTERS
// ============================================
export const cbseTopics: CBSETopic[] = [
  // Mathematics Class 10 - Real Numbers
  { id: "t-mat-10-1-1", name: "Euclid's Division Lemma", chapterId: "mat-10-1", order: 1 },
  { id: "t-mat-10-1-2", name: "The Fundamental Theorem of Arithmetic", chapterId: "mat-10-1", order: 2 },
  { id: "t-mat-10-1-3", name: "Revisiting Irrational Numbers", chapterId: "mat-10-1", order: 3 },
  { id: "t-mat-10-1-4", name: "Revisiting Rational Numbers and Their Decimal Expansions", chapterId: "mat-10-1", order: 4 },

  // Mathematics Class 10 - Quadratic Equations
  { id: "t-mat-10-4-1", name: "Standard Form of Quadratic Equation", chapterId: "mat-10-4", order: 1 },
  { id: "t-mat-10-4-2", name: "Solution by Factorisation", chapterId: "mat-10-4", order: 2 },
  { id: "t-mat-10-4-3", name: "Completing the Square", chapterId: "mat-10-4", order: 3 },
  { id: "t-mat-10-4-4", name: "Quadratic Formula", chapterId: "mat-10-4", order: 4 },
  { id: "t-mat-10-4-5", name: "Nature of Roots", chapterId: "mat-10-4", order: 5 },

  // Mathematics Class 12 - Matrices
  { id: "t-mat-12-3-1", name: "Concept of Matrix", chapterId: "mat-12-3", order: 1 },
  { id: "t-mat-12-3-2", name: "Types of Matrices", chapterId: "mat-12-3", order: 2 },
  { id: "t-mat-12-3-3", name: "Operations on Matrices", chapterId: "mat-12-3", order: 3 },
  { id: "t-mat-12-3-4", name: "Transpose of a Matrix", chapterId: "mat-12-3", order: 4 },
  { id: "t-mat-12-3-5", name: "Symmetric and Skew Symmetric Matrices", chapterId: "mat-12-3", order: 5 },
  { id: "t-mat-12-3-6", name: "Invertible Matrices", chapterId: "mat-12-3", order: 6 },

  // Physics Class 11 - Units and Measurements
  { id: "t-phy-11-2-1", name: "The International System of Units", chapterId: "phy-11-2", order: 1 },
  { id: "t-phy-11-2-2", name: "Measurement of Length", chapterId: "phy-11-2", order: 2 },
  { id: "t-phy-11-2-3", name: "Measurement of Mass", chapterId: "phy-11-2", order: 3 },
  { id: "t-phy-11-2-4", name: "Measurement of Time", chapterId: "phy-11-2", order: 4 },
  { id: "t-phy-11-2-5", name: "Accuracy, Precision and Errors", chapterId: "phy-11-2", order: 5 },
  { id: "t-phy-11-2-6", name: "Significant Figures", chapterId: "phy-11-2", order: 6 },
  { id: "t-phy-11-2-7", name: "Dimensions of Physical Quantities", chapterId: "phy-11-2", order: 7 },
  { id: "t-phy-11-2-8", name: "Dimensional Analysis and Applications", chapterId: "phy-11-2", order: 8 },

  // Physics Class 11 - Laws of Motion
  { id: "t-phy-11-5-1", name: "Aristotle's Fallacy", chapterId: "phy-11-5", order: 1 },
  { id: "t-phy-11-5-2", name: "Newton's First Law of Motion", chapterId: "phy-11-5", order: 2 },
  { id: "t-phy-11-5-3", name: "Newton's Second Law of Motion", chapterId: "phy-11-5", order: 3 },
  { id: "t-phy-11-5-4", name: "Newton's Third Law of Motion", chapterId: "phy-11-5", order: 4 },
  { id: "t-phy-11-5-5", name: "Conservation of Momentum", chapterId: "phy-11-5", order: 5 },
  { id: "t-phy-11-5-6", name: "Equilibrium of a Particle", chapterId: "phy-11-5", order: 6 },
  { id: "t-phy-11-5-7", name: "Common Forces in Mechanics", chapterId: "phy-11-5", order: 7 },
  { id: "t-phy-11-5-8", name: "Circular Motion", chapterId: "phy-11-5", order: 8 },

  // Physics Class 12 - Electric Charges and Fields
  { id: "t-phy-12-1-1", name: "Electric Charges", chapterId: "phy-12-1", order: 1 },
  { id: "t-phy-12-1-2", name: "Conductors and Insulators", chapterId: "phy-12-1", order: 2 },
  { id: "t-phy-12-1-3", name: "Charging by Induction", chapterId: "phy-12-1", order: 3 },
  { id: "t-phy-12-1-4", name: "Basic Properties of Electric Charge", chapterId: "phy-12-1", order: 4 },
  { id: "t-phy-12-1-5", name: "Coulomb's Law", chapterId: "phy-12-1", order: 5 },
  { id: "t-phy-12-1-6", name: "Electric Field", chapterId: "phy-12-1", order: 6 },
  { id: "t-phy-12-1-7", name: "Electric Field Lines", chapterId: "phy-12-1", order: 7 },
  { id: "t-phy-12-1-8", name: "Electric Flux", chapterId: "phy-12-1", order: 8 },
  { id: "t-phy-12-1-9", name: "Gauss's Law", chapterId: "phy-12-1", order: 9 },

  // Physics Class 12 - Current Electricity
  { id: "t-phy-12-3-1", name: "Electric Current", chapterId: "phy-12-3", order: 1 },
  { id: "t-phy-12-3-2", name: "Electric Currents in Conductors", chapterId: "phy-12-3", order: 2 },
  { id: "t-phy-12-3-3", name: "Ohm's Law", chapterId: "phy-12-3", order: 3 },
  { id: "t-phy-12-3-4", name: "Drift of Electrons and Origin of Resistivity", chapterId: "phy-12-3", order: 4 },
  { id: "t-phy-12-3-5", name: "Limitations of Ohm's Law", chapterId: "phy-12-3", order: 5 },
  { id: "t-phy-12-3-6", name: "Resistivity of Various Materials", chapterId: "phy-12-3", order: 6 },
  { id: "t-phy-12-3-7", name: "Electrical Energy and Power", chapterId: "phy-12-3", order: 7 },
  { id: "t-phy-12-3-8", name: "Combination of Resistors", chapterId: "phy-12-3", order: 8 },
  { id: "t-phy-12-3-9", name: "Cells, EMF, Internal Resistance", chapterId: "phy-12-3", order: 9 },
  { id: "t-phy-12-3-10", name: "Kirchhoff's Rules", chapterId: "phy-12-3", order: 10 },

  // Chemistry Class 11 - Some Basic Concepts
  { id: "t-che-11-1-1", name: "Importance of Chemistry", chapterId: "che-11-1", order: 1 },
  { id: "t-che-11-1-2", name: "Nature of Matter", chapterId: "che-11-1", order: 2 },
  { id: "t-che-11-1-3", name: "Properties of Matter and Classification", chapterId: "che-11-1", order: 3 },
  { id: "t-che-11-1-4", name: "Uncertainty in Measurement", chapterId: "che-11-1", order: 4 },
  { id: "t-che-11-1-5", name: "Laws of Chemical Combinations", chapterId: "che-11-1", order: 5 },
  { id: "t-che-11-1-6", name: "Dalton's Atomic Theory", chapterId: "che-11-1", order: 6 },
  { id: "t-che-11-1-7", name: "Atomic and Molecular Masses", chapterId: "che-11-1", order: 7 },
  { id: "t-che-11-1-8", name: "Mole Concept and Molar Masses", chapterId: "che-11-1", order: 8 },
  { id: "t-che-11-1-9", name: "Percentage Composition", chapterId: "che-11-1", order: 9 },
  { id: "t-che-11-1-10", name: "Stoichiometry and Calculations", chapterId: "che-11-1", order: 10 },

  // Chemistry Class 12 - Solutions
  { id: "t-che-12-2-1", name: "Types of Solutions", chapterId: "che-12-2", order: 1 },
  { id: "t-che-12-2-2", name: "Expressing Concentration of Solutions", chapterId: "che-12-2", order: 2 },
  { id: "t-che-12-2-3", name: "Solubility", chapterId: "che-12-2", order: 3 },
  { id: "t-che-12-2-4", name: "Vapour Pressure of Liquid Solutions", chapterId: "che-12-2", order: 4 },
  { id: "t-che-12-2-5", name: "Ideal and Non-ideal Solutions", chapterId: "che-12-2", order: 5 },
  { id: "t-che-12-2-6", name: "Colligative Properties", chapterId: "che-12-2", order: 6 },
  { id: "t-che-12-2-7", name: "Abnormal Molar Masses", chapterId: "che-12-2", order: 7 },

  // History Class 12 - Mahatma Gandhi
  { id: "t-his-12-13-1", name: "The Making of Mahatma", chapterId: "his-12-13", order: 1 },
  { id: "t-his-12-13-2", name: "The Salt Satyagraha and Civil Disobedience Movement", chapterId: "his-12-13", order: 2 },
  { id: "t-his-12-13-3", name: "Quit India Movement", chapterId: "his-12-13", order: 3 },
  { id: "t-his-12-13-4", name: "Gandhi's Philosophy of Non-violence", chapterId: "his-12-13", order: 4 },
  { id: "t-his-12-13-5", name: "Gandhi and the Nation", chapterId: "his-12-13", order: 5 },

  // History Class 12 - Framing the Constitution
  { id: "t-his-12-15-1", name: "The Constituent Assembly Debates", chapterId: "his-12-15", order: 1 },
  { id: "t-his-12-15-2", name: "The Problem of Separate Electorates", chapterId: "his-12-15", order: 2 },
  { id: "t-his-12-15-3", name: "The Language Question", chapterId: "his-12-15", order: 3 },
  { id: "t-his-12-15-4", name: "Federalism and Centre-State Relations", chapterId: "his-12-15", order: 4 },
  { id: "t-his-12-15-5", name: "The Vision of the Constitution", chapterId: "his-12-15", order: 5 },

  // Hindi Class 9 - Do Bailon ki Katha (दो बैलों की कथा)
  { id: "t-hin-9-1-1", name: "Heera aur Moti ka Parichay", nameHindi: "हीरा और मोती का परिचय", chapterId: "hin-9-1", order: 1 },
  { id: "t-hin-9-1-2", name: "Bailon ki Mitrata", nameHindi: "बैलों की मित्रता", chapterId: "hin-9-1", order: 2 },
  { id: "t-hin-9-1-3", name: "Aazadi ke liye Sangharsh", nameHindi: "आज़ादी के लिए संघर्ष", chapterId: "hin-9-1", order: 3 },
  { id: "t-hin-9-1-4", name: "Katha ka Sandesh", nameHindi: "कथा का संदेश", chapterId: "hin-9-1", order: 4 },

  // Hindi Class 10 - Surdas ke Pad (सूरदास के पद)
  { id: "t-hin-10-1-1", name: "Bhakti aur Prem", nameHindi: "भक्ति और प्रेम", chapterId: "hin-10-1", order: 1 },
  { id: "t-hin-10-1-2", name: "Gopi Virah", nameHindi: "गोपी विरह", chapterId: "hin-10-1", order: 2 },
  { id: "t-hin-10-1-3", name: "Uddhav-Gopi Samvad", nameHindi: "उद्धव-गोपी संवाद", chapterId: "hin-10-1", order: 3 },
  { id: "t-hin-10-1-4", name: "Kavya Shilp", nameHindi: "काव्य शिल्प", chapterId: "hin-10-1", order: 4 },
];

// ============================================
// COMBINED EXPORTS
// ============================================
export const allCBSEChapters: CBSEChapter[] = [
  ...mathematicsChapters,
  ...physicsChapters,
  ...chemistryChapters,
  ...historyChapters,
  ...hindiChapters,
];

export const allCBSETopics: CBSETopic[] = [...cbseTopics];

// Helper to get chapters by class and subject
export const getChaptersByClassAndSubject = (classId: string, subjectId: string): CBSEChapter[] => {
  return allCBSEChapters.filter(ch => ch.classId === classId && ch.subjectId === subjectId);
};

// Helper to get topics by chapter
export const getTopicsByChapter = (chapterId: string): CBSETopic[] => {
  return allCBSETopics.filter(t => t.chapterId === chapterId);
};

// Summary stats
export const cbseDataStats = {
  totalChapters: allCBSEChapters.length,
  totalTopics: allCBSETopics.length,
  subjectBreakdown: {
    mathematics: mathematicsChapters.length,
    physics: physicsChapters.length,
    chemistry: chemistryChapters.length,
    history: historyChapters.length,
    hindi: hindiChapters.length,
  }
};
