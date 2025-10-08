# 🚀 MarketScout – Yahoo/Finviz-Style Stock Market Platform

**MarketScout** is a full-stack stock market platform with real-time quotes, interactive charts, company news, key metrics, and persistent watchlists. Built with **Next.js 14**, **Spring Boot 3.5**, **PostgreSQL**, **Aceternity UI**, and **Tailwind CSS**.

---

## 📊 What MarketScout Does

- **Search stocks** by symbol or company name (Finnhub API)
- **View real-time quotes** with price changes and market data
- **Interactive charts** with multiple timeframes (1D, 1W, 1M, 6M, 1Y) using Twelve Data
- **Key metrics** including market cap, P/E, P/B, dividend yield, beta, sector, etc.
- **Latest company news** with sources and timestamps
- **Watchlist management** - Create multiple lists, add/remove symbols (PostgreSQL-backed)
- **Dark mode** support with theme toggle
- **Responsive UI** built with Aceternity UI components

---

## 🛠️ Tech Stack

### Backend (Java 17 + Spring Boot 3.5.3)
- **Spring Boot** - REST API framework
- **Spring Data JPA** - ORM with Hibernate
- **PostgreSQL** - Production database
- **Spring Security** - Configured to permit all (no auth for MVP)
- **Caffeine Cache** - In-memory caching for API responses
- **RestTemplate** - HTTP client for external APIs
- **Finnhub API** - Stock quotes, news, metrics, search
- **Twelve Data API** - Historical OHLC chart data

### Frontend (Next.js 14 + TypeScript)
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Aceternity UI** - Modern UI components
- **TanStack Query** - Server state management & caching
- **Axios** - HTTP client
- **Recharts** - Chart library for OHLC data
- **Framer Motion** - Animations
- **Lucide Icons** - Icon library
- **date-fns** - Date formatting

### Deployment Stack
- **Frontend**: Vercel
- **Backend**: Render or Railway
- **Database**: Neon or Supabase (PostgreSQL)

---

## 📁 Project Structure

```
marketscout/
├── backend/                    # Spring Boot application
│   ├── src/main/java/com/marketscout/backend/
│   │   ├── config/            # Security, CORS, Cache config
│   │   ├── controller/        # REST controllers
│   │   ├── dto/               # Data transfer objects
│   │   ├── entity/            # JPA entities
│   │   ├── repository/        # Spring Data repositories
│   │   └── service/           # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/               # Next.js pages (App Router)
│   │   ├── components/        # React components
│   │   ├── lib/               # Utilities & API client
│   │   └── types/             # TypeScript types
│   ├── package.json
│   └── tsconfig.json
├── .env                        # Backend environment variables
└── README.md                   # This file
```

---

## 🚀 Local Development Setup

### Prerequisites

