import Episode from '@modules/episodes/infra/typeorm/entities/Episode';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_watched_episodes')
class UserEposiode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Episode, { eager: true })
  @JoinColumn({ name: 'episode_id' })
  episodes: Episode[];

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'episode_id' })
  episodeId: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserEposiode;
