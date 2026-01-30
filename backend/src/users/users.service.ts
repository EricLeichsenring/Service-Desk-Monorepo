import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 1. Criptografar a senha antes de salvar
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    // 2. Salvar no banco usando o Prisma
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        senha: hashedPassword, // Salva o hash, nunca a senha real
      },
    });
  }

  findAll() {
    // Retorna todos, mas removemos a senha do retorno por segurança
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        login: true,
        role: true,
        createdAt: true,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  // Buscar pelo Login (Usaremos na Autenticação depois)
  findByLogin(login: string) {
    return this.prisma.user.findUnique({ where: { login } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}