import { CommonModule } from '@lib/common';
import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { AWSSESService } from '@lib/common/aws/aws-ses.service';
import { PlayersService } from './players.service';

@Module({
  imports: [CommonModule, AWSSESService],
  providers: [NotificationsService, PlayersService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
