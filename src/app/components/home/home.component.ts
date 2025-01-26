import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  menuOpen = false;
  userMenuOpen = false;
  activeTab = 'users';

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
