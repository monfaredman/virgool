import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { EntityName } from '../common/enums/entity.enum';
import { Roles } from 'src/common/enums/role.enum';
import { UserStatus } from 'src/modules/user/enums/status.enum';

export class Migrations1728459714221 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: EntityName.User,
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
            isNullable: false,
          },
          {
            name: 'username',
            type: 'character varying(50)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'character varying(12)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'email',
            type: 'character varying(100)',
            isNullable: true,
            isUnique: true,
          },
          {
            name: 'role',
            type: 'enum',
            enum: [Roles.Admin, Roles.User],
          },
          {
            name: 'status',
            type: 'enum',
            enum: [UserStatus.Block, UserStatus.Report],
            isNullable: true,
          },
          {
            name: 'new_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'new_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'verify_phone',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'verify_email',
            type: 'boolean',
            isNullable: true,
            default: false,
          },
          {
            name: 'password',
            type: 'varchar(20)',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(EntityName.User, true);
  }
}
