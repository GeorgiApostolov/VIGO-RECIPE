import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { UserModel } from '../../shared/interfaces/user.model.js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly storageKey = 'vigo-recipe-user';
  private readonly userSubject = new BehaviorSubject<UserModel | null>(null);

  readonly currentUser$ = this.userSubject.asObservable().pipe(distinctUntilChanged());
  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => user !== null));

  get currentUser(): UserModel | null {
    return this.userSubject.value;
  }

  restoreSession(): void {
    const storedUser = localStorage.getItem(this.storageKey);

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser) as UserModel;
      this.userSubject.next(parsedUser);
    } catch {
      localStorage.removeItem(this.storageKey);
      this.userSubject.next(null);
    }
  }

  setUser(user: UserModel): void {
    localStorage.setItem(this.storageKey, JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.userSubject.next(null);
  }
}
