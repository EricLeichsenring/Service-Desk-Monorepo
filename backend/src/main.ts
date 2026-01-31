import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- ADICIONE ESTAS LINHAS ---
  app.enableCors({
    origin: '*', // Permite qualquer origem (ideal para teste inicial)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe()); // Ativa as validações (IsString, IsNotEmpty)
  // ----------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();