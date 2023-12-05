import { style } from '@angular/animations';
import {
  Input,
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-kiosk-designer-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
})
export class DropdownSelectComponent implements OnDestroy {
  //input props
  /** @todo remove this property and make optionsMap:Map<string,boolean>() for multiple selected options @property array of data to be injected into dropdown select, one row per element */
  @Input() options: string[];
  /** @todo remove this property and make optionsMap:Map<string,boolean>() for multiple selected options  @property zero-based index of selected property */
  @Input() selectedIndex: number | undefined;
  /** @property unique value used to identify this element in the DOM */
  @Input() id: string;

  @Output() selectOption = new EventEmitter<number>();
  //computed props
  above: boolean = false;
  styleOverrideTag: HTMLStyleElement | undefined;

  styleObject: { top: string; bottom: string } = {
    top: '0px',
    bottom: '0px',
  };
  //state props
  active: boolean = false;
  constructor() {}
  ngOnDestroy(): void {
    this.removeOverride();
  }
  removeOverride() {
    try {
      if (this.styleOverrideTag)
        document.body.removeChild(this.styleOverrideTag);
    } catch (e) {
      //swallow error if thrown
      //error means override was already removed
    }
  }
  deactivate() {
    this.active = false;
    this.removeOverride();
  }
  activate() {
    let self = document.getElementById(`${this.id}-ellipse`);
    if (!self) return;
    this.active = true;
    let bounds = self.getBoundingClientRect();
    let elemheight = bounds.height;
    let height = window.innerHeight || document.body.clientHeight;
    this.above = height - bounds.bottom < 305;
    this.styleObject = Object.assign({}, this.styleObject, {
      top: this.above ? '' : `${elemheight + 2}px`,
      bottom: this.above ? `${elemheight + 2}px` : '',
    });
    // conditional if, avoids generating this tag if no user interaction with the dropdown,
    // avoids regeneration if interacting with dropdown multiple times
    //belongs in a windoeScrollBlocker service
    //keep in mind, current issue with top-right icons moving when scroll blocked
    if (!this.styleOverrideTag) {
      this.styleOverrideTag = document.createElement('style');
      this.styleOverrideTag.type = 'text/css';
      this.styleOverrideTag.textContent = `
      body {
        overflow:hidden !important;
        padding-right:${
          //gives difference between window and drawable page
          //this difference is zero when no scrolling is present
          //otherwise this difference is the width of a scrollbar
          window.innerWidth - document.documentElement.clientWidth
        }px;
      }
      `;
    }
    document.body.appendChild(this.styleOverrideTag);
  }
  select(x: number) {
    this.selectedIndex = x;
    this.selectOption.emit(x);
  }
}
