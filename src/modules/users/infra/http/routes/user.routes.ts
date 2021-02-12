import { Router } from 'express';
import authMiddleware from '@shared/infra/http/middleware/auth';
import UserController from '../controllers/UserController';

const userRouter = Router();
const userController = new UserController();

userRouter.post('/', userController.store);
userRouter.put('/', [authMiddleware], userController.update);
userRouter.delete('/', [authMiddleware], userController.delete);
userRouter.get('/:id', [authMiddleware], userController.get);

export default userRouter;
