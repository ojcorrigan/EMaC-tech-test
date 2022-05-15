const supertest = require('supertest');
const server = require('../server');

const request = supertest(server);

test('/api', async () => {
	const { body } = await request.get('/api').expect(200);
	expect(body.message).toBe('ok');
});

describe('getRecipes', () => {
	//recipe tests - happy path
	test('200: /api/recipes responds with an array of recipes', () => {
		return request
			.get('/api/recipes')
			.expect(200)
			.then((res) => {
				expect(
					res.body.recipes.forEach((recipe) => {
						expect(recipe).toMatchObject({
							id: expect.any(String),
							imageUrl: expect.any(String),
							instructions: expect.any(String),
						});
						expect(recipe.ingredients).toBeInstanceOf(Array);
					})
				);
				expect(res.body.recipes.length).toBe(100);
			});
	});

	test("200: /api/recipes?exclude_ingredients=banana responds with an array of recipes which don't include banana", () => {
		return request
			.get('/api/recipes?exclude_ingredients=banana')
			.expect(200)
			.then((res) => {
				expect(res.body.recipes.length).toBeLessThan(100);
				expect(res.body.recipes.length).toBe(90);
			});
	});

	test("200: /api/recipes?exclude_ingredients=banana,strawberries responds with an array of recipes which don't include banana or strawberries", () => {
		return request
			.get('/api/recipes?exclude_ingredients=banana,strawberries')
			.expect(200)
			.then((res) => {
				expect(res.body.recipes.length).toBeLessThan(90);
				expect(res.body.recipes.length).toBe(73);
				expect(
					res.body.recipes.forEach((recipe) => {
						recipe.ingredients.forEach((ingredient) => {
							expect(ingredient.name).not.toBe('banana');
							expect(ingredient.name).not.toBe('strawberries');
						});
					})
				);
			});
	});

	test("200: /api/recipes?exclude_ingredients=banana,strawberries responds with an array of recipes which don't include banana or strawberries", () => {
		return request
			.get('/api/recipes?exclude_ingredients=banana,strawberries,apple_juice')
			.expect(200)
			.then((res) => {
				expect(res.body.recipes.length).toBeLessThan(90);
				expect(res.body.recipes.length).toBe(58);
				expect(
					res.body.recipes.forEach((recipe) => {
						recipe.ingredients.forEach((ingredient) => {
							expect(ingredient.name).not.toBe('banana');
							expect(ingredient.name).not.toBe('strawberries');
							expect(ingredient.name).not.toBe('apple_juice');
						});
					})
				);
			});
	});

	//recipe tests - unhappy path

	test('404: /api/recipe route not found', () => {
		return request
			.get('/api/recipe')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('invalid path');
			});
	});

	test('400: /api/recipes?exclude=banana invalid query rejects with 400', () => {
		return request
			.get('/api/recipes?exclude=banana')
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe('bad request');
			});
	});
});

describe('getRecipeByID', () => {
	test('200: gets a recipe by its id', () => {
		const expected = {
			id: 'recipe-31',
			imageUrl: 'http://www.images.com/21',
			instructions: 'spin it, twist it, pull it, flick it... bop it!',
			ingredients: [
				{
					name: 'strawberries',
					grams: 187,
				},
				{
					name: 'kale',
					grams: 41,
				},
				{
					name: 'apple juice',
					grams: 64,
				},
				{
					name: 'coffee',
					grams: 146,
				},
				{
					name: 'cocoa nibs',
					grams: 154,
				},
			],
		};
		return request
			.get('/api/recipes/recipe-31')
			.expect(200)
			.then((res) => {
				expect(res.body.recipe).toEqual(expected);
			});
	});

	test("404: recipe not found if given an id that could exist by currently doesn't", () => {
		return request
			.get('/api/recipes/recipe-500')
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe('recipe not found');
			});
	});
});
