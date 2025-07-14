import requests
from bs4 import BeautifulSoup
import PyPDF2
from docx import Document
import io
import re

async def process_file(file) -> str:
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        try:
            reader = PyPDF2.PdfReader(io.BytesIO(content))
            text = ''
            for page in reader.pages:
                page_text = page.extract_text() or ''
                text += page_text + '\n'
            return text.strip()
        except Exception as e:
            raise ValueError(f"Error processing PDF: {str(e)}")
    
    elif file.filename.endswith('.docx'):
        try:
            doc = Document(io.BytesIO(content))
            return '\n'.join([para.text for para in doc.paragraphs if para.text.strip()])
        except Exception as e:
            raise ValueError(f"Error processing DOCX: {str(e)}")
    
    elif file.filename.endswith('.txt'):
        try:
            return content.decode('utf-8')
        except UnicodeDecodeError:
            return content.decode('latin-1')
    
    else:
        raise ValueError("Unsupported file type. Please upload PDF, DOCX, or TXT.")

def clean_text(text):
    """Clean and normalize text from HTML"""
    # Remove excessive whitespace and newlines
    text = re.sub(r'\s+', ' ', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Remove special characters except basic punctuation
    text = re.sub(r'[^\w\s.,;:!?\'"-]', '', text)
    return text.strip()

def process_url(url: str) -> str:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()  # Raise error for bad status codes
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove unnecessary elements
        for element in soup(['script', 'style', 'header', 'footer', 'nav', 'aside']):
            element.decompose()
        
        # Extract text from main content areas
        main_content = soup.find_all(['main', 'article', 'div.article', 'div.content'])
        
        if main_content:
            # Get text from the main content areas
            text = ' '.join([clean_text(element.get_text()) for element in main_content])
        else:
            # Fallback to entire body if no main content found
            text = clean_text(soup.get_text())
        
        # Further clean the text
        text = re.sub(r'\s+', ' ', text)  # Collapse multiple spaces
        text = re.sub(r'(\s*\.\s*)+', '. ', text)  # Clean up periods
        
        # Truncate to first 10,000 characters to avoid overly long text
        return text[:10000].strip()
    
    except requests.exceptions.RequestException as e:
        raise ValueError(f"Error fetching URL: {str(e)}")
    except Exception as e:
        raise ValueError(f"Error processing content: {str(e)}")