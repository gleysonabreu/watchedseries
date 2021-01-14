import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateEpisodes1610624603157 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'episodes',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
          },
          {
            name: 'synopsis',
            type: 'text',
          },
          {
            name: 'first_aired',
            type: 'timestamp',
          },
          {
            name: 'season_id',
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
      'episodes',
      new TableForeignKey({
        name: 'Episodes-SeasonId',
        columnNames: ['season_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'seasons',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('episodes', 'Episodes-SeasonId');
    await queryRunner.dropTable('episodes');
  }
}
