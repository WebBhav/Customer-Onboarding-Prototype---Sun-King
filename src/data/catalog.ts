import { ProductCatalogItem } from '../types';

export const SUN_KING_CATALOG: ProductCatalogItem[] = [
  {
    id: 'sk-home-60',
    name: 'Sun King Home 60',
    category: 'NORMAL_VALUE',
    cashPriceKsh: 8500,
    depositKsh: 1200,
    dailyRateKsh: 45,
    loanTermMonths: 12,
    description: 'Entry-level solar home system with 3 bright hanging lamps, dual USB mobile charging ports, and digital PAYG keypad.',
    image: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=400&q=80',
    features: ['3 Overhead Lamps (100 lm each)', 'Dual 5V USB Phone Charger', '6W Polycrystalline Solar Panel', 'LFP Battery with 5-Year Lifespan']
  },
  {
    id: 'sk-home-200',
    name: 'Sun King Home 200 Plus',
    category: 'NORMAL_VALUE',
    cashPriceKsh: 17500,
    depositKsh: 2500,
    dailyRateKsh: 85,
    loanTermMonths: 12,
    description: 'Family solar lighting kit with 4 high-lumen lamps, portable motion-sensor security light, and multi-phone fast charging.',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=400&q=80',
    features: ['4 Ceiling Lights with Wall Switches', '12W Solar Panel', 'USB-C Fast Charging Hub', 'Long-life Lithium Ferro-Phosphate Battery']
  },
  {
    id: 'sk-fan-system',
    name: 'Sun King Solar Fan System',
    category: 'NORMAL_VALUE',
    cashPriceKsh: 22000,
    depositKsh: 3200,
    dailyRateKsh: 95,
    loanTermMonths: 12,
    description: 'Solar lighting combined with a quiet 16-inch DC brushless pedestal fan and phone charging for off-grid homes.',
    image: 'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=400&q=80',
    features: ['16-inch 3-Speed Pedestal Fan', '2 Hanging Tube Lights', '20W Solar Panel', 'All-night runtime on medium speed']
  },
  {
    id: 'sk-tv-32',
    name: 'Sun King Solar TV 32" System',
    category: 'HIGH_VALUE',
    cashPriceKsh: 46000,
    depositKsh: 7500,
    dailyRateKsh: 180,
    loanTermMonths: 18,
    description: 'High-value solar entertainment package featuring a customized ultra-low-power 32-inch HD LED TV, built-in satellite tuner, and 4 lamps.',
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=400&q=80',
    features: ['32" Energy-Efficient HD LED TV', 'Built-in DVB-T2/S2 Tuner', '50W Solar Panel + 150Wh Battery', '4 Room Lights + Multi-device Charger']
  },
  {
    id: 'sk-powerhub-1000',
    name: 'Sun King PowerHub 1000W Inverter',
    category: 'HIGH_VALUE',
    cashPriceKsh: 98000,
    depositKsh: 15000,
    dailyRateKsh: 350,
    loanTermMonths: 24,
    description: 'Commercial-grade 1kVA pure sine wave inverter system powering refrigeration, clinic diagnostics, pos machines, and rural enterprises.',
    image: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=400&q=80',
    features: ['1000W Pure Sine Wave AC Output', '300W Bifacial Solar Array', '1kWh LiFePO4 Smart Battery Pack', 'Surge protection for light motors & refrigerators']
  }
];
