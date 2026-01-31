import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- ADICIONE ESTAS LINHAS ---
  app.enableCors({
  origin: [
    'https://service-desk-monorepo.vercel.app', // Sua URL da Vercel
    'http://localhost:5173',          // Localhost do Vite
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
});
  app.useGlobalPipes(new ValidationPipe()); // Ativa as validações (IsString, IsNotEmpty)
  // ----------------------------

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();