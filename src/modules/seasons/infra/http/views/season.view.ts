import Season from '../../typeorm/entities/Season';

export default {
  render(season: Season) {
    return {
      id: season.id,
      serieId: season.serieId,
      name: season.name,
      episodes: season.episodes,
    };
  },

  renderMany(seasons: Season[]) {
    return seasons.map(season => this.render(season));
  },
};
