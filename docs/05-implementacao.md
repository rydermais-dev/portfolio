# Entregas para os agentes

Cada entrega começa com requisito e contrato escrito, usa uma branch própria e termina com PR revisável, evidências de teste e passagem de contexto. A integração é sequencial após os contratos. Trabalhos independentes podem rodar em paralelo nos diretórios indicados.

| Ordem | Dono da entrega | Depende de | Evidência exigida |
| --- | --- | --- | --- |
| 0 | Coordenação / docs e assets | — | Projeto, recursos, referências e flags verificados. Revisar identidades e escopo de conteúdo com o dono. |
| 1 | Contratos / contracts e docs | 0 | OpenAPI, exemplos, mapa de rotas, fallback de tradução, envelopes de erro e critérios de cache e auth. Fixtures mínimas por kind. |
| 2A | Web / apps/web | 1 | App Router + Bun + Moduix. Shell desktop/mobile, tema/idioma acessíveis e rotas sobre fixtures. Capturas antes/depois da rolagem e do drawer. |
| 2B | API / apps/api | 1 | Axum e SQLx, schema/migrações, consulta indexada, pagination, smoke PG e alguma falha transitória simulada. |
| 3A | Editorial e mídia / apps/api: módulos editoriais | 2B | Upload autenticado, digest, dedupe, limite dimensional, stripping EXIF, variantes e verificação de assets privados. |
| 3B | Importador / apps/api: módulo import | 2B | CSV sintético de cada categoria, preview e conflito preservando edição, lote repetido, evento de auditoria. |
| 4 | Integração / apps/web e apps/api | 2A, 3A, 3B | Trajetória, posts, notícias e certificados atualizam via API; publish/rollback/revalidação e estados vazios cobertos. |
| 5 | Release / Railway e DNS | 4 | Deploy controlado, cold start e smoke, testes de segurança/falha, aceite visual, Go/No-Go e plano de rollback. |

## Sequência de desenvolvimento local

- No painel editorial de projetos, usar o contrato de blocos em [Dados e mídia](03-conteudo.md#estudos-de-caso-dos-projetos). Validar a prévia com o mesmo componente da rota pública e confirmar que reordenar blocos conserva os links internos e que rascunhos ficam fora da saída pública.

- Preparar Docker Compose local, envs de exemplo sem segredos, fixtures versionadas e comandos de diagnóstico no README. Documentar versões exatas de Bun, Next, Moduix e toolchain Rust escolhidas durante o bootstrap de cada app.
- Aplicar migrações e seed local. Rodar format e clippy/test no Rust, typecheck e build de produção na web, e Playwright para rotas, scroll, menu, troca de idioma, links, 404 e limites de mídia. Os testes de contrato precisam usar a mesma OpenAPI e fixtures.
- Antes do release, executar regressão em tema claro/escuro e teclado, simular API/banco indisponíveis, conferir conteúdo rascunho e informações pessoais na saída estática, rever traduções e confirmar que todo link do portfólio leva a uma rota funcional. Metas iniciais para avaliar no preview: LCP ≤2,5 s, CLS ≤0,1 e INP ≤200 ms, observando ambiente e amostra. Medir cold e warm separadamente e registrar resultados.
- No handoff de cada PR, incluir requisitos R01–R05 afetados, arquivos/contratos alterados, checks executados, hipótese ainda pendente e qual entrega pode começar. Mudanças nos contratos entram antes das alterações que os consomem.
