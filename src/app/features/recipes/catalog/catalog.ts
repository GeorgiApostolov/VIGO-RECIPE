import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { catchError, map, of, startWith } from 'rxjs';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeModel } from '../../../shared/interfaces/recipe.model.js';
import { TruncateTextPipe } from '../../../shared/pipes/truncate-text-pipe.js';

type CatalogViewModel = {
  recipes: RecipeModel[];
  loading: boolean;
  error: string;
};

@Component({
  selector: 'app-catalog',
  imports: [RouterLink, AsyncPipe, DatePipe, TruncateTextPipe],
  templateUrl: './catalog.html',
  styleUrl: './catalog.scss',
})
export class Catalog {
  private recipesService = inject(Recipes);

  vm$ = this.recipesService.getAllRecipes().pipe(
    map(
      (recipes): CatalogViewModel => ({
        recipes,
        loading: false,
        error: '',
      }),
    ),
    startWith<CatalogViewModel>({
      recipes: [],
      loading: true,
      error: '',
    }),
    catchError(() =>
      of<CatalogViewModel>({
        recipes: [],
        loading: false,
        error: 'Unable to load recipes right now. Please try again later.',
      }),
    ),
  );
}
