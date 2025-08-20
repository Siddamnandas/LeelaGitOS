# PRD Updates and Additions (as of 2025-08-19)

This document outlines updates to the Leela OS PRD to reflect the current state of the application after foundational strengthening and provides documentation for newly discovered features.

---

## **Part 1: Updates to Existing PRD Sections**

### **Update to Section 6.7: Parenting Activity Engine (Kids)**

**Original State:** The PRD described a highly detailed, multi-tabbed UI for kids' activities, which was implemented as a frontend mockup using hardcoded data.

**Current State:** This feature has been refactored into a functional, end-to-end slice.
*   **Backend:** The database schema has been evolved to support scheduled, template-based activities (`ActivityTemplate`, `ScheduledActivity` models). A robust backend API (`/api/parenting-activities`) now serves real data from the database.
*   **Frontend:** The `KidsActivities.tsx` component is now a data-driven component that fetches data from the API. It correctly displays a list of scheduled activities for the family.
*   **Scope:** The UI has been intentionally simplified to match the current backend capabilities. It focuses on displaying the list of themed activities. More complex UI elements from the original mockup (e.g., Kindness Jar, Emotion Explorers, detailed in-activity steps) are not yet implemented and require further backend development.

### **Update to Section 12 & 15: Analytics & Acceptance Criteria (Testing)**

**Original State:** The PRD claimed that "all core paths tested" and "All endpoints validated with error handling".

**Current State:** A testing framework has been established from the ground up.
*   **Framework:** The project now uses **Vitest** for unit/integration testing and **React Testing Library** for component testing.
*   **Coverage:** A suite of 15 tests has been created, covering utility functions, API endpoints (including success, failure, and edge cases), and frontend components (including loading, error, and success states).
*   **Status:** While the foundation for testing is now strong, comprehensive coverage of "all core paths" is still a work in progress. The claim "all core paths tested" should be considered a future goal, not a current state.

---

## **Part 2: Documentation for New Features**

### **New Feature: Recipe Management**

*   **Vision:** Allows users to create, view, and manage a personal collection of recipes.
*   **Data Model (`Recipe`):**
    *   `name`, `description`, `instructions`, `prep_time`, `cook_time`, `servings`, `difficulty`, `cuisine`, `is_favorite`, `imageUrl`.
    *   `ingredients`, `tags`, `nutrition` are stored as JSON strings.
*   **API Contract (`/api/recipes`):**
    *   `GET /api/recipes`: Fetches all recipes. Supports filtering by `cuisine`, `difficulty`, `isFavorite`, and `tags`.
    *   `POST /api/recipes`: Creates a new recipe. Validates the request body against a Zod schema.
*   **Frontend Component (`RecipeBuilder.tsx`):**
    *   A sophisticated, presentational UI component for creating and editing recipes with a tabbed interface.
    *   **Status:** This component is currently not integrated into any view. A container component is needed to fetch data and handle the `onSave` action to make it fully functional.

### **New Feature: Meal Planning**

*   **Vision:** Allows users to create structured meal plans for specific dates.
*   **Data Model (`MealPlan`):**
    *   `couple_id`, `name`, `date`, `budget`, `notes`.
    *   `meals` (breakfast, lunch, dinner) and `nutrition` are stored as JSON strings.
*   **API Contract (`/api/meal-plans`):**
    *   `GET /api/meal-plans`: Fetches meal plans for a couple. Supports filtering by date range.
    *   `POST /api/meal-plans`: Creates a new meal plan.
*   **Frontend Component (`MealsPlanning.tsx`):**
    *   **Status:** There is a major disconnect. The existing `MealsPlanning.tsx` component does **not** implement this feature. Instead, it serves as a dashboard for "Weekend Specials" (food delivery deals) and "Grocery Deals," linking to external sites. The UI for creating or viewing a structured meal plan does not currently exist.

### **New Feature: Grocery List Management**

*   **Vision:** Allows users to create and manage shared grocery lists.
*   **Data Model (`GroceryList`):**
    *   `couple_id`, `name`, `total_budget`, `assigned_to`, `status`, `due_date`.
    *   `items` are stored as a JSON string.
*   **API Contract (`/api/grocery-lists`):**
    *   `GET /api/grocery-lists`: Fetches grocery lists for a couple. Supports filtering by `status` and `assignedTo`.
    *   `POST /api/grocery-lists`: Creates a new grocery list.
*   **Frontend Component:**
    *   **Status:** No specific component for creating or managing a user's grocery list appears to exist. The "Grocery Deals" tab in `MealsPlanning.tsx` shows individual items on sale, which is a different functionality.
