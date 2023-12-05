import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-location-list-editor',
  templateUrl: './location-list-editor.component.html',
  styleUrls: ['./location-list-editor.component.scss'],
})
export class LocationListEditorComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    // wired up
  }
}
