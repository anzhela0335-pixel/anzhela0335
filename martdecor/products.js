const categories = [
  {id: 'wallpaper', name: 'Обои', catalog: 'oboi'},
  {id: 'fresco', name: 'Фрески', catalog: 'freski'},
  {id: 'panels', name: 'Стеновые панели', catalog: 'stenovye-paneli'},
  {id: 'stone', name: 'Каменный шпон', catalog: 'kamennyy-shpon'},
  {id: 'finishes', name: 'Краски и штукатурки', catalog: 'dekorativnye-kraski-i-shtukaturki'},
  {id: 'molding', name: 'Молдинги', catalog: 'moldingi'}
];

const products = [
  {
    id: 'oboi-sirpi-missoni-home-6-20065', category: 'wallpaper', brand: 'Sirpi',
    name: 'Missoni Home 6 20065', code: '20065', price: 19500, unit: 'рулон',
    spec: 'Рулон 10,05 × 1 м · раппорт 64 см',
    description: 'Обои коллекции Missoni Home 6, Италия. Учитывайте раппорт при расчёте количества рулонов.'
  },
  {
    id: 'stenovaya-panel-emperado-dark', category: 'panels', brand: 'MARMARO',
    name: 'Emperado Dark', price: 3150, unit: 'м²',
    spec: 'Стеновая панель · Россия',
    description: 'Панель с рисунком мрамора в кофейной гамме и контрастными прожилками.'
  },
  {
    id: 'freski-wall-street-faktury-fresok-frost-2', category: 'fresco', brand: 'Wall Street',
    name: 'Фактура «Фрост+»', code: 'Фрост+', price: 4600, unit: 'м²',
    spec: 'Фактура фрески · Россия',
    description: 'Покрытие из коллекции «Фактуры фресок». Заявленные цвета — белый и голубой.'
  },
  {
    id: 'kamennyy-shpon-verde-gvatemala-verde-guatemala-1220h2700mm-mramor', category: 'stone',
    name: 'Verde Guatemala', price: 26630,
    spec: 'Мрамор · 1 220 × 2 700 × 2 мм',
    description: 'Универсальный каменный шпон. Формат листа и толщина указаны в карточке магазина.'
  },
  {
    id: 'dekorativnaya-shtukaturka-lanors-solo-strukturnaya-15-kg-2-mm', category: 'finishes', brand: 'Lanors',
    name: 'Соло «Структурная» 2 мм', price: 4423, unit: 'упаковка',
    spec: 'Декоративная штукатурка · 15 кг',
    description: 'Камешковая штукатурка для интерьерной и фасадной отделки. Зерно 2 мм.'
  },
  {
    id: 'nastennyy-molding-orac-decor-px209-lenta-ribbon', category: 'molding', brand: 'Orac Decor',
    name: 'PX209 Ribbon', code: 'PX209', price: 438,
    spec: 'Duropolymer® · 200 × 1 × 1,8 см',
    description: 'Настенный молдинг под окраску. Предназначен для окантовки стыков и декоративных переходов.'
  },
  {
    id: 'oboi-sirpi-missoni-home-6-20061', category: 'wallpaper', brand: 'Sirpi',
    name: 'Missoni Home 6 20061', code: '20061', price: 19500, unit: 'рулон',
    spec: 'Рулон 10,05 × 1 м · раппорт 64 см',
    description: 'Обои коллекции Missoni Home 6, Италия. Учитывайте раппорт при расчёте количества рулонов.'
  },
  {
    id: 'stenovaya-panel-port-laurent', category: 'panels', brand: 'MARMARO',
    name: 'Port Laurent', price: 3150, unit: 'м²',
    spec: 'Стеновая панель · Россия',
    description: 'Стеновая панель для классических и современных интерьеров.'
  },
  {
    id: 'freski-wall-street-faktury-fresok-frost', category: 'fresco', brand: 'Wall Street',
    name: 'Фактура «Фрост»', code: 'Фрост', price: 4100, unit: 'м²',
    spec: 'Фактура фрески · Россия',
    description: 'Покрытие из коллекции «Фактуры фресок». Заявленные цвета — белый и голубой.'
  },
  {
    id: 'kamennyy-shpon-artik-shtorm-artic-storm-napravlenie-1220h2700mm-mramor-2', category: 'stone',
    name: 'Artic Storm', price: 26630,
    spec: 'Мрамор · 1 220 × 2 700 × 2 мм',
    description: 'Универсальный каменный шпон. Формат листа и толщина указаны в карточке магазина.'
  },
  {
    id: 'dekorativnaya-shtukaturka-lanors-solo-strukturnaya-15-kg-1-5-mm', category: 'finishes', brand: 'Lanors',
    name: 'Соло «Структурная» 1,5 мм', price: 4423, unit: 'упаковка',
    spec: 'Декоративная штукатурка · 15 кг',
    description: 'Камешковая штукатурка для интерьерной и фасадной отделки. Зерно 1,5 мм.'
  },
  {
    id: 'nastennyy-molding-orac-decor-px202f', category: 'molding', brand: 'Orac Decor',
    name: 'PX202F', code: 'PX202F', price: 5962,
    spec: 'Гибкий Flex · 200 × 7,5 × 2 см',
    description: 'Гибкий настенный молдинг под окраску. Допустимые радиусы изгиба указаны в карточке магазина.'
  }
];
