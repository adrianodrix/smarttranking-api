import { Module } from '@nestjs/common';
import * as path from 'path';
import { I18nModule, I18nJsonParser } from 'nestjs-i18n';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ptbr',
      parser: I18nJsonParser,
      parserOptions: {
        path: path.join(__dirname, '/i18n/'),
      },
    }),
    PlayersModule,
  ],
})
export class AppModule {}
