import Episode from '@modules/episodes/infra/typeorm/entities/Episode';

import Serie from '@modules/series/infra/typeorm/entities/Serie';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('seasons')
class Season {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serie_id' })
  serieId: string;

  @Column()
  name: string;

  @OneToMany(() => Episode, episode => episode.season, { eager: true })
  @JoinColumn({ name: 'season_id' })
  episodes: Episode[];

  @ManyToOne(() => Serie, serie => serie.seasons)
  @JoinColumn({ name: 'serie_id' })
  serie: Serie;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Season;
