import Episode from '../../typeorm/entities/Episode';

export default {
  render(episode: Episode) {
    return {
      id: episode.id,
      seasonId: episode.seasonId,
      title: episode.title,
      synopsis: episode.synopsis,
      firstAired: episode.firstAired,
      season: {
        id: episode.season.id,
        serieId: episode.season.serieId,
        name: episode.season.name,
      },
      serie: {
        id: episode.season.serie.id,
        title: episode.season.serie.title,
        duration: episode.season.serie.duration,
        launch: episode.season.serie.launch,
        finished: episode.season.serie.finished,
        status: episode.season.serie.status,
        synopsis: episode.season.serie.synopsis,
        image: episode.season.serie.image,
      },
    };
  },

  renderMany(episodes: Episode[]) {
    return episodes.map(episode => this.render(episode));
  },
};
