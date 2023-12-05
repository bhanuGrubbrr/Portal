export class AddRoleAssignmentModel {
  userEmail: string;
  role: string;
}
export class RoleAssignmentModel {
  userEmail: string;
  role: RoleModel;
  inherited: boolean;
  userId: string;
}
export class RoleModel {
  id: string;
  display: string;
}
