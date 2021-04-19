import { Module } from '@nestjs/common';
import { RankingsService } from './rankings.service';
import { RankingsController } from './rankings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ranking, RankingSchema } from './entities/ranking.entity';
import { CommonModule } from '@lib/common';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from './categories.service';
import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';

const configService: ConfigService = new ConfigService();

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRoot(configService.get<string>('MONGO_DSN_RANKINGS'), {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    MongooseModule.forFeature([{ name: Ranking.name, schema: RankingSchema }]),
  ],
  controllers: [RankingsController],
  providers: [ClientProxySmartRanking, RankingsService, CategoriesService],
})
export class RankingsModule {}
