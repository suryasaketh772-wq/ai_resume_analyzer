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
        
    # 3. Extract Name via spaCy NER
    if nlp:
        # Process the first 1000 characters (names are usually at the top)
        doc = nlp(text[:1000])
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                # Basic validation: ensure it looks like a name (2-3 words, no weird characters)
                name = ent.text.strip()
                if 3 < len(name) < 30 and "\n" not in name and any(c.isalpha() for c in name):
                    info["name"] = name
                    break
                    
    return info
