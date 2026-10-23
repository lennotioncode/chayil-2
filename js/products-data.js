/**
 * CHAYIL - Catálogo de Productos y Datos Globales
 */
const PRODUCTS_DATA = [
  {
    id: "cam-heavyweight-arena",
    name: "Camiseta Heavyweight Essential 240 GSM",
    shortName: "Camiseta Heavyweight Arena Clásica",
    category: "camisetas",
    subcategory: "heavyweight",
    price: 38.00,
    oldPrice: null,
    badge: "BESTSELLER",
    gsm: "240 GSM",
    image: "assets/images/prod_tee_arena.jpg",
    gallery: [
      "assets/images/prod_detail_main.jpg",
      "assets/images/prod_detail_thumb1.jpg",
      "assets/images/prod_detail_thumb2.jpg",
      "assets/images/prod_detail_thumb3.jpg",
      "assets/images/prod_detail_thumb4.jpg"
    ],
    rating: 4.9,
    reviewsCount: 128,
    fit: "Corte Regular Boxy",
    material: "100% Algodón Peinado Orgánico GOTS",
    description: "Diseñada con una silueta contemporánea ligeramente 'boxy' que no oprime el torso ni pierde la compostura. Sus hombros deliberadamente caídos otorgan un aspecto desenfadado sin renunciar a la pulcritud satorial. Cuello cerrado reforzado en canalé 1x1 de 2.5 cm que mantiene su tensión tras lavados.",
    specs: "Gramaje: 240 GSM • Corte Recto Boxy • Caída arquitectónica",
    colors: [
      { name: "Arena Crudo", hex: "#E3DAC9", tag: "RAW SAND", isDefault: true },
      { name: "Crema Natural", hex: "#F3EAD8", tag: "NATURAL CREAM" },
      { name: "Arcilla Suave", hex: "#B86B4B", tag: "TERRACOTTA" },
      { name: "Negro Carbón", hex: "#2A2826", tag: "WASHED BLACK" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "gorra-duna-washed",
    name: "Gorra Daily Canvas 'Duna Washed'",
    shortName: "Gorra Daily Canvas 'Duna Washed'",
    category: "gorras",
    subcategory: "dad-cap",
    price: 32.00,
    oldPrice: null,
    badge: "BESTSELLER",
    gsm: "280 GSM",
    image: "assets/images/prod_cap_duna.jpg",
    gallery: [
      "assets/images/prod_cap_duna.jpg",
      "assets/images/gorras_hero.jpg",
      "assets/images/cap_feature_corona.jpg",
      "assets/images/cap_feature_visera.jpg",
      "assets/images/cap_feature_hebilla.jpg"
    ],
    rating: 5.0,
    reviewsCount: 142,
    fit: "Talla Única Ajustable",
    material: "100% Algodón Canvas Lavado",
    description: "Confeccionada en sarga de algodón peinado lavado a la piedra para un tacto suave desde el primer uso. Cierre posterior con hebilla metálica de latón envejecido y visera con curvatura natural relajada.",
    specs: "Lona 100% Algodón • Hebilla Deslizante Latón • Tonalidad Duna Desgastado",
    colors: [
      { name: "Duna Washed", hex: "#C2AF94", tag: "DUNA DESGASTADO", isDefault: true },
      { name: "Tierra Calma", hex: "#8A6B4F", tag: "EARTH" },
      { name: "Carbón Mineral", hex: "#32302D", tag: "CHARCOAL" }
    ],
    sizes: ["Única"]
  },
  {
    id: "cam-boxy-arcilla",
    name: "Camiseta Boxy Fit Arcilla Cálida",
    shortName: "Camiseta Boxy Fit Arcilla Cálida",
    category: "camisetas",
    subcategory: "heavyweight",
    price: 42.00,
    oldPrice: null,
    badge: "EDICIÓN LIMITADA",
    gsm: "240 GSM",
    image: "assets/images/prod_tee_arcilla.jpg",
    rating: 4.8,
    reviewsCount: 94,
    fit: "Hombro Caído",
    material: "100% Algodón GOTS Tintado Botánico",
    description: "Tintado botánico mineral en frío que respeta la textura noble del algodón pesado. Corte boxy de hombros relajados para un estilo sobrio y atemporal.",
    specs: "Gramaje: 240 GSM • Tintado Botánico Mineral • Algodón GOTS",
    colors: [
      { name: "Arcilla Cálida", hex: "#B86B4B", tag: "CLAY", isDefault: true },
      { name: "Sal Marina", hex: "#E8E5DD", tag: "SEA SALT" },
      { name: "Carbón", hex: "#2B2927", tag: "CARBON" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "gorra-sal-marina",
    name: "Gorra 6 Paneles Sal Marina",
    shortName: "Gorra 6 Paneles Sal Marina",
    category: "gorras",
    subcategory: "dad-cap",
    price: 32.00,
    oldPrice: null,
    badge: "NUEVO",
    gsm: "260 GSM",
    image: "assets/images/prod_cap_salina.jpg",
    rating: 4.9,
    reviewsCount: 78,
    fit: "Visera Curvada",
    material: "Sarga de Algodón Orgánico",
    description: "Tonalidad blanco crudo sin tintes químicos artificiales. Fresca, transpirable, ligera e ideal para acompañar jornadas frente al mar o en la ciudad.",
    specs: "Sarga Peinada • Visera Curvada Anatómica • Cierre Latón",
    colors: [
      { name: "Sal Marina", hex: "#EFECE6", tag: "SEA SALT", isDefault: true },
      { name: "Carbón", hex: "#2E2D2B", tag: "CARBON" }
    ],
    sizes: ["Única"]
  },
  {
    id: "cam-relaxed-salina",
    name: "Camiseta Relaxed Sal Marina",
    shortName: "Camiseta Relaxed Sal Marina",
    category: "camisetas",
    subcategory: "relaxed",
    price: 38.00,
    oldPrice: null,
    badge: "180 GSM",
    gsm: "180 GSM",
    image: "assets/images/prod_tee_salina.jpg",
    rating: 4.9,
    reviewsCount: 112,
    fit: "Caída Fluida",
    material: "Algodón Transpirable 180 GSM",
    description: "Nuestra propuesta más ligera para días cálidos. Caída natural que no pierde cuerpo ni transparencia tras los lavados.",
    specs: "180 GSM Ligera y Fluida • Cuello fino de 1.8 cm • Hilo Peinado",
    colors: [
      { name: "Sal Marina", hex: "#EFECE6", isDefault: true },
      { name: "Salvia", hex: "#9EA893" }
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"]
  },
  {
    id: "cam-oversized-carbon",
    name: "Camiseta Oversized Carbón Lavado",
    shortName: "Camiseta Oversized Carbón Lavado",
    category: "camisetas",
    subcategory: "oversized",
    price: 45.00,
    oldPrice: null,
    badge: "CÁPSULA LIMITADA",
    gsm: "240 GSM",
    image: "assets/images/prod_tee_carbon.jpg",
    rating: 4.9,
    reviewsCount: 86,
    fit: "Oversized Fit",
    material: "Algodón Orgánico Pesado",
    description: "Lavado en piedra mineral suave que logra un tono antracita profundo con matices desgastados sutiles en las costuras.",
    specs: "240 GSM • Acabado Vintage • Costuras Reforzadas",
    colors: [
      { name: "Carbón Lavado", hex: "#2A2826", isDefault: true },
      { name: "Arcilla", hex: "#B86B4B" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "cam-pocket-duna",
    name: "Camiseta Pocket Essential Duna",
    shortName: "Camiseta Pocket Essential Duna",
    category: "camisetas",
    subcategory: "relaxed",
    price: 40.00,
    oldPrice: null,
    badge: "200 GSM",
    gsm: "200 GSM",
    image: "assets/images/prod_tee_pocket.jpg",
    rating: 4.7,
    reviewsCount: 63,
    fit: "Corte Recto",
    material: "Algodón Orgánico 200 GSM",
    description: "Bolsillo ciego en pecho reforzado con doble costura. Equilibrio idóneo entre peso medio y tacto cálido para entretiempo.",
    specs: "200 GSM • Bolsillo Ciego Reforzado • Tintado en Madeja",
    colors: [
      { name: "Duna Tostado", hex: "#C2AF94", isDefault: true },
      { name: "Negro", hex: "#1A1918" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "cam-henley-texturizada",
    name: "Camiseta Henley Texturizada",
    shortName: "Camiseta Henley Texturizada",
    category: "camisetas",
    subcategory: "clasico",
    price: 46.00,
    oldPrice: null,
    badge: "LINO & ALGODÓN",
    gsm: "180 GSM",
    image: "assets/images/prod_tee_henley.jpg",
    rating: 4.9,
    reviewsCount: 52,
    fit: "Tacto Fresco",
    material: "55% Lino Crudo, 45% Algodón Peinado",
    description: "Patrón clásico con botones de corozo vegetal. Estructura texturizada que permite una ventilación excepcional.",
    specs: "Mezcla Lino & Algodón • Botones Corozo • Ribetes Reforzados",
    colors: [
      { name: "Lino Crudo", hex: "#D8CFBC", isDefault: true },
      { name: "Tierra Calma", hex: "#8A6B4F" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "cam-boxy-salvia",
    name: "Camiseta Boxy Salvia Pálido",
    shortName: "Camiseta Boxy Salvia Pálido",
    category: "camisetas",
    subcategory: "heavyweight",
    price: 42.00,
    oldPrice: null,
    badge: "240 GSM",
    gsm: "240 GSM",
    image: "assets/images/prod_tee_salvia.jpg",
    rating: 4.8,
    reviewsCount: 41,
    fit: "Boxy Regular",
    material: "Algodón Orgánico Pesado",
    description: "Tono salvia sereno obtenido mediante pigmentos de origen vegetal. Suavizado al tacto sin alterar la resistencia de la tela.",
    specs: "240 GSM • Pigmento Origen Vegetal • Cuello 2.5cm",
    colors: [
      { name: "Salvia Pálido", hex: "#9EA893", isDefault: true },
      { name: "Arena", hex: "#E3DAC9" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "cam-cuello-obsidiana",
    name: "Camiseta Cuello Redondo Obsidiana",
    shortName: "Camiseta Cuello Redondo Obsidiana",
    category: "camisetas",
    subcategory: "clasico",
    price: 42.00,
    oldPrice: null,
    badge: "BESTSELLER",
    gsm: "240 GSM",
    image: "assets/images/prod_tee_obsidiana.jpg",
    rating: 4.9,
    reviewsCount: 88,
    fit: "Corte Clásico Pesado",
    material: "Algodón 240 GSM de Alto Gramaje",
    description: "Costuras dobles ciegas en hombros y sisa. Diseñada para mantener su tonalidad negra profunda incluso tras decenas de lavados.",
    specs: "Costuras Dobles Ciegas • Anti-deformación • Algodón GOTS",
    colors: [
      { name: "Negro Obsidiana", hex: "#1A1918", isDefault: true },
      { name: "Sal Marina", hex: "#E8E5DD" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: "gorra-dad-arcilla",
    name: "Gorra Dad Cap Arcilla Lavada",
    shortName: "Gorra Dad Cap Arcilla Lavada",
    category: "gorras",
    subcategory: "dad-cap",
    price: 36.00,
    oldPrice: null,
    badge: "LAVADO A LA PIEDRA",
    gsm: "280 GSM",
    image: "assets/images/prod_cap_arcilla.jpg",
    rating: 4.8,
    reviewsCount: 65,
    fit: "Ajustable",
    material: "Lona Lavada a la Piedra",
    description: "Tinte vegetal inspirado en la cerámica cocida artesanal de la albufera. Suavidad extrema en el contacto frontal.",
    specs: "Lona Gruesa • Hebilla Latón Envejecido • Tono Mineral",
    colors: [
      { name: "Arcilla Lavada", hex: "#B86B4B", isDefault: true },
      { name: "Arena Duna", hex: "#C2AF94" }
    ],
    sizes: ["Única"]
  },
  {
    id: "gorra-verde-olivo",
    name: "Gorra Estructurada Verde Olivo Costa",
    shortName: "Gorra Estructurada Verde Olivo Costa",
    category: "gorras",
    subcategory: "low-profile",
    price: 35.00,
    oldPrice: null,
    badge: "ESTRUCTURA LOW-PROFILE",
    gsm: "280 GSM",
    image: "assets/images/prod_cap_olivo.jpg",
    rating: 4.9,
    reviewsCount: 54,
    fit: "Corona Firme",
    material: "Sarga Pesada de Algodón",
    description: "Refuerzo ligero en los paneles delanteros para mantener la silueta impecable a lo largo del tiempo sin rigidez artificial.",
    specs: "Corona Firme • Bordado Tonal Interior • Cierre Ajustable",
    colors: [
      { name: "Verde Olivo", hex: "#5C614E", isDefault: true },
      { name: "Carbón", hex: "#2A2826" }
    ],
    sizes: ["Única"]
  },
  {
    id: "gorra-carbon-mineral",
    name: "Gorra Minimal Tonal Carbón",
    shortName: "Gorra Minimal Tonal Carbón",
    category: "gorras",
    subcategory: "low-profile",
    price: 36.00,
    oldPrice: null,
    badge: "BORDADO TONAL",
    gsm: "300 GSM",
    image: "assets/images/prod_cap_carbon.jpg",
    rating: 4.9,
    reviewsCount: 71,
    fit: "Perfil Bajo",
    material: "Lona 300 GSM Lavada",
    description: "Negro atenuado por lavado mineral. Discreción absoluta y bordado monócromo imperceptible de la firma.",
    specs: "Lona 300 GSM • Tonalidad Carbón Mate • Hebilla Latón",
    colors: [
      { name: "Carbón Mineral", hex: "#2A2826", isDefault: true },
      { name: "Gris Cemento", hex: "#5E5C58" }
    ],
    sizes: ["Única"]
  },
  {
    id: "gorra-viento-sur",
    name: "Gorra Canvas sin Corona 'Viento Sur'",
    shortName: "Gorra Canvas sin Corona 'Viento Sur'",
    category: "gorras",
    subcategory: "canvas-sin-refuerzo",
    price: 32.00,
    oldPrice: null,
    badge: "NOVEDAD",
    gsm: "260 GSM",
    image: "assets/images/prod_cap_vientosur.jpg",
    rating: 4.7,
    reviewsCount: 39,
    fit: "Plegable",
    material: "Lona Ligera Lavada",
    description: "Estructura ultra maleable plegable para viajar en mochila o maleta sin deformarse. Tacto aterciopelado por fricción mecánica.",
    specs: "Plegable • Sin Cierres Plásticos • Tacto Suave",
    colors: [
      { name: "Arena Duna", hex: "#C2AF94", isDefault: true },
      { name: "Blanco Sal", hex: "#EFECE6" }
    ],
    sizes: ["Única"]
  },
  {
    id: "pack-trilogia",
    name: "Pack Trilogía Esencial (3 Camisetas)",
    shortName: "Pack Esenciales 3 Camisetas",
    category: "camisetas",
    subcategory: "packs",
    price: 98.00,
    oldPrice: 114.00,
    badge: "AHORRO 15%",
    gsm: "240 GSM",
    image: "assets/images/pack_trilogia.jpg",
    rating: 5.0,
    reviewsCount: 210,
    fit: "Caja de Regalo",
    material: "Algodón Orgánico GOTS",
    description: "Combina 3 camisetas esenciales en cualquiera de nuestros tonos y gramajes. Recíbelas presentadas en nuestra emblemática caja kraft reciclada con papel de seda vegetal libre de ácidos.",
    specs: "3 Unidades a Elección • Incluye Estuche Kraft de Regalo • Ahorro 15%",
    colors: [
      { name: "Trilogía Neutra (Arena + Arcilla + Carbón)", hex: "#C2AF94", isDefault: true }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "calcetines-acanalados",
    name: "Calcetines Acanalados Algodón Orgánico",
    shortName: "Calcetines Acanalados (Pack)",
    category: "accesorios",
    subcategory: "accesorios",
    price: 9.00,
    oldPrice: null,
    badge: "ACCESORIO",
    gsm: "Punto Acanalado",
    image: "assets/images/cart_socks.jpg",
    rating: 4.9,
    reviewsCount: 88,
    fit: "Talla Única (39-44)",
    material: "Algodón Orgánico Peinado",
    description: "Pack de calcetines con punto canalé ergonómico y puntera remallada a mano sin rozaduras. Tonalidades naturales tierra.",
    specs: "Algodón Orgánico • Puntera sin Costura • Estuche Kraft",
    colors: [
      { name: "Pack 4 Tonos Neutros", hex: "#D8CFBC", isDefault: true }
    ],
    sizes: ["Única (39-44)"]
  }
];

// Helper para buscar producto por ID
function getProductById(id) {
  return PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
}

// Helper para formatear precio en euros
function formatPrice(amount) {
  return amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
}
