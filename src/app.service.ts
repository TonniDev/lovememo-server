import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getLoveMemo(): string {
    return 'Hello Love Memos!';
  }
}
