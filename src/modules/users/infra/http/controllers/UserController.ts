import { container } from 'tsyringe';
import { Request, Response } from 'express';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import DeleteUserService from '@modules/users/services/DeleteUserService';
import FindUserByIdService from '@modules/users/services/FindUserByIdService';
import userView from '../views/user.view';

class UserController {
  async store(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, username, password } = request.body;

    const createUserService = container.resolve(CreateUserService);
    const user = await createUserService.execute({
      firstName,
      lastName,
      email,
      username,
      password,
    });
    return response.json(userView.render(user));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const { firstName, lastName, email, username } = request.body;
    const { userId } = request;

    const updateUserService = container.resolve(UpdateUserService);
    const user = await updateUserService.execute({
      firstName,
      lastName,
      email,
      username,
      userId,
    });
    return response.json(userView.render(user));
  }

  async delete(request: Request, response: Response): Promise<Response> {
    const { userId } = request;

    const deleteUserService = container.resolve(DeleteUserService);
    await deleteUserService.execute({ userId });
    return response.sendStatus(204);
  }

  async get(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const findUserByIdService = container.resolve(FindUserByIdService);
    const user = await findUserByIdService.execute({ id });

    return response.json(userView.render(user));
  }
}

export default UserController;
