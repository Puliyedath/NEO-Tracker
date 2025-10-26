# Redis Setup Guide

## Docker Compose Configuration

A `docker-compose.yml` file has been created with Redis configured for persistence.

## Environment Variables

Add the following to your `.env.local` file in the root of the project:

```env
# NASA API Configuration
NASA_API_KEY=your_nasa_api_key_here

# Redis Configuration
REDIS_URL=redis://localhost:6379
```

## Starting Redis

To start the Redis container:

```bash
docker-compose up -d
```

## Stopping Redis

To stop the Redis container:

```bash
docker-compose down
```

## Viewing Redis Logs

```bash
docker-compose logs -f redis
```

## Redis Persistence

The Redis instance is configured with:

- **AOF (Append Only File)** persistence enabled
- **Append sync**: Every second (good balance between performance and safety)
- **Volume**: `redis-data` for persistent storage

Data will persist across container restarts.

## Connecting to Redis

You can connect to Redis using the Redis CLI:

```bash
docker exec -it neo-tracker-redis redis-cli
```

Or from your application using the `REDIS_URL` environment variable.

## Health Check

The container includes a health check that pings Redis every 10 seconds to ensure it's running properly.
