import { Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // 1. AJUSTE: Verifica se o login já existe antes de tentar criar
    const userExists = await this.prisma.user.findUnique({
      where: { login: createUserDto.login },
    });

    if (userExists) {
      throw new ConflictException('Este login já está em uso.');
    }

    // 2. Criptografar a senha
    const hashedPassword = await bcrypt.hash(createUserDto.senha, 10);

    // 3. Salvar no banco
    return this.prisma.user.create({
      data: {
        // É mais seguro mapear manualmente para garantir que a senha seja a hash
        nome: createUserDto.nome,
        login: createUserDto.login,
        senha: hashedPassword,
        role: createUserDto.role, 
        // Se houver outros campos no DTO, adicione aqui
      },
    });
  }

  findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        nome: true,
        login: true,
        role: true,
        createdAt: true,
        // Senha omitida propositalmente
      }
    });
  }

  findOne(id: number) {
    return this.prisma.user.findUnique({ 
      where: { id },
      // Opcional: Você pode usar 'select' aqui também para não retornar a senha
    });
  }
  
  findByLogin(login: string) {
    return this.prisma.user.findUnique({ where: { login } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    // Nota: Se for atualizar senha aqui, lembre de fazer o hash novamente!
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({ where: { id } });
  }
}