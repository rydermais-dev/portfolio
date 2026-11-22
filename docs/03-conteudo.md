# Conteúdo, LinkedIn e imagens

## Certificados do portfólio

Áreas, tecnologias e termos de busca são mantidos em apps/web/content/certificate-search.ts. A classificação parte dos títulos e dos dados do catálogo. As tecnologias do percurso Frontend da Scrimba constam no [currículo do emissor](https://www.v1.scrimba.com/learn/frontend). As equivalências em outros idiomas são termos de busca.

A coleção cruza os títulos com a [seção de certificações do perfil](https://www.linkedin.com/in/wellnas/details/certifications/) e mantém somente os códigos e destinos externos de verificação exibidos ali. O modal mostra o código e o link quando estão cadastrados. Anexos internos do LinkedIn ficam de fora. Preserve os códigos dos três certificados Recode cujo verificador legado não respondeu e reavalie os links com o emissor antes de exibi-los.

## R04 · Atividade profissional

A abertura pública automatizada do perfil retornou HTTP 999 no pesquisador, então a atividade recente permanece sem verificação. O LinkedIn documenta exportação de posições, certificações e outros dados aplicáveis à conta. A leitura de posts de membro via API requer permissão restrita (`r_member_social`), enquanto `w_member_social` permite escrita. O programa Member Portability informado pelo LinkedIn é voltado a membros EU/EEE/Suíça. Começar com exportação do dono e curadoria de URLs de posts, avaliar sincronização automática após aprovação de API e verificação dos campos disponíveis. [Perfil](https://www.linkedin.com/in/wellnas/) · [Exportação oficial](https://www.linkedin.com/help/linkedin/answer/a1339364/downloading-your-account-data?lang=en) · [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api)

1. Pedir ao dono o recorte de exportação Positions e Certifications na interface oficial e as URLs de posts que deseja destacar. Aceitar o arquivo de compartilhamentos quando presente e com estrutura validada por fixture. Para posts, oferecer também cadastro de URL, data, título e resumo próprio. Renderizar link público e atribuição.
2. Importar por CLI em modo preview com allowlist de arquivos/colunas e validação de codificação, datas e URLs. Se aceitar ZIP, limitar tamanho comprimido e descomprimido e ler só membros esperados. Descartar o bruto após o processamento e a revisão prevista. Ignorar contatos, mensagens, endereços e campos fora do escopo. Separar apenas IDs de credenciais exibidos no perfil e URLs de verificação para revisão editorial.
3. Deduplicar por ID original ou URL normalizada. Para experiências/certificações sem ID, gerar chave estável com campos de identidade e oferecer reconciliação quando mudarem. Importar o mesmo lote duas vezes deve produzir o mesmo resultado. Manter traduções, edições manuais e estado editorial.
4. Mostrar diff de novos/alterados e campos incertos. Criar rascunhos com fonte e data de ingestão. Publicar somente depois de confirmação editorial. Ausência em um export parcial não arquiva registros. A home mostra posts recentes, /about mostra trajetória e /certifications mostra certificações.
5. Futuro conector OAuth: escopo mínimo aprovado, tokens no Railway, revogação supervisada, último sync visível e job agendado que encerra ao concluir. Erros de cota, autenticação ou rede preservam as versões publicadas. Enquanto o conector estiver indisponível, o conteúdo continua atualizável por importação ou curadoria.

## R05 · Publicação e compressão

- Notícias ficam como Markdown, metadados e revisões no PostgreSQL. Capas, screenshots e anexos permitidos ficam no bucket privado. Os SVGs de bandeiras recuperados do código original são assets de build versionados.
- Upload autenticado inicialmente aceita JPEG, PNG ou WebP. Validar assinatura e decodificação real, limite inicial de 8 MiB e 24 MP com rejeição antes da alocação total. Rejeitar SVG enviado, imagens animadas e URLs remotas arbitrárias. Corrigir orientação, remover EXIF/GPS, gerar WebP em 480/960/1600 sem ampliar e manter proporção e alpha quando aplicável. Processar no pool de bloqueio Rust com semáforo inicial de 1. Medir RAM/CPU no Railway antes de aumentar concorrência ou adotar AVIF.
- Calcular digest da variante e usar chave imutável. Upload idempotente, commit do manifesto após todas as variantes, e manutenção de órfãos por comando com dry-run e janela de segurança. Persistir variantes otimizadas por padrão e documentar exceções editoriais para originais. Usar meta operacional inicial de 1 GB e medir volume real. Validar políticas de exclusão e backup do bucket no runbook.
- Para público, web expõe URL estável de variante publicada e redireciona a uma URL S3 pré-assinada, com TTL do redirect inferior ao da assinatura. Servir bytes do bucket e usar srcset/sizes. Validação usa IDs e chaves cadastradas, por estado editorial. Rascunhos ficam em rotas autenticadas. Após despublicar, bloquear novas assinaturas e documentar o prazo máximo das anteriores. [Bucket Railway](https://docs.railway.com/storage-buckets)

## Auditoria de conteúdo e idiomas — 17/11/2026

As capas locais dos projetos, marcas dos emissores e ilustração do perfil de personalidade foram recuperadas do repositório original. O currículo da rota /cv é gerado a partir da trajetória atual e oferece impressão pelo navegador; o teste antigo em /static/mbti-test.html tem JavaScript ofuscado e ainda exige reconstrução e validação antes de ser disponibilizado. O currículo Europass antigo também não foi recriado. Não considerar os applets concluídos.

URLs sem prefixo usam preferência salva ou Accept-Language, preservam caminho e query e não devem ser armazenadas em cache compartilhado. A cobertura de textos não está completa: comparando as 180 chaves de texto do pt-BR com os arquivos originais, faltam en 131, es 143, fr 143, de 130, ja-JP 163, ko 143, ru 130 e pt-PT 140. Essas contagens incluem chaves não necessariamente usadas nas páginas atuais. Trajetória, certificados, blog, parte dos projetos e currículo continuam majoritariamente em português. Traduções editoriais e revisão por idioma permanecem necessárias.

## Estudos de caso dos projetos

O catálogo continua em `apps/web/content/projects.json`. A página de detalhe combina esse registro com o estudo de caso de mesmo `id` em `apps/web/content/project-stories.ts`. As amostras descrevem conceitos e materiais existentes. Revise a narrativa com o dono antes de tratá-la como conteúdo definitivo.

Cada estudo tem categoria traduzível, cor de destaque, temas e uma lista ordenada de blocos. A ordem alimenta a leitura e o índice lateral. Os formatos atuais são `text` (título e parágrafos), `feature` (texto e uma imagem) e `gallery` (uma ou mais imagens). Imagens têm texto alternativo e legenda opcional. A abertura usa título, resumo, capa e links do catálogo. Uma página sem estudo ainda exibe a abertura e a navegação. As amostras têm pt-BR e inglês. Outros idiomas recebem o texto pt-BR com o atributo de idioma correspondente.

No painel, o editor poderá criar, reordenar e remover blocos, editar as traduções e selecionar mídia publicada. IDs de bloco serão únicos por projeto, no formato de slug, e continuarão estáveis quando o título ou a ordem mudar para preservar links diretos. Na API, validar IDs e tipos de bloco, exigir pt-BR nos campos traduzíveis e validar alt, links e referências de mídia. A renderização receberá somente a revisão publicada, com rascunhos e prévia isolados no fluxo editorial autenticado. A fixture atual usa arquivos locais. Na integração, as referências de imagem serão resolvidas para variantes do catálogo de mídia antes de chegar ao componente.

O aceite cobre conteúdo específico de cada projeto, navegação pelo índice e pelo próximo projeto no mesmo idioma, mídia com legendas e texto alternativo, layout móvel sem rolagem horizontal, e links externos exibidos apenas quando cadastrados.
