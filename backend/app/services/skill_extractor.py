import re

SKILL_PATTERNS = {
    "python": r"\bpython[23]?\b",
    "react": r"\breact(?:\.?js)?\b",
    "sql": r"\bsql\b",
    "docker": r"\bdocker\b",
    "fastapi": r"\bfastapi\b",
    "postgresql": r"\bpostgres(?:ql)?\b",
    "javascript": r"\bjavascript\b|\bjs\b",
    "typescript": r"\btypescript\b|\bts\b",
    "html": r"\bhtml5?\b",
    "css": r"\bcss3?\b",
    "java": r"\bjava\b",
    "c++": r"\bc\+\+\b",
    "aws": r"\baws\b",
    "git": r"\bgit\b",
    "kubernetes": r"\bkubernetes\b|\bk8s\b",
    "linux": r"\blinux\b",
    "mongodb": r"\bmongo(?:db)?\b",
    "node.js": r"\bnode(?:\.?js)?\b",
    "django": r"\bdjango\b",
    "flask": r"\bflask\b",
    "rest api": r"\brest(?:ful)?\s+apis?\b",
    "jwt": r"\bjwt\b",
    "redux": r"\bredux\b",
    "tailwind": r"\btailwind(?:\s*css)?\b",
    "responsive design": r"\bresponsive(?:\s+design)?\b"
}

def extract_skills(text: str) -> list[str]:
    """
    Extracts technical skills from text using robust regex patterns 
    to handle variations like HTML5, CSS3, Node.js, Reactjs, etc.
    """
    if not text:
        return []
        
    text_lower = text.lower()
    found_skills = set()
    
    for skill_name, pattern in SKILL_PATTERNS.items():
        if re.search(pattern, text_lower):
            found_skills.add(skill_name)
            
    return list(found_skills)
