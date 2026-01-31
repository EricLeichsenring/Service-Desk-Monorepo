import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import {
  // Ícones Gerais
  LogOut, Wrench, Loader2, Trash2,
  // Ícones Site
  Image, FileText, Plus, Folder, Type,
  // Ícones Usuários
  UserPlus, Shield, Lock, User, Users
} from 'lucide-react';
import api from '../services/api';

// --- INTERFACES ---
interface Slide {
  id: string;
  titulo: string;
  texto: string;
  imagemUrl?: string;
}

interface Doc {
  id: string;
  titulo: string;
  texto?: string; 
  setor: string;
  arquivoUrl: string;
}

// Alterado para bater com o Model User
interface UserData {
  id: number;     // Prisma: Int
  nome: string;   // Prisma: nome
  login: string;  // Prisma: login
  role: string;   // Prisma: role
}

// Constantes
const ROLES = ['ROOT', 'TI', 'MANUTENCAO', 'COMUNICACAO'];
const SETORES_OPCOES = [
  'Hospital H.M.G', 'Pronto Socorro (PS)', 'Unidade Básica de Saúde (UBS)',
  'Pop H.M.G', 'Pop P.S', 'Pop U.B.S'
];

export function SiteAdmin() {
  const navigate = useNavigate();

  // --- ESTADOS GERAIS ---
  const [currentUser, setCurrentUser] = useState<{ role?: string } | null>(null);
  const [activeSection, setActiveSection] = useState<'site' | 'users'>('site');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false); 

  // --- ESTADOS DO SITE (Banners/Docs) ---
  const [siteTab, setSiteTab] = useState<'banners' | 'docs'>('banners');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [newSlide, setNewSlide] = useState({ titulo: '', texto: '', file: null as File | null });
  const [newDoc, setNewDoc] = useState({ titulo: '', setor: '', file: null as File | null });

  // --- ESTADOS DE USUÁRIOS (Atualizado para o Model) ---
  const [users, setUsers] = useState<UserData[]>([]);
  // Alterado: name -> nome, username -> login, password -> senha
  const [newUser, setNewUser] = useState({ nome: '', login: '', senha: '', role: 'COMUNICACAO' });

  // --- INICIALIZAÇÃO E AUTH ---
  useEffect(() => {
    const userStr = localStorage.getItem('intranet_user');
    const token = localStorage.getItem('token');

    if (!token || !userStr) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role) user.role = user.role.toLowerCase(); 
    setCurrentUser(user);

    if (user.role !== 'root' && user.role !== 'comunicacao') {
      alert('Acesso negado para seu perfil.');
      navigate('/admin-os');
      return;
    }

    fetchSiteData();
  }, []);

  useEffect(() => {
    if (activeSection === 'site') fetchSiteData();
    if (activeSection === 'users') fetchUsersData();
  }, [activeSection]);


  // --- FUNÇÕES DE BUSCA (API) ---
  const fetchSiteData = async () => {
    setLoading(true);
    try {
      const [slidesRes, docsRes] = await Promise.all([
        api.get('/carousel').catch(() => ({ data: [] })),
        api.get('/documents').catch(() => ({ data: [] }))
      ]);

      setSlides(slidesRes.data.map((s: any) => ({
        ...s, imagemUrl: s.imagemUrl ? `http://localhost:3000${s.imagemUrl}` : null
      })));

      setDocs(docsRes.data.map((d: any) => ({
        ...d, arquivoUrl: d.arquivoUrl ? `http://localhost:3000${d.arquivoUrl}` : null
      })));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsersData = async () => {
    if (currentUser?.role !== 'root') return; 
    setLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
    } finally {
      setLoading(false);
    }
  };


  // --- HANDLERS: SITE ---
  const handleAddBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      let imagemUrl = '';
      if (newSlide.file) {
        const formData = new FormData();
        formData.append('file', newSlide.file);
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        imagemUrl = uploadRes.data.url;
      }
      await api.post('/carousel', { ...newSlide, imagemUrl });
      alert('Banner adicionado!');
      setNewSlide({ titulo: '', texto: '', file: null });
      fetchSiteData();
    } catch (err) { alert('Erro ao salvar banner'); } finally { setActionLoading(false); }
  };

  const removeBanner = async (id: string) => {
    if (!confirm('Remover banner?')) return;
    try { await api.delete(`/carousel/${id}`); fetchSiteData(); } catch (err) { alert('Erro ao remover'); }
  };

  const handleAddDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoc.file || !newDoc.setor) return alert('Preencha todos os campos e anexe o PDF');
    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', newDoc.file);
      const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      
      await api.post('/documents', { 
        titulo: newDoc.titulo, 
        setor: newDoc.setor, 
        arquivoUrl: uploadRes.data.url 
      });
      alert('Documento publicado!');
      setNewDoc({ titulo: '', setor: '', file: null });
      fetchSiteData();
    } catch (err) { alert('Erro ao publicar documento'); } finally { setActionLoading(false); }
  };

  const removeDoc = async (id: string) => {
    if (!confirm('Excluir documento permanentemente?')) return;
    try { await api.delete(`/documents/${id}`); fetchSiteData(); } catch (err) { alert('Erro ao excluir'); }
  };

  // --- HANDLERS: USUÁRIOS (Atualizado) ---
  const handleRegisterUser = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validação usando as chaves do Model: login, senha, nome
    if (!newUser.login || !newUser.senha || !newUser.nome) return alert('Preencha tudo');
    
    setActionLoading(true);
    try {
      // O objeto newUser já está no formato { nome, login, senha, role }
      await api.post('/users', newUser);
      alert('Usuário criado!');
      setNewUser({ nome: '', login: '', senha: '', role: 'COMUNICACAO' });
      fetchUsersData();
    } catch (err) { alert('Erro ao criar usuário (Login já existe?)'); } finally { setActionLoading(false); }
  };

  // ID agora é number
  const removeUser = async (id: number) => {
    if (!confirm('Remover usuário? Irreversível.')) return;
    try { await api.delete(`/users/${id}`); fetchUsersData(); } catch (err) { alert('Erro ao remover usuário'); }
  };

  // --- UTILS ---
  const handleLogout = () => {
    localStorage.removeItem('intranet_user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const getRoleColor = (role: string) => {
    switch (role?.toUpperCase()) {
      case 'ROOT': return 'bg-red-100 text-red-700 border-red-200';
      case 'TI': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'MANUTENCAO': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* === HEADER PRINCIPAL === */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-sm text-gray-600">
               {activeSection === 'site' ? 'Gerenciamento de conteúdo público' : 'Controle de acesso e usuários'}
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {currentUser?.role === 'root' && (
              <button onClick={() => navigate('/admin-os')} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 border border-blue-200 font-medium transition-all">
                <Wrench size={18} /> Painel O.S.
              </button>
            )}
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 hover:text-red-700 bg-red-50 px-4 py-2 rounded-lg font-medium transition-all">
              <LogOut size={18} /> Sair
            </button>
          </div>
        </div>

        {/* === NAVEGAÇÃO SUPERIOR === */}
        {currentUser?.role === 'root' && (
          <div className="flex p-1 bg-gray-100 rounded-xl mb-8 w-fit mx-auto md:mx-0">
            <button
              onClick={() => setActiveSection('site')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'site' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Image size={18} /> Conteúdo do Site
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} /> Usuários do Sistema
            </button>
          </div>
        )}

        {/* =================================================================================
            SEÇÃO 1: GESTÃO DO SITE (Mantida igual, pois não afeta o User Model)
           ================================================================================= */}
        {activeSection === 'site' && (
          <>
            <div className="flex gap-4 mb-8 border-b border-gray-200">
              <button onClick={() => setSiteTab('banners')} className={`pb-4 px-2 font-medium flex items-center gap-2 ${siteTab === 'banners' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                <Image size={20} /> Carrossel
              </button>
              <button onClick={() => setSiteTab('docs')} className={`pb-4 px-2 font-medium flex items-center gap-2 ${siteTab === 'docs' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>
                <FileText size={20} /> Documentos
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700">
                  <Plus size={20} className="text-blue-600"/> 
                  {siteTab === 'banners' ? 'Novo Banner' : 'Novo Documento'}
                </h2>
                
                {siteTab === 'banners' ? (
                  <form onSubmit={handleAddBanner} className="space-y-4">
                    <input type="text" placeholder="Título" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSlide.titulo} onChange={e => setNewSlide({...newSlide, titulo: e.target.value})} />
                    <textarea placeholder="Texto" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={newSlide.texto} onChange={e => setNewSlide({...newSlide, texto: e.target.value})} />
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center cursor-pointer hover:bg-gray-50">
                      <input className="w-full text-sm text-gray-500" type="file" accept="image/*" 
                        onChange={e => setNewSlide({...newSlide, file: e.target.files?.[0] || null})} />
                    </div>
                    <button disabled={actionLoading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium flex justify-center">
                      {actionLoading ? <Loader2 className="animate-spin"/> : 'Salvar Banner'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAddDoc} className="space-y-4">
                    <input type="text" placeholder="Nome do Documento" required className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                      value={newDoc.titulo} onChange={e => setNewDoc({...newDoc, titulo: e.target.value})} />
                    <select required className="w-full p-3 border rounded-lg outline-none bg-white" value={newDoc.setor} onChange={e => setNewDoc({...newDoc, setor: e.target.value})}>
                      <option value="">Selecione o Setor</option>
                      {SETORES_OPCOES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg text-center">
                      <input className="w-full text-sm text-gray-500" type="file" accept=".pdf,.doc,.docx" required 
                        onChange={e => setNewDoc({...newDoc, file: e.target.files?.[0] || null})} />
                      <p className="text-xs text-gray-400 mt-1">PDF Recomendado</p>
                    </div>
                    <button disabled={actionLoading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium flex justify-center">
                      {actionLoading ? <Loader2 className="animate-spin"/> : 'Publicar'}
                    </button>
                  </form>
                )}
              </div>

              <div className="md:col-span-2 space-y-4">
                <h2 className="font-bold text-gray-700 text-lg">Itens Ativos</h2>
                {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div> : (
                  <div className="grid gap-3">
                    {siteTab === 'banners' ? (
                      slides.length === 0 ? <p className="text-gray-500 italic">Nenhum banner.</p> :
                      slides.map(slide => (
                        <div key={slide.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
                          {slide.imagemUrl ? <img src={slide.imagemUrl} className="w-20 h-14 object-cover rounded" /> : <div className="w-20 h-14 bg-blue-600 rounded flex items-center justify-center"><Type className="text-white opacity-50"/></div>}
                          <div className="flex-1 min-w-0">
                             <h4 className="font-bold truncate">{slide.titulo}</h4>
                             <p className="text-xs text-gray-500 truncate">{slide.texto}</p>
                          </div>
                          <button onClick={() => removeBanner(slide.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                        </div>
                      ))
                    ) : (
                      docs.length === 0 ? <p className="text-gray-500 italic">Nenhum documento.</p> :
                      docs.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="bg-red-100 p-2 rounded text-red-600"><FileText size={18}/></div>
                            <div>
                              <span className="font-medium block truncate">{doc.titulo}</span>
                              <span className="text-xs text-gray-500 flex items-center gap-1"><Folder size={10}/> {doc.setor}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <a href={doc.arquivoUrl} target="_blank" className="text-blue-600 text-sm hover:underline font-medium">Ver</a>
                            <button onClick={() => removeDoc(doc.id)} className="text-red-500 hover:bg-red-50 p-2 rounded"><Trash2 size={18}/></button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* =================================================================================
            SEÇÃO 2: GESTÃO DE USUÁRIOS (Atualizado para NOME, LOGIN, SENHA)
           ================================================================================= */}
        {activeSection === 'users' && currentUser?.role === 'root' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Formulário Usuários */}
            <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-700">
                <UserPlus size={20} className="text-blue-600"/> Novo Usuário
              </h2>
              <form onSubmit={handleRegisterUser} className="space-y-4">
                
                {/* CAMPO NOME */}
                <div>
                   <label className="text-sm text-gray-600">Nome</label>
                   <div className="relative">
                      <User className="absolute left-3 top-3 text-gray-400" size={16}/>
                      <input type="text" required placeholder="Ex: João Silva" className="w-full pl-9 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUser.nome} onChange={e => setNewUser({...newUser, nome: e.target.value})} />
                   </div>
                </div>

                {/* CAMPO LOGIN */}
                <div>
                   <label className="text-sm text-gray-600">Login</label>
                   <div className="relative">
                      <Shield className="absolute left-3 top-3 text-gray-400" size={16}/>
                      <input type="text" required placeholder="Ex: joao.silva" className="w-full pl-9 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUser.login} onChange={e => setNewUser({...newUser, login: e.target.value})} />
                   </div>
                </div>

                {/* CAMPO SENHA */}
                <div>
                   <label className="text-sm text-gray-600">Senha</label>
                   <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={16}/>
                      <input type="password" required placeholder="******" className="w-full pl-9 p-2.5 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                        value={newUser.senha} onChange={e => setNewUser({...newUser, senha: e.target.value})} />
                   </div>
                </div>

                {/* CAMPO ROLE */}
                <div>
                   <label className="text-sm text-gray-600">Cargo</label>
                   <select className="w-full p-2.5 border rounded-lg outline-none bg-white" 
                     value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                     {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                   </select>
                </div>

                <button disabled={actionLoading} type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 font-medium flex justify-center">
                   {actionLoading ? <Loader2 className="animate-spin"/> : 'Criar Usuário'}
                </button>
              </form>
            </div>

            {/* Lista Usuários */}
            <div className="md:col-span-2 space-y-4">
              <h2 className="font-bold text-gray-700 text-lg flex justify-between">
                Usuários do Sistema <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-500">{users.length}</span>
              </h2>
              {loading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div> : (
                <div className="grid gap-3">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between bg-white p-4 rounded-lg border shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-full text-gray-600"><User size={20}/></div>
                        <div>
                          {/* Exibe NOME e LOGIN */}
                          <h4 className="font-bold text-gray-800">{u.nome}</h4>
                          <p className="text-xs text-gray-500">Login: {u.login}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded border font-bold mt-1 inline-block ${getRoleColor(u.role)}`}>{u.role}</span>
                        </div>
                      </div>
                      <button onClick={() => removeUser(u.id)} className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded transition-all">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
                  {users.length === 0 && <p className="text-gray-500 italic">Apenas você cadastrado.</p>}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}