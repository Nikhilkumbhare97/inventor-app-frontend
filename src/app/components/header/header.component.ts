import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  menuOpen = false;
  userMenuOpen = false;
  @ViewChild('userSection', { static: false }) userSectionRef!: ElementRef;
  constructor(private router: Router) { }

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

  navigateToChangePassword() {
    this.router.navigate(['/change-password']);
  }

  signOut() {
    // Do sign-out logic here (e.g., clear tokens, call logout API)
    this.router.navigate(['/login']);
  }

  // 👇 Detect clicks outside user section to close the user menu
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const clickedInside = this.userSectionRef?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.userMenuOpen = false;
    }
  }
}
