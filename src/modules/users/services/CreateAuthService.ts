import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import { sign } from '@shared/services/auth';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  email: string;
  password: string;
}

@injectable()
class CreateAuthService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ email, password }: IRequest): Promise<string> {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
    });
    await schema.validate({ email, password }, { abortEarly: false });

    const user = await this.userRepository.findByEmail(email);
    if (!user) throw new AppError('This user does not exist', 401);

    if (!user.checkPassword(password))
      throw new AppError('This user does not exist', 401);

    const token = sign({ id: user.id, username: user.username });
    return token;
  }
}

export default CreateAuthService;
