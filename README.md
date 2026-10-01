# AHE Global Enterprise

A responsive Flask website for AHE Global Enterprise's solar products, installation support, and international container trade.

## Run the full stack with Docker Compose

Requirements: Docker Engine with the Docker Compose plugin.

1. Create a local environment file and replace the placeholders with unique values for `SECRET_KEY`, `DB_PASSWORD`, and `MYSQL_ROOT_PASSWORD`. Use different passwords for the application user and MySQL root. Compose will stop with a clear error until the database passwords are set:

   ```bash
   cp .env.example .env
   ```

   Generate secure values with `openssl rand -hex 32` (run it separately for each secret), then paste them into `.env`. Do not commit `.env`; it is excluded by `.gitignore`.

2. Build and start the app, MySQL, and Nginx:

   ```bash
   docker compose up --build -d
   ```

3. Open http://localhost:8080.

Set these credentials before the first start. MySQL keeps its initialized credentials in the persistent `mysql_data` volume.

Compose attaches the local Nginx configuration to the Nginx container using a read-only bind mount in `docker-compose.yml`:

```yaml
./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
```

`docker compose up --build -d` applies this mount when it creates the Nginx container. The Nginx config stays on your machine, so you can edit it without rebuilding the image.

The same Compose service bind-mounts `./static` so Nginx can serve the site’s images, CSS, and JavaScript directly. Edit `nginx/default.conf`, then apply a config change with:

```bash
docker compose restart nginx
```

Useful commands:

```bash
docker compose logs -f
docker compose down
```

MySQL data persists in the `mysql_data` Docker volume when you stop the stack with `docker compose down`.

## Run Flask locally without Docker

1. Create and activate a virtual environment: `python3 -m venv .venv` then `source .venv/bin/activate`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Configure MySQL, copy `.env.example` to `.env`, and set your database credentials.
4. Run `python app.py` and open http://127.0.0.1:5000.

The contact form creates its `enquiries` table automatically on the first successful submission. Replace the sample `hello@aheglobal.com` address in `templates/base.html` and `templates/contact.html` before sharing the site.
