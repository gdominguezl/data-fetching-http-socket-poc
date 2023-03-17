import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { faker } from '@faker-js/faker';

@Controller('stream')
export class StreamController {
  @Get()
  stream(@Res() res: Response): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    // Data to be fetch in finn
    const data$ = interval(200).pipe(
      map(() => ({
        id: faker.datatype.uuid(),
        name: faker.name.firstName(),
        age: faker.datatype.number(100),
        address: {
          street: faker.address.street(),
          city: faker.address.city(),
          state: faker.address.state(),
          country: faker.address.country(),
        },
      })),
      map((data) => `data: ${JSON.stringify(data)}\n\n`.repeat(5)),
    );

    data$.subscribe((data) => {
      res.write(data);
    });
  }
}
