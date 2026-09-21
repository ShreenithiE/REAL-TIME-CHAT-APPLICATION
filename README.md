# ⚡ CodTech AI Support Assistant — Real-Time WebSocket Chatbot

![Python Version](https://img.shields.io/badge/python-3.10%2B-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110%2B-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC?logo=tailwind-css)
![WebSocket](https://img.shields.io/badge/Protocol-WebSocket-informational)
![License](https://img.shields.io/badge/License-MIT-green)

A production-grade, asynchronous real-time support chatbot system developed for the **CODTECH IT Solutions Internship**. Built with a high-throughput **FastAPI ASGI WebSocket** engine on the backend and a modern, glassmorphic **React + Tailwind CSS** frontend using an obsidian and electric violet monochromatic color scheme.

---

## 🌟 Key Features

* **Full-Duplex Asynchronous Communication:** Real-time bi-directional messaging powered by FastAPI native WebSockets (`/ws/bot`).
* **Automated Support Intelligence:** Rule- and pattern-matched NLP triage resolving common queries regarding guidelines, submissions, passwords, and credentials.
* **Modern Purple Monochromatic Glassmorphism:** Custom aesthetic with backdrop blurs, glow layers, fluid entry transitions, and custom-themed scrollbars.
* **Rich Text & Code Formatting:** Inline Markdown rendering powered by `marked.js` with syntax-highlighted code containers.
* **Realistic Typing Simulation:** Dynamic typing indicator emitting states from the backend during response generation.
* **Session Utilities:** One-click chat transcript export (`.txt`) for documentation and conversation reset triggers.

---

## 🏗️ System Architecture

```text
       +---------------------------------------------+
       |               Client Browser                |
       |  (React 18 + Tailwind CSS + Marked.js Engine)|
       +----------------------+----------------------+
                              |
               WebSocket Handshake (ws://)
                              |
       +----------------------v----------------------+
       |               FastAPI Gateway               |
       |           (ASGI Concurrency Core)           |
       +----------------------+----------------------+
                              |
                    Triage & Pattern Engine
                              |
       +----------------------v----------------------+
       |            FAQ Knowledge Base Data          |
       |       (Guidelines, Credentials, Policies)   |
       +---------------------------------------------+


⚙️ Tech Stack
Backend Framework: FastAPI (ASGI)

ASGI Server: Uvicorn

Protocol: WebSockets (ws://)

Frontend UI: React 18, Babel Standalone

Styling Engine: Tailwind CSS, Glassmorphic CSS3

Typography: Plus Jakarta Sans

Markdown Parser: Marked.js



🚀 Getting Started
1. Prerequisites
Python 3.10 or higher installed

Modern Web Browser (Chrome, Edge, Firefox, Brave)

Git installed

2. Clone the Repository
Bash
git clone [https://github.com/your-username/codtech-chatbot.git](https://github.com/your-username/codtech-chatbot.git)
cd codtech-chatbot
3. Set Up Virtual Environment
Bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
4. Install Dependencies
Bash
pip install -r backend/requirements.txt
If requirements.txt is missing, run:

Bash
pip install fastapi "uvicorn[standard]" websockets
5. Launch the Application
Run the FastAPI entry point from the project root:

Bash
python backend/main.py
Visit the running application in your browser at:

Plaintext
[http://127.0.0.1:8000/](http://127.0.0.1:8000/)
