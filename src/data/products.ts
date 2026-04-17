import type { Aisle, Product, ProductAvailability } from "../types/catalog";

type SeedProduct = Omit<
  Product,
  "priceInCents" | "stock" | "availability"
>;

const categoryPricing: Record<
  string,
  { basePriceInCents: number; stepInCents: number }
> = {
  "Analgésicos": { basePriceInCents: 1190, stepInCents: 170 },
  "Medicamentos OTC": { basePriceInCents: 1490, stepInCents: 190 },
  "Vitaminas e Suplementos": { basePriceInCents: 2490, stepInCents: 260 },
  "Higiene Pessoal": { basePriceInCents: 1390, stepInCents: 210 },
  "Cuidados com a Pele": { basePriceInCents: 1890, stepInCents: 260 },
  "Dermocosméticos": { basePriceInCents: 4590, stepInCents: 320 },
  "Higiene Bucal": { basePriceInCents: 990, stepInCents: 150 },
  "Bebês e Infantil": { basePriceInCents: 1890, stepInCents: 230 },
  "Primeiros Socorros": { basePriceInCents: 1290, stepInCents: 210 },
  "Equipamentos Médicos": { basePriceInCents: 4990, stepInCents: 650 },
  Diabetes: { basePriceInCents: 2590, stepInCents: 420 },
  "Chás e Naturais": { basePriceInCents: 1590, stepInCents: 180 },
  "Suplementos Esportivos": { basePriceInCents: 3590, stepInCents: 390 },
  "Bem-estar": { basePriceInCents: 1790, stepInCents: 250 },
};

function inferStock(index: number): number {
  if (index % 11 === 0) {
    return 0;
  }

  if (index % 5 === 0) {
    return 4 + (index % 3);
  }

  return 12 + (index % 9) * 3;
}

function inferAvailability(stock: number): ProductAvailability {
  if (stock <= 0) {
    return "Sob encomenda";
  }

  if (stock <= 6) {
    return "Ultimas unidades";
  }

  return "Em estoque";
}

function enrichProduct(product: SeedProduct, index: number): Product {
  const pricing =
    categoryPricing[product.category] ?? {
      basePriceInCents: 1990,
      stepInCents: 200,
    };
  const stock = inferStock(index + 1);

  return {
    ...product,
    priceInCents: pricing.basePriceInCents + pricing.stepInCents * (index % 6),
    stock,
    availability: inferAvailability(stock),
  };
}

export const aisles: Aisle[] = [
  {
    id: "corredor-1",
    label: "Corredor 1",
    summary: "Analgésicos & OTC",
    description:
      "Medicamentos de venda livre para alívio rápido de dores, febre e desconfortos cotidianos.",
  },
  {
    id: "corredor-2",
    label: "Corredor 2",
    summary: "Vitaminas & Suplementos",
    description:
      "Complemente a rotina de saúde com vitaminas, minerais e fórmulas de reforço imunológico.",
  },
  {
    id: "corredor-3",
    label: "Corredor 3",
    summary: "Higiene Pessoal",
    description:
      "Linha completa para o autocuidado diário: banhos, cabelos e proteção duradoura.",
  },
  {
    id: "corredor-4",
    label: "Corredor 4",
    summary: "Higiene Bucal",
    description:
      "Tudo para um sorriso saudável: limpadores, anticáries, opções para sensibilidade e clareamento.",
  },
  {
    id: "corredor-5",
    label: "Corredor 5",
    summary: "Pele & Dermocosméticos",
    description:
      "Tratamentos profissionais para hidratação, proteção solar e cuidados faciais avançados.",
  },
  {
    id: "corredor-6",
    label: "Corredor 6",
    summary: "Bebês & Infantil",
    description:
      "Produtos seguros e hipoalergênicos pensados para o cuidado delicado dos pequenos.",
  },
  {
    id: "corredor-7",
    label: "Corredor 7",
    summary: "Primeiros Socorros",
    description:
      "Soluções de prevenção e tratamentos imediatos para pequenos acidentes e recuperação.",
  },
  {
    id: "corredor-8",
    label: "Corredor 8",
    summary: "Diabetes & Monitoramento",
    description:
      "Equipamentos e consumíveis para acompanhamento glicêmico e gestão segura da rotina.",
  },
  {
    id: "corredor-9",
    label: "Corredor 9",
    summary: "Naturais & Bem-estar",
    description:
      "Chás especiais, aromaterapia e alternativas naturais para relaxamento e qualidade de vida.",
  },
  {
    id: "corredor-10",
    label: "Corredor 10",
    summary: "Suplementos Esportivos",
    description:
      "Performance, recuperação muscular e nutrição avançada para quem treina com foco.",
  },
];

