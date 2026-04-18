# Vigo Recipe

Vigo Recipe is a Single Page Application built with Angular and Firebase for sharing cooking ideas and managing personal recipes.

## Functional Guide

### 1. Purpose of the Application

The application allows users to browse recipes, view recipe details, and manage their own recipe collection after authentication.

### 2. Main User Flows

#### Guest Flow

Guests can:

- Open the home page
- Browse the public recipe catalog
- Open recipe details
- Register for a new account
- Log in with an existing account

Guests cannot:

- Create recipes
- Edit recipes
- Delete recipes
- Access the personal dashboard

#### Authenticated User Flow

Logged-in users can:

- Stay logged in after page refresh
- Create new recipes
- View recipe details
- Open a personal dashboard with their own recipes
- Edit their own recipes
- Delete their own recipes
- Log out safely

### 3. Core Features

#### Public Part

- Home page
- Recipe catalog
- Recipe details page
- Login page
- Register page

#### Private Part

- Create recipe page
- Edit recipe page
- Delete recipe page
- My Recipes dashboard

#### Authentication

- Firebase Authentication with email and password
- Guest guard for login/register
- Auth guard for private routes
- Persistent login session after refresh

#### Recipe Management

- Recipes are stored in Firebase Firestore
- Users can create new records
- Users can update only their own records
- Users can delete only their own records
- Public users can only read catalog and details

### 4. How the User Interacts with the System

1. A guest enters the application through the home page.
2. The guest can browse the recipe catalog and open details pages.
3. The guest can register or log in.
4. After authentication, the user sees extra navigation options such as My Recipes and Create Recipe.
5. The user can create a new recipe through a validated form.
6. The created recipe appears in the catalog and in My Recipes.
7. From details or My Recipes, the owner can edit or delete the recipe.
8. If the user refreshes the page, the authentication state remains active.

### 5. Validation and Error Handling

- Reactive forms are used for login, register, create, and edit pages
- Required fields and minimum length validation are implemented
- User-friendly error messages are displayed
- Empty state messages are shown when there are no recipes
- Network and loading states are handled in the catalog, details, and dashboard pages

## Technologies Used

- Angular
- TypeScript
- RxJS
- Firebase Authentication
- Firebase Firestore
- SCSS

## Local Setup

1. Install dependencies:
   ```bash
   npm install
   ```
