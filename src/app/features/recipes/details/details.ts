import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeModel } from '../../../shared/interfaces/recipe.model.js';

type DetailsViewModel = {
  recipe: RecipeModel | null;
  loading: boolean;
  error: string;
};

@Component({
  selector: 'app-details',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  private route = inject(ActivatedRoute);
  private recipesService = inject(Recipes);

  vm$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => {
      if (!id) {
        return of<DetailsViewModel>({
          recipe: null,
          loading: false,
          error: 'Recipe not found.',
        });
      }

      return this.recipesService.getRecipeById(id).pipe(
        map(
          (recipe): DetailsViewModel => ({
            recipe,
            loading: false,
            error: recipe ? '' : 'Recipe not found.',
          }),
        ),
        startWith<DetailsViewModel>({
          recipe: null,
          loading: true,
          error: '',
        }),
        catchError(() =>
          of<DetailsViewModel>({
            recipe: null,
            loading: false,
            error: 'Unable to load recipe details right now. Please try again later.',
          }),
        ),
      );
    }),
  );
}
