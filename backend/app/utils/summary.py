import os
import requests
import json
import re

HF_API_TOKEN = os.getenv("HF_API_TOKEN", "your_huggingface_token_here")
HF_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1"

HEADERS = {
    "Authorization": f"Bearer {HF_API_TOKEN}",
    "Content-Type": "application/json"
}

def extract_doi(text: str) -> str:
    match = re.search(r'\b(10\.\d{4,9}/[-._;()/:A-Z0-9]+)\b', text, re.IGNORECASE)
    return match.group(0) if match else ""

import json
import re

def extract_last_json(output_text: str):
    """
    Extracts the last JSON object from a raw LLM output string,
    assuming JSON objects are delimited by balanced braces.
    """

    # Find all JSON blocks by matching braces with a regex pattern
    # This is a simplified approach assuming no nested JSON objects inside strings
    # and JSON is valid and balanced.
    
    json_blocks = []
    brace_stack = []
    start_idx = None

    for i, ch in enumerate(output_text):
        if ch == '{':
            if not brace_stack:
                start_idx = i
            brace_stack.append(ch)
        elif ch == '}':
            if brace_stack:
                brace_stack.pop()
                if not brace_stack and start_idx is not None:
                    # Complete JSON block found
                    json_blocks.append(output_text[start_idx:i+1])
                    start_idx = None

    if not json_blocks:
        raise ValueError("No JSON object found in the output text.")

    # The last JSON block is likely the intended result
    last_json_str = json_blocks[-1]

    try:
        return json.loads(last_json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"Failed to parse JSON: {e}")

def generate_summary_and_metadata(text: str) -> dict:
    prompt = f"""
Extract the following information from this research paper content:
1. DOI (if present)
2. Title of the paper
3. List of authors
4. A brief summary (3–5 sentences)

Return the result strictly in this JSON format:
{{
  "doi": "string",
  "title": "string",
  "authors": ["author1", "author2", ...],
  "summary": "string"
}}

Text:
{text[:12000]}
    """

    payload = {
        "inputs": prompt,
        "parameters": {
            "max_new_tokens": 512,
            "temperature": 0.3
        }
    }

    try:
        response = requests.post(HF_API_URL, headers=HEADERS, json=payload, timeout=90)
        response.raise_for_status()
        result = response.json()
        output_text = result[0].get("generated_text", "") if isinstance(result, list) else result.get("generated_text", "")
        return extract_last_json(output_text)
    
    except Exception as e:
        print(f"DEBUG RAW RESPONSE: {response.text if 'response' in locals() else 'No response'}")
        return {
            "doi": extract_doi(text),
            "title": "",
            "authors": [],
            "summary": f"Summary generation failed: {e}"
        }
