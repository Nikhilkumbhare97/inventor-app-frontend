import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  activeTab = 'users';

  constructor(private router: Router) { }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
