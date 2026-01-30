import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(login: string, pass: string) {
    // 1. Busca o usuário pelo login
    const user = await this.usersService.findByLogin(login);
    
    // 2. Se não achar, erro
    if (!user) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // 3. Compara a senha (texto) com o hash do banco
    const isMatch = await bcrypt.compare(pass, user.senha);
    if (!isMatch) {
      throw new UnauthorizedException('Usuário ou senha inválidos');
    }

    // 4. Se deu tudo certo, gera o Token
    const payload = { sub: user.id, username: user.login, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
      nome: user.nome,
      role: user.role
    };
  }
}