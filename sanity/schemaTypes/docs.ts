import { defineType, defineField } from 'sanity'

export const docsType = defineType({
  name: 'documentosImpressao',
  title: 'Documentos para Impressão',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome do Documento',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'arquivo',
      title: 'Arquivo (PDF/DOC)',
      type: 'file',
      options: { accept: '.pdf,.doc,.docx' },
      validation: Rule => Rule.required()
    })
  ]
})