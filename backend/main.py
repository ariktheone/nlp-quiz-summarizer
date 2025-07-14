from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from typing import List, Dict, Any

from summarizer import generate_summary
from mcq_generator import generate_mcqs
from history import router as history_router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(history_router, prefix="/api/history")

class SummarizeRequest(BaseModel):
    text: str

class MCQRequest(BaseModel):
    text: str

@app.post("/api/summarize")
async def summarize_api(req: SummarizeRequest):
    summary = generate_summary(req.text)
    return {"summary": summary}

@app.post("/api/mcqs")
async def mcqs_api(req: MCQRequest):
    mcqs = generate_mcqs(req.text)
    return {"mcqs": mcqs}