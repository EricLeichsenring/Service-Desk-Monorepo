import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import para navegação fluida
import { Layout } from '../components/Layout';
import { LogIn, Lock, User, Loader2 } from 'lucide-react';
import { client } from '../lib/sanity'; 

export function Login() {
  // 2. Hook de navegação
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const query = `
        *[_type == "usuario" && login == $login && senha == $senha][0] {
          _id,
          nome,
          role
        }
      `;

      const user = await client.fetch(query, {
        login: credentials.username,
        senha: credentials.password
      });

      if (user) {
        // --- SUCESSO ---
        localStorage.setItem('intranet_user', JSON.stringify(user));
        
        // LÓGICA DE REDIRECIONAMENTO (Usando navigate para ser fluido)
        if (user.role === 'manutencao') {
          navigate('/admin-os'); 
        } else if (user.role === 'comunicacao') {
          navigate('/admin-site'); 
        } else {
          // Fallback para root ou outros
          navigate('/admin-os'); 
        }

      } else {
        // --- ERRO: SENHA INCORRETA ---
        // Sim, mantemos isso! É o feedback visual.
        setError('Usuário ou senha incorretos.');
      }

    } catch (err) {
      console.error(err);
      setError('Erro ao conectar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 w-full max-w-md">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Login</h1>
            <p className="text-gray-600 text-sm mt-1">Acesse o sistema com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Exibe mensagem de erro se houver */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  id="username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Digite seu usuário"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="Digite sua senha"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-3 px-6 py-3 bg-blue-600 text-white font-medium rounded-lg transition-colors shadow-sm mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Entrar</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
              Esqueceu sua senha?
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}