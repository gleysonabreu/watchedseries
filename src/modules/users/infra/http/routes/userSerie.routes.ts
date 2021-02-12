import { Router } from 'express';
import authMiddleware from '@shared/infra/http/middleware/auth';
import UserSerieController from '../controllers/UserSerieController';

const useSerieRouter = Router();
const userSerieController = new UserSerieController();

useSerieRouter.post('/', [authMiddleware], userSerieController.store);
useSerieRouter.delete('/:id', [authMiddleware], userSerieController.delete);
useSerieRouter.get('/', [authMiddleware], userSerieController.index);
useSerieRouter.get('/:id', [authMiddleware], userSerieController.get);

export default useSerieRouter;
