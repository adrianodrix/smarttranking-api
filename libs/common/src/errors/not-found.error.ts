import { Injectable } from '@nestjs/common';

@Injectable()
export class NotFoundError extends Error {}
