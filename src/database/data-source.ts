import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';


config();

const isTest = process.env.NODE_ENV === 'test';

export const databaseOptions: DataSourceOptions = {
  type: 'postgres',
  host: isTest ? process.env.DB_HOST_TEST : process.env.DB_HOST,
  port: isTest
    ? Number(process.env.DB_PORT_TEST)
    : Number(process.env.DB_PORT),
  username: isTest
    ? process.env.DB_USERNAME_TEST
    : process.env.DB_USERNAME,
  password: isTest
    ? process.env.DB_PASSWORD_TEST
    : process.env.DB_PASSWORD,
  database: isTest ? process.env.DB_DATABASE_TEST : process.env.DB_DATABASE,
  subscribers: [],
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/src/database/migrations/*.js'],
  migrationsTableName: 'cooperative_migration_table',
  logging: false,
  synchronize: false
};

export const dataSource = new DataSource(databaseOptions);