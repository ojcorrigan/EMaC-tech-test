const apiRouter = require('express').Router();
const recipeRouter = require('./recipes');

apiRouter.get('/', (_, res) => {
	res.json({ message: 'ok' });
});

apiRouter.use('/recipes', recipeRouter);

module.exports = apiRouter;
