import { Module } from '@nestjs/common';
import { I18nJsonParser, I18nModule } from 'nestjs-i18n';
import { join } from 'path';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'ptbr',
      parser: I18nJsonParser,
      parserOptions: {
        path: join(
          __dirname,
          '..',
          '..',
          'libs',
          'common',
          'i18n',
          'translates',
        ),
      },
    }),
  ],
})
export class TranslateModule {}
