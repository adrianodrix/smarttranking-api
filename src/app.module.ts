import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { join } from 'path';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DSN, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'ptbr',
      parser: I18nJsonParser,
      parserOptions: {
        path: join(__dirname, '/common/i18n/'),
      },
    }),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
})
export class AppModule {}
