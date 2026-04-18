import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { Auth } from '../../../core/services/auth.js';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeModel } from '../../../shared/interfaces/recipe.model.js';
import { TruncateTextPipe } from '../../../shared/pipes/truncate-text-pipe.js';

type MyRecipesViewModel = {
  recipes: RecipeModel[];
  loading: boolean;
  error: string;
};

@Component({
  selector: 'app-my-recipes',
  imports: [AsyncPipe, DatePipe, RouterLink, TruncateTextPipe],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.scss',
})
export class MyRecipes {
  private auth = inject(Auth);
  private recipesService = inject(Recipes);
  private currentUser = this.auth.currentUser;

  vm$ = !this.currentUser
    ? of<MyRecipesViewModel>({
        recipes: [],
        loading: false,
        error: 'You must be logged in to view your recipes.',
      })
    : this.recipesService.getRecipesByOwner(this.currentUser.id).pipe(
        map(
          (recipes): MyRecipesViewModel => ({
            recipes,
            loading: false,
            error: '',
          }),
        ),
        startWith<MyRecipesViewModel>({
          recipes: [],
          loading: true,
          error: '',
        }),
        catchError(() =>
          of<MyRecipesViewModel>({
            recipes: [],
            loading: false,
            error: 'Unable to load your recipes right now. Please try again later.',
          }),
        ),
      );
}
