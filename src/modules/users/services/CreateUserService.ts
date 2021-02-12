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
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({
    firstName,
    lastName,
    email,
    username,
    password,
  }: IRequest): Promise<User> {
    const schema = Yup.object().shape({
      firstName: Yup.string().required().min(5),
      lastName: Yup.string().required().min(5),
      email: Yup.string().email().required(),
      username: Yup.string().required().min(5),
      password: Yup.string().required().min(6),
    });
    await schema.validate(
      { firstName, lastName, email, username, password },
      { abortEarly: false },
    );

    const findUserByEmail = await this.userRepository.findByEmail(email);
    if (findUserByEmail) throw new AppError('This email already exists');

    const findUserByUserName = await this.userRepository.findByUserName(
      username,
    );
    if (findUserByUserName) throw new AppError('This username already exists');

    const user = await this.userRepository.store({
      firstName,
      lastName,
      email,
      username,
      password,
    });

    return user;
  }
}

export default CreateUserService;
