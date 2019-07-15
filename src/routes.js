import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

const routes = new Router();

routes.get('/', (req, res) => {
  return res.json('Olá Yellow Wave');
});

routes.post('/', UserController.store);
routes.post('/', SessionController.store);

export default routes;
