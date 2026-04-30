import os
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path: str) -> str:
    """
    Extracts all text from a given PDF file using PyPDF2.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found at {file_path}")
        
    text_content = []
    try:
        reader = PdfReader(file_path)
        for page in reader.pages:
            extracted = page.extract_text()
            if extracted:
                text_content.append(extracted)
        return "\n".join(text_content)
    except Exception as e:
        raise Exception(f"Error parsing PDF: {str(e)}")
