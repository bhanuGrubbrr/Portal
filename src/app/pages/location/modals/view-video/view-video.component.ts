import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.scss'],
})
export class ViewVideoComponent implements OnInit {
  @Input() fromParent: any;
  src: string;
  isVideo: boolean;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.src = this.fromParent.src.url ?? this.fromParent.src.displayUrl;
    this.isVideo = this.checkURL(this.src);
  }

  checkURL(url: string) {
    return url.match(/\.(mp4)$/) != null;
  }
}
