import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCarouselDto } from './carousel.dto';

@Injectable()
export class CarouselService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.carouselSlide.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: CreateCarouselDto) {
    return this.prisma.carouselSlide.create({ data });
  }

  async remove(id: number) {
    return this.prisma.carouselSlide.delete({
      where: { id },
    });
  }
}