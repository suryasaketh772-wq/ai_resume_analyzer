def generate_suggestions(missing_skills: list[str], score: float, extracted_text: str) -> list[str]:
    """
    Generates actionable resume improvement suggestions based on matched metrics and text content.
    """
    suggestions = []
    
    # 1. Missing skills suggestions
    if missing_skills:
        for skill in missing_skills:
            # Format the skill nicely (e.g., "node.js" -> "Node.js")
            formatted_skill = skill.title() if len(skill) > 3 else skill.upper()
            suggestions.append(f"Add {formatted_skill} experience or coursework to your resume.")
            
    # 2. Score-based suggestions
    if score < 50.0:
        suggestions.append("Your resume is missing several core requirements. Consider tailoring your experience section to highlight these key areas.")
    elif score < 80.0:
        suggestions.append("You have a solid foundation! To increase your match rate, make sure you explicitly mention the missing technical skills.")
        
    # 3. Missing certifications
    text_lower = extracted_text.lower() if extracted_text else ""
    cert_keywords = ["certification", "certified", "certificate", "aws certified", "azure", "pmp", "scrum"]
    has_cert = any(keyword in text_lower for keyword in cert_keywords)
    if not has_cert:
        suggestions.append("Include relevant certifications (e.g., AWS, Azure, Scrum) if you have them, as they help validate your skills.")
        
    # 4. Missing projects
    project_keywords = ["project", "projects", "github.com", "portfolio", "deployed"]
    has_project = any(keyword in text_lower for keyword in project_keywords)
    if not has_project:
        suggestions.append("Mention specific hands-on projects (like backend or deployment projects) and link to your GitHub to demonstrate practical experience.")
        
    return suggestions
