export interface RecipeModel {
  id: string;
  title: string;
  imageUrl: string;
  category: string;
  cookingTime: number;
  ingredients: string;
  instructions: string;
  ownerId: string;
  createdAt: string;
}
