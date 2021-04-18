import { Injectable } from '@nestjs/common';

@Injectable()
export class DuplicateKeyError extends Error {}
