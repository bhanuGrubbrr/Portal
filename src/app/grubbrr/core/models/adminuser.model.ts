export class AdminUserModel {
  email: string;
  role: string;
}

export type AdminDeactivateUserModel = Pick<AdminUserModel, 'email'>;
