import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDocumentDto } from './documents.dto';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    // Atenção: O prisma gera 'document' minúsculo para o model 'Document'
    return this.prisma.document.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateDocumentDto) {
    return this.prisma.document.create({ data });
  }

  async remove(id: number) {
    return this.prisma.document.delete({
      where: { id },
    });
  }
}