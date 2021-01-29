import CreateAuthService from '@modules/users/services/CreateAuthService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class AuthController {
  async store(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const createAuthService = container.resolve(CreateAuthService);
    const token = await createAuthService.execute({ email, password });
    return response.json({ auth: true, token });
  }
}

export default AuthController;
