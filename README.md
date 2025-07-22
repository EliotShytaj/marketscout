# 📊 TradeTrack

TradeTrack is a personal stock tracking dashboard that visualizes real-time market data. Built with **Spring Boot** and **React**, it helps you monitor portfolio performance in a clean, responsive UI.

---

## 🧰 Tech Stack

### Backend
- Java 17 + Spring Boot
- REST APIs
- PostgreSQL
- Finnhub API
- Spring Security (optional for auth)

### Frontend
- React + Vite
- Tailwind CSS
- DaisyUI
- Axios or React Query

---

## ⚙️ Project Structure

```
tradetrack/
├── backend/ → Spring Boot app
│   ├── src/
│   └── pom.xml
├── frontend/ → React + Vite app
│   ├── src/
│   └── package.json
├── README.md
└── .gitignore
```

---

## 🚀 Local Setup Instructions

### 🔹 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/tradetrack.git
cd tradetrack
```

### 🔹 2. Backend Setup (Spring Boot)
```bash
cd backend
./mvnw spring-boot:run
```

Configure `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tradetrack
spring.datasource.username=YOUR_DB_USER
spring.datasource.password=YOUR_DB_PASS
finnhub.api.key=YOUR_API_KEY_HERE
```

The backend runs at: **http://localhost:8080**

Sample endpoint:
```http
GET /api/hello
returns "Hello from TradeTrack backend!"
```

### 🔹 3. Frontend Setup (React + Vite)
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8080
```

Start the dev server:
```bash
npm run dev
```

The frontend runs at: **http://localhost:5173**

---

## 🌐 Deployment Note

- Never expose your Finnhub API key in the frontend.
- Store it in backend environment variables or secure config.

---

## 📄 License

MIT — Use for personal or educational projects.  
Commercial use may require a separate Finnhub license.

---

## 💬 Contact

Made with 💻 by **Eliot Shytaj**.  
Feel free to fork, contribute, or reach out!