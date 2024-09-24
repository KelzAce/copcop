import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
  } from 'typeorm';
  
  export class CreateUserTable1706013646225 implements MigrationInterface {
    name = 'CreateUserTable1706013646225';
  
    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(
        new Table({
          name: 'users',
          columns: [
            {
              name: 'id',
              type: 'uuid',
              isPrimary: true,
              isUnique: true,
              generationStrategy: 'uuid',
              default: `uuid_generate_v4()`,
            },
            {
              name: 'first_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'last_name',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'email',
              type: 'varchar',
              isNullable: false,
              isUnique: true,
            },
            {
              name: 'password',
              type: 'varchar',
              isNullable: false,
            },
            {
              name: 'phone_number',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'gender',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'image',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'bank_account_id',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'role',
              type: 'varchar',
              default: `'MEMBER'`,
              isNullable: true,
            },
            {
              name: 'is_verified',
              type: 'boolean',
              default: false,
              isNullable: true,
            },
            {
              name: 'invitedBy',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'bvn',
              type: 'varchar',
              length: '11',
              isNullable: true,
            },
            {
              name: 'invitationAcceptance',
              type: 'boolean',
              default: false,
              isNullable: true,
            },
            {
              name: 'cooperative',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'invitationSentAt',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'access',
              type: 'uuid',
              isNullable: true,
            },
            {
              name: 'deleted_at',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'last_login',
              type: 'timestamp',
              isNullable: true,
            },
            {
              name: 'status',
              type: 'boolean',
              default: false,
              isNullable: true,
            },
            {
              name: 'created_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
            {
              name: 'updated_at',
              type: 'timestamp',
              default: 'CURRENT_TIMESTAMP',
              isNullable: false,
            },
          ],
        }),
      );
  
      // Foreign Key for 'cooperative'
      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          columnNames: ['cooperative'],
          referencedColumnNames: ['id'],
          referencedTableName: 'cooperatives',
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION',
          name: 'Fk_cooperative_Users',
        }),
      );
  
      // Foreign Key for 'invitedBy'
      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          columnNames: ['invitedBy'],
          referencedColumnNames: ['id'],
          referencedTableName: 'users',
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION',
          name: 'Fk_invitedBy_Users',
        }),
      );
  
      // Foreign Key for 'access'
      await queryRunner.createForeignKey(
        'users',
        new TableForeignKey({
          columnNames: ['access'],
          referencedColumnNames: ['id'],
          referencedTableName: 'access',
          onDelete: 'CASCADE',
          onUpdate: 'NO ACTION',
          name: 'Fk_access_Users',
        }),
      );
    }
  
    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropForeignKey('users', 'Fk_cooperative_Users');
      await queryRunner.dropForeignKey('users', 'Fk_invitedBy_Users');
      await queryRunner.dropForeignKey('users', 'Fk_access_Users');
      await queryRunner.dropTable('users');
    }
  }
  