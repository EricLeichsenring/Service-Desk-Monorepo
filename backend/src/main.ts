import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- ADICIONE ESTAS LINHAS ---
  app.enableCors(); // Libera o Frontend para acessar o Backend
  app.useGlobalPipes(new ValidationPipe()); // Ativa as validações (IsString, IsNotEmpty)
  // ----------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();