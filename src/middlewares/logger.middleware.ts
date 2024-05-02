import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const { method, path, body, query, headers } = req;

    // リクエスト開始時にこれらの詳細をログに記録
    console.log('-------------Request-------------');
    console.log(`${method} ${path}`);
    console.log(`Headers: ${JSON.stringify(headers)}`);
    console.log(`Body: ${JSON.stringify(body)}`);
    console.log(`Query: ${JSON.stringify(query)}`);
    console.log('---------------------------------');

    // レスポンスが完了したときにステータスコードをログに記録
    res.on('finish', () => {
      console.log('-------------Response-------------');
      console.log(`${method} ${path} - Status: ${res.statusCode}`);
      console.log('---------------------------------');
    });
    next();
  }
}
