from transformers import pipeline
import nltk
from nltk.corpus import stopwords
import re

nltk.download('stopwords')
nltk.download('punkt')

def preprocess_text(text: str) -> str:
    text = re.sub(r'\s+', ' ', text)
    sentences = nltk.sent_tokenize(text)
    return ' '.join(sentences[:10])  # First 10 sentences for efficiency

def generate_summary(text: str, model_name="facebook/bart-large-cnn") -> str:
    text = preprocess_text(text)
    summarizer = pipeline("summarization", model=model_name)
    result = summarizer(text, max_length=150, min_length=30, do_sample=False)
    return result[0]['summary_text']