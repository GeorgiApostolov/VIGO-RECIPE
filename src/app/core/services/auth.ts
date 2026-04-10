import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth } from '../config/firebase.config.js';
import { UserModel } from '../../shared/interfaces/user.model.js';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly userSubject = new BehaviorSubject<UserModel | null>(null);
  private hasRestoredSession = false;

  readonly currentUser$ = this.userSubject
    .asObservable()
    .pipe(
      distinctUntilChanged(
        (previous, current) =>
          previous?.id === current?.id &&
          previous?.email === current?.email &&
          previous?.accessToken === current?.accessToken,
      ),
    );

  readonly isLoggedIn$ = this.currentUser$.pipe(map((user) => user !== null));

  get currentUser(): UserModel | null {
    return this.userSubject.value;
  }

  restoreSession(): void {
    if (this.hasRestoredSession) {
      return;
    }

    this.hasRestoredSession = true;

    onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (!firebaseUser) {
        this.userSubject.next(null);
        return;
      }

      const user = await this.mapFirebaseUser(firebaseUser);
      this.userSubject.next(user);
    });
  }

  logout(): void {
    signOut(firebaseAuth).catch((error: unknown) => {
      console.error('Firebase logout error', error);
    });
  }

  private async mapFirebaseUser(firebaseUser: FirebaseUser): Promise<UserModel> {
    const accessToken = await firebaseUser.getIdToken();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      accessToken,
    };
  }
}
