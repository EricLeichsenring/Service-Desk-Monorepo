import { Studio } from 'sanity'
import config from '../../sanity/sanity.config' // Caminho para seu arquivo de config

export function SanityStudio() {
  // A div com h-screen garante que o painel ocupe a tela toda
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Studio config={config} />
    </div>
  )
}