import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUsersWatchedEpisodes1610625191166
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users_watched_episodes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'user_id',
            type: 'uuid',
          },
          {
            name: 'episode_id',
            type: 'uuid',
          },
          {
            name: 'create_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'users_watched_episodes',
      new TableForeignKey({
        name: 'UsersWatchedEpisodes-UserId',
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'users_watched_episodes',
      new TableForeignKey({
        name: 'UsersWatchedEpisodes-EpisodeId',
        columnNames: ['episode_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'episodes',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'users_watched_episodes',
      'UsersWatchedEpisodes-UserId',
    );
    await queryRunner.dropForeignKey(
      'users_watched_episodes',
      'UsersWatchedEpisodes-EpisodeId',
    );

    await queryRunner.dropTable('users_watched_episodes');
  }
}
