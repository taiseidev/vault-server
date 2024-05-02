import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module'; // 仮定のモジュールパス

@Module({
  imports: [MoviesModule], // MoviesModuleをインポート
  controllers: [],
  providers: [],
})
export class AppModule {}
``;
