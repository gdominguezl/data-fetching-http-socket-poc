import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { interval, from, EMPTY } from 'rxjs';
import { faker } from '@faker-js/faker';
import { map, switchMap, catchError } from 'rxjs/operators';
import axios from 'axios';

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

    const apiURL = `http://localhost:8080/fims/get?uri=dbi/ui_config/dashboard&replyto=${faker.word.noun()}`;

    // Use an observable to fetch data from the API at a regular interval
    const api$ = interval(200).pipe(
      switchMap(() => from(axios.get(apiURL))),
      catchError((error) => {
        console.error(`API error: ${error.message}`);
        return EMPTY;
      }),
      map((response) => response.data),
    );

    // Use a subscription to write data from the API to the response stream
    const subscription = api$.subscribe({
      next: (data) => {
        res.write(`data: ${JSON.stringify(data)}\n\n`);
      },
      error: (error) => {
        console.log(`Subscription error: ${error.message}`);
        res.end();
      },
      complete: () => {
        console.log('Subscription completed');
        res.end();
      },
    });

    // Detect when the server closes the connection
    res.on('close', () => {
      console.log('Server closed the connection');
      subscription.unsubscribe();
    });
  }
}
