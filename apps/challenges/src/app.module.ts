import { CommonModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChallengesModule } from './challenges/challenges.module';

@Module({
  imports: [
    CommonModule,
    MongooseModule.forRoot(process.env.MONGO_DSN_CHALLENGES, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }),
    ChallengesModule,
  ],
})
export class AppModule {}
