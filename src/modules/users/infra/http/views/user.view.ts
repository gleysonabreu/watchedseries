import User from '../../typeorm/entities/User';

export default {
  render(user: User) {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  },

  renderMany(users: User[]) {
    return users.map(user => this.render(user));
  },
};
