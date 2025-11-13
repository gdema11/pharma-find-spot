export interface Aisle {
  id: string;
  label: string;
  summary: string;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  aisleId: string;
  description: string;
  tags?: string[];
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

export const products: Product[] = [
  {
    id: "analgesico-dipirona-500",
    name: "Dipirona Sódica 500 mg 10 comprimidos",
    brand: "Medpharma",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Analgésico e antipirético de ação rápida indicado para dores moderadas e febre.",
    tags: ["alívio rápido", "sem receita"],
  },
  {
    id: "analgesico-paracetamol-750",
    name: "Paracetamol 750 mg 16 comprimidos",
    brand: "PharmaPlus",
    category: "Analgésicos",
    aisleId: "corredor-1",
    description:
      "Controla febre e dores musculares com fórmula segura para adultos e idosos.",
    tags: ["febre", "musculares"],
  },
  {
    id: "analgesico-dorflex",
    name: "Dorflex Relaxante Muscular 24 comprimidos",
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
    name: "Benegrip Multi 6 cápsulas",
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
    name: "Vitamina C Efervescente 1 g 10 comprimidos",
    brand: "Cenevit",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Reposição diária de vitamina C com alto poder antioxidante e suporte imunológico.",
    tags: ["imunidade", "energia"],
  },
  {
    id: "vitamina-d3-2000",
    name: "Vitamina D3 2000 UI 60 cápsulas",
    brand: "LifeMix",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Auxilia na absorção de cálcio e na manutenção da saúde óssea e muscular.",
    tags: ["ossos", "imunidade"],
  },
  {
    id: "vitamina-centrum-pro",
    name: "Centrum Pró Multivitamínico 60 comprimidos",
    brand: "Centrum",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Fórmula completa com vitaminas e minerais essenciais para energia e metabolismo.",
    tags: ["energia", "diário"],
  },
  {
    id: "vitamina-lavitan-mulher",
    name: "Lavitan Mulher 60 cápsulas",
    brand: "Lavitan",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Vitaminas com ferro e zinco para suporte hormonal e redução do cansaço diário.",
    tags: ["mulheres", "ritmo intenso"],
  },
  {
    id: "suplemento-omega-3",
    name: "Ômega 3 1000 mg 120 cápsulas",
    brand: "VitGold",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Ácidos graxos essenciais com alta concentração EPA/DHA para coração e mente.",
    tags: ["coração", "colesterol"],
  },
  {
    id: "suplemento-colageno",
    name: "Colágeno Tipo II + Vitamina C 60 cápsulas",
    brand: "RegenFlex",
    category: "Vitaminas e Suplementos",
    aisleId: "corredor-2",
    description:
      "Suporte articular avançado para mobilidade, flexibilidade e conforto diário.",
    tags: ["articulações", "mobilidade"],
  },
  {
    id: "sports-whey-isolado",
    name: "Whey Protein Isolado 900 g Chocolate",
    brand: "ProSeries",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Proteína isolada de alta pureza com 25 g de proteína por dose para recuperação muscular.",
    tags: ["pós-treino", "alta pureza"],
  },
  {
    id: "sports-bcaa",
    name: "BCAA 2:1:1 120 cápsulas",
    brand: "ProSeries",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Aminoácidos essenciais que auxiliam na recuperação e manutenção da massa magra.",
    tags: ["recuperação", "massa magra"],
  },
  {
    id: "sports-creatina",
    name: "Creatina Monoidratada 300 g",
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
    name: "Barra Proteica Cacau 12 g Proteína",
    brand: "PowerBar",
    category: "Suplementos Esportivos",
    aisleId: "corredor-10",
    description:
      "Lanche prático com baixo teor de açúcar para consumo pré ou pós-atividade física.",
    tags: ["on-the-go", "low sugar"],
  },
  {
    id: "higiene-sabonete-liquido",
    name: "Sabonete Líquido Antibacteriano 300 ml",
    brand: "DermaCare",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Limpeza suave com proteção antibacteriana e fragrância refrescante para o dia a dia.",
    tags: ["proteção", "uso diário"],
  },
  {
    id: "higiene-desodorante-48h",
    name: "Desodorante Aerossol 48 h Antitranspirante",
    brand: "DryShield",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Tecnologia antiumidade com proteção prolongada e toque seco imediato.",
    tags: ["48h", "toque seco"],
  },
  {
    id: "higiene-shampoo-antiqueda",
    name: "Shampoo Antiqueda Cafeína 400 ml",
    brand: "Capilaris",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Estimula o couro cabeludo e fortalece os fios contra quebra e queda diária.",
    tags: ["fortalecimento", "vitaminas"],
  },
  {
    id: "higiene-condicionador-nutricao",
    name: "Condicionador Nutrição Intensa 300 ml",
    brand: "Capilaris",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Restaura o brilho com óleos nutritivos e deixa os fios soltos e hidratados.",
    tags: ["brilho", "reparação"],
  },
  {
    id: "higiene-gel-fixador",
    name: "Gel Fixador Capilar Forte 250 g",
    brand: "StyleMax",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Fixação forte e flexível com acabamento sem resíduos e proteção térmica leve.",
    tags: ["fixação forte", "sem resíduos"],
  },
  {
    id: "higiene-sabonete-intimo",
    name: "Sabonete Íntimo pH Balanceado 200 ml",
    brand: "FreshCare",
    category: "Higiene Pessoal",
    aisleId: "corredor-3",
    description:
      "Formulação suave com ácido lático para conforto e proteção da flora natural.",
    tags: ["pH balanceado", "flora natural"],
  },
  {
    id: "bucal-creme-branqueador",
    name: "Creme Dental Branqueador 12 h",
    brand: "SmilePro",
    category: "Higiene Bucal",
    aisleId: "corredor-4",
    description:
      "Clareia gradualmente e protege contra manchas mantendo o hálito fresco por 12 horas.",
    tags: ["clareamento", "anticárie"],
  },
  {
    id: "bucal-creme-sensibilidade",
    name: "Creme Dental Sensibilidade 90 g",
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
    name: "Hidratante Corporal 48 h 400 ml",
    brand: "SkinBalance",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Textura leve com ácido hialurônico e manteiga de karité para pele radiante e macia.",
    tags: ["ácido hialurônico", "hidratação intensa"],
  },
  {
    id: "pele-protetor-solar",
    name: "Protetor Solar FPS 50 Oil Control 50 g",
    brand: "SunShield",
    category: "Cuidados com a Pele",
    aisleId: "corredor-5",
    description:
      "Filtro solar de amplo espectro com efeito matte e proteção anti-luz azul.",
    tags: ["fps50", "oil free"],
  },
  {
    id: "dermo-serum-vitamina-c",
    name: "Sérum Facial Vitamina C 10% 30 ml",
    brand: "DermaLab",
    category: "Dermocosméticos",
    aisleId: "corredor-5",
    description:
      "Antioxidante com ácido ferúlico e vitamina E para luminosidade e uniformização do tom.",
    tags: ["antioxidante", "luminosidade"],
  },
  {
    id: "dermo-creme-noturno",
    name: "Creme Facial Noturno Retinol 50 g",
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
    name: "Fralda Descartável M 34 unidades",
    brand: "BabySoft",
    category: "Bebês e Infantil",
    aisleId: "corredor-6",
    description:
      "Camada ultraabsorvente com barreiras antivazamento e indicador de umidade.",
    tags: ["absorção", "conforto"],
  },
  {
    id: "bebe-lenco-umedecido",
    name: "Lenço Umedecido Hipoalergênico 100 unidades",
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
    name: "Curativo Impermeável 30 unidades",
    brand: "SafeLine",
    category: "Primeiros Socorros",
    aisleId: "corredor-7",
    description:
      "Fixação respirável com bordas aderentes e almofada central que não gruda.",
    tags: ["impermeável", "respirável"],
  },
  {
    id: "primeiros-socorros-alcool-gel",
    name: "Álcool Gel 70% 400 g",
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
    name: "Tiras para Glicemia 50 unidades",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Compatíveis com toda a linha Smart Connect e embaladas individualmente.",
    tags: ["uso diário", "precisas"],
  },
  {
    id: "diabetes-lancetas",
    name: "Lancetas Universais 100 unidades",
    brand: "GlucoTrack",
    category: "Diabetes",
    aisleId: "corredor-8",
    description:
      "Ponta siliconizada para punção suave e compatibilidade com diversos lancetadores.",
    tags: ["siliconizada", "universal"],
  },
  {
    id: "diabetes-alcool-swab",
    name: "Álcool Swab Estéril 100 unidades",
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
    name: "Chá Verde Orgânico 20 sachês",
    brand: "NaturaTea",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Sabor suave rico em antioxidantes para consumir quente ou gelado.",
    tags: ["antioxidante", "revigorante"],
  },
  {
    id: "naturais-cha-camomila",
    name: "Chá de Camomila Premium 20 sachês",
    brand: "NaturaTea",
    category: "Chás e Naturais",
    aisleId: "corredor-9",
    description:
      "Flores selecionadas para infusão relaxante e aroma acolhedor antes de dormir.",
    tags: ["relaxante", "noturno"],
  },
  {
    id: "naturais-propolis",
    name: "Própolis Spray Sem Álcool 30 ml",
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
    name: "Óleo de Coco Extra Virgem 200 ml",
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
