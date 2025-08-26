import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Server } from 'http';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const expressApp = express();
let server: Server;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));
  app.enableCors();
  await app.init();
  return expressApp;
}

// Vercel serverless handler
export default async function handler(req: any, res: any) {
  if (!server) {
    const expressApp = await bootstrap();
    server = expressApp.listen();
  }
  server.emit('request', req, res);
}
