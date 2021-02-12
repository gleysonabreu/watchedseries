import { getRepository, Repository } from 'typeorm';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import User from '../entities/User';

class UserRepository implements IUserRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  async store(user: ICreateUserDTO): Promise<User> {
    const createUser = this.ormRepository.create(user);
    const insertUser = await this.ormRepository.save(createUser);
    return insertUser;
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ email });
    return user;
  }

  async findByUserName(username: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ username });
    return user;
  }

  async update(user: User): Promise<User> {
    const updateUser = await this.ormRepository.save(user);
    return updateUser;
  }

  async findById(id: string): Promise<User | undefined> {
    const user = await this.ormRepository.findOne({ id });
    return user;
  }

  async delete(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

export default UserRepository;
