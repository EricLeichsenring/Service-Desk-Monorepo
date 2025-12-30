import { defineField, defineType } from 'sanity'

export const carouselType = defineType({
  name: 'carousel',
  title: 'Carrossel Principal',
  type: 'document',
  fields: [
    defineField({
      name: 'tituloInterno',
      title: 'Identificação do Carrossel',
      type: 'string',
      description: 'Apenas para organização interna (ex: "Carrossel Home")'
    }),
    defineField({
      name: 'slides',
      title: 'Slides',
      type: 'array', 
      of: [
        {
          type: 'object',
          title: 'Slide',
          fields: [
            { name: 'titulo', type: 'string', title: 'Título do Slide' },
            { name: 'texto', type: 'text', title: 'Texto de Apoio', rows: 2 },
            { name: 'imagem', type: 'image', title: 'Imagem de Fundo', options: { hotspot: true } },
          ],
          preview: {
            select: {
              title: 'titulo',
              media: 'imagem'
            }
          }
        }
      ]
    }),
    defineField({
      name: 'ativo',
      title: 'Ativar este carrossel?',
      type: 'boolean',
      initialValue: true
    })
  ],
})