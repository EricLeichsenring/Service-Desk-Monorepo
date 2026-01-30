import { Controller, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('upload')
export class UploadController {
@Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        callback(null, `${uniqueSuffix}${ext}`);
      },
    }),
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // PROTEÇÃO: Se não vier arquivo, retorna erro amigável em vez de travar
    if (!file) {
      return { erro: 'Nenhum arquivo enviado. Verifique se o campo se chama "file"' };
    }

    return {
      url: `/uploads/${file.filename}`,
      originalName: file.originalname
    };
  }
}