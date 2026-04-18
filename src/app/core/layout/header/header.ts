import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth.js';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private auth = inject(Auth);
  private router = inject(Router);

  currentUser$ = this.auth.currentUser$;
  isLoggedIn$ = this.auth.isLoggedIn$;

  async logout(): Promise<void> {
    try {
      await this.auth.logout();
      await this.router.navigateByUrl('/');
    } catch {
      // no-op
    }
  }
}
