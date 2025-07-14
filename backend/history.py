import json
import os
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

HISTORY_FILE = "history.json"
router = APIRouter()

class HistoryItem(BaseModel):
    summary: str
    mcqs: list
    createdAt: str
    type: str = "text"
    input: str = ""
    timestamp: str = ""
    userAnswers: list = []
    score: int = 0  # Add score field

def read_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    with open(HISTORY_FILE, "r") as f:
        return json.load(f)

def write_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

@router.get("/", response_model=List[HistoryItem])
def get_history():
    return read_history()

@router.post("/", response_model=dict)
def add_history(item: HistoryItem):
    history = read_history()
    history.insert(0, item.dict())
    write_history(history)
    return {"success": True}

@router.post("/response/{idx}", response_model=dict)
def save_response(idx: int, answers: list):
    history = read_history()
    if idx < 0 or idx >= len(history):
        raise HTTPException(status_code=404, detail="History item not found")
    history_item = history[idx]
    history_item['userAnswers'] = answers
    # Calculate score
    correct = 0
    for i, mcq in enumerate(history_item['mcqs']):
        if i < len(answers) and answers[i] == mcq['answer']:
            correct += 1
    history_item['score'] = correct
    write_history(history)
    return {"success": True, "score": correct}