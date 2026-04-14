import json

from fastapi import HTTPException
from openai import OpenAI, OpenAIError, RateLimitError

from app.config import OPENAI_API_KEY, GROQ_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None
groq_client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
) if GROQ_API_KEY else None

def extract_resume_data(resume_text: str):

    prompt = f"""
    Extract structured information from the following resume text.

    IMPORTANT: Respond with ONLY a valid JSON object in this exact format:
    {{
        "skills": ["skill1", "skill2", "skill3"],
        "experience_years": 5,
        "summary": "A brief professional summary"
    }}

    Do not include any other text, explanations, or formatting. Just the JSON.

    Resume text:
    {resume_text}
    """

    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
            result_text = response.choices[0].message.content
        except RateLimitError:
            raise HTTPException(
                status_code=503,
                detail="GROQ quota exceeded. Check your API plan/billing."
            )
        except OpenAIError as exc:
            raise HTTPException(status_code=502, detail=f"GROQ API request failed: {exc}")
    elif client:
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert resume parser."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
            result_text = response.choices[0].message.content
        except RateLimitError:
            raise HTTPException(
                status_code=503,
                detail="OpenAI quota exceeded. Check your API plan/billing."
            )
        except OpenAIError as exc:
            raise HTTPException(status_code=502, detail=f"OpenAI request failed: {exc}")
    else:
        raise HTTPException(status_code=500, detail="No OpenAI or GROQ API key configured.")

    try:
        parsed = json.loads(result_text)
        # print("Parsed extracted data:", parsed)  # Print the parsed data for debugging
    except ValueError:
        print(f"Failed to parse JSON. Raw response: {result_text[:500]}...")  # Debug raw response
        parsed = {
            "skills": [],
            "experience_years": 0,
            "summary": ""
        }
    # print("Final extracted data:", parsed)  # Print the final extracted data for debugging
    return parsed