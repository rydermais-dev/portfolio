import type { Locale } from '.';
import certificates from './certifications.json';

type Languages = [pt: string, en: string, es: string, de: string, fr: string, ja: string, ko: string, ru: string];
const languageIndex = { 'pt-BR': 0, 'pt-PT': 0, en: 1, es: 2, de: 3, fr: 4, 'ja-JP': 5, ko: 6, ru: 7 } as const;

export const areas = {
  ai: ['Inteligência artificial', 'Artificial intelligence', 'Inteligencia artificial', 'Künstliche Intelligenz', 'Intelligence artificielle', '人工知能', '인공지능', 'Искусственный интеллект'],
  governance: ['Governança e conformidade', 'Governance and compliance', 'Gobernanza y cumplimiento', 'Governance und Compliance', 'Gouvernance et conformité', 'ガバナンスとコンプライアンス', '거버넌스 및 규정 준수', 'Управление и комплаенс'],
  security: ['Segurança da informação', 'Information security', 'Seguridad de la información', 'Informationssicherheit', 'Sécurité de l’information', '情報セキュリティ', '정보 보안', 'Информационная безопасность'],
  privacy: ['Privacidade e proteção de dados', 'Privacy and data protection', 'Privacidad y protección de datos', 'Datenschutz', 'Protection des données', '個人情報保護', '개인정보 보호', 'Защита персональных данных'],
  frontend: ['Desenvolvimento front-end', 'Front-end development', 'Desarrollo frontend', 'Frontend-Entwicklung', 'Développement front-end', 'フロントエンド開発', '프론트엔드 개발', 'Фронтенд-разработка'],
  backend: ['Desenvolvimento back-end', 'Back-end development', 'Desarrollo backend', 'Backend-Entwicklung', 'Développement back-end', 'バックエンド開発', '백엔드 개발', 'Бэкенд-разработка'],
  fullstack: ['Desenvolvimento full stack', 'Full-stack development', 'Desarrollo full stack', 'Full-Stack-Entwicklung', 'Développement full stack', 'フルスタック開発', '풀스택 개발', 'Фулстек-разработка'],
  programming: ['Fundamentos de programação', 'Programming fundamentals', 'Fundamentos de programación', 'Grundlagen der Programmierung', 'Bases de la programmation', 'プログラミング基礎', '프로그래밍 기초', 'Основы программирования'],
  hardware: ['Arquitetura de computadores', 'Computer architecture', 'Arquitectura de computadores', 'Rechnerarchitektur', 'Architecture des ordinateurs', 'コンピュータアーキテクチャ', '컴퓨터 구조', 'Архитектура компьютеров'],
  games: ['Desenvolvimento de jogos', 'Game development', 'Desarrollo de videojuegos', 'Spieleentwicklung', 'Développement de jeux vidéo', 'ゲーム開発', '게임 개발', 'Разработка игр'],
  projects: ['Gestão de projetos', 'Project management', 'Gestión de proyectos', 'Projektmanagement', 'Gestion de projet', 'プロジェクト管理', '프로젝트 관리', 'Управление проектами'],
  mentoring: ['Mentoria e colaboração', 'Mentoring and collaboration', 'Mentoría y colaboración', 'Mentoring und Zusammenarbeit', 'Mentorat et collaboration', 'メンタリングと協働', '멘토링 및 협업', 'Наставничество и сотрудничество'],
  ux: ['Experiência do usuário (UX)', 'User experience (UX)', 'Experiencia de usuario (UX)', 'Nutzererfahrung (UX)', 'Expérience utilisateur (UX)', 'ユーザー体験（UX）', '사용자 경험(UX)', 'Пользовательский опыт (UX)'],
  commerce: ['Comércio eletrônico', 'E-commerce', 'Comercio electrónico', 'Onlinehandel', 'Commerce électronique', '電子商取引', '전자상거래', 'Электронная коммерция'],
  marketing: ['Marketing', 'Marketing', 'Marketing', 'Marketing', 'Marketing', 'マーケティング', '마케팅', 'Маркетинг'],
  productivity: ['Produtividade digital', 'Digital productivity', 'Productividad digital', 'Digitale Produktivität', 'Productivité numérique', 'デジタル生産性', '디지털 생산성', 'Цифровая продуктивность'],
  mobile: ['Desenvolvimento móvel', 'Mobile development', 'Desarrollo móvil', 'Mobile Entwicklung', 'Développement mobile', 'モバイル開発', '모바일 개발', 'Мобильная разработка'],
  health: ['Primeiros socorros', 'First aid', 'Primeros auxilios', 'Erste Hilfe', 'Premiers secours', '応急処置', '응급처치', 'Первая помощь'],
} satisfies Record<string, Languages>;

