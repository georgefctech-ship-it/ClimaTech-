import { ServicePreset } from '../types';

export const DEFAULT_SERVICES: ServicePreset[] = [
  {
    id: 'instalacao',
    name: 'Instalação de Ar-Condicionado',
    description: 'Fixação das unidades interna e externa, passagem de tubulação, furação e teste de estanqueidade.',
    basePrice: 450.0,
    category: 'instalacao',
    icon: 'wrench',
  },
  {
    id: 'manutencao',
    name: 'Manutenção / Higienização',
    description: 'Limpeza profunda de filtros, serpentinas, turbina, bandeja de dreno e aplicação de bactericida.',
    basePrice: 200.0,
    category: 'manutencao',
    icon: 'snowflake',
  },
  {
    id: 'gas',
    name: 'Carga de Gás Refrigerante',
    description: 'Verificação de vazamentos com manômetro, vácuo no sistema e recarga com gás R410A / R22 / R32.',
    basePrice: 100.0,
    category: 'gas',
    icon: 'wind',
  },
];

export const BTU_OPTIONS = [
  '9.000 BTUs',
  '12.000 BTUs',
  '18.000 BTUs',
  '24.000 BTUs',
  '30.000+ BTUs',
];

export const PAYMENT_METHODS = [
  'Pix (À vista)',
  'Cartão de Crédito (Até 12x)',
  'Cartão de Débito',
  'Dinheiro na conclusão',
  'Faturado para empresa (Boleto)',
];

export const WARRANTY_OPTIONS = [
  '90 dias (Garantia Legal)',
  '6 meses de garantia',
  '1 ano de garantia',
  '30 dias',
];
