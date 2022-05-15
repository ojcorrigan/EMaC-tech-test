const { selectRecipes, selectRecipesById } = require('../models/recipeModels');

const getRecipes = async (req, res) => {
	const { exclude_ingredients } = req.query;

	try {
		//manually checking for valid query as I'm just using JSON for the database
		if (
			Object.keys(req.query).includes('exclude_ingredients') ||
			Object.keys(req.query).length === 0
		) {
			const recipes = await selectRecipes(exclude_ingredients);
			res.status(200).send(recipes);
		} else {
			throw new Error('bad request');
		}
	} catch (error) {
		res.status(400).send({ msg: error.message });
	}
};

const getRecipeById = async (req, res) => {
	const { id } = req.params;

	try {
		const recipe = await selectRecipesById(id);
		if (Object.keys(recipe.recipe).includes('id')) {
			res.status(200).send(recipe);
		} else {
			throw new Error('recipe not found');
		}
	} catch (error) {
		res.status(404).send({ msg: error.message });
	}
};

module.exports = { getRecipes, getRecipeById };
