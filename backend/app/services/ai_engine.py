import httpx
import json
from app.services.matcher import calculate_match_score
from app.services.suggester import generate_suggestions

OLLAMA_URL = "http://localhost:11434/api/generate"

def analyze_with_ai_sync(extracted_text: str, required_skills: list[str]) -> dict:
    """Synchronous fallback if needed."""
    pass

async def analyze_with_ai(extracted_text: str, required_skills: list[str]) -> dict:
    """
    Asynchronously sends the resume text and required skills to local Llama 3 via Ollama.
    Falls back to the basic matcher if Ollama is not available or fails.
    """
    prompt = f"""
    You are an expert technical recruiter AI. 
    Review the following resume text and compare it against the required job skills.
    
    Required Skills: {', '.join(required_skills)}
    
    Resume Text:
    {extracted_text[:3000]}  # Limit to avoid token limits just in case
    
    Respond STRICTLY with a valid JSON object matching this exact schema:
    {{
        "score": <a float between 0 and 100 representing how well the resume matches the skills>,
        "missing_skills": [<list of required skills that are NOT found in the resume>],
        "suggestions": [<list of 3 highly personalized, actionable sentences advising the candidate on how to improve their resume based on what's missing>]
    }}
    
    Do NOT wrap the JSON in markdown code blocks. Do not include any other text.
    """
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(OLLAMA_URL, json={
                "model": "llama3",
                "prompt": prompt,
                "stream": False,
                "format": "json"
            }, timeout=30.0)
            
            response.raise_for_status()
            data = response.json()
            result = json.loads(data.get("response", "{}"))
        
        return {
            "score": float(result.get("score", 0)),
            "missing_skills": result.get("missing_skills", []),
            "suggestions": result.get("suggestions", [])
        }
        
    except Exception as e:
        print(f"Ollama AI failed or not installed, falling back to basic matching: {e}")
        # Fallback to the original logic if Ollama isn't running
        extracted_skills = [] # We'd need to pass this or rely on basic logic
        return None
