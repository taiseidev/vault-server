// http-client.service.ts
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(private httpService: HttpService) {}

  async get(url: string, headers?: Record<string, string>) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      throw new Error(`HTTP GET request to ${url} failed: ${error.message}`);
    }
  }
}
