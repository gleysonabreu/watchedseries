import UserSerie from '../../typeorm/entities/UserSerie';
import UserEpisode from '../../typeorm/entities/UserEpisode';

interface IRequestMany {
  userSeries: UserSerie[];
  userEpisodes: UserEpisode[];
}

interface IRequestSingle {
  userSerie: UserSerie;
  userEpisodes: UserEpisode[];
}

const watchedOrNot = (
  episodeId: string,
  userEpisodes: UserEpisode[],
): boolean => {
  const fill = userEpisodes.filter(
    userEpisode => userEpisode.episodeId === episodeId,
  );
  if (fill.length > 0) {
    return true;
  }
  return false;
};

export default {
  render({ userSerie, userEpisodes }: IRequestSingle) {
    return {
      ...userSerie,
      serie: {
        ...userSerie.serie,
        seasons: userSerie.serie.seasons.map(season => {
          return {
            ...season,
            episodes: season.episodes.map(episode => {
              return {
                ...episode,
                watched: watchedOrNot(episode.id, userEpisodes),
              };
            }),
          };
        }),
      },
    };
  },

  renderMany({ userSeries, userEpisodes }: IRequestMany) {
    return userSeries.map(userSerie =>
      this.render({ userSerie, userEpisodes }),
    );
  },
};
