import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID, 
  dataset: import.meta.env.VITE_SANITY_DATASET,
  useCdn: false, // Deixe false para atualizações em tempo real
  apiVersion: '2023-05-03', 
  token: import.meta.env.VITE_SANITY_TOKEN, // Seu token de escrita (Editor)
});

// Configuração do construtor de imagens
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}