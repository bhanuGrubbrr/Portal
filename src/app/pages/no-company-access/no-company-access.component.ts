import { Component, HostBinding, OnInit } from '@angular/core';
import { UserDetailsModel } from 'src/app/grubbrr/core/models/userdetails.model';
import { UserService } from 'src/app/grubbrr/service/user.service';

@Component({
  selector: 'app-no-company-access',
  templateUrl: './no-company-access.component.html',
  styleUrls: ['./no-company-access.component.scss'],
})
export class NoCompanyAccessComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';

  currentUser: UserDetailsModel;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUser();
  }
  private async fetchUser() {
    this.currentUser = await this.userService.getUserMe();
  }
}
