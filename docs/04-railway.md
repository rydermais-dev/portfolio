# Railway e operação

## Implantado em 16/11/2026

[Portfolio RyderMais](https://railway.com/project/7ccc282c-e748-4fc1-92cd-944cd64b1738), ambiente `production` (`3b039186-30b7-4567-b06a-df57f8d36abd`). Projeto separado para isolar o ciclo de vida do portfólio.

| Recurso | ID | Estado inicial |
| --- | --- | --- |
| Postgres | `1c085d56-b084-4d04-badb-a5414203e050` | PostgreSQL 18, deploy SUCCESS, uma réplica em sfo, volume de 5.000 MB, sem proxy TCP público |
| api | `d58b49ec-1954-411e-90cf-c6c59de0d7c6` | Serviço reservado para Rust, sem código/deploy |
| web | `f40130b6-f30b-4f9a-8bb0-88b4d17a7740` | Serviço reservado para Next.js, sem código/deploy |
| portfolio-media | `d2cd90df-9244-44da-876b-499875d9ab6d` | Bucket privado criado em iad |

Serverless habilitado nos dois serviços, com leitura de retorno pela API Railway. Também foram verificados os diretórios raiz /apps/api e /apps/web e os healthchecks /readyz e /healthz. A latência de cold start será medida com as aplicações implantadas.

Referências configuradas com `railway variable set --skip-deploys`, sem materializar credenciais no repositório. `API_INTERNAL_URL` é apenas para código server-side no Next. O SDK S3 deve seguir o estilo de URL informado pelo bucket.

| Serviço | Variável | Origem |
| --- | --- | --- |
| api | DATABASE_URL | `${{Postgres.DATABASE_URL}}` |
| api | PORT | `8080` |
| api | S3_BUCKET | `${{portfolio-media.BUCKET}}` |
| api | AWS_ENDPOINT_URL_S3 | `${{portfolio-media.ENDPOINT}}` |
| api | AWS_REGION | `${{portfolio-media.REGION}}` |
| api | AWS_ACCESS_KEY_ID | `${{portfolio-media.ACCESS_KEY_ID}}` |
| api | AWS_SECRET_ACCESS_KEY | `${{portfolio-media.SECRET_ACCESS_KEY}}` |
| web | API_INTERNAL_URL | `http://${{api.RAILWAY_PRIVATE_DOMAIN}}:8080` |

## Primeiro deploy

1. Da raiz do repositório, execute `railway link --project 7ccc282c-e748-4fc1-92cd-944cd64b1738 --environment production` e confira `railway service list --json` e `railway bucket list --json`. Use seletores explícitos de serviço. Nunca exiba variáveis resolvidas.
2. Crie Dockerfiles em `apps/api` e `apps/web`, com builds reproduzíveis e lockfiles fixados. A web standalone inclui `.next/static` e `public`. Garanta contextos independentes para evitar builds cruzados. Antes de ligar o autodeploy, confirme os diretórios raiz e healthchecks já configurados e use uma réplica na mesma região do Postgres para os dois serviços. O bucket é acessado pelo endpoint S3, atualmente pela rede pública.
3. Faça um deploy controlado pela CLI antes do GitHub se necessário. Da raiz, `railway up --service api --environment production` envia o monorepo para o serviço cuja raiz já é /apps/api. Faça o equivalente para web após a API ficar pronta. Use uma autoridade de migração separada. Execute migrações aditivas em pre-deploy com lock, teste inicialização em banco limpo e upgrades a partir de versão anterior. Não transfira toda a pasta open-karaoke.
4. Valide a rede privada via web → api e api → PG. Teste uma imagem sintética em prefixo de smoke com upload/leitura/exclusão S3 e confirme que conteúdo de rascunho segue restrito. Configure secrets de produção e timeouts no Railway. Use preview com domínio gerado somente na web e com proteção enquanto houver conteúdo em revisão.
5. Quando existir um repositório GitHub sob conta acessível, autorize o Railway GitHub App nele e conecte os dois serviços a `owner/repo` branch `main`. Configure filtros de caminhos por app com inclusão de arquivos compartilhados usados por ambos. Confirme um único deploy por serviço afetado. [GitHub autodeploys](https://docs.railway.com/deployments/github-autodeploys)
6. Após aceitar o preview, planeje a migração de `portfolio.rydermais.com` com TTL de DNS reduzido, HTTPS, mapa de redirects e verificação de sitemap. Guarde configuração anterior e valide o retorno ao destino antigo em caso de falha. A origem atual segue ativa. O release também precisa de rollback de app compatível com o schema e teste de restauração do banco.

## Custos, suspensão e manutenção

- Verificar Serverless em api e web após o primeiro deploy. A configuração entra em vigor com a criação de um container. Medir cold start após ao menos 10 minutos sem tráfego, anotar p50/p95 e 502 em idle → web → api. Rede privada pode acordar a API. Se a dupla suspensão degradar a experiência, priorizar API suspensa e medir o custo de manter a web ativa ou usar cache público de borda. Evitar pings recorrentes, pooling com atividade periódica e varreduras do bucket a partir de requisições públicas. [Serverless Railway](https://docs.railway.com/deployments/serverless)
- Medir baseline do Postgres sempre ativo, custo de volume, CPU/memórias de runtime e egress. A infra em branco já pode gerar cobrança de banco/armazenamento. O custo do bucket documentado é US$ 0,015/GB-mês e o upload a partir de serviços Railway conta como egress do serviço. Verificar plano e métricas antes de duplicar ambientes ou definir limites. Ativar alerta compatível com o orçamento existente, sem alterar limite global do workspace a partir deste projeto. [Controle de custos](https://docs.railway.com/pricing/cost-control) · [Cobrança de buckets](https://docs.railway.com/storage-buckets/billing)
- Registrar latência, erros, memória e resultados de importação sem registrar segredos, payloads privados ou URLs pré-assinadas. Configurar backup do Postgres e ensaiar restauração isolada. Guardar cópia de objetos e manifesto em destino separado se houver mídia insubstituível. Um bucket Railway não oferece snapshots automáticos. Cron só quando existir integração aprovada, com duração limitada e prevenção de sobreposição.
- Se adotar IaC, importar o estado com CLI e Railway TypeScript SDK, preservar referências de segredos, revisar `railway config plan` e rejeitar substituição inesperada de banco/volume/bucket. Este bootstrap usou CLI e API. [Referência IaC](https://docs.railway.com/infrastructure-as-code/reference)
