import { 
  Atom, 
  Beaker, 
  Calculator, 
  Dna, 
  BookOpen, 
  Languages, 
  Globe2, 
  Landmark, 
  Scale, 
  TrendingUp, 
  Building2, 
  Briefcase, 
  Monitor, 
  Code, 
  Palette, 
  Music, 
  Dumbbell, 
  Heart, 
  Leaf, 
  BookText, 
  Brain, 
  GraduationCap,
  Sigma,
  FlaskConical,
  type LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Subject Categories
export type SubjectCategory = 
  | "sciences" 
  | "mathematics" 
  | "languages" 
  | "social_sciences" 
  | "commerce" 
  | "computer" 
  | "arts" 
  | "physical_education"
  | "vocational";

// Category configuration with colors
export const subjectCategoryConfig: Record<SubjectCategory, { label: string; color: string; bgColor: string }> = {
  sciences: { label: "Sciences", color: "text-emerald-600", bgColor: "bg-emerald-50" },
  mathematics: { label: "Mathematics", color: "text-blue-600", bgColor: "bg-blue-50" },
  languages: { label: "Languages", color: "text-violet-600", bgColor: "bg-violet-50" },
  social_sciences: { label: "Social Sciences", color: "text-amber-600", bgColor: "bg-amber-50" },
  commerce: { label: "Commerce", color: "text-teal-600", bgColor: "bg-teal-50" },
  computer: { label: "Computer & IT", color: "text-indigo-600", bgColor: "bg-indigo-50" },
  arts: { label: "Arts & Creativity", color: "text-pink-600", bgColor: "bg-pink-50" },
  physical_education: { label: "Physical Education", color: "text-orange-600", bgColor: "bg-orange-50" },
  vocational: { label: "Vocational", color: "text-slate-600", bgColor: "bg-slate-50" },
};

// Complete CBSE Subject List (Class 6-12)
export interface SubjectInfo {
  id: string;
  name: string;
  code: string;
  icon: LucideIcon;
  category: SubjectCategory;
  description?: string;
}

export const subjectMasterList: SubjectInfo[] = [
  // Sciences
  { id: "phy", name: "Physics", code: "PHY", icon: Atom, category: "sciences", description: "Study of matter, energy, and their interactions" },
  { id: "che", name: "Chemistry", code: "CHE", icon: Beaker, category: "sciences", description: "Study of substances and chemical reactions" },
  { id: "bio", name: "Biology", code: "BIO", icon: Dna, category: "sciences", description: "Study of living organisms" },
  { id: "sci", name: "Science", code: "SCI", icon: FlaskConical, category: "sciences", description: "General science for middle school" },
  { id: "evs", name: "Environmental Studies", code: "EVS", icon: Leaf, category: "sciences", description: "Study of environment and ecology" },
  
  // Mathematics
  { id: "mat", name: "Mathematics", code: "MAT", icon: Calculator, category: "mathematics", description: "Study of numbers, quantities, and shapes" },
  { id: "mab", name: "Mathematics (Basic)", code: "MAB", icon: Calculator, category: "mathematics", description: "Basic mathematics for Class 10" },
  { id: "mas", name: "Mathematics (Standard)", code: "MAS", icon: Sigma, category: "mathematics", description: "Standard mathematics for Class 10" },
  { id: "apm", name: "Applied Mathematics", code: "APM", icon: TrendingUp, category: "mathematics", description: "Mathematics for real-world applications" },
  
  // Languages
  { id: "eng", name: "English", code: "ENG", icon: BookOpen, category: "languages", description: "English language and literature" },
  { id: "hin", name: "Hindi", code: "HIN", icon: Languages, category: "languages", description: "Hindi language and literature" },
  { id: "san", name: "Sanskrit", code: "SAN", icon: BookText, category: "languages", description: "Classical Sanskrit language" },
  { id: "urd", name: "Urdu", code: "URD", icon: Languages, category: "languages", description: "Urdu language and literature" },
  { id: "fre", name: "French", code: "FRE", icon: Languages, category: "languages", description: "French language" },
  { id: "ger", name: "German", code: "GER", icon: Languages, category: "languages", description: "German language" },
  { id: "spa", name: "Spanish", code: "SPA", icon: Languages, category: "languages", description: "Spanish language" },
  
  // Social Sciences
  { id: "his", name: "History", code: "HIS", icon: Landmark, category: "social_sciences", description: "Study of past events" },
  { id: "geo", name: "Geography", code: "GEO", icon: Globe2, category: "social_sciences", description: "Study of Earth and its features" },
  { id: "pol", name: "Political Science", code: "POL", icon: Scale, category: "social_sciences", description: "Study of government and politics" },
  { id: "eco", name: "Economics", code: "ECO", icon: TrendingUp, category: "social_sciences", description: "Study of production, distribution, and consumption" },
  { id: "soc", name: "Sociology", code: "SOC", icon: Brain, category: "social_sciences", description: "Study of society and social behavior" },
  { id: "psy", name: "Psychology", code: "PSY", icon: Brain, category: "social_sciences", description: "Study of mind and behavior" },
  { id: "sst", name: "Social Science", code: "SST", icon: Globe2, category: "social_sciences", description: "Combined social studies for middle school" },
  
  // Commerce
  { id: "acc", name: "Accountancy", code: "ACC", icon: Building2, category: "commerce", description: "Study of financial record-keeping" },
  { id: "bst", name: "Business Studies", code: "BST", icon: Briefcase, category: "commerce", description: "Study of business operations" },
  { id: "ent", name: "Entrepreneurship", code: "ENT", icon: Briefcase, category: "commerce", description: "Study of starting and running businesses" },
  
  // Computer & IT
  { id: "cs", name: "Computer Science", code: "CS", icon: Code, category: "computer", description: "Study of computation and programming" },
  { id: "ip", name: "Informatics Practices", code: "IP", icon: Monitor, category: "computer", description: "Practical IT applications" },
  { id: "ai", name: "Artificial Intelligence", code: "AI", icon: Brain, category: "computer", description: "Study of intelligent systems" },
  
  // Arts & Creativity
  { id: "art", name: "Fine Arts", code: "ART", icon: Palette, category: "arts", description: "Visual arts and drawing" },
  { id: "mus", name: "Music", code: "MUS", icon: Music, category: "arts", description: "Study of music and performance" },
  { id: "hec", name: "Home Science", code: "HEC", icon: Heart, category: "arts", description: "Study of home management" },
  
  // Physical Education
  { id: "ped", name: "Physical Education", code: "PED", icon: Dumbbell, category: "physical_education", description: "Sports and physical fitness" },
  { id: "hpe", name: "Health & Physical Education", code: "HPE", icon: Heart, category: "physical_education", description: "Health and fitness studies" },
  
  // General/Foundation
  { id: "gen", name: "General Knowledge", code: "GK", icon: GraduationCap, category: "vocational", description: "General awareness" },
  { id: "mor", name: "Moral Science", code: "MOR", icon: Heart, category: "vocational", description: "Ethics and values education" },
];

// Quick lookup map
export const subjectMap = new Map(subjectMasterList.map(s => [s.id, s]));
export const subjectByNameMap = new Map(subjectMasterList.map(s => [s.name.toLowerCase(), s]));
export const subjectByCodeMap = new Map(subjectMasterList.map(s => [s.code.toLowerCase(), s]));

// Helper to find subject by name, code, or id
export const findSubject = (identifier: string): SubjectInfo | undefined => {
  const lower = identifier.toLowerCase();
  return subjectMap.get(lower) || 
         subjectByNameMap.get(lower) || 
         subjectByCodeMap.get(lower) ||
         subjectMasterList.find(s => s.name.toLowerCase().includes(lower));
};

// Badge sizes
type BadgeSize = "xs" | "sm" | "md" | "lg";

interface SubjectBadgeProps {
  subject: string | SubjectInfo;
  size?: BadgeSize;
  showIcon?: boolean;
  showCategory?: boolean;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

const sizeConfig: Record<BadgeSize, { text: string; icon: string; padding: string; gap: string }> = {
  xs: { text: "text-xs", icon: "w-3 h-3", padding: "px-1.5 py-0.5", gap: "gap-1" },
  sm: { text: "text-sm", icon: "w-3.5 h-3.5", padding: "px-2 py-1", gap: "gap-1.5" },
  md: { text: "text-sm", icon: "w-4 h-4", padding: "px-2.5 py-1.5", gap: "gap-2" },
  lg: { text: "text-base", icon: "w-5 h-5", padding: "px-3 py-2", gap: "gap-2" },
};

export const SubjectBadge = ({ 
  subject, 
  size = "sm", 
  showIcon = true, 
  showCategory = false,
  className,
  variant = "default"
}: SubjectBadgeProps) => {
  // Resolve subject info
  const subjectInfo: SubjectInfo | undefined = 
    typeof subject === "string" ? findSubject(subject) : subject;
  
  // Fallback for unknown subjects
  if (!subjectInfo) {
    return (
      <span className={cn(
        "inline-flex items-center rounded-md font-medium bg-muted text-muted-foreground",
        sizeConfig[size].padding,
        sizeConfig[size].text,
        sizeConfig[size].gap,
        className
      )}>
        {showIcon && <BookOpen className={sizeConfig[size].icon} />}
        <span>{typeof subject === "string" ? subject : "Unknown"}</span>
      </span>
    );
  }

  const Icon = subjectInfo.icon;
  const categoryConfig = subjectCategoryConfig[subjectInfo.category];
  
  const variantStyles = {
    default: cn(categoryConfig.bgColor, categoryConfig.color),
    outline: cn("bg-transparent border", categoryConfig.color, `border-current`),
    ghost: cn("bg-transparent", categoryConfig.color),
  };

  return (
    <span className={cn(
      "inline-flex items-center rounded-md font-medium transition-colors",
      sizeConfig[size].padding,
      sizeConfig[size].text,
      sizeConfig[size].gap,
      variantStyles[variant],
      className
    )}>
      {showIcon && <Icon className={cn(sizeConfig[size].icon, "flex-shrink-0")} />}
      <span>{subjectInfo.name}</span>
      {showCategory && (
        <span className="opacity-60 text-xs">({categoryConfig.label})</span>
      )}
    </span>
  );
};

// Export helper to get icon by subject name
export const getSubjectIcon = (subject: string): LucideIcon => {
  const info = findSubject(subject);
  return info?.icon || BookOpen;
};

// Export helper to get category by subject name
export const getSubjectCategory = (subject: string): SubjectCategory | undefined => {
  const info = findSubject(subject);
  return info?.category;
};

export default SubjectBadge;
