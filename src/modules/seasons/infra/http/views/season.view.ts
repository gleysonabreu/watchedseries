import Season from '../../typeorm/entities/Season';

export default {
  render(season: Season) {
    return {
      id: season.id,
      serieId: season.serieId,
      name: season.name,
      episodes: season.episodes,
      serie: {
        id: season.serie.id,
        title: season.serie.title,
        duration: season.serie.duration,
        launch: season.serie.launch,
        finished: season.serie.finished,
        status: season.serie.status,
        synopsis: season.serie.synopsis,
        image: season.serie.image,
      },
    };
  },

  renderMany(seasons: Season[]) {
    return seasons.map(season => this.render(season));
  },
};
