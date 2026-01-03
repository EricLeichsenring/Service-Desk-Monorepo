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
          // ATENÇÃO: Mudado de 'andamento' para 'em_andamento' para bater com o código React
          { title: 'Em Andamento', value: 'em_andamento' }, 
          { title: 'Concluído', value: 'concluido' },
          // NOVO: Adicionado status cancelado
          { title: 'Cancelado', value: 'cancelado' }, 
        ],
        layout: 'radio'
      },
      initialValue: 'pendente'
    }),
    
    // --- NOVO CAMPO: Roteamento Automático ---
    defineField({
      name: 'setor',
      title: 'Setor Responsável',
      type: 'string',
      options: {
        list: [
          { title: 'TI', value: 'ti' },
          { title: 'Manutenção', value: 'manutencao' }
        ],
        layout: 'radio'
      },
      initialValue: 'manutencao' // Valor padrão por segurança
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
    
    // --- NOVO CAMPO: Material Utilizado ---
    defineField({
      name: 'materialUtilizado',
      title: 'Material Utilizado',
      type: 'text',
      // Só aparece no painel do Sanity se estiver concluído
      hidden: ({document}) => document?.status !== 'concluido' 
    }),

    defineField({
      name: 'justificativa',
      title: 'Justificativa de Cancelamento',
      type: 'text', 
      // Só aparece no painel do Sanity se estiver cancelado
      hidden: ({document}) => document?.status !== 'cancelado' 
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
  ]
})