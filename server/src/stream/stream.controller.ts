import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { faker } from '@faker-js/faker';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}

  @Get()
  stream(@Res() res: Response): void {
    const apiUrl = `http://localhost:8080/fims/get?uri=dbi/ui_config/dashboard&replyto=${faker.word.noun()}`;

    const streamService = new StreamService(apiUrl);
    streamService.startStream(res);
  }
}
