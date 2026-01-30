import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Precisamos replicar os Enums do Prisma aqui
export enum TicketSector {
  TI = 'TI',
  MANUTENCAO = 'MANUTENCAO',
}

export class CreateTicketDto {
  @IsEnum(TicketSector, { message: 'Setor inválido (Use: TI ou MANUTENCAO)' })
  setorResponsavel: TicketSector;

  @IsString()
  @IsNotEmpty()
  local: string; // Ex: "Sala 302" ou "Recepção"

  @IsString()
  @IsNotEmpty()
  tipoProblema: string; // Ex: "Impressora" ou "Ar Condicionado"

  @IsString()
  @IsNotEmpty()
  descricao: string;

  // O anexo é opcional no envio inicial (trataremos upload depois)
  @IsOptional()
  @IsString()
  anexoUrl?: string;
  
  // Quem está solicitando (Nome visível)
  @IsString()
  @IsNotEmpty()
  nomeSolicitante: string;
}