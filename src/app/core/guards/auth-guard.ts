import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, take } from 'rxjs';
import { Auth } from '../services/auth.js';

export const authGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  const router = inject(Router);

  auth.restoreSession();

  return auth.authReady$.pipe(
    take(1),
    map((): boolean | UrlTree => {
      return auth.currentUser ? true : router.createUrlTree(['/login']);
    }),
  );
};
