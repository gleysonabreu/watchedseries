import { Router } from 'express';
import authMiddleware from '@shared/infra/http/middleware/auth';
import UserSerieController from '../controllers/UserSerieController';

const useSerieSearchRouter = Router();
const userSerieController = new UserSerieController();

useSerieSearchRouter.get('/', [authMiddleware], userSerieController.search);

export default useSerieSearchRouter;
