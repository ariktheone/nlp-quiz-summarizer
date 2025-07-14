import os
import requests
from dotenv import load_dotenv
import json

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent"  # Use gemini-1.5-flash model
LIST_MODELS_URL = "https://generativelanguage.googleapis.com/v1/models"

def list_gemini_models():
    if not GEMINI_API_KEY:
        raise ValueError("Gemini API key is missing.")
    params = {"key": GEMINI_API_KEY}
    response = requests.get(LIST_MODELS_URL, params=params)
    response.raise_for_status()
    return response.json()

def generate_mcqs_with_gemini(text: str, num_questions: int = 5):
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your-gemini-api-key-here":
        raise ValueError("Gemini API key is missing or not set. Please add GEMINI_API_KEY to your .env file.")
    prompt = f"""
You are an expert quiz generator. Read the following text and generate {num_questions} multiple choice questions (MCQs). For each question, provide:
- question: The question text
- options: Four options (one correct, three plausible distractors)
- answer: The correct option
Return the result as a JSON array of objects with keys: question, options, answer.
Text:
{text}
"""
    headers = {"Content-Type": "application/json"}
    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.7, "maxOutputTokens": 1024}
    }
    params = {"key": GEMINI_API_KEY}
    try:
        response = requests.post(GEMINI_API_URL, headers=headers, params=params, json=data)
        response.raise_for_status()
        result = response.json()
        candidates = result.get("candidates", [])
        if not candidates:
            raise ValueError("No candidates returned from Gemini API. Check your API key and quota.")
        text_response = candidates[0]["content"]["parts"][0]["text"]
        start = text_response.find('[')
        end = text_response.rfind(']') + 1
        mcq_json = text_response[start:end]
        return json.loads(mcq_json)
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            print("Gemini model not found. Listing available models:")
            models = list_gemini_models()
            print(json.dumps(models, indent=2))
            raise RuntimeError(f"Gemini API error: {e.response.text}\nSee available models above and update GEMINI_API_URL accordingly.")
        raise RuntimeError(f"Gemini API error: {e.response.text}")
    except Exception as e:
        raise RuntimeError(f"Gemini MCQ generation failed: {str(e)}")
