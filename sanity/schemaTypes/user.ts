import { defineType, defineField } from 'sanity'

export const userType = defineType({
  name: 'usuario',
  title: 'Usuários do Sistema',
  type: 'document',
  fields: [
    defineField({
      name: 'nome',
      title: 'Nome Completo',
      type: 'string',
    }),
    defineField({
      name: 'login',
      title: 'Login / Usuário',
      type: 'string',
    }),
    defineField({
      name: 'senha',
      title: 'Senha',
      type: 'string', // Em produção real, isso deveria ser hash
      description: 'Senha de acesso ao sistema'
    }),
    defineField({
      name: 'role',
      title: 'Função',
      type: 'string',
      options: {
        list: [
          { title: 'Equipe de Manutenção (O.S.)', value: 'manutencao' },
          { title: 'Comunicação / Marketing', value: 'comunicacao' },
          { title: 'ti', value: 'ti'},
          { title: 'Administrador Root (Acesso Total)', value: 'root' }
        ]
      }
    })
  ]
})