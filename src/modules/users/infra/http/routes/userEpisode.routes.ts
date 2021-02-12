import { Router } from 'express';
import authMiddleware from '@shared/infra/http/middleware/auth';
import UserEpisodeController from '../controllers/UserEpisodeController';

const userEpisodeRouter = Router();
const userEpisodeController = new UserEpisodeController();

userEpisodeRouter.post('/', [authMiddleware], userEpisodeController.store);
userEpisodeRouter.delete(
  '/:id',
  [authMiddleware],
  userEpisodeController.delete,
);
userEpisodeRouter.get('/', [authMiddleware], userEpisodeController.getAll);
userEpisodeRouter.get('/:id', [authMiddleware], userEpisodeController.get);

export default userEpisodeRouter;
