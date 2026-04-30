import spacy

# Try loading the model, fallback to downloading if not available
try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    import spacy.cli
    spacy.cli.download("en_core_web_sm")
    nlp = spacy.load("en_core_web_sm")

PREDEFINED_SKILLS = {
    "python", "react", "sql", "docker", "fastapi", "postgresql",
    "javascript", "typescript", "html", "css", "java", "c++", 
    "aws", "git", "kubernetes", "linux", "mongodb", "node.js"
}

def extract_skills(text: str) -> list[str]:
    """
    Extracts predefined technical skills from text using spaCy.
    """
    if not text:
        return []
        
    # Process the text with spaCy
    doc = nlp(text.lower())
    
    found_skills = set()
    
    # Iterate through the tokens to find matching skills
    for token in doc:
        word = token.text
        if word in PREDEFINED_SKILLS:
            found_skills.add(word)
            
    return list(found_skills)
