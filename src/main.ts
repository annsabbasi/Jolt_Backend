import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { Express } from 'express';

async function createNestApp(expressApp: Express) {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn', 'log', 'debug'],
      cors: true,
    },
  );
  const API_PREFIX = "/api/v1";
  app.setGlobalPrefix(API_PREFIX);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Jolt App API')
    .setDescription('The Jolt App is the description.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/', (req, res) => {
    res.send('🚀 Server is running!');
  });
  return app;
}

const server: Express = express();
let nestApp;

async function bootstrap() {
  nestApp = await createNestApp(server);
  await nestApp.init();

  if (process.env.VERCEL !== '1') {
    const port = process.env.PORT || 3020;
    await nestApp.listen(port);
    console.log(`Application is running on: http://localhost:${port}`);
  }
}

bootstrap();

export default server;