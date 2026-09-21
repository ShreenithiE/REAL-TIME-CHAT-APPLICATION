import asyncio
import json
import os
import re
import uuid
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="CodTech AI Chatbot")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve path to the frontend directory
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "frontend"))

# Mount the static directory so style.css and app.js load properly without 404 errors
app.mount("/static", StaticFiles(directory=BASE_DIR), name="static")

@app.get("/")
async def serve_frontend():
    index_file = os.path.join(BASE_DIR, "index.html")
    if not os.path.exists(index_file):
        raise HTTPException(
            status_code=404,
            detail=f"index.html not found. Looked in: {index_file}"
        )
    return FileResponse(index_file)

# Knowledge Base Dictionary
FAQ_DATABASE = [
    {
        "keywords": [r"\bhi\b", r"\bhello\b", r"\bhey\b"],
        "reply": "Hello! I am your **CodTech AI Assistant**. How can I assist you with your project or task today?"
    },
    {
        "keywords": [r"format", r"submission", r"code format"],
        "reply": "Here is the recommended task submission format:\n\n```markdown\n## Project Title\n- **Intern Name**: Your Name\n- **Domain**: Web Development / AI\n- **Deliverables**: Code Repository & Video Link\n```"
    },
    {
        "keywords": [r"password", r"reset", r"forgot", r"create.*password"],
        "reply": "To configure or reset your password securely:\n1. Open **Settings > Security**\n2. Select **Change Password**\n3. Use at least 8 characters including 1 uppercase, 1 number, and 1 symbol."
    },
    {
        "keywords": [r"internship", r"task", r"guidelines"],
        "reply": "Key internship guidelines:\n* Push your completed source code to a public GitHub repository.\n* Include a comprehensive `README.md` with setup instructions.\n* Record a short demo video showcasing your working application.\n* Submit before your batch deadline via the official portal."
    },
    {
        "keywords": [r"certificate", r"completion", r"offer letter"],
        "reply": "Completion certificates are reviewed and dispatched within **3 to 5 business days** following successful project evaluation."
    },
    {
        "keywords": [r"contact", r"mentor", r"support", r"email"],
        "reply": "You can reach our mentors directly through the official support desk or email us at `support@codtech.com`."
    }
]

def generate_bot_response(user_message: str) -> str:
    cleaned = user_message.lower()
    for entry in FAQ_DATABASE:
        for pattern in entry["keywords"]:
            if re.search(pattern, cleaned):
                return entry["reply"]
    return "I'm not sure about that specific query yet. Please check your official task documentation or reach out at `support@codtech.com`!"

@app.websocket("/ws/bot")
async def bot_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            raw_text = await websocket.receive_text()
            data = json.loads(raw_text)
            user_text = data.get("message", "").strip()

            if not user_text:
                continue

            # 1. Echo user message back to the client
            await websocket.send_text(json.dumps({
                "id": str(uuid.uuid4())[:8],
                "sender": "user",
                "text": user_text
            }))

            # 2. Trigger typing indicator
            await websocket.send_text(json.dumps({
                "type": "typing",
                "is_typing": True
            }))

            # 3. Simulate processing latency
            await asyncio.sleep(0.7)

            # 4. Return bot answer
            bot_reply = generate_bot_response(user_text)
            await websocket.send_text(json.dumps({
                "id": str(uuid.uuid4())[:8],
                "sender": "bot",
                "text": bot_reply
            }))

            # Turn off typing indicator
            await websocket.send_text(json.dumps({
                "type": "typing",
                "is_typing": False
            }))

    except WebSocketDisconnect:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)