import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Auth } from '../../../core/services/auth.js';
import { Recipes } from '../../../core/services/recipes.js';
import { RecipeFormModel } from '../../../shared/interfaces/recipe.model.js';

@Component({
  selector: 'app-edit',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit.html',
  styleUrl: './edit.scss',
})
export class Edit implements OnInit {
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private auth = inject(Auth);
  private recipesService = inject(Recipes);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  recipeId = '';
  isLoading = true;
  isSubmitting = false;
  loadError = '';
  submitError = '';
  notOwner = false;

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

  async ngOnInit(): Promise<void> {
    await firstValueFrom(this.auth.authReady$);

    this.recipeId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.recipeId) {
      this.loadError = 'Recipe not found.';
      this.isLoading = false;
      return;
    }

    try {
      const recipe = await firstValueFrom(this.recipesService.getRecipeById(this.recipeId));

      if (!recipe) {
        this.loadError = 'Recipe not found.';
        return;
      }

      const currentUser = this.auth.currentUser;

      if (!currentUser || recipe.ownerId !== currentUser.id) {
        this.notOwner = true;
        return;
      }

      this.form.patchValue({
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        category: recipe.category,
        cookingTime: recipe.cookingTime,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      });
    } catch (error: unknown) {
      console.error('Load recipe for edit error', error);
      this.loadError = 'Unable to load recipe for editing.';
    } finally {
      this.isLoading = false;
      this.cdr.detectChanges();
    }
  }

  async onSubmit(): Promise<void> {
    this.submitError = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.notOwner) {
      this.submitError = 'You can edit only your own recipes.';
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
      await firstValueFrom(this.recipesService.updateRecipe(this.recipeId, recipe));
      await this.router.navigate(['/recipes', this.recipeId]);
    } catch (error: unknown) {
      console.error('Update recipe error', error);
      this.submitError = 'Unable to update recipe right now. Please try again later.';
    } finally {
      this.isSubmitting = false;
      this.cdr.detectChanges();
    }
  }
}
