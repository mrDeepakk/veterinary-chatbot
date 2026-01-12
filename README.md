# 🐾 Veterinary Chatbot SDK

A production-ready, embeddable veterinary chatbot with **AI-powered pet Q&A** and **conversational appointment booking**.

**Live Demo:**  
https://veterinary-chatbot-c0c8.onrender.com/demo/index.html

---

## 🚀 What this is

This project is a **website-integrated chatbot SDK** for veterinary clinics.  
It can be embedded into **any website** using a single `<script>` tag and provides:

- AI-based answers to veterinary questions  
- Real-time conversational appointment booking  
- Persistent chat & booking storage in MongoDB  

---

## ✨ Features

- 🤖 AI Vet Assistant (Google Gemini)  
- 🐶 Vet-only responses enforced  
- 📅 Conversational appointment booking  
- 🔄 State-machine driven booking flow  
- 💾 MongoDB for chat & appointments  
- 🎨 React floating chat widget  
- 🔌 One-line SDK integration  

---

## 🖥️ Demo

Open the live demo and try:
- “What should I feed my puppy?”
- “My dog is sick”
- “Book an appointment”

👉 https://veterinary-chatbot-c0c8.onrender.com/demo/index.html

---

## 🔌 Website Integration

```html
<script>
  window.VetChatbotConfig = {
    userName: "John",
    petName: "Buddy"
  };
</script>

<script src="https://veterinary-chatbot-c0c8.onrender.com/chatbot.js"></script>
```

## ⚙️ Local Setup

```bash
git clone https://github.com/mrDeepakk/veterinary-chatbot.git

cd veterinary-chatbot/server
npm install

cd ../widget
npm install

cd ../server
cp .env.example .env
# Add GEMINI_API_KEY and MONGODB_URI

npm run dev
```
### Open:
http://localhost:3000/demo

