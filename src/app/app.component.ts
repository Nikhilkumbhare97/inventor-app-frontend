import { Component, HostListener } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'inventor-app-frontend';
  lastScrollTop = 0;
  headerHidden = false;
  isLoginPage = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationEnd)
    ).subscribe(event => {
      const navEnd = event as NavigationEnd;
      this.isLoginPage = navEnd.urlAfterRedirects.includes('/login');
      this.headerHidden = this.isLoginPage;
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (this.isLoginPage) return;

    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 80) {
      this.headerHidden = true;
    } else {
      this.headerHidden = false;
    }

    this.lastScrollTop = Math.max(currentScroll, 0);
  }
}
