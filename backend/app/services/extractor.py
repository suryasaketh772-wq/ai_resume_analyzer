import re
import spacy

# Load the small English model for NER
try:
    nlp = spacy.load("en_core_web_sm")
except Exception as e:
    nlp = None
    print(f"Warning: Could not load spacy model: {e}")

def extract_contact_info(text: str) -> dict:
    """
    Extracts name, email, and phone number from resume text using NER and Regex.
    """
    info = {
        "name": None,
        "email": None,
        "phone": None
    }
    
    if not text:
        return info
        
    # 1. Extract Email via Regex
    email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    emails = re.findall(email_pattern, text)
    if emails:
        info["email"] = emails[0]
        
    # 2. Extract Phone Number via Regex
    # Matches various formats: (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
    phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    if phones:
        info["phone"] = phones[0]
        
    # 3. Extract Name via Heuristics and spaCy NER
    # Often, the candidate's name is the very first non-empty line of the resume.
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    if lines:
        first_line = lines[0]
        # If the first line is short (1-4 words), has no numbers, and no weird symbols, it's highly likely the name.
        if 0 < len(first_line.split()) <= 4 and not any(char.isdigit() for char in first_line) and len(first_line) < 40:
            # Ignore common headers that might be at the top
            ignore_words = {"resume", "cv", "curriculum vitae", "profile"}
            if first_line.lower() not in ignore_words:
                info["name"] = first_line.title()

    # Fallback to spaCy NER if heuristic didn't find a good name
    if not info["name"] and nlp:
        doc = nlp(text[:1000])
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                name = ent.text.strip().replace('\n', ' ')
                if 3 < len(name) < 30 and any(c.isalpha() for c in name):
                    info["name"] = name.title()
                    break
                    
    return info
