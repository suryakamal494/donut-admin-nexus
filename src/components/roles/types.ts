// SuperAdmin Roles & Access Types

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface ScopeConfig {
  allClasses: boolean;
  classIds: string[];
  allSubjects: boolean;
  subjectIds: string[];
}

export interface QuestionBankPermission extends ModulePermission {
  scope: ScopeConfig;
  capabilities: {
    manual: boolean;
    aiGeneration: boolean;
    pdfUpload: boolean;
  };
}

export interface ExamsPermission extends ModulePermission {
  types: {
    grandTests: boolean;
    previousYearPapers: boolean;
  };
  scopeInheritFromQuestionBank: boolean;
  scope?: ScopeConfig;
}

export interface ContentLibraryPermission extends ModulePermission {
  capabilities: {
    manualUpload: boolean;
    aiGeneration: boolean;
  };
  scopeInheritFromQuestionBank: boolean;
  scope?: ScopeConfig;
}

export interface InstitutesPermission extends ModulePermission {
  tierManagement: boolean;
}

export interface SuperAdminRolePermissions {
  dashboard: { view: boolean };
  institutes: InstitutesPermission;
  users: ModulePermission;
  masterData: ModulePermission;
  rolesAccess: ModulePermission;
  questionBank: QuestionBankPermission;
  exams: ExamsPermission;
  contentLibrary: ContentLibraryPermission;
}

export interface SuperAdminRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: SuperAdminRolePermissions;
  memberCount: number;
  createdAt: string;
}

export interface SuperAdminTeamMember {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  roleTypeId: string;
  status: "active" | "inactive";
  createdAt: string;
}

// Default empty permissions
export const defaultPermissions: SuperAdminRolePermissions = {
  dashboard: { view: true },
  institutes: { view: false, create: false, edit: false, delete: false, tierManagement: false },
  users: { view: false, create: false, edit: false, delete: false },
  masterData: { view: false, create: false, edit: false, delete: false },
  rolesAccess: { view: false, create: false, edit: false, delete: false },
  questionBank: {
    view: false, create: false, edit: false, delete: false,
    scope: { allClasses: true, classIds: [], allSubjects: true, subjectIds: [] },
    capabilities: { manual: true, aiGeneration: true, pdfUpload: true },
  },
  exams: {
    view: false, create: false, edit: false, delete: false,
    types: { grandTests: true, previousYearPapers: true },
    scopeInheritFromQuestionBank: true,
  },
  contentLibrary: {
    view: false, create: false, edit: false, delete: false,
    capabilities: { manualUpload: true, aiGeneration: true },
    scopeInheritFromQuestionBank: true,
  },
};
