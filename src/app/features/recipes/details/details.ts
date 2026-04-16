import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, map, of, startWith, switchMap } from 'rxjs';
import { Auth } from '../../../core/services/auth.js';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeModel } from '../../../shared/interfaces/recipe.model.js';

type DetailsViewModel = {
  recipe: RecipeModel | null;
  loading: boolean;
  error: string;
  isOwner: boolean;
};

@Component({
  selector: 'app-details',
  imports: [AsyncPipe, DatePipe, RouterLink],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  private route = inject(ActivatedRoute);
  private recipesService = inject(Recipes);
  private auth = inject(Auth);

  vm$ = this.route.paramMap.pipe(
    map((params) => params.get('id') ?? ''),
    switchMap((id) => {
      if (!id) {
        return of<DetailsViewModel>({
          recipe: null,
          loading: false,
          error: 'Recipe not found.',
          isOwner: false,
        });
      }

      return combineLatest([this.recipesService.getRecipeById(id), this.auth.currentUser$]).pipe(
        map(
          ([recipe, currentUser]): DetailsViewModel => ({
            recipe,
            loading: false,
            error: recipe ? '' : 'Recipe not found.',
            isOwner: !!recipe && recipe.ownerId === currentUser?.id,
          }),
        ),
        startWith<DetailsViewModel>({
          recipe: null,
          loading: true,
          error: '',
          isOwner: false,
        }),
        catchError(() =>
          of<DetailsViewModel>({
            recipe: null,
            loading: false,
            error: 'Unable to load recipe details right now. Please try again later.',
            isOwner: false,
          }),
        ),
      );
    }),
  );
}
