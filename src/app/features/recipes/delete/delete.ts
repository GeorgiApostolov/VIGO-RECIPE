import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth.js';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeModel } from '../../../shared/interfaces/recipe.model.js';

@Component({
  selector: 'app-delete',
  imports: [RouterLink],
  templateUrl: './delete.html',
  styleUrl: './delete.scss',
})
export class Delete implements OnInit {
  private auth = inject(Auth);
  private recipesService = inject(Recipes);
  private cdr = inject(ChangeDetectorRef);

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipeId = '';
  recipe: RecipeModel | null = null;
  isLoading = true;
  isDeleting = false;
  error = '';
  notOwner = false;

  async ngOnInit(): Promise<void> {
    await firstValueFrom(this.auth.authReady$);
    this.recipeId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.recipeId) {
      this.error = 'Recipe not found.';
      this.isLoading = false;
      return;
    }

    try {
      const recipe = await firstValueFrom(this.recipesService.getRecipeById(this.recipeId));

      if (!recipe) {
        this.error = 'Recipe not found.';
        return;
      }

      const currentUser = this.auth.currentUser;

      if (!currentUser || recipe.ownerId !== currentUser.id) {
        this.notOwner = true;
        return;
      }

      this.recipe = recipe;
    } catch (deleteError: unknown) {
      console.error('Load recipe for delete error', deleteError);
      this.error = 'Unable to load recipe for deletion.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async confirmDelete(): Promise<void> {
    if (!this.recipeId) {
      return;
    }

    this.error = '';
    this.isDeleting = true;

    try {
      await firstValueFrom(this.recipesService.deleteRecipe(this.recipeId));
      await this.router.navigateByUrl('/my-recipes');
    } catch (deleteError: unknown) {
      console.error('Delete recipe error', deleteError);
      this.error = 'Unable to delete recipe right now. Please try again later.';
    } finally {
      this.isDeleting = false;
      this.cdr.detectChanges();
    }
  }
}
