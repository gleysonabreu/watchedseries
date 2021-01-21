import faker from 'faker';

export default {
  async factorySerie() {
    return {
      title: faker.name.findName(),
      duration: 45,
      launch: new Date('02-16-2001'),
      finished: new Date('10-13-2020'),
      status: 'Finalizada',
      synopsis: faker.lorem.lines(),
      image: 'Image.png',
    };
  },
};
