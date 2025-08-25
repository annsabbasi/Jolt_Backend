import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS (local + deployed frontend)
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // allow Railway frontend
    ].filter(Boolean), // remove undefined if env not set
    credentials: true, // fixed key name
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT || 3020;
  await app.listen(port, '0.0.0.0'); // ✅ important for Railway
  console.log(`🚀 Server running on port ${port}`);
}

bootstrap();






// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS
//   app.enableCors({
//     origin: ['http:localhost:3000', 'http:localhost:3001',],
//     Credential: true
//   })

//   app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))

//   await app.listen(process.env.PORT ?? 3020);
// }
// bootstrap();
