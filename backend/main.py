from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from typing import List, Dict, Any

# Load modules
from summarizer import generate_summary
from mcq_generator import generate_mcqs
from utils import process_file, process_url

load_dotenv()

app = FastAPI()

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

@app.post("/summarize")
async def summarize(request: TextRequest):
    return {"summary": generate_summary(request.text)}

@app.post("/mcqs")
async def mcqs(request: TextRequest):
    return {"mcqs": generate_mcqs(request.text)}

@app.post("/process-file")
async def process_file_route(file: UploadFile = File(...)):
    try:
        text = await process_file(file)
        return {
            "summary": generate_summary(text),
            "mcqs": generate_mcqs(text)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/process-url")
async def process_url_route(request: URLRequest):
    try:
        text = process_url(request.url)
        return {
            "summary": generate_summary(text),
            "mcqs": generate_mcqs(text)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)