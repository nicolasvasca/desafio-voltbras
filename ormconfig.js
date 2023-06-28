module.exports = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nicolas',
  password: '123456',
  database: 'test_graphl',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
};
