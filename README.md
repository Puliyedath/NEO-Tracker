This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Clone the repository:

```bash
git clone <repository-url>
cd NEO-tracker
```

### Configure Environment Variables

Create a `.env.local` file in the root directory of the project:

```bash
touch .env.local
```

Add the following environment variables to the `.env.local` file:

```
REDIS_URL=redis://localhost:6379
NASA_API_KEY=lTHPxbpwqnn3thI5aiCieLtOpT1MZ85pxbkRI9tN
```

**⚠️ DISCLAIMER:** The NASA API key provided above is for demonstration purposes only. In a production environment, sensitive credentials should **never** be committed to version control and should be managed through a secure secret management system (e.g., AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or environment-specific CI/CD secrets).

### Install Dependencies

Install the required Node.js packages:

```bash
npm ci
```

### Start Redis Cache

Start the Redis Docker container that acts as a read-through cache:

```bash
docker-compose up -d
```

Wait for the container to be fully up and running by tailing the logs:

```bash
docker-compose logs -f redis
```

Once you see the message `Ready to accept connections`, the Redis cache is ready. Press `Ctrl+C` to exit the logs.

### Start the Application

Once the Redis container is up and running, start the Next.js app:

```bash
npm run dev
```

### Access the Application

Navigate to [http://localhost:3000](http://localhost:3000) with your browser to see the result.