export const aislesById = aisles.reduce<Record<string, Aisle>>((acc, aisle) => {
  acc[aisle.id] = aisle;
  return acc;
}, {});

export const categories = [
  "Todos",
  "Analgésicos",
  "Medicamentos OTC",
  "Vitaminas e Suplementos",
  "Higiene Pessoal",
  "Cuidados com a Pele",
  "Dermocosméticos",
  "Higiene Bucal",
  "Bebês e Infantil",
  "Primeiros Socorros",
  "Equipamentos Médicos",
  "Diabetes",
  "Chás e Naturais",
  "Suplementos Esportivos",
  "Bem-estar",
];

const baseProducts: SeedProduct[] = [
  {
    id: "analgesico-dipirona-500",
    name: "Dipirona Sódica",
    brand: "Medpharma",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Analgésico e antipirético de ação rápida indicado para dores moderadas e febre.",
    tags: ["alívio rápido", "sem receita"],
  },
  {
    id: "analgesico-paracetamol-750",
    name: "Paracetamol",
    brand: "PharmaPlus",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Controla febre e dores musculares com fórmula segura para adultos e idosos.",
    tags: ["febre", "musculares"],
  },
  {
    id: "analgesico-dorflex",
    name: "Dorflex Relaxante Muscular",
    brand: "Sanofi",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Combinação de analgésico com relaxante muscular para tensão e dores pós-esforço.",
    tags: ["tensão", "costas"],
  },
  {
    id: "analgesico-neosaldina",
    name: "Neosaldina Gotas 30 ml",
    brand: "Takeda",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Tratamento rápido para dores de cabeça resistentes com aplicação em gotas.",
    tags: ["cabeça", "gotejador"],
  },
  {
    id: "otc-benegrip-multi",
    name: "Benegrip Multi",
    brand: "Hypera",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description:
      "Associação completa contra sintomas de gripes e resfriados sem causar sonolência.",
    tags: ["gripe", "resfriado"],
  },
  {
    id: "otc-spray-garganta",
    name: "Spray Bucal Alívio Garganta 35 ml",
    brand: "ClorActive",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description:
      "Ação bactericida e anestésica localizada para inflamações leves de garganta.",
    tags: ["anti-inflamatório", "locais"],
  },
  {
    id: "vitamina-c-efervescente",
    name: "Vitamina C Efervescente",
    brand: "Cenevit",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Reposição diária de vitamina C com alto poder antioxidante e suporte imunológico.",
    tags: ["imunidade", "energia"],
  },
  {
    id: "vitamina-d3-2000",
    name: "Vitamina D3",
    brand: "LifeMix",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Auxilia na absorção de cálcio e na manutenção da saúde óssea e muscular.",
    tags: ["ossos", "imunidade"],
  },
  {
    id: "vitamina-centrum-pro",
    name: "Centrum Pró Multivitamínico",
    brand: "Centrum",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Fórmula completa com vitaminas e minerais essenciais para energia e metabolismo.",
    tags: ["energia", "diário"],
  },
  {
    id: "vitamina-lavitan-mulher",
    name: "Lavitan Mulher",
    brand: "Lavitan",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Vitaminas com ferro e zinco para suporte hormonal e redução do cansaço diário.",
    tags: ["mulheres", "ritmo intenso"],
  },
  {
    id: "suplemento-omega-3",
    name: "Ômega 3",
    brand: "VitGold",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Ácidos graxos essenciais com alta concentração EPA/DHA para coração e mente.",
    tags: ["coração", "colesterol"],
  },
  {
    id: "suplemento-colageno",
    name: "Colágeno Tipo II",
    brand: "RegenFlex",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Suporte articular avançado para mobilidade, flexibilidade e conforto diário.",
    tags: ["articulações", "mobilidade"],
  },
  {
    id: "sports-whey-isolado",
    name: "Whey Protein Isolado",
    brand: "ProSeries",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Proteína isolada de alta pureza com 25 g de proteína por dose para recuperação muscular.",
    tags: ["pós-treino", "alta pureza"],
  },
  {
    id: "sports-bcaa",
    name: "BCAA 2:1:1",
    brand: "ProSeries",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Aminoácidos essenciais que auxiliam na recuperação e manutenção da massa magra.",
    tags: ["recuperação", "massa magra"],
  },
  {
    id: "sports-creatina",
    name: "Creatina Monoidratada",
    brand: "PureX",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Creatina micronizada com selo Creapure para força, explosão e desempenho.",
    tags: ["força", "explosão"],
  },
  {
    id: "sports-pre-treino",
    name: "Pré-Treino Booster 210 g",
    brand: "Ignite Labs",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Blend com beta-alanina e cafeína para foco, energia e concentração durante treinos intensos.",
    tags: ["energia", "foco"],
  },
  {
    id: "sports-barra-proteica",
    name: "Barra Proteica",
    brand: "PowerBar",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Lanche prático com baixo teor de açúcar para consumo pré ou pós-atividade física.",
    tags: ["on-the-go", "low sugar"],
  },
  {
    id: "higiene-sabonete-liquido",
    name: "Sabonete Líquido Antibacteriano",
    brand: "DermaCare",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Limpeza suave com proteção antibacteriana e fragrância refrescante para o dia a dia.",
    tags: ["proteção", "uso diário"],
  },
  {
    id: "higiene-desodorante-48h",
    name: "Desodorante Antitranspirante",
    brand: "DryShield",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Tecnologia antiumidade com proteção prolongada e toque seco imediato.",
    tags: ["48h", "toque seco"],
  },
  {
    id: "higiene-shampoo-antiqueda",
    name: "Shampoo Antiqueda",
    brand: "Capilaris",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Estimula o couro cabeludo e fortalece os fios contra quebra e queda diária.",
    tags: ["fortalecimento", "vitaminas"],
  },
  {
    id: "higiene-condicionador-nutricao",
    name: "Condicionador Nutritivo",
    brand: "Capilaris",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Restaura o brilho com óleos nutritivos e deixa os fios soltos e hidratados.",
    tags: ["brilho", "reparação"],
  },
  {
    id: "higiene-gel-fixador",
    name: "Gel Fixador Capilar",
    brand: "StyleMax",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Fixação forte e flexível com acabamento sem resíduos e proteção térmica leve.",
    tags: ["fixação forte", "sem resíduos"],
  },
  {
    id: "higiene-sabonete-intimo",
    name: "Sabonete Íntimo",
    brand: "FreshCare",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Formulação suave com ácido lático para conforto e proteção da flora natural.",
    tags: ["pH balanceado", "flora natural"],
  },
  {
    id: "bucal-creme-branqueador",
    name: "Creme Dental Branqueador",
    brand: "SmilePro",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Clareia gradualmente e protege contra manchas mantendo o hálito fresco por 12 horas.",
    tags: ["clareamento", "anticárie"],
  },
  {
    id: "bucal-creme-sensibilidade",
    name: "Creme Dental Sensibilidade",
    brand: "Sensiplus",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Reduz a dor causada por alimentos quentes e frios com barreira protetora avançada.",
    tags: ["sensibilidade", "proteção"],
  },
  {
    id: "bucal-escova-macia",
    name: "Escova Dental Macia Premium",
    brand: "OralCare",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Cerdas suaves com tecnologia de limpeza profunda sem agredir gengivas sensíveis.",
    tags: ["cerdas macias", "gengivas"],
  },
  {
    id: "bucal-escova-interdental",
    name: "Kit Escova Interdental 4 unidades",
    brand: "OralCare",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Atinge espaços entre os dentes e aparelhos ortodônticos para higiene completa.",
    tags: ["interdental", "ortodontia"],
  },
  {
    id: "bucal-enxaguante",
    name: "Enxaguante Bucal Sem Álcool 500 ml",
    brand: "SmilePro",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Antisséptico com flúor que elimina 99% das bactérias sem ardência.",
    tags: ["sem álcool", "antisséptico"],
  },
  {
    id: "bucal-fio-dental",
    name: "Fio Dental Menta 50 m",
    brand: "DentFlex",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Fio multifilamento com cera para deslizar facilmente e remover placa entre os dentes.",
    tags: ["multifilamento", "menta"],
  },
  {
    id: "pele-hidratante-corporal",
    name: "Hidratante Corporal",
    brand: "SkinBalance",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Textura leve com ácido hialurônico e manteiga de karité para pele radiante e macia.",
    tags: ["ácido hialurônico", "hidratação intensa"],
  },
  {
    id: "pele-protetor-solar",
    name: "Protetor Solar FPS 50",
    brand: "SunShield",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Filtro solar de amplo espectro com efeito matte e proteção anti-luz azul.",
    tags: ["fps50", "oil free"],
  },
  {
    id: "dermo-serum-vitamina-c",
    name: "Sérum Facial Vitamina C",
    brand: "DermaLab",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description:
      "Antioxidante com ácido ferúlico e vitamina E para luminosidade e uniformização do tom.",
    tags: ["antioxidante", "luminosidade"],
  },
  {
    id: "dermo-creme-noturno",
    name: "Creme Facial Noturno Retinol",
    brand: "DermaLab",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description:
      "Renovação celular com retinol encapsulado e niacinamida para firmeza visível.",
    tags: ["retinol", "anti-idade"],
  },
  {
    id: "pele-mascara-detox",
    name: "Máscara Facial Detox Carvão Ativado",
    brand: "SkinBalance",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Remove impurezas profundas e controla oleosidade sem ressecar o rosto.",
    tags: ["carvão", "purificante"],
  },
  {
    id: "pele-creme-maos",
    name: "Creme para Mãos Reparador 50 g",
    brand: "HydraHands",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Tratamento intensivo com ureia e pantenol para resgate da barreira cutânea.",
    tags: ["hidratação", "barreira"],
  },
  {
    id: "pele-agua-micelar",
    name: "Água Micelar 5 em 1 400 ml",
    brand: "SkinBalance",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Limpa, demaquila e tonifica em um único gesto sem enxágue e sem oleosidade.",
    tags: ["multiuso", "sem enxágue"],
  },
  {
    id: "bebe-fralda-m",
    name: "Fralda Descartável",
    brand: "BabySoft",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Camada ultraabsorvente com barreiras antivazamento e indicador de umidade.",
    tags: ["absorção", "conforto"],
  },
  {
    id: "bebe-lenco-umedecido",
    name: "Lenço Umedecido",
    brand: "BabySoft",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Fórmula com aloe vera e sem álcool para limpeza delicada da pele sensível.",
    tags: ["hipoalergênico", "sem álcool"],
  },
  {
    id: "bebe-shampoo-suave",
    name: "Shampoo Suave Infantil 200 ml",
    brand: "LittleBloom",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Não arde os olhos e mantém a hidratação natural dos fios finos e delicados.",
    tags: ["sem lágrimas", "controle de frizz"],
  },
  {
    id: "bebe-pomada-assaduras",
    name: "Pomada para Assaduras 60 g",
    brand: "Dermababy",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Barreira protetora com óxido de zinco e vitamina E para prevenção diária.",
    tags: ["proteção", "vitamina e"],
  },
  {
    id: "bebe-talco",
    name: "Talco Sem Perfume 200 g",
    brand: "BabyCalm",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Absorve a umidade e evita assaduras mantendo a pele seca e confortável.",
    tags: ["sem perfume", "absorção"],
  },
  {
    id: "bebe-sabonete-glicerina",
    name: "Sabonete Infantil Glicerina 90 g",
    brand: "BabyCalm",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Base vegetal suave indicada para banhos frequentes e peles atópicas.",
    tags: ["base vegetal", "diário"],
  },
  {
    id: "primeiros-socorros-kit",
    name: "Kit Primeiros Socorros Premium",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Estojo completo com itens essenciais, manual rápido e organização modular.",
    tags: ["completo", "emergências"],
  },
  {
    id: "primeiros-socorros-curativo",
    name: "Curativo Impermeável",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Fixação respirável com bordas aderentes e almofada central que não gruda.",
    tags: ["impermeável", "respirável"],
  },
  {
    id: "primeiros-socorros-alcool-gel",
    name: "Álcool Gel 70%",
    brand: "Protect",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Higienização instantânea com vitamina E e fórmula hidratante para as mãos.",
    tags: ["antisséptico", "com vitamina e"],
  },
  {
    id: "primeiros-socorros-soro",
    name: "Soro Fisiológico 500 ml",
    brand: "VitalClean",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Solução isotônica estéril para higiene nasal, ocular e curativos delicados.",
    tags: ["esterilizado", "multiuso"],
  },
  {
    id: "bem-estar-bolsa-termica",
    name: "Bolsa Térmica Gel Reutilizável",
    brand: "ThermoFlex",
    category: "Bem-estar",
    aisleId: "corredor-7",
    description:
      "Uso quente ou frio para dores musculares, contusões e relaxamento localizado.",
    tags: ["quente e frio", "reutilizável"],
  },
  {
    id: "primeiros-socorros-atadura",
    name: "Atadura Elástica 1,80 m",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Compressão ajustável para imobilização leve e suporte durante a recuperação.",
    tags: ["compressão", "suporte"],
  },
  {
    id: "diabetes-glicosimetro",
    name: "Glicosímetro Smart Connect",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Monitor com conectividade Bluetooth para registrar leituras e gerar relatórios.",
    tags: ["bluetooth", "registro digital"],
  },
  {
    id: "diabetes-tiras",
    name: "Tiras para Glicemia",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Compatíveis com toda a linha Smart Connect e embaladas individualmente.",
    tags: ["uso diário", "precisas"],
  },
  {
    id: "diabetes-lancetas",
    name: "Lancetas Universais",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Ponta siliconizada para punção suave e compatibilidade com diversos lancetadores.",
    tags: ["siliconizada", "universal"],
  },
  {
    id: "diabetes-alcool-swab",
    name: "Álcool Swab Estéril",
    brand: "MedClean",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Sachês individuais prontos para uso em medições, vacinas e curativos.",
    tags: ["estéril", "pronto uso"],
  },
  {
    id: "equipamento-estojo-insulina",
    name: "Estojo Térmico para Insulina",
    brand: "ThermoSafe",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description:
      "Compartimentos organizados com isolamento térmico para transporte seguro.",
    tags: ["térmico", "portátil"],
  },
  {
    id: "equipamento-medidor-pressao",
    name: "Medidor de Pressão Digital Braço",
    brand: "LifeMed",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description:
      "Inflagem automática, média das últimas leituras e memória para dois perfis.",
    tags: ["memória dupla", "inflagem automática"],
  },
  {
    id: "equipamento-oximetro",
    name: "Oxímetro de Dedo OLED",
    brand: "LifeMed",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description:
      "Acompanha saturação e batimentos em display colorido com desligamento automático.",
    tags: ["o2", "batimentos"],
  },
  {
    id: "equipamento-termometro",
    name: "Termômetro Digital Infravermelho",
    brand: "LifeMed",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description:
      "Medição sem contato em 1 segundo com alerta visual para febre.",
    tags: ["sem contato", "1 segundo"],
  },
  {
    id: "equipamento-nebulizador",
    name: "Nebulizador Compressor Silencioso",
    brand: "BreatheCare",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description:
      "Nebulização contínua com baixo ruído e kit completo para adultos e crianças.",
    tags: ["baixo ruído", "familia"],
  },
  {
    id: "naturais-cha-verde",
    name: "Chá Verde",
    brand: "NaturaTea",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Sabor suave rico em antioxidantes para consumir quente ou gelado.",
    tags: ["antioxidante", "revigorante"],
  },
  {
    id: "naturais-cha-camomila",
    name: "Chá de Camomila",
    brand: "NaturaTea",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Flores selecionadas para infusão relaxante e aroma acolhedor antes de dormir.",
    tags: ["relaxante", "noturno"],
  },
  {
    id: "naturais-propolis",
    name: "Própolis Spray",
    brand: "Apismel",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Calmante natural para garganta com extratos de mel e romã sem adição de álcool.",
    tags: ["imunidade", "spray"],
  },
  {
    id: "naturais-mel-limao",
    name: "Mel com Limão 300 g",
    brand: "Apismel",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Blend equilibrado para bebidas quentes, alívio de garganta e receitas saudáveis.",
    tags: ["artesanal", "multifunção"],
  },
  {
    id: "naturais-oleo-coco",
    name: "Óleo de Coco Extra Virgem",
    brand: "BioNutri",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Prensado a frio, ideal para culinária saudável, cuidados com cabelos e pele.",
    tags: ["cold pressed", "versátil"],
  },
  {
    id: "bem-estar-difusor-lavanda",
    name: "Difusor Aromático Lavanda 200 ml",
    brand: "Essence Home",
    category: "Bem-estar",
    aisleId: "corredor-9",
    description:
      "Bastões em fibra com fragrância relaxante para ambientes, spa em casa ou recepção.",
    tags: ["aromaterapia", "relaxamento"],
  },
];

