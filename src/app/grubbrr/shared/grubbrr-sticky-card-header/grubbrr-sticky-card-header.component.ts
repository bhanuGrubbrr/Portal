import {
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  Input,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-grubbrr-sticky-card-header',
  templateUrl: './grubbrr-sticky-card-header.component.html',
  styleUrls: ['./grubbrr-sticky-card-header.component.scss'],
})
export class GrubbrrStickyCardHeaderComponent {
  offSet = 20;
  @Input() cardTitle: string;
  @ContentChild('templateRef') templateRef: TemplateRef<any>;
  @ViewChild('cardHeader') cardHeaderRef: ElementRef;

  constructor() {}

  // Adding some customs styles that were in the
  // html version of metronic sticky card headers
  // we seem to be overiding the event here
  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e: Event) {
    const stickyCardHeader = this.cardHeaderRef.nativeElement as HTMLElement;
    const menuCollapsed = document.body.hasAttribute('data-kt-aside-minimize');

    if (window.scrollY > this.offSet) {
      if (window.innerWidth < 992) {
        // left right should be 15px
        stickyCardHeader.style.left = '15px';
        stickyCardHeader.style.right = '15px';
      } else {
        if (menuCollapsed) {
          stickyCardHeader.style.left = '105px';
        } else {
          stickyCardHeader.style.left = '295px';
        }

        stickyCardHeader.style.right = '30px';
        stickyCardHeader.style.top = '109px';
        stickyCardHeader.style.zIndex = '90';
      }

      document.body.classList.add('card-sticky-on');
    } else {
      document.body.classList.remove('card-sticky-on');
    }
  }
}
