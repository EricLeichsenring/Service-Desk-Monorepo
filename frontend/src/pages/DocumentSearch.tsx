import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { 
  Search, Printer, FileText, Folder, 
  ChevronRight, ArrowLeft, FolderOpen, AlertCircle 
} from 'lucide-react';
import api from '../services/api';

// Interface para o Frontend
interface Document {
  id: string;
  name: string;
  sector: string;
  type: string;
  date: string;
  url: string;
}

export function DocumentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para controlar qual pasta está aberta (null = vendo todas as pastas)
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // 🔥 BUSCA OS DOCUMENTOS DO BACKEND
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Faz a requisição para o backend
        const response = await api.get('/documents');
        
        if (response.data && response.data.length > 0) {
          // 🔄 ADAPTADOR: Transforma os dados do backend para o formato do frontend
          const documentsFormatted: Document[] = response.data.map((item: any) => {
            // Extrai a extensão do arquivo da URL
            const fileExtension = item.arquivoUrl 
              ? item.arquivoUrl.split('.').pop()?.toUpperCase() || 'FILE'
              : 'FILE';
            
            return {
              id: String(item.id),
              name: item.titulo || 'Sem título',
              sector: item.setor || 'Geral',
              type: fileExtension,
              date: item.createdAt 
                ? new Date(item.createdAt).toLocaleDateString('pt-BR')
                : new Date().toLocaleDateString('pt-BR'),
              url: item.arquivoUrl 
                ? `${api.defaults.baseURL || 'http://localhost:3000'}${item.arquivoUrl}`
                : '#'
            };
          });
          
          setDocuments(documentsFormatted);
          console.log('✅ Documentos carregados do banco:', documentsFormatted);
        } else {
          console.log('⚠️ Nenhum documento no banco');
          setDocuments([]);
        }
        
      } catch (err: any) {
        console.error('❌ Erro ao buscar documentos:', err);
        console.error('📍 Response:', err.response?.data);
        
        setError('Não foi possível carregar os documentos. Verifique a conexão com o servidor.');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, []);

  const handlePrint = (url: string) => {
    if (url && url !== '#') {
      window.open(url, '_blank');
    } else {
      alert("Este documento ainda não possui arquivo vinculado.");
    }
  };

  // --- LÓGICA DE AGRUPAMENTO (MANTIDA IGUAL) ---

  // 1. Obtém lista única de setores para criar as pastas
  const sectors = Array.from(new Set(documents.map(d => d.sector))).sort();

  // 2. Filtra documentos baseados na busca OU no setor selecionado
  const getDisplayDocuments = () => {
    // Se o usuário estiver digitando na busca, faz uma busca global (ignora pastas)
    if (searchTerm.trim() !== '') {
      return documents.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Se tiver um setor selecionado, mostra só os documentos dele
    if (selectedSector) {
      return documents.filter(doc => doc.sector === selectedSector);
    }

    return []; // Se não tiver busca nem setor, não retorna docs (mostraremos as pastas)
  };

  const filteredDocs = getDisplayDocuments();
  const isGlobalSearch = searchTerm.trim() !== '';

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 min-h-[500px]">
          
          {/* CABEÇALHO */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Documentos e Modelos</h1>
            <p className="text-gray-600">
              {selectedSector && !isGlobalSearch 
                ? `Visualizando pasta: ${selectedSector}` 
                : 'Navegue pelas pastas ou pesquise um documento'}
            </p>
          </div>

          {/* BARRA DE PESQUISA */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Pesquisar documento em todos os setores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* CONTEÚDO PRINCIPAL */}
          <div className="space-y-3">
            
            {loading ? (
              <p className="text-center text-gray-500 py-12 flex flex-col items-center">
                 <span className="animate-spin text-2xl mb-2">↻</span>
                 Carregando biblioteca...
              </p>
            ) : error ? (
              // ESTADO DE ERRO
              <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-600 font-medium mb-2">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-sm text-red-600 hover:text-red-800 underline"
                >
                  Tentar novamente
                </button>
              </div>
            ) : documents.length === 0 ? (
              // ESTADO VAZIO (sem documentos no banco)
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Nenhum documento cadastrado ainda.</p>
                <p className="text-sm text-gray-400 mt-1">Os documentos adicionados aparecerão aqui.</p>
              </div>
            ) : (
              <>
                {/* CENÁRIO 1: VISÃO DE PASTAS (Sem busca e nenhum setor selecionado) */}
                {!isGlobalSearch && !selectedSector && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectors.length > 0 ? (
                      sectors.map((sector) => {
                        const count = documents.filter(d => d.sector === sector).length;
                        return (
                          <button
                            key={sector}
                            onClick={() => setSelectedSector(sector)}
                            className="flex items-center p-4 bg-blue-50 border border-blue-100 rounded-lg hover:bg-blue-100 hover:shadow-sm transition-all text-left group"
                          >
                            <div className="p-3 bg-white rounded-full mr-4 text-blue-500 group-hover:text-blue-600">
                              <Folder className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800 group-hover:text-blue-800">{sector}</h3>
                              <p className="text-xs text-gray-500">{count} documento(s)</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                          </button>
                        );
                      })
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        Nenhuma pasta disponível
                      </div>
                    )}
                  </div>
                )}

                {/* CENÁRIO 2: LISTA DE ARQUIVOS (Busca Global OU Dentro de uma Pasta) */}
                {(isGlobalSearch || selectedSector) && (
                  <div>
                    {/* Botão de Voltar (Só aparece se não for busca global) */}
                    {!isGlobalSearch && (
                      <button 
                        onClick={() => setSelectedSector(null)}
                        className="flex items-center text-sm text-gray-500 hover:text-blue-600 mb-4 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Voltar para pastas
                      </button>
                    )}

                    {/* Lista de Docs */}
                    <div className="space-y-2 animate-fade-in">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-white hover:border-blue-200 hover:shadow-sm transition-all"
                          >
                            <div className="flex items-center gap-4 flex-1">
                              <div className="flex items-center justify-center w-10 h-10 bg-white border border-gray-200 rounded text-gray-500">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-800">{doc.name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                  <span className="bg-gray-200 px-2 py-0.5 rounded text-xs font-semibold text-gray-600">
                                    {doc.type}
                                  </span>
                                  <span>• {doc.date}</span>
                                  {/* Na busca global, mostra de qual setor é o arquivo */}
                                  {isGlobalSearch && (
                                    <span className="text-blue-600 text-xs bg-blue-50 px-2 py-0.5 rounded">
                                      {doc.sector}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => handlePrint(doc.url)}
                              className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                              title='Imprimir'
                            >
                              <Printer className="w-4 h-4" />
                              <span className='hidden sm:block'>Imprimir</span>
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                          <FolderOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500 font-medium">Nenhum documento encontrado.</p>
                          {isGlobalSearch && <p className="text-sm text-gray-400">Tente buscar por outro termo.</p>}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}