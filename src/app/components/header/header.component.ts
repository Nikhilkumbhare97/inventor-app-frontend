import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  menuOpen = false;
  userMenuOpen = false;
  constructor(private router: Router) { };

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  navigateTo(route: string) {
    this.toggleMenu();
    this.router.navigate([route]);
  }

  navigateHome() {
    this.router.navigate(['/home']);
  }
}
