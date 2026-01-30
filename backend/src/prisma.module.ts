import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // <--- Isso é a mágica. Torna o Prisma disponível em TODO o app.
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}