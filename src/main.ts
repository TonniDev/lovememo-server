import * as fs from 'fs';
import * as process from 'node:process';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  let app;

  if (process.env.HTTPS === 'true') {
    const httpsOptions = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CERT),
    };
    app = await NestFactory.create(AppModule, { httpsOptions });
  } else {
    app = await NestFactory.create(AppModule);
  }

  app.use(helmet());
  app.use(
    helmet.hsts({
      maxAge: 86400, // 60 days
      includeSubDomains: true,
      preload: true,
    }),
  );

  app.setGlobalPrefix('api/v1');
  app.use(cookieParser());
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
