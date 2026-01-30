import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  // ==================================================================
  // ÁREA PÚBLICA (Qualquer pessoa acessa)
  // ==================================================================

  // 1. Rota de Criação (Pública)
  @Post()
  create(@Body() createTicketDto: CreateTicketDto) {
    return this.ticketsService.create(createTicketDto);
  }

  // 2. Rota de Consulta Pública (Pelo Protocolo ou Nome)
  // IMPORTANTE: Esta rota deve vir ANTES do @Get(':id')
  // Uso: GET /tickets/consulta?q=Maria
  @Get('consulta')
  buscar(@Query('q') termo: string) {
    return this.ticketsService.buscarPublico(termo);
  }

  // ==================================================================
  // ÁREA ADMINISTRATIVA (Requer Login / Token JWT)
  // ==================================================================

  // 3. Listar TODOS (Apenas Admin vê a lista completa)
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  // 4. Ver Detalhes de UM chamado (Apenas Admin)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  // 5. Atualizar Chamado (Apenas Admin)
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(+id, updateTicketDto);
  }

  // 6. Deletar Chamado (Apenas Admin)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}