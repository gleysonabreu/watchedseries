import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  userId: string;
}

@injectable()
class DeleteUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<void> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
    });
    await schema.validate({ userId }, { abortEarly: false });

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('This user does not exist');

    await this.userRepository.delete(user);
  }
}

export default DeleteUserService;
