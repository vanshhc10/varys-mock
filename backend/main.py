from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import httpx
import json
from typing import List, Dict, AsyncGenerator

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

async def stream_ollama_response(messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
    async with httpx.AsyncClient() as client:
        # Prepare the request to Ollama
        ollama_request = {
            "model": "llama3.2:3b",
            "messages": messages,
            "stream": True
        }
        
        async with client.stream(
            "POST",
            "http://127.0.0.1:11434/api/chat",
            json=ollama_request,
            timeout=None  # Disable timeout for streaming
        ) as response:
            async for line in response.aiter_lines():
                if line:
                    try:
                        chunk = json.loads(line)
                        if "error" in chunk:
                            yield f"Error: {chunk['error']}\n"
                            break
                        if "content" in chunk.get("message", {}):
                            yield chunk["message"]["content"]
                    except json.JSONDecodeError:
                        yield "Error: Invalid JSON response from Ollama\n"

@app.post("/chat")
async def chat(request: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        stream_ollama_response([msg.dict() for msg in request.messages]),
        media_type="text/plain"
    )

@app.get("/")
async def root() -> Dict[str, str]:
    return {
        "status": "ok",
        "message": "Varys Chat API is running. Use /chat for chat completion."
    }

@app.get("/health")
async def health_check() -> Dict[str, str]:
    try:
        # Try to connect to Ollama to check if it's running
        async with httpx.AsyncClient() as client:
            response = await client.get("http://127.0.0.1:11434/api/version")
            if response.status_code == 200:
                return {"status": "healthy", "ollama": "connected"}
            return {"status": "unhealthy", "ollama": "not responding"}
    except:
        return {"status": "unhealthy", "ollama": "not running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
