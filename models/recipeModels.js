const db = require('../data/data.json');

const selectRecipes = (exclusions) => {
	const recipes = db;

	if (exclusions) {
		let individualIngredients = exclusions.replace('_', ' ').split(',');

		let filtered = recipes.filter((recipe) => {
			let count = 0;
			recipe.ingredients.forEach((ingredient) => {
				if (!individualIngredients.includes(ingredient.name)) count++;
			});
			if (count === recipe.ingredients.length) return recipe;
		});

		return { recipes: filtered };
	}

	return { recipes: db };
};

const selectRecipesById = (id) => {
	const recipe = db.filter((recipe) => {
		if (recipe.id === id) {
			return recipe;
		}
	});

	return { recipe: recipe[0] };
};

module.exports = { selectRecipes, selectRecipesById };
