const { Router } = require('express');
const DevController = require('./app/controllers/DevController');
const SearchController = require('./app/controllers/SearchController');
const UserController = require('./app/controllers/UserController');
const Auth = require('./app/middlewares/auth');

const routes = Router();

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

routes.get('/', UserController.index);
routes.post('/register', UserController.register);

routes.post('/login', UserController.login);
routes.post('/forgot', UserController.forgot);
routes.post('/reset', UserController.reset);

module.exports = routes;
