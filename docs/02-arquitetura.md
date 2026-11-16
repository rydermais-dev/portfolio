# Arquitetura e contratos

## Decisões de partida

- **Web** — Next.js App Router em TypeScript com Bun para instalar, desenvolver e compilar. Provar execução da saída standalone com Bun em Linux, com uma opção de runtime Node se surgir incompatibilidade de produção. Instalar `@moduix/react` e `@ark-ui/react`, importar foundation CSS no layout raiz e restringir componentes client-side a menu, tema, idioma e controles interativos. [Moduix para Next.js](https://moduix.dev/docs/installation/nextjs) · [Next.js self-hosting](https://nextjs.org/docs/app/guides/self-hosting)
- **API** — Rust com Axum/Tokio, SQLx e migrações numeradas. Servir HTTP em `[::]:8080` ou configuração que cubra a rede privada, com `PORT` como fonte do valor. Pool preguiçoso, zero conexões mínimas e até cinco por instância inicialmente. Começar com timeout de aquisição de 2 s e idle de 60 s. Ajustar por medição.
- **Dados** — PostgreSQL 18 no Railway. Uma réplica por serviço no início. Em desenvolvimento, Docker Compose com PostgreSQL e um S3 compatível local. Gerar fixtures versionadas e sintéticas para builds e testes. Em produção, separar a role de migração da role de execução e conceder apenas permissões usadas.
- **Fluxo público** — Browser → Next.js → API privada → PostgreSQL/bucket. Rotas institucionais pré-renderizadas. Rotas de conteúdo têm seed pública revisada para o build e atualização em runtime com cache por locale e publicação. A seed independe da rede privada em build time. Fixar a opção concreta de cache após prova com a versão do Next escolhida.
- **Cache** — Começar com janela de frescor de 5 minutos para leituras, invalidação autenticada por tag/locale após publicação e retry único de GET em 502/503 dentro do timeout total de 4 s. Em falha, usar a última cópia publicada disponível. Responder 503 com estado de recuperação se a página depender de conteúdo ainda indisponível. Nunca cachear erro transitório como 404. Ao invalidar, retirar imediatamente rascunhos removidos da cópia gerada; usar reimplantação/purge de emergência se necessário. Considerar o disco do container descartável e reproduzir o último snapshot publicado a partir do banco ou do release. [Cache e ISR](https://nextjs.org/docs/app/guides/self-hosting#caching-and-isr)
- **Operação editorial** — Web expõe a área autenticada em /admin ou fluxo CLI equivalente para o primeiro release. A API permanece privada. A autenticação do dono deve ser OIDC com identidade vinculada por emissor e subject, sessão segura e proteção CSRF. Uma credencial interna de serviço protege as mutações na API e o callback de revalidação tem credencial própria. Definir emissor permitido no PR de autenticação. Rastrear alterações com autor, ID e timestamp UTC.

## Modelo relacional

- `content_entry`: UUID, kind (project, article, post, experience, education, certification), estado (draft, published, archived), source, external_id, source_url, published_at, updated_at. Chave única (source, kind, external_id) para fontes importadas.
- `content_translation`: entry_id, locale, slug, title, summary, Markdown sanitizado na renderização. PK (entry_id, locale), unicidade de slug no namespace da rota, inclusive para IDs legados via tabela de aliases ou restrição equivalente.
- `experience_detail` e `certification_detail`: organização/emissor, datas com precisão explícita, vínculo e URL verificável. Data de fim nula representa em andamento quando confirmado.
- `media_asset` e `media_variant`: digest, objeto no bucket, largura/altura, bytes, MIME, estado. Relação com captura, hero ou thumbnails. Alt localizado na associação editorial.
- `import_run`: fonte, hash, estado, contagens e timestamp. Guardar métricas e erros normalizados. `audit_event` registra publicação, arquivamento e importação.

Usar índice parcial para feed publicado em (kind, published_at DESC, id DESC), índice de lookup de tradução e keyset pagination por (published_at, id). Rodar `EXPLAIN (ANALYZE, BUFFERS)` com fixture representativa e registrar resultado. Acesso público recupera apenas registros publicados e projeção permitida.

## Contratos que viram OpenAPI no primeiro PR

| Operação | Semântica |
| --- | --- |
| GET /healthz | Liveness leve, sem I/O |
| GET /readyz | Prazo curto, verifica conexão SQL e compatibilidade do schema implantado |
| GET /v1/content?kind=&locale=&cursor=&limit= | Lista pública, limite 20 padrão / 50 máximo, cursor opaco, nextCursor nullable |
| GET /v1/content/{kind}/{slug}?locale= | Detalhe ativo, 404 para ausente/rascunho |
| POST /v1/admin/imports | Cria lote de preview. Confirmação e publicação em operações distintas |
| POST /v1/admin/media | Upload autenticado de imagem, limitado e com referência retornada |
| POST /v1/admin/content/{id}/publish | Valida, grava em transação e invalida cache de forma recuperável |

Respostas de conteúdo incluem id, kind, slug, title, summary, locale, availableLocales, publishedAt e campos discriminados por kind. Devolver erros em `application/problem+json` com status, code e requestId. Testar idioma inválido, cursor inválido, registros sem tradução, repetição de import e render sanitizado. Definir versionamento da API e o mecanismo de entrega de invalidação no PR de contratos.
