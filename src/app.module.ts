import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    TasksModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
