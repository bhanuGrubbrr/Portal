import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { LocationIdService } from '../service/location-id.service';
import {
  RbacAccessType,
  RbacResourceType,
  UserPrincipalService,
} from '../service/user-principal.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[writeConfigRequired],[writeAccessRequired]',
})
export class AccessCheckDirective implements OnInit, OnDestroy {
  @Input() writeConfigRequired: string;
  @Input() writeAccessRequired: string;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private userPrincipal: UserPrincipalService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private locationIdService: LocationIdService
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    let scopeId: string;
    let resourceType: RbacResourceType;
    let access: RbacAccessType;

    if (this.writeConfigRequired) {
      scopeId = this.writeConfigRequired;
      access = RbacAccessType.Write;
      resourceType = RbacResourceType.Config;
    } else if (this.writeAccessRequired) {
      scopeId = this.writeAccessRequired;
      access = RbacAccessType.Write;
      resourceType = RbacResourceType.Access;
    } else {
      throw new Error('AccessCheck not specified scope');
    }

    var isAllowed: boolean | undefined;
    if (this.locationIdService.IsLocationId(scopeId)) {
      var companyId = await this.locationIdService.GetCompanyIdFromLocationId(
        scopeId
      );
      isAllowed = await this.userPrincipal.AccessCheckLocation(
        companyId,
        scopeId,
        resourceType,
        access
      );
    } else {
      isAllowed = await this.userPrincipal.AccessCheckCompany(
        scopeId,
        resourceType,
        access
      );
    }

    if (isAllowed) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  ngOnDestroy() {
    this.onDestroy$.next(true);
    this.onDestroy$.unsubscribe();
  }
}
