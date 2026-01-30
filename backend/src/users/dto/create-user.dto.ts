import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';

// 1. Criamos o Enum aqui para validar
export enum UserRole {
  ROOT = 'ROOT',
  TI = 'TI',
  MANUTENCAO = 'MANUTENCAO',
  COMUNICACAO = 'COMUNICACAO',
}

// 2. Definimos a classe com os campos OBRIGATÓRIOS
export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsEnum(UserRole)
  role: UserRole;
}