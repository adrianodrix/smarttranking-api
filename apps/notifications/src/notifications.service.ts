import { AWSSESService } from '@lib/common/aws/aws-ses.service';
import { IEmailParams } from '@lib/common/aws/interfaces/email-params.interface';
import { IEmailWithTemplateParams } from '@lib/common/aws/interfaces/email-template-params.interface';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import { IPlayer } from '@lib/models/interfaces/player.interface';
import { Injectable, Logger } from '@nestjs/common';
import { PlayersService } from './players.service';
import HTML_NOTIFICACAO_ADVERSARIO from './static/html-notificacao-adversario';

@Injectable()
export class NotificationsService {
  private logger: Logger = new Logger(NotificationsService.name);

  constructor(
    private readonly awsSES: AWSSESService,
    private readonly playersService: PlayersService,
  ) {}

  async sendEmailToPlayer(challenge: IChallenge): Promise<void> {
    this.logger.log(`sendEmailToPlayer ${JSON.stringify(challenge)}`);
    const { players, applicant: applicantId } = challenge;

    let idAdversary = '';
    players.map((player) => {
      if (player !== challenge.applicant) idAdversary = player;
    });

    const adversary: IPlayer = await this.playersService.findById(idAdversary);
    const applicant: IPlayer = await this.playersService.findById(applicantId);
    const toAddress = `${adversary.name} <adrianodrix@gmail.com>`;

    let body = HTML_NOTIFICACAO_ADVERSARIO;
    body = body.replace(/#NOME_ADVERSARIO/g, adversary.name);
    body = body.replace(/#NOME_SOLICITANTE/g, applicant.name);
    body = body.replace(/#ID_DESAFIO/g, challenge._id);

    const params: IEmailParams = {
      Source: 'Nawe.by <suporte@treeunfe.com.br>',
      ReplyToAddresses: [adversary.email],
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Subject: {
          Data: `😎 Parabéns! Você recebeu um novo desafio`,
        },
        Body: {
          Html: {
            Data: body,
          },
        },
      },
    };

    await this.awsSES.sendEmail(params);
  }
}
