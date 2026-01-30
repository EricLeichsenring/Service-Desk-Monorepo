import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    UsersModule, // Importamos para poder buscar o usuário
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'chave_secreta_provisoria', // Ideal: usar .env
      signOptions: { expiresIn: '8h' }, // O token dura 8 horas (turno de trabalho)
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,
    JwtStrategy
  ],
})
export class AuthModule {}