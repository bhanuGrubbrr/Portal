import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import { UserPrincipalService } from '../service/user-principal.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[requiresGrubbrrAdmin]',
})
export class RequiresGrubbrrAdminDirective implements OnInit, OnDestroy {
  @Input() requiresGrubbrrAdmin: string;

  private onDestroy$ = new Subject<boolean>();

  constructor(
    private userPrincipal: UserPrincipalService,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit() {
    this.init();
  }

  async init() {
    let isAllowed: Boolean;
    //const adminLevel = this.requiresGrubbrrAdmin ?? "SupportAdmin";
    // TODO: check SysAdmin vs. SupportAdmin eventually
    isAllowed = await this.userPrincipal.IsAdmin();

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
