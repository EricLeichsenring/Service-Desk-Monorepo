import { Controller, Get, Post, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { CreateCarouselDto } from './carousel.dto';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  findAll() {
    return this.carouselService.findAll();
  }

  @Post()
  create(@Body() createCarouselDto: CreateCarouselDto) {
    return this.carouselService.create(createCarouselDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carouselService.remove(id);
  }
}