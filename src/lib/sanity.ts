import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from '@sanity/image-url';

export const client = createClient({
  projectId: 's0a4d0sr', // Coloquei direto aqui
  dataset: 'production', // Coloquei direto aqui
  useCdn: false,
  apiVersion: '2023-05-03', 
  token: 'skOu8f2iUopTuMcORJBtqWOgiPyviUsn7XFxZ37yE3wumNuXNsxwXuzlNPtQnfm0TbInvw2fHnI0rCFr8n2LDuEpcigWJhHce1iHfmAHOH10XPGVJySrrNcA6zrwBt5bZ53VsewMq7uQUecQ1A0QYLJdeq1ryJFoSKAjnFCjHUW4ZVY2MvGc', 
});

// Configuração do construtor de imagens
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}