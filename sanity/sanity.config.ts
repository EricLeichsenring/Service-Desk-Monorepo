import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Meu Painel Intranet',

  projectId: 's0a4d0sr', // Coloque seu ID aqui
  dataset: 'production',
  basePath: '/studio', // Importante: define que o painel abre em /studio

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})