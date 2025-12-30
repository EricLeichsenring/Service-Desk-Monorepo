import { useState, useEffect } from 'react';
import { client, urlFor } from '../lib/sanity';

export function Carousel() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 1. Busca os dados do Sanity
  useEffect(() => {
    const query = `*[_type == "carousel" && ativo == true][0].slides`;

    client.fetch(query)
      .then((data) => {
        if (data) setSlides(data);
      })
      .catch(console.error);
  }, []);

  // 2. Configuração do Autoplay (Novo)
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
  
  const backgroundStyle = hasImage
    ? { backgroundImage: `url(${urlFor(currentSlide.imagem).width(1200).url()})`, backgroundSize: 'cover', backgroundPosition: 'center' }
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

      {/* Navegação (Bolinhas) */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)} // O usuário ainda pode clicar para mudar manualmente
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