# 🐾 Veterinary Chatbot SDK

Production-grade, embeddable chatbot for veterinary clinics with AI-powered question answering and conversational appointment booking.

## 🚀 Quick Start

```bash
# 1. Install dependencies
cd server
npm install

cd ../widget
npm install

# 2. Set up environment
cd ../server
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY and MONGODB_URI

# 3. Run the server (auto-builds everything!)
npm run dev
```

Visit **http://localhost:3000/demo/** to see the chatbot in action!

### 🐳 Quick Start with Docker

```bash
# 1. Create environment file
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# 2. Start with Docker Compose
docker-compose up -d

# 3. Access the demo
# http://localhost:3000/demo/
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete Docker deployment guide.

### 🌐 Deploy to Render

```bash
# 1. Build widget locally
cd server && npm run build

# 2. Commit build artifacts
git add public/ && git commit -m "Build widget"

# 3. Push to trigger Render deployment
git push origin main
```

See [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) for complete Render deployment guide.

---

## ✨ Features

- 🤖 **AI-Powered Q&A** - Google Gemini integration for veterinary questions
- 📅 **Appointment Booking** - Full conversational booking flow
- 🔄 **State Machine** - Robust booking state management
- 💾 **MongoDB Storage** - Persistent conversations and appointments
- 🎨 **React Widget** - Beautiful floating chat interface
- 🔌 **Easy Integration** - Single script tag to embed anywhere

---


## 🔧 Development

### Run Development Server
```bash
cd server
npm run dev
```
✅ Auto-builds widget and SDK loader  
✅ Starts server with hot-reload  
✅ Available at http://localhost:3000

### Build Only
```bash
cd server
npm run build
```

### Widget Development
```bash
# Terminal 1 - Widget dev server
cd widget
npm start

# Terminal 2 - Backend server
cd server
npm run dev
```

---

## 🔌 Integration

Add the chatbot to any website:

```html
<!-- Optional: Configure chatbot -->
<script>
  window.VetChatbotConfig = {
    userId: "user_123",
    userName: "John",
    petName: "Buddy"
  };
  
  window.VET_CHATBOT_API_URL = "http://localhost:3000";
  window.VET_CHATBOT_WIDGET_URL = "http://localhost:3000/widget.js";
</script>

<!-- Load chatbot SDK -->
<script src="http://localhost:3000/chatbot.js"></script>
```

That's it! The floating button will appear automatically.

---

## 📚 API Endpoints

### Chat
- `POST /api/chat/message` - Send message to chatbot
- `GET /api/chat/history/:sessionId` - Get conversation history

### Appointments
- `POST /api/appointment/book` - Book appointment (legacy)
- `GET /api/appointment/:sessionId` - Get appointments for session

### Health
- `GET /health` - Server health check

---

## 🛠️ Technologies

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Google Gemini AI
- Chrono-node (date parsing)

**Frontend:**
- React
- Webpack
- CSS-in-JS

**Architecture:**
- State machine pattern
- Service layer architecture
- Conversation persistence
- Session management

**Docker & Deployment:**
- Multi-stage Docker builds
- Docker Compose orchestration
- Production-ready configurations
- Health checks & monitoring

---


---

## 🔐 Environment Variables

Create `.env` in the `server/` directory:

```env
# Required
GEMINI_API_KEY=your_gemini_api_key_here
MONGODB_URI=mongodb://localhost:27017/veterinary-chatbot

# Optional
PORT=3000
NODE_ENV=development
CORS_ORIGIN=*
```

---

## 🧪 Testing

Try these messages in the demo:

**AI Questions:**
- "What should I feed my puppy?"
- "How often should I vaccinate my dog?"
- "My cat is not eating, what should I do?"

**Booking:**
- "I want to book an appointment"
- "Schedule a visit"
- "My pet is sick" (triggers booking)

**Validation Tests:**
- Invalid name: "John123" (rejects numbers)
- Invalid phone: "abc" (validates format)
- Past date: "Yesterday at 4pm" (requires future date)

---


## 🤝 Contributing

This is a production-ready SDK. Feel free to extend it with:
- Additional booking features (cancellation, rescheduling)
- Email/SMS notifications
- Multi-language support
- Custom theming
- More AI capabilities

---
