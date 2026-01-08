// Institute Roles & Access Types

export interface ModulePermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface TimetablePermission extends ModulePermission {
  capabilities: {
    setup: boolean;
    workspace: boolean;
    substitution: boolean;
  };
}

export interface ExamsPermission extends ModulePermission {
  capabilities: {
    createManual: boolean;
    uploadPDF: boolean;
    assignBatches: boolean;
    scheduleExams: boolean;
  };
}

export interface InstituteRolePermissions {
  dashboard: { view: boolean };
  batches: ModulePermission;
  teachers: ModulePermission;
  students: ModulePermission;
  timetable: TimetablePermission;
  questionBank: ModulePermission;
  contentLibrary: ModulePermission;
  exams: ExamsPermission;
  masterData: { view: boolean };
  settings: { view: boolean; edit: boolean };
  rolesAccess: ModulePermission;
}

export interface InstituteRole {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissions: InstituteRolePermissions;
  memberCount: number;
  createdAt: string;
}

export interface InstituteStaffMember {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  roleTypeId: string;
  status: "active" | "inactive";
  createdAt: string;
}

export const defaultInstitutePermissions: InstituteRolePermissions = {
  dashboard: { view: true },
  batches: { view: false, create: false, edit: false, delete: false },
  teachers: { view: false, create: false, edit: false, delete: false },
  students: { view: false, create: false, edit: false, delete: false },
  timetable: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    capabilities: { setup: false, workspace: false, substitution: false },
  },
  questionBank: { view: false, create: false, edit: false, delete: false },
  contentLibrary: { view: false, create: false, edit: false, delete: false },
  exams: {
    view: false,
    create: false,
    edit: false,
    delete: false,
    capabilities: { createManual: true, uploadPDF: true, assignBatches: true, scheduleExams: true },
  },
  masterData: { view: true },
  settings: { view: false, edit: false },
  rolesAccess: { view: false, create: false, edit: false, delete: false },
};
