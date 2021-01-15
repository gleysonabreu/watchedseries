import Season from '@modules/seasons/infra/typeorm/entities/Season';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('series')
class Serie {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  duration: number;

  @Column()
  launch: Date;

  @Column()
  finished: Date;

  @Column()
  status: string;

  @Column()
  synopsis: string;

  @Column()
  image: string;

  @OneToMany(() => Season, season => season.serie, { eager: true })
  @JoinColumn({ name: 'serie_id' })
  seasons: Season[];

  @CreateDateColumn({ name: 'create_at' })
  createAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default Serie;
