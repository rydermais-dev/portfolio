import type { Locale } from './index';

export const certificateLabels = {
  'pt-BR': ['Áreas', 'Tecnologias', 'Buscar por palavra-chave', 'Ex.: React, segurança, design', 'Instituição', 'Todas as instituições', 'Limpar filtros', 'Temas', 'Emissão', 'Explore a coleção', 'Busque por assunto ou combine os filtros.', 'Nenhum certificado encontrado', 'Experimente outro termo ou remova algum filtro.', 'Resultados'],
  'pt-PT': ['Áreas', 'Tecnologias', 'Pesquisar por palavra-chave', 'Ex.: React, segurança, design', 'Instituição', 'Todas as instituições', 'Limpar filtros', 'Temas', 'Emissão', 'Explore a coleção', 'Pesquise por tema ou combine os filtros.', 'Nenhum certificado encontrado', 'Experimente outro termo ou remova um filtro.', 'Resultados'],
  en: ['Areas', 'Technologies', 'Search by keyword', 'E.g. React, security, design', 'Institution', 'All institutions', 'Clear filters', 'Topics', 'Issued', 'Explore the collection', 'Search by topic or combine filters.', 'No certificates found', 'Try another term or remove a filter.', 'Results'],
  es: ['Áreas', 'Tecnologías', 'Buscar por palabra clave', 'P. ej.: React, seguridad, diseño', 'Institución', 'Todas las instituciones', 'Borrar filtros', 'Temas', 'Emisión', 'Explora la colección', 'Busca por tema o combina los filtros.', 'No se encontraron certificados', 'Prueba otro término o elimina un filtro.', 'Resultados'],
  de: ['Fachbereiche', 'Technologien', 'Nach Stichwort suchen', 'Z. B. React, Sicherheit, Design', 'Institution', 'Alle Institutionen', 'Filter zurücksetzen', 'Themen', 'Ausgestellt', 'Sammlung entdecken', 'Suche nach Themen oder kombiniere Filter.', 'Keine Zertifikate gefunden', 'Versuche einen anderen Begriff oder entferne einen Filter.', 'Ergebnisse'],
  fr: ['Domaines', 'Technologies', 'Rechercher par mot-clé', 'Ex. : React, sécurité, design', 'Organisme', 'Tous les organismes', 'Effacer les filtres', 'Thèmes', 'Délivré', 'Explorer la collection', 'Recherchez par thème ou combinez les filtres.', 'Aucun certificat trouvé', 'Essayez un autre terme ou retirez un filtre.', 'Résultats'],
  'ja-JP': ['分野', '技術', 'キーワードで検索', '例：React、セキュリティ、デザイン', '発行機関', 'すべての発行機関', '絞り込みを解除', 'テーマ', '発行日', 'コレクションを見る', 'テーマで検索するか、複数の条件で絞り込めます。', '証明書が見つかりませんでした', '別のキーワードを試すか、絞り込み条件を外してください。', '検索結果'],
  ko: ['분야', '기술', '키워드로 검색', '예: React, 보안, 디자인', '발급 기관', '모든 발급 기관', '필터 초기화', '주제', '발급일', '컬렉션 둘러보기', '주제로 검색하거나 필터를 조합해 보세요.', '검색 결과가 없습니다', '다른 검색어를 입력하거나 필터를 해제하세요.', '결과'],
  ru: ['Области', 'Технологии', 'Поиск по ключевым словам', 'Например, React, безопасность, дизайн', 'Организация', 'Все организации', 'Сбросить фильтры', 'Темы', 'Дата выдачи', 'Посмотреть коллекцию', 'Ищите по теме или сочетайте фильтры.', 'Сертификаты не найдены', 'Попробуйте другой запрос или уберите фильтр.', 'Результаты'],
} satisfies Record<Locale, readonly string[]>;

export const certificateHeroTitles: Record<Locale, string> = {
  'pt-BR': 'O estudo também vira projeto.',
  'pt-PT': 'O estudo também ganha forma.',
  en: 'Learning, put into practice.',
  es: 'Aprender también es hacer.',
  de: 'Lernen, um Dinge zu gestalten.',
  fr: 'Apprendre, puis donner forme.',
  'ja-JP': '学びを、かたちに。',
  ko: '배움을 실천으로.',
  ru: 'Знания в дело.',
};

type DiplomaLabels = [view: string, close: string, record: string, recipient: string, issuer: string, credential: string, verify: string];
export const diplomaLabels = {
  'pt-BR': ['Ver', 'Fechar', 'Certificado · registro do portfólio', 'Titular', 'Emitido por', 'ID da credencial', 'Ver credencial'],
  'pt-PT': ['Ver', 'Fechar', 'Certificado · registo do portefólio', 'Titular', 'Emitido por', 'ID da credencial', 'Ver credencial'],
  en: ['View', 'Close', 'Certificate · portfolio record', 'Recipient', 'Issued by', 'Credential ID', 'View credential'],
  es: ['Ver', 'Cerrar', 'Certificado · registro del portafolio', 'Titular', 'Emitido por', 'ID de la credencial', 'Ver credencial'],
  de: ['Ansehen', 'Schließen', 'Zertifikat · Portfolioeintrag', 'Inhaber', 'Ausgestellt von', 'Zertifikats-ID', 'Nachweis ansehen'],
  fr: ['Voir', 'Fermer', 'Certificat · fiche du portfolio', 'Titulaire', 'Délivré par', 'Identifiant du certificat', 'Voir le certificat'],
  'ja-JP': ['表示', '閉じる', '証明書・ポートフォリオ記録', '取得者', '発行機関', '認証ID', '認証情報を見る'],
  ko: ['보기', '닫기', '증명서 · 포트폴리오 기록', '취득자', '발급 기관', '인증 ID', '인증 정보 보기'],
  ru: ['Открыть', 'Закрыть', 'Сертификат · запись в портфолио', 'Владелец', 'Кем выдан', 'ID сертификата', 'Посмотреть сертификат'],
} satisfies Record<Locale, DiplomaLabels>;

export const diplomaShareLabels = {
  'pt-BR': ['Copiar link', 'Link copiado'],
  'pt-PT': ['Copiar ligação', 'Ligação copiada'],
  en: ['Copy link', 'Link copied'],
  es: ['Copiar enlace', 'Enlace copiado'],
  de: ['Link kopieren', 'Link kopiert'],
  fr: ['Copier le lien', 'Lien copié'],
  'ja-JP': ['リンクをコピー', 'リンクをコピーしました'],
  ko: ['링크 복사', '링크가 복사되었습니다'],
  ru: ['Копировать ссылку', 'Ссылка скопирована'],
} satisfies Record<Locale, [string, string]>;