const extraProducts: SeedProduct[] = [
  {
    id: "otc-antialergico",
    name: "Antialérgico",
    brand: "Respiral",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description:
      "Formula de uso diurno para alivio de espirros, coriza e desconforto respiratorio leve.",
    tags: ["alergia", "respiracao", "sem sonolencia"],
  },
  {
    id: "vitamina-magnesio",
    name: "Magnésio Quelato",
    brand: "NutriCore",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Suporte muscular e metabolico para rotina intensa, sono e recuperacao.",
    tags: ["magnesio", "recuperacao", "sono"],
  },
  {
    id: "higiene-sabonete-vegetal",
    name: "Sabonete Vegetal Calmante 90 g",
    brand: "PureBath",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Limpeza suave para peles sensiveis com extrato vegetal e espuma cremosa.",
    tags: ["sensivel", "banho", "suave"],
  },
  {
    id: "bucal-antisseptico-pocket",
    name: "Antisséptico Bucal",
    brand: "SmilePro",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Versao compacta para bolsa ou mochila com protecao diaria contra mau halito.",
    tags: ["portatil", "halito", "viagem"],
  },
  {
    id: "pele-labial-reparador",
    name: "Reparador Labial FPS 30",
    brand: "SkinBalance",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Protege labios ressecados com filtro solar, manteiga vegetal e rapida absorcao.",
    tags: ["labial", "fps", "hidratacao"],
  },
  {
    id: "bebe-mamadeira-anticolica",
    name: "Mamadeira Anticolica 260 ml",
    brand: "BabySoft",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Bico de fluxo controlado com sistema de ventilacao para reduzir desconfortos na mamada.",
    tags: ["mamada", "anticolica", "bebe"],
  },
  {
    id: "primeiros-socorros-gaze",
    name: "Gaze Esteril 13 fios 10 unidades",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Pacotes individuais para curativos e limpeza de feridas com manuseio seguro.",
    tags: ["curativo", "esteril", "gaze"],
  },
  {
    id: "diabetes-lancetador",
    name: "Lancetador Ajustavel",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Dispositivo ergonomico com niveis de profundidade para rotina de medicao mais confortavel.",
    tags: ["medicao", "ergonomico", "ajustavel"],
  },
  {
    id: "naturais-cha-hortela",
    name: "Chá de Hortelã",
    brand: "NaturaTea",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Infusao refrescante para rotina digestiva e pausas leves durante o dia.",
    tags: ["digestao", "hortela", "leve"],
  },
  {
    id: "sports-isotonico-po",
    name: "Isotônico em Pó",
    brand: "ProSeries",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Reposicao de sais minerais e carboidratos para treinos longos e recuperacao rapida.",
    tags: ["hidratacao", "resistencia", "treino"],
  },
];

