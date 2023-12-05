import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { screenSaver } from 'src/app/grubbrr/core/models/screensaver.model';

@Component({
  selector: 'app-screen-saver-delete',
  templateUrl: './screen-saver-delete.component.html',
  styleUrls: ['./screen-saver-delete.component.scss'],
})
export class ScreenSaverDeleteComponent implements OnInit {
  @Input() fromParent: any;
  screenSaver: screenSaver;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.screenSaver = this.fromParent.screenSaver;
  }

  closeModal(message: string) {
    this.activeModal.close(this.screenSaver.displayOrder);
  }
}
