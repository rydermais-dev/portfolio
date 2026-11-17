# Release mínimo

A versão inicial pré-renderiza as rotas públicas com Next.js e Bun. O cabeçalho fica fixo com recortes nas duas pontas. A API Axum privada consulta PostgreSQL para notícias, acessíveis pela web em /api/news. As demais páginas usam dados recuperados do portfólio original; textos editoriais sem tradução são exibidos no idioma original. Os artigos migrados vêm de [Bryceed/markdown-blog](https://github.com/Bryceed/markdown-blog), com o texto de licença preservado em apps/web/content/LICENSE-BLOG.txt.

## Local

Na raiz, para a web:

```powershell
Set-Location apps/web
bun install --frozen-lockfile
bun run dev
bun run build
```

Para testar notícias com banco, use PostgreSQL local, configure DATABASE_URL na API, rode `cargo run --locked --manifest-path apps/api/Cargo.toml` e inicie a web com `API_INTERNAL_URL=http://127.0.0.1:8080`. A primeira inicialização aplica a migração de notícias. O MVP usa uma tabela editorial simples. Administração, upload e compressão no bucket e sincronização LinkedIn ficam para o plano documentado anteriormente.

## Produção

- [Repositório](https://github.com/rydermais-dev/portfolio)
- [Railway](https://railway.com/project/7ccc282c-e748-4fc1-92cd-944cd64b1738)
- [Endereço para validação](https://web-production-ded11945.up.railway.app/about)
- /healthz verifica web. /api/news confirma o caminho web → API privada → PostgreSQL, inclusive com lista vazia.

Deploy manual da raiz com `railway up --service api --environment production` e `railway up --service web --environment production`.

## Troca de origem

1. Confira o ambiente novo, incluindo /about, /projects, /blog, /healthz e /api/news.
2. Consulte `railway domain status portfolio.rydermais.com --json` para os valores atuais do CNAME e TXT. Na zona Cloudflare de rydermais.com, adicione primeiro o TXT `_railway-verify.portfolio`. Preserve o estado do proxy e demais registros da zona.
3. Atualize apenas o CNAME `portfolio` de `cname.vercel-dns.com` para `0h63w2hx.up.railway.app`. Confirme verificação de domínio, certificado HTTPS e as rotas públicas. Controle a janela de propagação com o TTL do próprio registro.
4. Para rollback, restaure o CNAME anterior e mantenha a Vercel disponível até o fim da validação.
