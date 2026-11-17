use axum::{Json, Router, extract::State, http::StatusCode, routing::get};
use serde::Serialize;
use sqlx::{PgPool, postgres::PgPoolOptions};
use std::{env, time::Duration};
use tokio::net::TcpListener;

#[derive(Serialize, sqlx::FromRow)]
struct News {
    slug: String,
    title: String,
    summary: String,
    url: String,
}

async fn ready(State(pool): State<PgPool>) -> StatusCode {
    match sqlx::query_scalar::<_, i32>("SELECT 1").fetch_one(&pool).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::SERVICE_UNAVAILABLE,
    }
}

async fn news(State(pool): State<PgPool>) -> Result<Json<Vec<News>>, StatusCode> {
    sqlx::query_as(
        "SELECT slug, title, summary, url FROM news
         WHERE published_at <= now()
         ORDER BY published_at DESC, slug LIMIT 30",
    )
    .fetch_all(&pool)
    .await
    .map(Json)
    .map_err(|_| StatusCode::SERVICE_UNAVAILABLE)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let database_url = env::var("DATABASE_URL")?;
    let pool = PgPoolOptions::new()
        .min_connections(0)
        .max_connections(5)
        .acquire_timeout(Duration::from_secs(3))
        .idle_timeout(Duration::from_secs(60))
        .connect_lazy(&database_url)?;
    sqlx::migrate!().run(&pool).await?;

    let port = env::var("PORT").unwrap_or_else(|_| "8080".into()).parse()?;
    let listener = TcpListener::bind((std::net::Ipv6Addr::UNSPECIFIED, port)).await?;
    let app = Router::new()
        .route("/healthz", get(|| async { StatusCode::NO_CONTENT }))
        .route("/readyz", get(ready))
        .route("/v1/news", get(news))
        .with_state(pool);
    println!("portfolio-api listening on port {port}");
    axum::serve(listener, app).await?;
    Ok(())
}
