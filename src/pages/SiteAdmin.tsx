import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Importar navegação
import { Layout } from '../components/Layout';
import { 
  Image, FileText, Trash2, Plus, Loader2, LogOut, 
  Wrench // 2. Ícone para representar a Manutenção
} from 'lucide-react';
import { client } from '../lib/sanity';

export function SiteAdmin() {
  const navigate = useNavigate(); // Hook de navegação

  const [activeTab, setActiveTab] = useState<'banners' | 'docs'>('banners');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Dados
  const [carouselData, setCarouselData] = useState<any>(null);
  const [docs, setDocs] = useState<any[]>([]);
  // 3. Estado para saber quem é o usuário
  const [currentUser, setCurrentUser] = useState<{role?: string} | null>(null);

  // Formulários
  const [newSlide, setNewSlide] = useState({ titulo: '', texto: '', file: null as File | null });
  const [newDoc, setNewDoc] = useState({ titulo: '', file: null as File | null });

  // 1. CARREGAR DADOS E USUÁRIO
  useEffect(() => {
    const userStr = localStorage.getItem('intranet_user');
    if (!userStr) { window.location.href = '/login'; return; }
    
    const user = JSON.parse(userStr);
    setCurrentUser(user); // Salva usuário no estado

    // Verificação de permissão
    if (user.role !== 'comunicacao' && user.role !== 'root') {
      alert('Acesso negado para seu perfil.');
      window.location.href = '/login';
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const bannerQuery = `*[_type == "carousel"][0] { _id, slides[] { titulo, texto, "url": imagem.asset->url, "key": _key } }`;
      const docQuery = `*[_type == "documentosImpressao"] | order(_createdAt desc) { _id, titulo, "url": arquivo.asset->url }`;

      const [bannerResult, docResult] = await Promise.all([
        client.fetch(bannerQuery),
        client.fetch(docQuery)
      ]);

      setCarouselData(bannerResult);
      setDocs(docResult);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // 2. ADICIONAR BANNER
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlide.file || !carouselData?._id) return alert('Selecione uma imagem e verifique se o carrossel existe.');

    setUploading(true);
    try {
      const imageAsset = await client.assets.upload('image', newSlide.file);

      await client.patch(carouselData._id)
        .setIfMissing({ slides: [] })
        .append('slides', [{
          _type: 'object',
          _key: Math.random().toString(36).substring(7),
          titulo: newSlide.titulo,
          texto: newSlide.texto,
          imagem: { _type: 'image', asset: { _type: 'reference', _ref: imageAsset._id } }
        }])
        .commit();

      alert('Banner adicionado!');
      setNewSlide({ titulo: '', texto: '', file: null });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar banner');
    } finally {
      setUploading(false);
    }
  };

  // 3. REMOVER BANNER
  const removeBanner = async (itemKey: string) => {
    if (!confirm('Tem certeza que deseja remover este banner?')) return;
    try {
      await client.patch(carouselData._id).unset([`slides[_key=="${itemKey}"]`]).commit();
      fetchData();
    } catch (err) { console.error(err); alert('Erro ao remover'); }
  };

  // 4. ADICIONAR DOCUMENTO
  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.file) return alert('Selecione um PDF');

    setUploading(true);
    try {
      const fileAsset = await client.assets.upload('file', newDoc.file);

      await client.create({
        _type: 'documentosImpressao',
        titulo: newDoc.titulo,
        arquivo: { _type: 'file', asset: { _type: 'reference', _ref: fileAsset._id } }
      });

      alert('Documento publicado!');
      setNewDoc({ titulo: '', file: null });
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Erro ao publicar documento');
    } finally {
      setUploading(false);
    }
  };

  // 5. REMOVER DOCUMENTO
  const removeDoc = async (id: string) => {
    if (!confirm('Excluir documento permanentemente?')) return;
    try {
      await client.delete(id);
      fetchData();
    } catch (err) { alert('Erro ao excluir'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('intranet_user');
    navigate('/login');
  };

  // Renderização
  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-8">
        
        {/* --- CABEÇALHO COM BOTÕES DE NAVEGAÇÃO --- */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Gestão do Site</h1>
            <p className="text-gray-600">Gerencie banners e arquivos públicos</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* BOTÃO DO ROOT (Só aparece para root) */}
            {currentUser?.role === 'root' && (
              <button 
                onClick={() => navigate('/admin-os')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium border border-blue-200"
              >
                <Wrench size={18} />
                Painel O.S.
              </button>
            )}

            <button 
              onClick={handleLogout} 
              className="text-red-600 hover:text-red-700 flex gap-2 items-center text-sm font-medium px-2"
            >
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>

        {/* Abas */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('banners')}
            className={`pb-4 px-2 font-medium flex items-center gap-2 ${activeTab === 'banners' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Image size={20} /> Carrossel (Home)
          </button>
          <button 
            onClick={() => setActiveTab('docs')}
            className={`pb-4 px-2 font-medium flex items-center gap-2 ${activeTab === 'docs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileText size={20} /> Documentos
          </button>
        </div>

        {loading ? <p className="text-center py-10 text-gray-500">Carregando dados...</p> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* --- COLUNA ESQUERDA: FORMULÁRIO --- */}
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Plus size={20} className="text-blue-600"/> 
                {activeTab === 'banners' ? 'Novo Slide' : 'Novo Documento'}
              </h2>
              
              {activeTab === 'banners' ? (
                <form onSubmit={handleAddBanner} className="space-y-4">
                  <input 
                    type="text" placeholder="Título do Slide" required
                    className="w-full p-2 border rounded"
                    value={newSlide.titulo} onChange={e => setNewSlide({...newSlide, titulo: e.target.value})}
                  />
                  <textarea 
                    placeholder="Texto curto" required
                    className="w-full p-2 border rounded"
                    value={newSlide.texto} onChange={e => setNewSlide({...newSlide, texto: e.target.value})}
                  />
                  <div className="border-2 border-dashed p-4 rounded text-center cursor-pointer hover:bg-gray-50 min-w-0">
                    <input className="w-full" type="file" accept="image/*" required onChange={e => setNewSlide({...newSlide, file: e.target.files?.[0] || null})} />
                  </div>
                  <button disabled={uploading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 flex justify-center">
                    {uploading ? <Loader2 className="animate-spin"/> : 'Adicionar ao Site'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleAddDoc} className="space-y-4">
                  <input 
                    type="text" placeholder="Nome do Documento (ex: Edital 01)" required
                    className="w-full p-2 border rounded"
                    value={newDoc.titulo} onChange={e => setNewDoc({...newDoc, titulo: e.target.value})}
                  />
                  <div className="border-2 border-dashed p-4 rounded text-center cursor-pointer hover:bg-gray-50 min-w-0">
                    <input className="w-full" type="file" accept=".pdf,.doc,.docx" required onChange={e => setNewDoc({...newDoc, file: e.target.files?.[0] || null})} />
                    <p className="text-xs text-gray-500 mt-1">PDF Recomendado</p>
                  </div>
                  <button disabled={uploading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 flex justify-center">
                    {uploading ? <Loader2 className="animate-spin"/> : 'Publicar Documento'}
                  </button>
                </form>
              )}
            </div>

            {/* --- COLUNA DIREITA: LISTA --- */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-bold text-gray-700">Itens Ativos</h2>
              
              {activeTab === 'banners' ? (
                <div className="grid gap-4">
                  {carouselData?.slides?.map((slide: any) => (
                    <div key={slide.key} className="flex items-center gap-4 bg-white p-4 rounded border">
                      <img src={slide.url} className="w-24 h-16 object-cover rounded" />
                      <div className="flex-1">
                        <h4 className="font-bold">{slide.titulo}</h4>
                        <p className="text-sm text-gray-500">{slide.texto}</p>
                      </div>
                      <button onClick={() => removeBanner(slide.key)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  ))}
                  {!carouselData?.slides && <p className="text-gray-500">Nenhum banner encontrado.</p>}
                </div>
              ) : (
                <div className="grid gap-2">
                  {docs.map((doc) => (
                    <div key={doc._id} className="flex items-center justify-between bg-white p-4 rounded border">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded text-red-600"><FileText size={20}/></div>
                        <span className="font-medium">{doc.titulo}</span>
                      </div>
                      <div className="flex gap-4 items-center">
                        <a href={doc.url} target="_blank" className="text-blue-600 text-sm hover:underline">Ver arquivo</a>
                        <button onClick={() => removeDoc(doc._id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}