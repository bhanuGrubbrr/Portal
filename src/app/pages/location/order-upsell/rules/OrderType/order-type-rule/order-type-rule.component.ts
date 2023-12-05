import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderTypeTestVM } from 'src/app/grubbrr/generated/common_pb';
import { OrderTypeOptionVM } from 'src/app/grubbrr/generated/kioskConfig_pb';
import { KioskConfigService } from 'src/app/grubbrr/service/kioskConfig.service';
import { IModalConfiguration, IModalResponse, RuleTypes } from '../../rules';
type SelectableOrderType = OrderTypeOptionVM & { checked?: boolean };

@Component({
  selector: 'app-order-type-rule',
  templateUrl: './order-type-rule.component.html',
  styleUrls: ['./order-type-rule.component.scss'],
})
export class OrderTypeRuleComponent implements OnInit {
  static RuleType = RuleTypes.OrderTypeRule;

  public Loaded: boolean = false;
  public OrderTypes: SelectableOrderType[];

  constructor(
    public activeModal: NgbActiveModal,
    private kioskConfig: KioskConfigService,
    private config: IModalConfiguration
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
    let res = await this.kioskConfig.getOrderTypes(this.config.locationId);
    if (res) {
      this.OrderTypes = res.options;
    }

    let tests = this.config.tests?.find(
      (t) => t.test.oneofKind == 'orderTypeTest'
    );
    if (tests && tests.test.oneofKind == 'orderTypeTest') {
      tests.test.orderTypeTest.orderTypes.forEach((type) => {
        let target = this.OrderTypes.find((o) => o.id == type);
        if (target) {
          target.checked = true;
        }
      });
    }

    this.Loaded = true;
  }

  HandleInput(event: any, orderType: SelectableOrderType) {
    orderType.checked = event.target.checked;
  }

  save() {
    let payload = { orderTypes: [] } as OrderTypeTestVM;
    this.OrderTypes.filter((t) => t.checked).forEach((type) => {
      payload.orderTypes.push(type.id);
    });
    let response: IModalResponse = {
      success: true,
      RuleType: OrderTypeRuleComponent.RuleType,
      Payload: payload,
    };
    this.activeModal.close(response);
  }
}
