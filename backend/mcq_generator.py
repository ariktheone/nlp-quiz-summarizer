import spacy
from transformers import T5ForConditionalGeneration, T5Tokenizer
from google_api import validate_answer
from typing import List, Dict

nlp = spacy.load("en_core_web_sm")
model = T5ForConditionalGeneration.from_pretrained('valhalla/t5-base-qg-hl')
tokenizer = T5Tokenizer.from_pretrained('valhalla/t5-base-qg-hl')

def generate_question(context: str, answer: str) -> str:
    input_text = f"generate question: {answer} </s> {context}"
    inputs = tokenizer(input_text, return_tensors="pt", max_length=512, truncation=True)
    outputs = model.generate(**inputs, max_length=64, num_beams=4)
    return tokenizer.decode(outputs[0], skip_special_tokens=True)

def generate_mcqs(text: str, num_questions=5) -> List[Dict[str, any]]:
    doc = nlp(text)
    mcqs = []
    entities = [ent.text for ent in doc.ents if ent.label_ in ['PERSON', 'ORG', 'GPE', 'DATE']][:num_questions]
    
    for entity in entities:
        question = generate_question(text, entity)
        options = [ent.text for ent in doc.ents if ent.label_ != 'DATE'][:3] + [entity]
        mcqs.append({
            "question": question,
            "options": list(set(options))[:4],  # Ensure 4 unique options
            "answer": entity,
            "source_verified": validate_answer(question, entity)
        })
    return mcqs