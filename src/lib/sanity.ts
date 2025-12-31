import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: 's0a4d0sr', // Coloquei direto aqui
  dataset: 'production', // Coloquei direto aqui
  useCdn: false,
  apiVersion: '2023-05-03', 
  token: 'sknDNmQ8F38PnuumlvfdPvI4LuLAyDxlk9RKk6Z4mZ1Ryha3N4L5XLaQvD48Gc45PlV2miavC4prtTjG8T8k50JrjjQT1WVrQBC5Lkqbi0sJy46eEEBO3HIRI6nH1W4v9VwG75dGLhBfyBhO6yR7tszpXUn1uzZ17heyX4B0tILTYDq0tDXn', 
});

// Configuração do construtor de imagens
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}