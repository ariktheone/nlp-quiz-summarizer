import spacy
from transformers import T5ForConditionalGeneration, T5Tokenizer
from gemini_api import generate_mcqs_with_gemini
from google_api import validate_answer
from typing import List

nlp = spacy.load("en_core_web_sm")
model = T5ForConditionalGeneration.from_pretrained('valhalla/t5-base-qg-hl')
tokenizer = T5Tokenizer.from_pretrained('valhalla/t5-base-qg-hl')

def generate_question(context: str, answer: str) -> str:
    input_text = f"generate question: {answer} </s> {context}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(**inputs, max_length=64, num_beams=4)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def generate_mcqs(text: str, num_questions=5) -> List[dict]:
    mcqs = generate_mcqs_with_gemini(text, num_questions)
    # Optionally validate with Google
    for mcq in mcqs:
        mcq["source_verified"] = validate_answer(mcq["question"], mcq["answer"])
    return mcqs