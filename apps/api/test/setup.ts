// Workers re-import modules per file. Re-hydrate DATABASE_URL from globalSetup.
if (!process.env.DATABASE_URL && process.env.__PG_CONTAINER_URL__) {
  process.env.DATABASE_URL = process.env.__PG_CONTAINER_URL__;
}
