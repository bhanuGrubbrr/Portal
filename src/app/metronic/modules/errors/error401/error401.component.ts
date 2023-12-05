import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error401',
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.scss'],
})
export class Error401Component implements OnInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {}
}
