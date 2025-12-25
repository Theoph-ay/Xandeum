import re
from fastapi import HTTPException
from dotenv import load_dotenv

load_dotenv(override=True)

def validate_input(query: str):
    """
    Validates the user input for prompt injection and illegal content.
    Raises HTTPException if a violation is detected.
    """
    
    # 1. Heuristic Checks for Common Prompt Injection Patterns
    injection_patterns = [
        r"ignore previous instructions",
        r"system prompt",
        r"delete everything",
        r"drop table",
        r"update user set role",
        r"forget your instructions"
    ]
    
    for pattern in injection_patterns:
        if re.search(pattern, query, re.IGNORECASE):
             print(f"Security Alert: Heuristic match for '{pattern}'")
             raise HTTPException(status_code=400, detail="Potential security violation detected.")

    # 2. OpenAI Moderation API Check - DISABLED for Groq Migration
    # Future work: Implement Llama Guard or similar if needed.
    pass
