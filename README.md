This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Prerequisites

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd NEO-tracker
npm ci
```

### Start Redis Cache

Start the Redis Docker container that acts as a read-through cache:

```bash
docker-compose up -d
```

### Start the Application

Once the Redis container is up and running, start the Next.js app:

```bash
npm run dev
```

**Note:** The variables in `.env.local` should ideally come from a secret manager, however, they have been checked in for convenience.

### Access the Application

Navigate to [http://localhost:3000](http://localhost:3000) with your browser to see the result.


