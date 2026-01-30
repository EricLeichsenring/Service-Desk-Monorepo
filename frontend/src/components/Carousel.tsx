import { useState, useEffect } from 'react';
import api from '../services/api';

// --- DADOS TEMPORÁRIOS (Fallback se o backend não responder) ---
const SLIDES_INICIAIS: Slide[] = [
  {
    titulo: "Bem-vindo à Nova Intranet",
    texto: "Sistema integrado para gestão de chamados e comunicados.",
    imagem: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
  },
  {
    titulo: "Service Desk",
    texto: "Abra chamados para TI e Manutenção de forma rápida.",
    imagem: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=1200"
  }
];

interface Slide {
  titulo: string;
  texto: string;
  imagem?: string;
}

export function Carousel() {
  // Inicializamos com os dados fixos para não ficar tela branca
  const [slides, setSlides] = useState<Slide[]>(SLIDES_INICIAIS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. 🔥 BUSCA OS DADOS DO BACKEND
  useEffect(() => {
    const fetchCarouselData = async () => {
      try {
        const response = await api.get('/carousel');
        
        if (response.data && response.data.length > 0) {
          // 🔄 ADAPTADOR: Transforma os dados do backend para o formato do frontend
          const slidesFormatados = response.data.map((item: any) => ({
            titulo: item.title || item.titulo || 'Sem título',
            texto: item.description || item.texto || item.descricao || '',
            imagem: item.imagemUrl 
            ? `http://localhost:3000${item.imagemUrl}` 
            : (item.imageUrl || item.imagem || '')
          }));
          
          setSlides(slidesFormatados);
          console.log('✅ Carousel carregado do banco:', slidesFormatados);
        } else {
          console.log('⚠️ Nenhum slide no banco, usando dados de fallback');
        }
      } catch (error) {
        console.error('❌ Erro ao buscar carousel:', error);
        console.log('⚠️ Usando slides de fallback');
        // Mantém os SLIDES_INICIAIS em caso de erro
      }
    };

    fetchCarouselData();
  }, []);

  // 2. Configuração do Autoplay (MANTIDA ORIGINAL)
  useEffect(() => {
    // Só inicia o timer se houver mais de 1 slide
    if (slides.length <= 1) return;

    const tempo = 5000; // 5000ms = 5 segundos

    const intervalo = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        // Se estiver no último, volta para o 0 (zero), senão vai para o próximo (+1)
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, tempo);

    // Limpa o timer se o componente for desmontado (evita bugs)
    return () => clearInterval(intervalo);
  }, [slides.length]); // Recria o timer apenas se a quantidade de slides mudar

  // Renderização
  if (!slides.length) return null;

  const currentSlide = slides[currentIndex];
  const hasImage = !!currentSlide.imagem;
  
  // Usamos a URL direta da string
  const backgroundStyle = hasImage
    ? { backgroundImage: `url(${currentSlide.imagem})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};

  return (
    <div 
      className={`relative rounded-lg shadow-lg overflow-hidden transition-all duration-500 min-h-[400px] flex items-center justify-center
        ${!hasImage ? 'bg-gradient-to-r from-blue-600 to-blue-800' : 'bg-gray-900'}
      `}
      style={backgroundStyle}
    >
      {/* Overlay escuro */}
      {hasImage && <div className="absolute inset-0 bg-black/50"></div>}

      <div className="px-12 py-24 text-center relative z-10">
        <h2 className="text-4xl font-bold text-white mb-4 transition-opacity duration-300">
          {currentSlide.titulo || "Título Indisponível"}
        </h2>
        <p className="text-xl text-blue-100 max-w-2xl mx-auto transition-opacity duration-300">
          {currentSlide.texto || "Sem descrição disponível."}
        </p>
      </div>

      {/* Navegação (Bolinhas) - MANTIDA ORIGINAL */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)} 
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}