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

def safe_parse_json(text):

    try:
        return json.loads(text)
    except:
        # 🔥 Try to extract JSON manually
        start = text.find("[")
        end = text.rfind("]") + 1

        if start != -1 and end != -1:
            try:
                return json.loads(text[start:end])
            except:
                pass

    return []

def generate_interview_questions(skills, role, difficulty, interview_type, question_count=5):

    prompt = f"""
        Generate {question_count} UNIQUE and NON-REPETITIVE interview questions.

        Candidate Details:
        - Skills: {skills}
        - Role: {role}
        - Difficulty: {difficulty}
        - Interview Type: {interview_type}

        STRICT INSTRUCTIONS:
        - Questions MUST be different from each other
        - Avoid generic or repeated questions
        - Focus on practical and role-specific scenarios
        - Difficulty MUST strictly match: {difficulty}
        - Interview type MUST influence style:
            - technical → coding, concepts, problem-solving
            - HR → behavioral, communication
            - system design → architecture, scalability
            - mixed → combination of all

        - If skills are provided, prioritize them in questions
        - Do NOT repeat common questions like:
        "Tell me about yourself" or "Explain OOP"

        OUTPUT FORMAT:
        Return ONLY valid JSON array:

        [
        {{
            "question": "...",
            "topic": "...",
            "difficulty": "{difficulty}"
        }}
        ]

        IMPORTANT:
        - No explanation
        - No extra text
        - No duplicate questions
        """

    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are an expert interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            result = response.choices[0].message.content
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
                    {"role": "system", "content": "You are an expert interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7
            )
            result = response.choices[0].message.content
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
        questions = safe_parse_json(result)

        valid_questions = []

        for q in questions:
            if "question" in q:
                valid_questions.append(q)

        if not questions:
            questions = [
                {
                    "question": "Explain your recent project.",
                    "topic": "General",
                    "difficulty": "easy"
                }
            ]
        return valid_questions
    except ValueError:
        return []
    
def evaluate_answer(question, answer):

    prompt = f"""
    Evaluate the candidate's answer.

    Question:
    {question}

    Answer:
    {answer}

    Return STRICT JSON:

    {{
      "technical_score": 0-10,
      "depth_score": 0-10,
      "clarity_score": 0-10,
      "completeness_score": 0-10,
      "missing_concepts": ["..."],
      "improvement_suggestions": ["..."],
      "confidence_score": 0-1
    }}

    Rules:
    - Be strict but fair
    - Penalize vague answers
    - Reward clarity and depth
    - No explanation, only JSON
    """

    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are a strict technical interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
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
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are a strict technical interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
        except RateLimitError:
            raise HTTPException(
                status_code=503,
                detail="OpenAI quota exceeded. Check your API plan/billing."
            )
        except OpenAIError as exc:
            raise HTTPException(status_code=502, detail=f"OpenAI API request failed: {exc}")
    else:
        raise HTTPException(status_code=500, detail="No LLM client available")

    result = response.choices[0].message.content

    return safe_parse_json(result)


def generate_summary(report_data):

    prompt = f"""
    Generate a professional interview feedback summary:

    {report_data}
    """

    if groq_client:
        try:
            response = groq_client.chat.completions.create(
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are a technical interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
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
                model="openai/gpt-oss-120b",
                messages=[
                    {"role": "system", "content": "You are a strict technical interviewer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0
            )
        except RateLimitError:
            raise HTTPException(
                status_code=503,
                detail="OpenAI quota exceeded. Check your API plan/billing."
            )
        except OpenAIError as exc:
            raise HTTPException(status_code=502, detail=f"OpenAI API request failed: {exc}")
    else:
        raise HTTPException(status_code=500, detail="No LLM client available")
    # print("LLM response for summary:", response.choices[0].message.content)  # Debug print
    result = response.choices[0].message.content
    # print("Generated summary:", result)  # Debug print

    return result
