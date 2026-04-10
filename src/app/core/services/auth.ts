import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map } from 'rxjs';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
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

  async register(email: string, password: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
    const user = await this.mapFirebaseUser(userCredential.user);
    this.userSubject.next(user);
  }

  async login(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = await this.mapFirebaseUser(userCredential.user);
    this.userSubject.next(user);
  }

  logout(): void {
    signOut(firebaseAuth).catch((error: unknown) => {
      console.error('Firebase logout error', error);
    });
  }

  getErrorMessage(error: unknown): string {
    if (!this.isFirebaseError(error)) {
      return 'Something went wrong. Please try again.';
    }

    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/missing-password':
        return 'Password is required.';
      case 'auth/invalid-credential':
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Check your internet connection.';
      case 'auth/operation-not-allowed':
        return 'Email and password sign-in is not enabled in Firebase.';
      default:
        return 'Authentication failed. Please try again.';
    }
  }

  private async mapFirebaseUser(firebaseUser: FirebaseUser): Promise<UserModel> {
    const accessToken = await firebaseUser.getIdToken();

    return {
      id: firebaseUser.uid,
      email: firebaseUser.email ?? '',
      accessToken,
    };
  }

  private isFirebaseError(error: unknown): error is { code: string } {
    return typeof error === 'object' && error !== null && 'code' in error;
  }
}
