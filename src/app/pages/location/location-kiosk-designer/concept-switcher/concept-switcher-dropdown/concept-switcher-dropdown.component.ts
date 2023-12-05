import {
  Component,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
} from '@angular/core';
import { ConceptVM } from 'src/app/grubbrr/generated/kioskConfig_pb';

@Component({
  selector: 'app-concept-switcher-dropdown',
  templateUrl: './concept-switcher-dropdown.component.html',
  styleUrls: ['./concept-switcher-dropdown.component.scss'],
})
export class ConceptSwitcherDropdownComponent implements OnDestroy {
  //input props
  @Input() concepts: ConceptVM[];
  @Input() activeConceptId: string;
  @Output() conceptChangeEvent = new EventEmitter<ConceptVM>();

  //computed props
  styleOverrideTag: HTMLStyleElement | undefined;

  styleObject: { top: string; bottom: string; left: string; right: string } = {
    top: '0px',
    bottom: '0px',
    left: '0px',
    right: '0px',
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
    let self = document.getElementById('action-chevron');
    if (!self) return;
    this.active = true;
    let bounds = self.getBoundingClientRect();
    let elemheight = bounds.height;
    let height = window.innerHeight || document.body.clientHeight;
    this.styleObject = Object.assign({}, this.styleObject, {
      top: '1rem',
      bottom: ``,
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
  select(x: ConceptVM) {
    this.conceptChangeEvent.emit(x);
  }
}
