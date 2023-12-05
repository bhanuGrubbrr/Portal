import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  OrderTypeTestVM,
  SectionsTestVM,
} from 'src/app/grubbrr/generated/common_pb';
import { OrderTypeOptionVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { MenuSection } from 'src/app/grubbrr/generated/menu_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { MenuService } from 'src/app/grubbrr/service/menu.service';
import { IModalConfiguration, IModalResponse, RuleTypes } from '../../rules';
type SelectableSection = MenuSection & { checked?: boolean };

@Component({
  selector: 'app-sections-rule',
  templateUrl: './sections-rule.component.html',
  styleUrls: ['./sections-rule.component.scss'],
})
export class SectionsRuleComponent implements OnInit {
  static RuleType = RuleTypes.SectionsRule;

  public Loaded: boolean = false;
  public Sections: SelectableSection[];

  constructor(
    public activeModal: NgbActiveModal,
    private kioskConfig: KioskConfigService,
    private config: IModalConfiguration,
    private menuService: MenuService
  ) {}

  close() {
    let response: IModalResponse = {
      success: false,
    };
    this.activeModal.close(response);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  private async fetchData() {
    let res = (await this.menuService.getMenu(this.config.locationId))
      .effectiveMenu!;

    if (res) {
      this.Sections = res.menuSections.map((section) => {
        return Object.assign({}, section, { checked: false });
      });
    }

    let tests = this.config.tests?.find(
      (t) => t.test.oneofKind == 'sectionsTest'
    );
    if (tests && tests.test.oneofKind == 'sectionsTest') {
      tests.test.sectionsTest.sections.forEach((section) => {
        let target = this.Sections.find((o) => o.id == section);
        if (target) {
          target.checked = true;
        }
      });
    }
    this.Loaded = true;
  }

  HandleInput(event: any, orderType: SelectableSection) {
    orderType.checked = event.target.checked;
  }

  save() {
    let payload = { sections: [] } as SectionsTestVM;
    this.Sections.filter((t) => t.checked).forEach((section) => {
      payload.sections.push(section.id);
    });
    let response: IModalResponse = {
      success: true,
      RuleType: SectionsRuleComponent.RuleType,
      Payload: payload,
    };
    this.activeModal.close(response);
  }
}