const portugal: Partial<Record<keyof typeof areas, string>> = {
  governance: 'Governação e conformidade',
  ux: 'Experiência do utilizador (UX)',
  commerce: 'Comércio eletrónico',
};

export function areaLabel(area: keyof typeof areas, locale: Locale) {
  return (locale === 'pt-PT' && portugal[area]) || areas[area][languageIndex[locale]];
}

type Area = keyof typeof areas;

const classifications = {
  1: { areas: ['ai'], technologies: ['GitHub Copilot'] },
  2: { areas: ['governance'] },
  3: { areas: ['security'] },
  4: { areas: ['frontend'], technologies: ['HTML', 'CSS', 'JavaScript', 'React'] },
  5: { areas: ['ai'] },
  6: { areas: ['productivity'] },
  7: { areas: ['programming'] },
  8: { areas: ['hardware'] },
  9: { areas: ['games'], technologies: ['Unity'] },
  10: { areas: ['mentoring'] },
  11: { areas: ['ux'] },
  12: { areas: ['frontend'], technologies: ['jQuery', 'JavaScript'] },
  13: { areas: ['commerce'] },
  14: { areas: ['frontend'], technologies: ['React', 'TypeScript'] },
  15: { areas: ['ux'] },
  16: { areas: ['programming'], technologies: ['Dart'] },
  17: { areas: ['programming'], technologies: ['Dart'] },
  18: { areas: ['programming'], technologies: ['Dart'] },
  19: { areas: ['programming'], technologies: ['Dart'] },
  20: { areas: ['frontend'], technologies: ['Vue.js'] },
  21: { areas: ['games'] },
  22: { areas: ['marketing'] },
  23: { areas: ['fullstack', 'frontend', 'backend'] },
  24: { areas: ['projects'] },
  25: { areas: ['programming', 'frontend', 'backend'] },
  26: { areas: ['frontend'], technologies: ['HTML'] },
  27: { areas: ['privacy'] },
  28: { areas: ['health'] },
  29: { areas: ['mobile'], technologies: ['Java'] },
  30: { areas: ['productivity'], technologies: ['Microsoft Excel'] },
  31: { areas: ['productivity'] },
} satisfies Record<number, { areas: Area[]; technologies?: string[] }>;

const areaAliases: Partial<Record<Area, string[]>> = {
  ai: ['IA', 'AI', 'KI', 'ИИ'],
  governance: ['GRC', 'compliance', 'risco regulatório'],
  security: ['cibersegurança', 'cybersecurity', 'ciberseguridad', 'cybersécurité', 'Cybersicherheit', 'サイバーセキュリティ', '사이버 보안', 'кибербезопасность'],
  privacy: ['LGPD', 'GDPR', 'RGPD', 'DSGVO'],
  ux: ['design', 'usabilidade', 'usability', 'utilisabilité', 'Benutzerfreundlichkeit', 'ユーザビリティ', '사용성', 'юзабилити'],
};

const technologyAliases: Record<string, string[]> = {
  JavaScript: ['JS', 'ECMAScript'],
  TypeScript: ['TS'],
  React: ['React.js', 'ReactJS'],
  'Vue.js': ['Vue', 'Vue 3', 'Vue3', 'VueJS'],
  'Microsoft Excel': ['planilhas', 'folhas de cálculo', 'spreadsheets', 'hojas de cálculo', 'Tabellenkalkulation', 'tableur', '表計算', '스프레드시트', 'электронные таблицы'],
};

const certificateAliases: Partial<Record<number, string[]>> = {
  6: ['digitação', 'datilografia', 'typing', 'mecanografía', 'Tastaturschreiben', 'dactylographie', 'タイピング', '타자', 'слепая печать'],
  9: ['jogos 3D', '3D games', 'videojuegos 3D', '3D-Spiele', 'jeux 3D', '3Dゲーム', '3D 게임', '3D-игры'],
  16: ['tratamento de exceções', 'exception handling', 'manejo de excepciones', 'Ausnahmebehandlung', 'gestion des exceptions', '例外処理', '예외 처리', 'обработка исключений'],
  19: ['programação orientada a objetos', 'object-oriented programming', 'programación orientada a objetos', 'objektorientierte Programmierung', 'programmation orientée objet', 'オブジェクト指向', '객체 지향 프로그래밍', 'объектно-ориентированное программирование', 'POO', 'OOP'],
};

