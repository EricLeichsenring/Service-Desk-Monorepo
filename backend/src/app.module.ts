import { Module, Global } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma.module';
import { AuthModule } from './auth/auth.module';
import { TicketsModule } from './tickets/tickets.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UploadController } from './upload.controller';
import { CarouselModule } from './carousel/carousel.module';
import { DocumentsModule } from './documents/documents.module';

@Global()
@Module({
  imports: [
    // Configuração para servir a pasta 'uploads' publicamente
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),// Caminho da pasta
      serveRoot: '/uploads',// Prefixo da URL (http://localhost:3000/uploads/arquivo.jpg)
    }),
    PrismaModule, 
    UsersModule, 
    AuthModule, 
    TicketsModule,
    CarouselModule,
    DocumentsModule,
  ],
  controllers: [
    AppController,
    UploadController,
  ],
  providers: [AppService, PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
