⚛️ TradeTrack Frontend Setup
This is the frontend of TradeTrack, a personal stock and trade tracking dashboard. Built with Vite + React + Tailwind CSS, it visualizes real-time market data and provides a clean UI for monitoring portfolio performance.

🧰 Tech Stack
React

Vite

Tailwind CSS

DaisyUI (optional UI components)

Axios (for API calls)

🚀 Local Setup Instructions
1. Clone the repo
bash
Copy
Edit
git clone https://github.com/YOUR_USERNAME/tradetrack.git
cd tradetrack/frontend
2. Install dependencies
bash
Copy
Edit
npm install
3. Set environment variables
Create a .env file in the frontend/ folder:

bash
Copy
Edit
VITE_API_URL=http://localhost:8080
If you're not using a backend yet, this can point to a placeholder.

4. Start the development server
bash
Copy
Edit
npm run dev
The app should open at:
http://localhost:5173

📁 Folder Structure
bash
Copy
Edit
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.cjs
├── .env
└── package.json
🧠 Notes
Tailwind is already configured with PostCSS and DaisyUI.

You can start creating pages in src/pages/ and components in src/components/.

Make sure your backend API (e.g. Spring Boot) matches the VITE_API_URL in .env.