type Certificate = (typeof certificates)[number] & { credentialId?: string };

const issuerColors: Record<string, string> = {
  dio: '#cc235f',
  mag: '#007eaf',
  scrimba: '#6860ab',
  ratatype: '#525f9a',
  descomplica: '#00854c',
  udemy: '#893bea',
  recode: '#5366ae',
  alura: '#1775b7',
  sestsenat: '#006c8c',
  bradesco: '#c91947',
};
export const certificateCatalog = certificates.map((certificate: Certificate) => {
  const classification: { areas: Area[]; technologies?: string[] } = classifications[certificate.id as keyof typeof classifications] ?? { areas: [] };
  const logoKey = certificate.issuerLogo.split('/').pop()?.split('.')[0] ?? '';
  return { ...certificate, issuerColor: issuerColors[logoKey], areas: classification.areas, technologies: classification.technologies ?? [] };
});

export const certificateTechnologies = [...new Set(certificateCatalog.flatMap((certificate) => certificate.technologies))].sort();

function normalize(text: string) {
  return text.toLowerCase().normalize('NFKC').normalize('NFD')
    .replace(/([a-z])\p{M}+/gu, '$1').normalize('NFC')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
}

const index = certificateCatalog.map((certificate) => {
  const title = normalize(certificate.title);
  const terms = [
    certificate.title, certificate.emissor, certificate.date, certificate.credentialId ?? '',
    ...certificate.areas.flatMap((area) => [...areas[area], portugal[area] ?? '', ...(areaAliases[area] ?? [])]),
    ...certificate.technologies.flatMap((technology) => [technology, ...(technologyAliases[technology] ?? [])]),
    ...(certificateAliases[certificate.id] ?? []),
  ].map(normalize).filter(Boolean);
  return { certificate, title, terms, words: [...new Set(terms.flatMap((term) => term.split(' ')))] };
});

// Adjacent swaps count as a single typo, alongside an insertion, deletion or replacement.
function oneEdit(a: string, b: string) {
  if (Math.abs(a.length - b.length) > 1) return false;
  const first = [...a].findIndex((letter, index) => letter !== b[index]);
  if (first < 0) return true;
  const restA = a.slice(first), restB = b.slice(first);
  if (a.length === b.length) {
    return restA.slice(1) === restB.slice(1)
      || (restA[0] === restB[1] && restA[1] === restB[0] && restA.slice(2) === restB.slice(2));
  }
  return a.length > b.length ? restA.slice(1) === restB : restA === restB.slice(1);
}

const stopWords = new Set('de da do das dos para por com em the and for with of in des du et avec und mit für fur con del y в для и'.split(' '));

export function searchCertificates(query: string, issuer: string, selectedAreas: string[], selectedTechnologies: string[]) {
  const phrase = normalize(query);
  const tokens = [...new Set(phrase.split(' ').filter((word) => word && !stopWords.has(word)))];
  return index.flatMap(({ certificate, title, terms, words }) => {
    if (issuer && certificate.emissor !== issuer) return [];
    if (selectedAreas.length && !certificate.areas.some((area) => selectedAreas.includes(area))) return [];
    if (selectedTechnologies.length && !certificate.technologies.some((technology) => selectedTechnologies.includes(technology))) return [];
    if (!tokens.length) return [{ certificate, score: 0 }];

    const matches = tokens.map((token) => {
      if (words.includes(token)) return 4;
      if (/[^\p{Script=Latin}\p{Script=Cyrillic}\d]/u.test(token) && terms.some((term) => term.includes(token))) return 3;
      if (token.length >= 4 && words.some((word) => word.startsWith(token))) return 2;
      if (token.length >= 4 && words.some((word) => word.length >= 4 && oneEdit(token, word))) return 1;
      return 0;
    });
    if (matches.filter(Boolean).length < Math.ceil(tokens.length * .6)) return [];
    const phraseBonus = title === phrase ? 20 : terms.includes(phrase) ? 10 : 0;
    return [{ certificate, score: phraseBonus + matches.reduce<number>((sum, value) => sum + value, 0) }];
  }).sort((a, b) => b.score - a.score).map(({ certificate }) => certificate);
}
