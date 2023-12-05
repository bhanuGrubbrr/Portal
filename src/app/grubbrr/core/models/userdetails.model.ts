import { FeatureRoles, Roles } from 'src/app/core/global-constants';

export class UserDetailsModel {
  username: string;
  profilePicture: string;
  companyIds: string[];
  isAdmin: boolean;
  featureRoles: FeatureRoles[] = [];
}
export default new UserDetailsModel();
