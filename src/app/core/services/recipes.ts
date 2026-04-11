import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { from, map, Observable, of } from 'rxjs';
import { firebaseDb } from '../config/firebase.config.js';
import { RecipeFormModel, RecipeModel } from '../../shared/interfaces/recipe.model.js';

@Injectable({
  providedIn: 'root',
})
export class Recipes {
  private readonly recipesCollection = collection(firebaseDb, 'recipes');

  getAllRecipes(): Observable<RecipeModel[]> {
    return from(getDocs(this.recipesCollection)).pipe(
      map((snapshot) =>
        snapshot.docs
          .map((recipeDoc) => this.mapRecipe(recipeDoc.id, recipeDoc.data()))
          .sort((first, second) => second.createdAt.localeCompare(first.createdAt)),
      ),
    );
  }

  getRecipeById(id: string): Observable<RecipeModel | null> {
    if (!id.trim()) {
      return of(null);
    }

    const recipeDoc = doc(firebaseDb, 'recipes', id);

    return from(getDoc(recipeDoc)).pipe(
      map((snapshot) => (snapshot.exists() ? this.mapRecipe(snapshot.id, snapshot.data()) : null)),
    );
  }

  getRecipesByOwner(ownerId: string): Observable<RecipeModel[]> {
    if (!ownerId.trim()) {
      return of([]);
    }

    const ownerQuery = query(this.recipesCollection, where('ownerId', '==', ownerId));

    return from(getDocs(ownerQuery)).pipe(
      map((snapshot) =>
        snapshot.docs
          .map((recipeDoc) => this.mapRecipe(recipeDoc.id, recipeDoc.data()))
          .sort((first, second) => second.createdAt.localeCompare(first.createdAt)),
      ),
    );
  }

  createRecipe(recipe: RecipeFormModel, ownerId: string): Observable<string> {
    const payload = {
      ...recipe,
      ownerId,
      createdAt: new Date().toISOString(),
    };

    return from(addDoc(this.recipesCollection, payload)).pipe(
      map((documentReference) => documentReference.id),
    );
  }

  updateRecipe(id: string, recipe: RecipeFormModel): Observable<void> {
    const recipeDoc = doc(firebaseDb, 'recipes', id);

    return from(updateDoc(recipeDoc, { ...recipe }));
  }

  deleteRecipe(id: string): Observable<void> {
    const recipeDoc = doc(firebaseDb, 'recipes', id);

    return from(deleteDoc(recipeDoc));
  }

  private mapRecipe(id: string, data: unknown): RecipeModel {
    const recipeData = data as Partial<Omit<RecipeModel, 'id'>>;

    return {
      id,
      title: recipeData.title ?? '',
      imageUrl: recipeData.imageUrl ?? '',
      category: recipeData.category ?? '',
      cookingTime: Number(recipeData.cookingTime ?? 0),
      ingredients: recipeData.ingredients ?? '',
      instructions: recipeData.instructions ?? '',
      ownerId: recipeData.ownerId ?? '',
      createdAt: recipeData.createdAt ?? '',
    };
  }
}
