import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    // Enable CORS
    app.enableCors({
      origin: true, // Allow all for now
      credentials: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    const port = process.env.PORT || 3020;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Server running on port ${port}`);

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
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
