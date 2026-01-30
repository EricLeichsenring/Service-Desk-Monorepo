import { Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { PrismaService } from '../prisma.service';
import { TicketStatus } from '@prisma/client'; // Importamos o Enum do Prisma para garantir

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  // ==================================================================
  // ÁREA PÚBLICA (Qualquer pessoa acessa)
  // ==================================================================

  // 1. Criar Chamado (Sem login)
  async create(createTicketDto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        ...createTicketDto,
        status: TicketStatus.PENDENTE, // Garantindo que usa o Enum correto
        // userId fica como NULL pois é público
      },
    });
  }

  // 2. Busca Pública (Pelo ID/Protocolo ou Pelo Nome)
  async buscarPublico(termo: string) {
    const id = Number(termo);

    // CASO 1: É um número? Busca pelo ID
    if (!isNaN(id)) {
      return this.prisma.ticket.findUnique({
        where: { id: id },
        select: { 
          id: true,
          status: true,
          nomeSolicitante: true,
          tipoProblema: true,
          local: true,
          justificativa: true,
          dataAbertura: true, // <--- Nome corrigido aqui
          descricao: true, 
        }
      });
    }

    // CASO 2: É texto? Busca por parte do nome
    return this.prisma.ticket.findMany({
      where: {
        nomeSolicitante: {
          contains: termo, 
        },
      },
      select: {
        id: true,
        status: true,
        nomeSolicitante: true,
        tipoProblema: true,
        local: true,
        justificativa: true,
        dataAbertura: true, // <--- Nome corrigido aqui
      }
    });
  }

  // ==================================================================
  // ÁREA ADMINISTRATIVA (Requer Login)
  // ==================================================================

  // 3. Listar todos
  findAll() {
    return this.prisma.ticket.findMany({
      orderBy: { dataAbertura: 'desc' }, // <--- CORREÇÃO: Usando dataAbertura
      include: { user: true }, 
    });
  }

  // 4. Buscar UM detalhado
  findOne(id: number) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // 5. Atualizar
  update(id: number, updateTicketDto: UpdateTicketDto) {
    return this.prisma.ticket.update({
      where: { id },
      data: updateTicketDto,
    });
  }

  // 6. Remover
  remove(id: number) {
    return this.prisma.ticket.delete({ where: { id } });
  }
}