const newProducts: SeedProduct[] = [
  // Gastrointestinal / OTC
  {
    id: "otc-omeprazol",
    name: "Omeprazol",
    brand: "Medpharma",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Inibidor da bomba de prótons para gastrite, refluxo e úlcera gástrica.",
    tags: ["gastrite", "refluxo", "estômago"],
  },
  {
    id: "otc-buscopan",
    name: "Buscopan",
    brand: "Sanofi",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Antiespasmódico para cólicas abdominais, intestinais e menstruais.",
    tags: ["cólica", "espasmo", "intestino"],
  },
  {
    id: "otc-luftal",
    name: "Luftal",
    brand: "Takeda",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Alivia gases, flatulência e distensão abdominal com ação rápida.",
    tags: ["gases", "flatulência", "estômago"],
  },
  {
    id: "otc-dramin",
    name: "Dramin B6",
    brand: "Hypera",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Antiemético para náuseas, vômitos e enjoo de movimento.",
    tags: ["náusea", "vômito", "enjoo"],
  },
  {
    id: "otc-loperamida",
    name: "Loperamida",
    brand: "Medpharma",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Antidiarreico de ação rápida para diarreia aguda e crônica.",
    tags: ["diarreia", "intestino"],
  },
  {
    id: "otc-antiácido",
    name: "Antiácido Mastigável",
    brand: "Mylanta",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Neutraliza o ácido estomacal e alivia azia, queimação e indigestão.",
    tags: ["azia", "queimação", "indigestão"],
  },
  {
    id: "otc-descongestionante-nasal",
    name: "Descongestionante Nasal",
    brand: "Rinosoro",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Spray nasal com solução isotônica para desobstrução e limpeza nasal.",
    tags: ["nariz entupido", "sinusite", "gripe"],
  },
  {
    id: "otc-xarope-tosse",
    name: "Xarope para Tosse",
    brand: "Vick",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Expectorante e antitussígeno para tosse seca e produtiva.",
    tags: ["tosse", "gripe", "resfriado"],
  },
  {
    id: "otc-losna-pastilha",
    name: "Pastilha para Garganta",
    brand: "Strepsils",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Antibacteriana e anestésica local para irritações e inflamações de garganta.",
    tags: ["garganta", "anti-inflamatório", "tosse"],
  },
  // Dermatológicos
  {
    id: "dermo-pomada-antibiotica",
    name: "Pomada Antibiótica",
    brand: "Nebacetin",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description: "Tratamento tópico de infecções bacterianas em cortes, arranhões e queimaduras leves.",
    tags: ["infecção", "ferida", "antibiótico"],
  },
  {
    id: "dermo-antifungico",
    name: "Antifúngico Tópico",
    brand: "Canesten",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description: "Creme para tratamento de micoses, candidíase e frieira.",
    tags: ["micose", "fungo", "frieira"],
  },
  {
    id: "dermo-corticoide",
    name: "Corticoide Tópico",
    brand: "Celestoderm",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description: "Anti-inflamatório tópico para eczema, dermatite e reações alérgicas na pele.",
    tags: ["eczema", "dermatite", "alergia"],
  },
  {
    id: "dermo-cicatrizante",
    name: "Pomada Cicatrizante",
    brand: "Bepantol",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description: "Provitamina B5 para cicatrização de feridas, assaduras e pele ressecada.",
    tags: ["cicatrização", "bepantol", "pele"],
  },
  // Oftalmológicos
  {
    id: "oftalmo-colirio-vermelhidao",
    name: "Colírio para Vermelhidão",
    brand: "Visine",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Descongestionante ocular para alívio imediato de olhos vermelhos e irritados.",
    tags: ["olhos", "vermelhidão", "irritação"],
  },
  {
    id: "oftalmo-lagrima-artificial",
    name: "Lágrima Artificial",
    brand: "Refresh",
    category: "Medicamentos OTC",
    aisleId: "corredor-1",
    description: "Lubrificante ocular para olho seco, sensação de areia e uso de lentes.",
    tags: ["olho seco", "lente de contato", "lubrificante"],
  },
  // Saúde Sexual e Feminina
  {
    id: "higiene-absorvente",
    name: "Absorvente com Abas",
    brand: "Always",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description: "Proteção diária com superfície suave e abas fixadoras para maior conforto.",
    tags: ["feminino", "menstruação", "proteção"],
  },
  {
    id: "higiene-absorvente-interno",
    name: "Absorvente Interno",
    brand: "o.b.",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description: "Absorção interna confortável para praticidade nas atividades do dia a dia.",
    tags: ["tampão", "feminino", "menstruação"],
  },
  {
    id: "saude-preservativo",
    name: "Preservativo Masculino",
    brand: "Jontex",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description: "Proteção contra ISTs e gravidez não planejada com lubrificação especial.",
    tags: ["camisinha", "proteção", "sexual"],
  },
  {
    id: "saude-teste-gravidez",
    name: "Teste de Gravidez",
    brand: "Clearblue",
    category: "Equipamentos Médicos",
    aisleId: "corredor-8",
    description: "Resultado em 3 minutos com alta precisão a partir do primeiro dia de atraso.",
    tags: ["gravidez", "teste", "resultado rápido"],
  },
  // Ortopédicos / Bem-estar físico
  {
    id: "ortopedico-joelheira",
    name: "Joelheira Compressiva",
    brand: "Orthofit",
    category: "Bem-estar",
    aisleId: "corredor-7",
    description: "Suporte elástico para joelho com compressão graduada para dor e instabilidade.",
    tags: ["joelho", "suporte", "compressão"],
  },
  {
    id: "ortopedico-tornozeleira",
    name: "Tornozeleira de Suporte",
    brand: "Orthofit",
    category: "Bem-estar",
    aisleId: "corredor-7",
    description: "Estabiliza o tornozelo após entorses e em atividades físicas de impacto.",
    tags: ["tornozelo", "entorse", "suporte"],
  },
  {
    id: "ortopedico-munhequeira",
    name: "Munhequeira Elástica",
    brand: "Orthofit",
    category: "Bem-estar",
    aisleId: "corredor-7",
    description: "Compressão e estabilização do punho para tendinite, digitadores e esportistas.",
    tags: ["punho", "tendinite", "compressão"],
  },
  {
    id: "ortopedico-palmilha",
    name: "Palmilha Anatômica",
    brand: "Podoflex",
    category: "Bem-estar",
    aisleId: "corredor-7",
    description: "Distribuição de carga e absorção de impacto para conforto e alívio de dores nos pés.",
    tags: ["pé", "conforto", "amortecimento"],
  },
  // Capilar
  {
    id: "capilar-minoxidil",
    name: "Minoxidil",
    brand: "Regaine",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description: "Tratamento tópico para queda de cabelo androgenética masculina e feminina.",
    tags: ["queda de cabelo", "calvície", "capilar"],
  },
  {
    id: "capilar-ampoula-queda",
    name: "Ampola Antiqueda Capilar",
    brand: "Capilaris",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description: "Tratamento intensivo com biotina e queratina para cabelos enfraquecidos.",
    tags: ["queda", "biotina", "cabelo"],
  },
  // Vitaminas e suplementos faltantes
  {
    id: "vitamina-b12",
    name: "Vitamina B12",
    brand: "NutriCore",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description: "Suplementação de cianocobalamina para energia, memória e sistema nervoso.",
    tags: ["energia", "memória", "sistema nervoso"],
  },
  {
    id: "vitamina-ferro",
    name: "Sulfato Ferroso",
    brand: "Medpharma",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description: "Reposição de ferro para prevenção e tratamento de anemia ferropriva.",
    tags: ["anemia", "ferro", "cansaço"],
  },
  {
    id: "vitamina-zinco",
    name: "Zinco Quelato",
    brand: "NutriCore",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description: "Mineral essencial para imunidade, cicatrização e saúde da pele.",
    tags: ["imunidade", "pele", "mineral"],
  },
  {
    id: "vitamina-acido-folico",
    name: "Ácido Fólico",
    brand: "Medpharma",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description: "Vitamina B9 essencial para gestantes e prevenção de anemia megaloblástica.",
    tags: ["gestante", "gravidez", "anemia"],
  },
  // Higiene pessoal faltantes
  {
    id: "higiene-fralda-geriatrica",
    name: "Fralda Geriátrica",
    brand: "Tena",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description: "Absorção especial para incontinência urinária com ajuste anatômico e conforto prolongado.",
    tags: ["incontinência", "adulto", "idoso"],
  },
  {
    id: "higiene-protetor-solar-corporal",
    name: "Protetor Solar Corporal FPS 30",
    brand: "Sundown",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description: "Proteção UVA/UVB para o corpo com textura não gordurosa e fácil espalhamento.",
    tags: ["fps30", "corpo", "praia"],
  },
  // Primeiros socorros
  {
    id: "primeiros-socorros-esparadrapo",
    name: "Esparadrapo Hospitalar",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description: "Fita adesiva resistente para fixação de curativos, gazes e ataduras.",
    tags: ["fixação", "curativo", "adesivo"],
  },
  {
    id: "primeiros-socorros-agua-oxigenada",
    name: "Água Oxigenada 10 volumes",
    brand: "Protect",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description: "Antisséptico para limpeza de feridas e prevenção de infecções.",
    tags: ["antisséptico", "ferida", "limpeza"],
  },
  {
    id: "primeiros-socorros-mercurocromo",
    name: "Tintura de Iodo",
    brand: "Protect",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description: "Antisséptico tópico de amplo espectro para higienização de feridas.",
    tags: ["iodo", "antisséptico", "ferida"],
  },
  // Bem-estar e relaxamento
  {
    id: "bem-estar-melatonina",
    name: "Melatonina",
    brand: "NutriCore",
    category: "Bem-estar",
    aisleId: "corredor-9",
    description: "Auxilia na regulação do ciclo do sono e combate à insônia leve.",
    tags: ["sono", "insônia", "relaxamento"],
  },
  {
    id: "bem-estar-valeriana",
    name: "Valeriana",
    brand: "Apismel",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description: "Fitoterápico natural para ansiedade leve, estresse e melhora do sono.",
    tags: ["ansiedade", "estresse", "sono"],
  },
  // Bebês
  {
    id: "bebe-termometro-digital",
    name: "Termômetro Digital Infantil",
    brand: "LifeMed",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description: "Medição rápida e segura para bebês e crianças com alerta sonoro de febre.",
    tags: ["febre", "bebê", "temperatura"],
  },
  {
    id: "bebe-soro-nasal",
    name: "Soro Nasal Infantil",
    brand: "Rinosoro",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description: "Solução fisiológica em spray para higiene e desobstrução nasal de bebês.",
    tags: ["nariz", "bebê", "higiene nasal"],
  },
  // Diabetes complementos
  {
    id: "diabetes-insulina-caneta",
    name: "Agulha para Caneta de Insulina",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description: "Agulha ultrafina e curta para aplicação de insulina com mínimo desconforto.",
    tags: ["insulina", "aplicação", "diabetes"],
  },
];

export const products: Product[] = [...baseProducts, ...extraProducts, ...newProducts].map(
  enrichProduct
);