- **Docker** (for PostgreSQL)
- **Java 17+** and **Maven 3.8+**
- **Node.js 18+** and **pnpm** (or npm)
- **API Keys**:
  - [Finnhub API Key](https://finnhub.io/register) (free tier)
  - [Twelve Data API Key](https://twelvedata.com/apikey) (free tier)

---

### 1️⃣ Database Setup (PostgreSQL via Docker)

```bash
# Create persistent volume
docker volume create marketscout_pgdata

# Start PostgreSQL container
docker run --name marketscout-pg \
  -e POSTGRES_USER=marketscoutuser \
  -e POSTGRES_PASSWORD=strong_pw \
  -e POSTGRES_DB=marketscoutdb \
  -p 5432:5432 \
  -v marketscout_pgdata:/var/lib/postgresql/data \
  -d postgres:16

# Verify it's running
docker logs -f marketscout-pg

# Test connection
docker exec -it marketscout-pg psql -U marketscoutuser -d marketscoutdb -c "SELECT 1;"
```

**To stop/start/remove:**
```bash
docker stop marketscout-pg
docker start marketscout-pg
docker rm marketscout-pg  # Removes container (data persists in volume)
```

---

### 2️⃣ Backend Setup (Spring Boot)

**Create `.env` file in project root:**

```bash
# /Users/eliotshytaj/Desktop/marketscout/.env

DB_PASSWORD=strong_pw
FINNHUB_API_KEY=your_finnhub_api_key_here
TWELVEDATA_API_KEY=your_twelvedata_api_key_here
```

**Run the backend:**

```bash
cd backend
mvn clean spring-boot:run
```

Backend runs at **http://localhost:8080**

**Test endpoints:**

```bash
# Health check
curl -i http://localhost:8080/api/market/quote?symbol=AAPL

# Search
curl -i "http://localhost:8080/api/market/search?q=apple"

# Candles
curl -i "http://localhost:8080/api/market/candles?symbol=AAPL&interval=1day&from=2025-06-01&to=2025-07-30"

# Watchlist (create a list)
curl -X POST http://localhost:8080/api/watchlist/add \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","list":"Tech","symbol":"AAPL"}'

# Get watchlists
curl -i "http://localhost:8080/api/watchlist/lists?email=test@example.com"
```

---

### 3️⃣ Frontend Setup (Next.js)

**Create `.env.local` in `frontend/` directory:**

```bash
# frontend/.env.local
NEXT_PUBLIC_API_BASE=http://localhost:8080
```

**Install dependencies and run:**

```bash
cd frontend
pnpm install  # or: npm install

pnpm dev      # or: npm run dev
```

Frontend runs at **http://localhost:3000**

**Pages to test:**
- **Home**: http://localhost:3000 (search stocks)
- **Symbol Detail**: http://localhost:3000/symbol/AAPL
- **Watchlists**: http://localhost:3000/watchlists

---

## 🌐 Production Deployment

### 1. Deploy Database (Neon or Supabase)

**Option A: Neon (Recommended)**

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project named `marketscout`
3. Copy the connection string (format: `postgresql://user:pass@host/db?sslmode=require`)

**Option B: Supabase**

1. Go to [supabase.com](https://supabase.com) and create a project
2. Get the connection string from Settings → Database

---

### 2. Deploy Backend (Render or Railway)

**Option A: Render**

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repo
3. Select `backend` as root directory
4. Build command: `mvn clean package -DskipTests`
5. Start command: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
6. Add environment variables:

```
SPRING_DATASOURCE_URL=jdbc:postgresql://<neon-host>/<db>?sslmode=require
SPRING_DATASOURCE_USERNAME=<neon-user>
SPRING_DATASOURCE_PASSWORD=<neon-password>
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect
SPRING_JPA_HIBERNATE_DDL_AUTO=update
FINNHUB_API_KEY=your_finnhub_key
TWELVEDATA_API_KEY=your_twelvedata_key
```

**Option B: Railway**

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add the same environment variables as above

---

### 3. Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Add environment variable:

```
NEXT_PUBLIC_API_BASE=https://your-backend-url.onrender.com
```

4. Deploy!

**Update CORS**: After deployment, add your Vercel domain to backend's `CorsConfig.java`:

```java
config.setAllowedOriginPatterns(Arrays.asList(
    "http://localhost:3000",
    "https://your-frontend.vercel.app"
));
```

Redeploy backend after CORS update.

---

## 🧪 Testing Production

```bash
# Backend health
curl https://your-backend-url.onrender.com/api/market/quote?symbol=AAPL

# Frontend
open https://your-frontend.vercel.app
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Kill process on port 8080 (backend)
lsof -ti:8080 | xargs kill -9

# Kill process on port 3000 (frontend)
lsof -ti:3000 | xargs kill -9
```

### Database Connection Refused

- Ensure PostgreSQL container is running: `docker ps`
- Check connection: `docker exec -it marketscout-pg psql -U marketscoutuser -d marketscoutdb -c "SELECT 1;"`
- Verify `.env` has correct `DB_PASSWORD`

### Backend API Errors

- Check logs: `mvn spring-boot:run` output
- Verify API keys in `.env`
- Test Finnhub directly: `curl "https://finnhub.io/api/v1/quote?symbol=AAPL&token=YOUR_KEY"`

### Frontend Not Loading Data

- Check console for CORS errors
- Verify `NEXT_PUBLIC_API_BASE` in `.env.local`
- Ensure backend is running and accessible

### Cache Not Working

- Check `CacheConfig.java` is being loaded
- Logs should show: `Creating shared instance of singleton bean 'cacheManager'`

---

## 🎨 Features & API Endpoints

### Market Data API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/market/quote?symbol={SYM}` | GET | Real-time quote |
| `/api/market/candles?symbol={SYM}&interval={INT}&from={DATE}&to={DATE}` | GET | OHLC chart data |
| `/api/market/news?symbol={SYM}&from={DATE}&to={DATE}` | GET | Company news |
| `/api/market/search?q={QUERY}` | GET | Search stocks |
| `/api/market/metrics?symbol={SYM}` | GET | Key metrics |

### Watchlist API

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/watchlist/lists?email={EMAIL}` | GET | List all watchlist names |
| `/api/watchlist/items?email={EMAIL}&list={NAME}` | GET | Get symbols in a list |
| `/api/watchlist/all?email={EMAIL}` | GET | All watchlist entries |
| `/api/watchlist/add` | POST | Add symbol to list |
| `/api/watchlist/remove?email={EMAIL}&list={NAME}&symbol={SYM}` | DELETE | Remove symbol |

---

## 🔄 Caching Strategy

- **Quotes**: 10 seconds (real-time feel)
- **Candles**: 10 minutes (chart data)
- **News**: 5 minutes
- **Search**: 5 minutes
- **Metrics**: 10 minutes

Powered by **Caffeine** cache with in-memory storage.

---

## 🚧 Future Enhancements

- User authentication (Spring Security + JWT)
- Real-time WebSocket updates
- Portfolio tracking with P&L calculations
- Alerts and notifications
- Advanced charting (indicators, overlays)
- Backtesting engine
- Mobile app (React Native)

---

## 📜 License

MIT License - Use for personal or educational projects.

---

## 🙏 Credits

Built with:
- [Finnhub](https://finnhub.io) - Market data API
- [Twelve Data](https://twelvedata.com) - Chart data API
- [Aceternity UI](https://ui.aceternity.com) - UI components
- [Next.js](https://nextjs.org) - React framework
- [Spring Boot](https://spring.io/projects/spring-boot) - Java framework

---

## 💬 Contact

Made with 💻 by **Eliot Shytaj**  
Feel free to fork, contribute, or reach out!

**Final Live URLs** (after deployment):
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.onrender.com or railway.app
