import os
import requests
from dotenv import load_dotenv

load_dotenv()

def validate_answer(question: str, answer: str) -> bool:
    API_KEY = os.getenv("GOOGLE_API_KEY")
    CX = os.getenv("GOOGLE_CX")
    url = f"https://www.googleapis.com/customsearch/v1?q={question}&key={API_KEY}&cx={CX}"
    
    try:
        response = requests.get(url)
        results = response.json().get('items', [])[:3]  # Top 3 results
        for item in results:
            snippet = item.get('snippet', '').lower()
            if answer.lower() in snippet:
                return True
        return False
    except:
        return False  # Fail-safe