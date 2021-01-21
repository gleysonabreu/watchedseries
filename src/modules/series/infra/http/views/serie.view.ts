import Serie from '../../typeorm/entities/Serie';

export default {
  render(serie: Serie) {
    return {
      id: serie.id,
      title: serie.title,
      image: serie.image,
      launch: serie.launch,
      finished: serie.finished,
      status: serie.status,
      synopsis: serie.synopsis,
      duration: Number(serie.duration),
    };
  },

  renderMany(series: Serie[]) {
    return series.map(serie => this.render(serie));
  },
};
