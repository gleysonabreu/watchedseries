import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import * as Yup from 'yup';

import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface IRequest {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  userId: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    firstName,
    lastName,
    email,
    username,
    userId,
  }: IRequest): Promise<User> {
    const schema = Yup.object().shape({
      userId: Yup.string().uuid().required(),
      firstName: Yup.string().required().min(1),
      lastName: Yup.string().required().min(1),
      email: Yup.string().email().required().min(1),
      username: Yup.string().required().min(1),
    });
    await schema.validate(
      { userId, firstName, lastName, email, username },
      { abortEarly: false },
    );

    const user = await this.userRepository.findById(userId);
    if (!user) throw new AppError('This user does not exist');

    if (user.email !== email) {
      const findEmail = await this.userRepository.findByEmail(email);
      if (findEmail) throw new AppError('This email already exists');
      user.email = email;
    }

    if (user.username !== username) {
      const findUserName = await this.userRepository.findByUserName(username);
      if (findUserName) throw new AppError('This username already exists');
      user.username = username;
    }

    user.firstName = firstName;
    user.lastName = lastName;
    const result = await this.userRepository.update(user);
    return result;
  }
}

export default UpdateUserService;
