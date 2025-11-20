import { ServicePlus, SalesDocument, CaseStudy, Expert, PricingRule } from '../types';

export const MOCK_SERVICES: ServicePlus[] = [
  {
    id: 'workspace-support',
    name: 'Servi+ Workspace Support Services',
    description: 'Servicio de soporte técnico en español que garantiza la continuidad operativa de los servicios Core de Google Workspace, con atención local, tiempos de respuesta garantizados y escalamiento directo a Google. Diseñado para empresas que requieren respaldo técnico confiable, cobertura flexible (Básico, Mejorado o Premium) y trazabilidad completa de cada incidente.',
    // FIX: Type '"Google Workspace"' is not assignable to type '"Google Cloud" | "AWS"'.
    businessLine: 'Google Cloud',
    // FIX: Type '"Soporte / Support"' is not assignable to type '"Propio" | "Representado"'.
    productType: 'Propio',
    category: 'Workspaces',
    rating: 4,
    keyBenefits: [
      { title: 'Continuidad del Negocio', description: 'Monitoreo proactivo y guía experta para proteger tus datos.' },
      { title: 'Reducción del Tiempo de Inactividad', description: 'Asegura que estás en el plan correcto y usando las licencias de manera efectiva.' },
      { title: 'Seguridad y Control Operativo', description: 'Nuestros expertos certificados en Google Cloud están disponibles a toda hora.' },
      { title: 'Optimización de Costos de Soporte', description: 'Minimiza el tiempo de inactividad y resuelve problemas rápidamente.' },
      { title: 'Acompañamiento Especializado', description: 'Ingenieros certificados en Google Workspace brindan soporte local en español, con conocimiento contextual del entorno del cliente.'},
      { title: 'Respuesta Inmediata 24/7 (Planes Avanzados)', description: 'Para entornos críticos, Servi+ ofrece soporte continuo con atención Premium 24x7 y asesoría directa del equipo experto.'}
    ]
  },
  
  {
    id: 'aws-managed',
    name: 'Servicios Gestionados para AWS',
    description: 'Suite completa de servicios gestionados para tu infraestructura de AWS.',
    businessLine: 'AWS',
    productType: 'Representado',
    category: 'Cloud GCP',
    rating: 3,
    keyBenefits: [
        { title: 'Infraestructura Preparada para el Futuro', description: 'Gestión experta de tus recursos en la nube.' },
        { title: 'Escalabilidad y Rendimiento', description: 'Optimiza tu entorno de AWS para el crecimiento.' },
    ]
  },
  {
    id: 'cloud-ia-service',
    name: 'Servicio de Cloud IA',
    description: 'Inteligencia artificial en la nube para análisis predictivo.',
    businessLine: 'Google Cloud',
    productType: 'Representado',
    category: 'Cloud IA',
    rating: 5,
    keyBenefits: [{ title: 'IA Potente', description: 'Modelos avanzados.' }]
  },
    {
    id: 'helpdesk-ia-service',
    name: 'HelpDesk con IA',
    description: 'Automatiza el soporte al cliente con IA conversacional.',
    businessLine: 'Google Cloud',
    productType: 'Representado',
    category: 'Cloud IA',
    rating: 4,
    keyBenefits: [{ title: 'Soporte 24/7', description: 'Resolución automática de tickets.' }]
  },
  {
    id: 'ai-platform',
    name: 'Plataforma de IA Generativa',
    description: 'Crea contenido, imágenes y código con nuestros modelos de IA.',
    businessLine: 'Google Cloud',
    productType: 'Representado',
    category: 'AI',
    rating: 4,
    keyBenefits: [{ title: 'Creatividad Aumentada', description: 'Generación de texto e imágenes de alta calidad.' }]
  },
  {
    id: 'data-analytics-aws',
    name: 'Análisis de Datos en AWS',
    description: 'Visualiza y entiende tus datos con los servicios de analítica de AWS.',
    businessLine: 'AWS',
    productType: 'Representado',
    category: 'Data & Analytics',
    rating: 4,
    keyBenefits: [{ title: 'Insights de Negocio', description: 'Toma decisiones estratégicas basadas en datos.' }]
  },
  {
    id: 'cybersecurity-gcp',
    name: 'Suite de Ciberseguridad GCP',
    description: 'Protege tus activos digitales en Google Cloud con seguridad de nivel empresarial.',
    businessLine: 'Google Cloud',
    productType: 'Representado',
    category: 'Cybersecurity',
    rating: 5,
    keyBenefits: [{ title: 'Protección Integral', description: 'Defensa contra amenazas avanzadas y vulnerabilidades.' }]
  }
];

export const MOCK_SALES_DOCUMENTS: SalesDocument[] = [
  { id: 'doc1', serviceId: 'workspace-support', name: 'One Pager', type: 'DOC', url: 'https://docs.google.com/document/d/1n4GoIjnqe1FSFfnWyEWfAsH0QfhRjF6DFudmwd3IjbY/edit?tab=t.0' },
  { id: 'doc2', serviceId: 'workspace-support', name: 'Presentación Comercial', type: 'PPT', url: 'https://docs.google.com/presentation/d/1Rwg83EmgpAUmi-Dd_MNopMFPbEoEDmDa/edit?slide=id.g36c9bd43210_1_406#slide=id.g36c9bd43210_1_406' },
  { id: 'doc3', serviceId: 'workspace-support', name: 'Especificaciones del Servicio', type: 'DOC', url: 'https://docs.google.com/document/d/1pvGji2c8qvGsKn_qf41TvYGp2O8oBwFPPi2TU5zvj-k/edit?tab=t.0' },
  { id: 'doc4', serviceId: 'workspace-support', name: 'Contrato de Servicios', type: 'DOC', url: 'https://docs.google.com/document/d/1yUWA3irmJY_F8ZNsYb9f13IP5cz9nvZkRzTIFJupslA/edit?tab=t.0' },
];

export const MOCK_CASE_STUDIES: CaseStudy[] = [
  
];

export const MOCK_EXPERTS: Expert[] = [
  { id: 'exp1', serviceId: 'workspace-support', name: 'Claudia Gutierrez', role: 'Gerente Relacionamiento con el cliente', imageUrl: 'https://lh3.googleusercontent.com/a-/ALV-UjUUuejJFwRToJoKlMAA7vjFRzZviEfjaUIn7CMoORIaKxYRB8Yl=s300-p-k-rw-no' },
];

export const MOCK_PRICING: PricingRule[] = [
  {
    serviceId: 'workspace-support',
    plans: [
      { planName: 'Básico', cost: 5, price: 8 },
      { planName: 'Operativo', cost: 8, price: 12 },
      { planName: 'Premium', cost: 12, price: 18 },
    ],
    addons: [
      { id: 'addon1', name: 'Módulo de Seguridad Avanzada', cost: 2, price: 4 },
      { id: 'addon2', name: 'Prevención de Pérdida de Datos', cost: 3, price: 5 },
    ]
  },
   {
    serviceId: 'workspace-managed',
    plans: [
      { planName: 'Básico', cost: 15, price: 25 },
      { planName: 'Operativo', cost: 22, price: 35 },
      { planName: 'Premium', cost: 30, price: 50 },
    ],
    addons: [
      { id: 'm-addon1', name: 'Gestión de Endpoints', cost: 4, price: 7 },
      { id: 'm-addon2', name: 'Control de Identidad y Acceso', cost: 5, price: 8 },
    ]
  }
];
