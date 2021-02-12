import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  store(user: ICreateUserDTO): Promise<User>;
  findByEmail(email: string): Promise<User | undefined>;
  findByUserName(username: string): Promise<User | undefined>;
  update(user: User): Promise<User>;
  findById(id: string): Promise<User | undefined>;
  delete(user: User): Promise<void>;
}
