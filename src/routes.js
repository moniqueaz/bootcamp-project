import { Router } from 'express';

import UserController from './app/controllers/UserController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json('Olá Yellow Wave');
});

routes.post('/', UserController.store);

export default routes;
