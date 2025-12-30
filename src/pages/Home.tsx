import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Carousel } from '../components/Carousel';
import {
  Mail,
  Users,
  Settings,
  FileText,
  Calendar,
  Search,
  Headphones,
  KeyRound,
  FlaskConical,
  Radiation,
} from 'lucide-react';

interface ServiceCard {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
  external?: boolean;
}

const services: ServiceCard[] = [
  {
    title: 'Email Corporativo',
    description: 'Acesse sua caixa de entrada',
    icon: Mail,
    href: 'https://guaratuba.pr.gov.br:2096/',
    external: true,
  },
  {
    title: 'RH Digital',
    description: 'Portal de Recursos Humanos',
    icon: Users,
    href: 'http://portal.guaratuba.pr.gov.br/rh',
    external: true,
  },
  {
    title: 'Sistema Integrado',
    description: 'Acesso aos sistemas internos',
    icon: Settings,
    href: 'https://openid.oxy.elotech.com.br/auth/realms/guaratuba/protocol/openid-connect/auth?client_id=minha-conta-frontend&redirect_uri=https%3A%2F%2Fguaratuba.oxy.elotech.com.br%2F&state=659e5d6d-6548-4ce4-9b57-63c208f3d9b7&response_mode=fragment&response_type=code&scope=openid',
    external: true,
  },
  {
    title: 'G-SUS',
    description: 'Acesso ao G-SUS',
    icon: KeyRound,
    href: 'https://auth-cs.identidadedigital.pr.gov.br/centralautenticacao/login.html?response_type=code&client_id=e2c0be24560d78c5e599c2a9c9d0bbd2&redirect_uri=https%3A%2F%2Fgsus.pr.gov.br%2Fgsus-integrado&scope=&state=1766748679044&urlCert=https://certauth-cs.identidadedigital.pr.gov.br&dnsCidadao=https://cidadao-cs.identidadedigital.pr.gov.br/centralcidadao&loginPadrao=btnCentral&labelCentral=CPF&modulosDeAutenticacao=btnCpf,btnCertificado,btnSms,btnCentral&urlLogo=https%3A%2F%2Fgsus.pr.gov.br%2Fgsus-integrado%2Fcommons%2Fimages%2Flogo_sistema.jpg&acesso=2101&tokenFormat=jwt&exibirLinkAutoCadastro=true&exibirLinkRecuperarSenha=true&exibirLinkAutoCadastroCertificado=false&exibirAviso=true&captcha=false',
    external: true,
  },
  {
    title: 'Raio-X',
    description: 'Consulte exames de Rx',
    icon: Radiation,
    href: 'https://optixone.com.br/pacs/login.html',
    external: true,
  },
  {
    title: 'Buscar & Imprimir',
    description: 'Pesquise documentos para impressão',
    icon: Search,
    href: '/documentos',
    external: false,
  },
  {
    title: 'Abrir Chamado',
    description: 'Central de atendimento técnico',
    icon: Headphones,
    href: '/abrir-chamado',
    external: false,
  },
  {
    title: 'Laboratorio',
    description: 'Acesso a exames',
    icon: FlaskConical,
    href: 'https://lanac.shiftcloud.com.br/shift/lis/lanac/elis/s01.iu.web.Login.cls?config=UNICO',
    external: true,
  },
];

export function Home() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Carousel />

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Serviços Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.map((service) => (
              <ServiceCardComponent key={service.title} {...service} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function ServiceCardComponent({ title, description, icon: Icon, href, external }: ServiceCard) {
  const cardContent = (
    <>
      <div className="flex items-center justify-center w-14 h-14 bg-blue-100 rounded-lg mb-4">
        <Icon className="w-7 h-7 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </>
  );

  const cardClasses =
    'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-blue-300 cursor-pointer';

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cardClasses}
      >
        {cardContent}
      </a>
    );
  }

  return (
    <Link to={href} className={cardClasses}>
      {cardContent}
    </Link>
  );
}
