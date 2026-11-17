# Produto e referência

## R01 · Navegação e rolagem

A página publicada /about foi observada no navegador antes e depois de rolar. O menu permanece no topo, com cápsula translúcida, marca “Well”, navegação, idioma e tema. O conteúdo começa com um hero azul e violeta, foto circular e nome. Na rolagem a timeline passa por trás do cabeçalho. O código combina `Menu.vue` sticky com `MenuOverlay.vue` fixo e dois recortes invertidos de 20 px, fora da home. [Site](https://portfolio.rydermais.com/about) · [Menu](https://github.com/Bryceed/portfolio/blob/57e94460f26544d0d5264060a0cd7396e78cb6e8/components/Menu.vue) · [Recorte](https://github.com/Bryceed/portfolio/blob/57e94460f26544d0d5264060a0cd7396e78cb6e8/components/MenuOverlay.vue)

Implementar um layout persistente por idioma, com rolagem do documento e header sticky acima do main. Compartilhar a altura real do header, inclusive safe area, com a camada visual. Pseudo-elementos ou máscaras CSS nas pontas preservam a silhueta enquanto o conteúdo se move, com `pointer-events: none`. Manter `scroll-padding-top` para âncoras, link de pular para o conteúdo e foco visível. Usar superfícies sólidas como fallback de blur. Evitar ancestrais com overflow que mudem o scroll container. Portais do menu de idioma e do drawer ficam acima do header. Tratar Escape, retorno de foco, navegação do drawer e `prefers-reduced-motion`.

Direção visual proposta: base grafite com tema claro equivalente, violeta para navegação ativa, azul profundo no hero e timeline com menos ruído cromático. Usar tokens semânticos do Moduix, Geist para leitura e IBM Plex Mono na marca, sujeitos à revisão visual. Em mobile, condensar navegação em drawer e colocar timeline em coluna única. Preservar a leitura sem rolagem horizontal e usar contraste WCAG AA. Validar referência mobile durante a primeira entrega de UI. Larguras de aceite: 360, 390, 768 e 1440 px, incluindo zoom a 200%, tema claro/escuro e teclado.

## R02 · Inventário e equivalência funcional

| Legado | Reconstrução esperada |
| --- | --- |
| / | Apresentação, destaques de projetos, experiência e atividade recente com links reais |
| /about | Perfil, trajetória profissional e formação, habilidades e seção de personalidade |
| /about/personality-test | Resultado estático com conteúdo aprovado e fonte atribuída |
| /certifications | Lista, emissor, datas e link verificável quando fornecido |
| /projects e /project/:id | Catálogo e detalhe, com demo/repositório quando disponíveis e redirecionamento de IDs legados |
| /blog e /blog/:slug | Listagem e artigo, notícias próprias e referências a publicações públicas |
| /contact | Canais aprovados e links diretos, incluindo LinkedIn |
| rota desconhecida | 404 localizada com retorno à navegação |

Inventariar formulário, CV, atualizações de projeto, Twitch, YouTube e contadores no código original. Preservar as interações relevantes com conteúdo/URLs verificáveis, por exemplo modal de currículo com arquivo publicado ou link funcional. Registrar por feature a decisão de manter, substituir por link ou adiar. A timeline atual serve de ponto de partida sujeito à revisão do dono. [Rotas legadas](https://github.com/Bryceed/portfolio/tree/57e94460f26544d0d5264060a0cd7396e78cb6e8/pages)

## R03 · Idiomas

O repositório tem 9 arquivos de mensagens: pt-BR, pt, en, es, fr, de, ja-JP, ko e ru. Preservar a cobertura, normalizando `pt` legado para pt-PT e mantendo as demais tags. O seletor deve mostrar autônimos com bandeiras decorativas e nomes legíveis. Brasil, Portugal, EUA, Espanha, França, Alemanha, Japão, Coreia do Sul e Rússia cobrem o conjunto inicial. Canadá, Itália e China ficam disponíveis como assets e entram no seletor quando houver mensagens validadas. [Mensagens originais](https://github.com/Bryceed/portfolio/tree/57e94460f26544d0d5264060a0cd7396e78cb6e8/locales)

Usar URLs com prefixo de idioma e pt-BR como padrão para URLs legadas, preservando query e seção quando possível. A troca de idioma preserva a entidade e usa desvio explícito para a versão original quando a tradução faltar. Usar `lang` no documento e nos trechos em idioma diferente, `Intl` para datas e números, URLs canônicas e hreflang para versões publicadas. Manter mapa completo de rotas antigas e verificar refresh/deep links. Datas sem dia usam precisão de mês/ano e nunca ganham dia inventado.

## Experiências e identidade visual

A página inicial apresenta uma seleção interativa de CodeHouse, SingAlong! e RyderMais, com botões Moduix e links diretos. A seção usa português identificado por `lang` enquanto traduções editoriais não estiverem disponíveis. A tipografia Inter Variable é distribuída pelo pacote local `@fontsource-variable/inter`. A trajetória inclui CSP Tech e datas de TI Safe e MAG conferidas no LinkedIn em novembro de 2026. Sincronização automática permanece pendente.

## Linguagem visual das páginas

O cabeçalho com recortes permanece comum às rotas. Perfil, catálogo, projetos e contatos compartilham tipografia Inter Variable, espaçamento, cores e estados de foco. Cada projeto recebe uma cor de abertura e uma transição respeita a preferência por movimento reduzido. Páginas de projeto oferecem retorno ao catálogo e links disponíveis. Verificar páginas claras e escuras, teclado, dimensões móveis e desktop em cada alteração visual.

## Interações recuperadas

A timeline de /about agrupa eventos por ano e usa marcadores coloridos, etiquetas de competências, localização e vínculo recuperados de `data/timeline.json` do repositório original. Contato reúne e-mail, WhatsApp, LinkedIn, GitHub e Instagram. Cartões de projetos e certificações respondem ao ponteiro com inclinação; o hero da home desenha uma malha de pontos e conexões próximas ao mouse e os controles recebem iluminação localizada. A malha desenha apenas quando necessário; toque tem estado estático e a preferência por movimento reduzido desativa os movimentos. Currículos antigos não foram republicados sem revisão.
