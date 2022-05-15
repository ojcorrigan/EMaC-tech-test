const recipeRouter = require('express').Router();
const {
	getRecipes,
	getRecipeById,
} = require('../controllers/recipeControllers.js');

recipeRouter.get('/', getRecipes);

recipeRouter.get('/:id', getRecipeById);

module.exports = recipeRouter;
