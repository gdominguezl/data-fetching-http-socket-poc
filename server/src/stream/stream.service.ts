import { Response } from 'express';
import { interval, from, EMPTY } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import axios from 'axios';

export class StreamService {
  constructor(private readonly apiUrl: string) {}

  startStream(res: Response): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });

    // Fetching data from the API at a regular interval
    const api$ = interval(200).pipe(
      switchMap(() => from(axios.get(this.apiUrl))),
      catchError((error) => {
        console.error(`API error: ${error.message}`);
        return EMPTY;
      }),
      map((response) => response.data),
    );

    // Using a subscription to write data from the API to the response stream
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

    // Detecting when the server closes the connection
    res.on('close', () => {
      console.log('Server closed the connection');
      subscription.unsubscribe();
    });
  }
}
