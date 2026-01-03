import { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Search, Printer, FileText } from 'lucide-react';
import { client } from '../lib/sanity'; // Certifique-se que o caminho está correto

// Interface para os dados que vêm do Sanity
interface DocumentoSanity {
  _id: string;
  titulo: string;
  arquivoUrl: string;
  _createdAt: string;
}

// Interface usada no componente (compatível com seu layout)
interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  url: string;
}

export function DocumentSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  // Busca os dados do Sanity ao carregar a página
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        // Query GROQ
        // 1. Filtra pelo tipo no schema ('documentosImpressao')
        // 2. Traz o título, a data de criação e a URL do arquivo
        const query = `
          *[_type == "documentosImpressao"] | order(lower(titulo) asc) {
            _id,
            titulo,
            "arquivoUrl": arquivo.asset->url,
            _createdAt
          }
        `;

        const data: DocumentoSanity[] = await client.fetch(query);

        // Formata os dados para o padrão do layout
        const formattedDocs = data.map((doc) => ({
          id: doc._id,
          name: doc.titulo,
          // Tenta pegar a extensão do arquivo da URL, ou define padrão PDF
          type: doc.arquivoUrl.split('.').pop()?.toUpperCase() || 'PDF', 
          date: new Date(doc._createdAt).toLocaleDateString('pt-BR'),
          url: doc.arquivoUrl
        }));

        setDocuments(formattedDocs);
      } catch (error) {
        console.error("Erro ao buscar documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  // Filtragem local baseada na busca
  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrint = (url: string) => {
    if (url) {
      // Abre o PDF em uma nova aba para impressão
      window.open(url, '_blank');
    } else {
      alert("Arquivo não disponível");
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Buscar Documentos</h1>
            <p className="text-gray-600">Pesquise e imprima documentos oficiais</p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Digite o nome do documento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-gray-500 py-8">Carregando documentos...</p>
            ) : filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{doc.name}</h3>
                      <p className="text-sm text-gray-500">
                        {doc.type} - {doc.date}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handlePrint(doc.url)}
                    className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors" title='Imprimir'
                  >
                    <Printer className="w-4 h-4" />
                    <span className='hidden sm:block'>Imprimir</span>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum documento encontrado</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}