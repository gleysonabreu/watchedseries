import Serie from '@modules/series/infra/typeorm/entities/Serie';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users_series')
class UserSerie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Serie, { eager: true })
  @JoinColumn({ name: 'serie_id' })
  serie: Serie;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'serie_id' })
  serieId: string;

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserSerie;
