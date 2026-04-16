import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth.js';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeFormModel } from '../../../shared/interfaces/recipe.model.js';

@Component({
  selector: 'app-create',
  imports: [ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrl: './create.scss',
})
export class Create {
  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private recipesService = inject(Recipes);
  private router = inject(Router);

  isSubmitting = false;
  submitError = '';

  categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Vegan', 'Healthy'];

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    imageUrl: ['', [Validators.required]],
    category: ['', [Validators.required]],
    cookingTime: [10, [Validators.required, Validators.min(1)]],
    ingredients: ['', [Validators.required, Validators.minLength(10)]],
    instructions: ['', [Validators.required, Validators.minLength(10)]],
  });

  get titleControl() {
    return this.form.controls.title;
  }

  get imageUrlControl() {
    return this.form.controls.imageUrl;
  }

  get categoryControl() {
    return this.form.controls.category;
  }

  get cookingTimeControl() {
    return this.form.controls.cookingTime;
  }

  get ingredientsControl() {
    return this.form.controls.ingredients;
  }

  get instructionsControl() {
    return this.form.controls.instructions;
  }

  async onSubmit(): Promise<void> {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const currentUser = this.auth.currentUser;

    if (!currentUser) {
      this.submitError = 'You must be logged in to create a recipe.';
      return;
    }

    this.isSubmitting = true;

    const rawValue = this.form.getRawValue();

    const recipe: RecipeFormModel = {
      title: rawValue.title.trim(),
      imageUrl: rawValue.imageUrl.trim(),
      category: rawValue.category.trim(),
      cookingTime: Number(rawValue.cookingTime),
      ingredients: rawValue.ingredients.trim(),
      instructions: rawValue.instructions.trim(),
    };

    try {
      const recipeId = await firstValueFrom(
        this.recipesService.createRecipe(recipe, currentUser.id),
      );

      await this.router.navigate(['/recipes', recipeId]);
    } catch (error: unknown) {
      console.error('Create recipe error', error);
      this.submitError = 'Unable to create recipe right now. Please try again later.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
