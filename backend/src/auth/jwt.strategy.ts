import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // Onde o token vem? Do cabeçalho "Authorization: Bearer <token>"
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // A mesma chave que usamos no auth.module.ts
      secretOrKey: process.env.JWT_SECRET || 'chave_secreta_provisoria',
    });
  }

  // Se o token for válido, isso roda e coloca o usuário dentro da Request
  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}