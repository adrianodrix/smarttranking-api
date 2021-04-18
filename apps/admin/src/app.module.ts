import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { CommonModule } from '@lib/common';

const configService: ConfigService = new ConfigService();
const logger: Logger = new Logger('Main');

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRoot(configService.get<string>('MONGO_DSN_ADMIN'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      connectionFactory: (connection) => {
        logger.log(`MongoDB connected!`);
        return connection;
      },
    }),
    CategoriesModule,
    PlayersModule,
  ],
})
export class AppModule {}
