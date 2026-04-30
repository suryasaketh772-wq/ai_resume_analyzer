def calculate_match_score(extracted_skills: list[str], required_skills: list[str]) -> dict:
    """
    Compares extracted skills with required role skills and returns match details.
    """
    extracted_set = set([s.lower() for s in extracted_skills])
    required_set = set([s.lower() for s in required_skills])
    
    if not required_set:
        return {
            "score": 0.0,
            "found_skills": [],
            "missing_skills": []
        }
        
    found_skills = list(required_set.intersection(extracted_set))
    missing_skills = list(required_set.difference(extracted_set))
    
    score = (len(found_skills) / len(required_set)) * 100.0
    
    return {
        "score": round(score, 2),
        "found_skills": found_skills,
        "missing_skills": missing_skills
    }
