import Season from '@modules/seasons/infra/typeorm/entities/Season';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('episodes')
class Episode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'season_id' })
  seasonId: string;

  @Column()
  title: string;

  @Column()
  synopsis: string;

  @Column({ name: 'first_aired' })
  firstAired: Date;

  @ManyToOne(() => Season, season => season.episodes)
  @JoinColumn({ name: 'season_id' })
  season: Season[];

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Episode;
