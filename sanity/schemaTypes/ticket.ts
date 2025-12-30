// schema/ticket.ts
import { defineType, defineField } from 'sanity'

export const ticketType = defineType({
  name: 'chamado',
  title: 'Chamados de Suporte',
  type: 'document',
  fields: [
    defineField({
      name: 'status',
      title: 'Status do Chamado',
      type: 'string',
      options: {
        list: [
          { title: 'Pendente', value: 'pendente' },
          { title: 'Em Andamento', value: 'andamento' },
          { title: 'Concluído', value: 'concluido' },
        ],
        layout: 'radio' // Aparece como bolinhas de seleção
      },
      initialValue: 'pendente' // Começa sempre como pendente
    }),
    defineField({
      name: 'nome',
      title: 'Nome do Solicitante',
      type: 'string',
    }),
    defineField({
      name: 'local',
      title: 'Local / Setor',
      type: 'string',
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo de Problema',
      type: 'string',
    }),
    defineField({
      name: 'descricao',
      title: 'Descrição',
      type: 'text',
    }),
    defineField({
      name: 'anexo',
      title: 'Imagem do Problema',
      type: 'image',
      options: { hotspot: true }
    }),
    defineField({
      name: 'dataAbertura',
      title: 'Data de Abertura',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'justificativa',
      title: 'Justificativa de Cancelamento',
      type: 'text', 
      hidden: ({document}) => document?.status !== 'cancelado' // Só aparece no painel se estiver cancelado
    }),
  ]
})