import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class UserPrincipalService {
  constructor(private userService: UserService) {}

  public async AccessCheckCompany(
    companyId: string,
    resourceType: RbacResourceType,
    accessType: RbacAccessType
  ) {
    var me = await this.userService.getUserMe();
    if (me.isAdmin) {
      return true;
    }
    const rbacAccess = await this.userService.getUserAccess(companyId);
    //const rbacAccess = await this.getRbacAccess(companyId);

    return rbacAccess?.AccessCheckCompany(companyId, resourceType, accessType);
  }

  public async AccessCheckLocation(
    companyId: string,
    locationId: string,
    resourceType: RbacResourceType,
    accessType: RbacAccessType
  ) {
    var me = await this.userService.getUserMe();
    if (me.isAdmin) {
      return true;
    }
    const rbacAccess = await this.userService.getUserAccess(companyId);
    return rbacAccess?.AccessCheckLocation(
      companyId,
      locationId,
      resourceType,
      accessType
    );
  }

  public async IsAdmin() {
    var me = await this.userService.getUserMe();
    return me.isAdmin;
  }
}

export class RbacAccess {
  public roleAssignments: RbacRoleAssignment[];

  public constructor(roleAssignments: RbacRoleAssignment[] | undefined) {
    this.roleAssignments = Array<RbacRoleAssignment>();
    for (var roleAssignment of roleAssignments ?? Array<RbacRoleAssignment>()) {
      this.roleAssignments.push(
        new RbacRoleAssignment(
          roleAssignment.scopeId,
          new RbacRole(roleAssignment.role)
        )
      );
    }
  }

  public AccessCheckCompany(
    companyId: string,
    resourceType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    var isAllowed = this._isAlowed(companyId, resourceType, requestedAccess);
    if (isAllowed) return true;

    if (requestedAccess == RbacAccessType.Read) {
      // If a user has any access to at least one location, they must be allowed to read the location object
      // otherwise the UI won't work.  We do require check on the same Resource Type
      for (var role of this.roleAssignments) {
        var allowed = role.IsAllowed(
          role.scopeId,
          resourceType,
          requestedAccess
        );
        if (allowed) return true;
      }
    }

    return false;
  }

  public AccessCheckLocation(
    companyId: string,
    locationId: string,
    resourceType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    // check for access based on the companyId, then try based on the locationId
    var isAllowed = this._isAlowed(companyId, resourceType, requestedAccess);
    if (!isAllowed) {
      isAllowed = this._isAlowed(locationId, resourceType, requestedAccess);
      if (!isAllowed) return false;
    }

    return true;
  }

  private _isAlowed(
    resourceScopeId: string,
    resourceType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    for (var role of this.roleAssignments) {
      var allowed = role.IsAllowed(
        resourceScopeId,
        resourceType,
        requestedAccess
      );
      if (allowed) return true;
    }

    // if (await currentUser.IsSupportAdmin())
    //     return true;

    return false;
  }
}

export class RbacRoleAssignment {
  constructor(public scopeId: string, public role: RbacRole) {
    this.role = new RbacRole(this.role);
  }

  public IsAllowed(
    requestedScope: string,
    targetType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    if (requestedScope == this.scopeId) {
      if (this.role.IsAllowed(targetType, requestedAccess)) return true;
    }
    return false;
  }
}

export class RbacRole {
  name: string;
  accessRights: RbacAccessRight[];

  constructor(role: RbacRole) {
    this.name = role.name;
    this.accessRights = Array<RbacAccessRight>();
    for (var accessRight of role.accessRights) {
      this.accessRights.push(new RbacAccessRight(accessRight));
    }
  }

  public IsAllowed(
    targetType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    for (const accessRight of this.accessRights) {
      if (accessRight.IsAllowed(targetType, requestedAccess)) return true;
    }

    return false;
  }
}

export class RbacAccessRight {
  public resourceType: RbacResourceType;
  public accessType: RbacAccessType;

  constructor(input: RbacAccessRight) {
    this.resourceType = input.resourceType;
    this.accessType = input.accessType;
  }

  public IsAllowed(
    targetType: RbacResourceType,
    requestedAccess: RbacAccessType
  ): boolean {
    if (
      targetType == this.resourceType ||
      this.resourceType == RbacResourceType.Any
    ) {
      if (
        this.accessType == requestedAccess ||
        this.accessType == RbacAccessType.Full
      )
        return true;
    }
    return false;
  }
}

export enum RbacResourceType {
  Any = 'Any',
  Config = 'Config',
  Menu = 'Menu',
  Orders = 'Orders',
  Access = 'Access',
}

export enum RbacAccessType {
  Full = 'Full',
  Read = 'Read',
  Write = 'Write',
}
