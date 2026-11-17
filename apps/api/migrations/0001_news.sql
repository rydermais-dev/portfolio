CREATE TABLE news (
    slug text PRIMARY KEY CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
    title text NOT NULL,
    summary text NOT NULL,
    url text NOT NULL CHECK (url LIKE 'https://%'),
    published_at timestamptz
);

CREATE INDEX news_published ON news (published_at DESC, slug) WHERE published_at IS NOT NULL;
