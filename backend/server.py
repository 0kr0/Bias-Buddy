from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

API_URL = "https://api.aimlapi.com/v1/chat/completions"
API_KEY = "2d9551e03e644691a3f8f83b258247a0" # Vladimir first token: "d71241ee33e546929a6e00963bbad7c1"
#3327ce8f43cf427fa822e4055b6d6b4c
SYSTEM_PROMPT = """
You are a bias detection assistant. Your job is to evaluate a user's input text for unconscious bias. Follow these instructions:

1. Provide an overall opinion of the text — is it mostly inclusive, slightly biased, or highly biased?
   - Estimate the percentage of bias in the text (0% = completely inclusive, 100% = extremely biased).
   - This percentage should be an intuitive estimate based on the number, severity, and interconnectedness of biased elements.
2. Analyze the text **holistically**, not line by line. Consider how sentences relate to and influence each other. Flag problematic content not only in isolation but based on tone, implication, or progression.
3. Identify any biased **snippets** (these can be individual sentences or groups of related phrases) and provide for each:
   - The **text** snippet
   - The **bias category** (choose one): Gender, Age, Race & Ethnicity, Nationality, Religion, Disability, Mental Health, Body Image, Socioeconomic Status, Educational Elitism, Occupational Bias, Aggressive Tone or Hostility, Dismissive or Condescending Language, Exclusionary Language, Cultural Appropriation or Insensitivity
   - If the bias topic does not fit specified above, indicate "Other(<your recognized bias topic>)"
   - **Bias strength** from 1 to 4 (1 = Low, 4 = Very High)
   - A brief **explanation**
   - A **more neutral or inclusive rephrasing**

Respond strictly in this JSON format (no markdown, no explanations outside the JSON):

{
  "overall_opinion": "...",
  "bias_percentage": ...,
  "analysis": [
    {
      "text": "...",
      "bias_strength": ...,
      "bias_category": "...",
      "explanation": "...",
      "suggestion": "..."
    }
  ]
}
"""

@app.route('/api/analyze', methods=['POST'])
def analyze_text():
    data = request.get_json()
    user_text = data.get("text", "")

    full_prompt = SYSTEM_PROMPT + "\n\nText:\n" + user_text

    try:
        response = requests.post(
            API_URL,
            headers={
                "Authorization": f"Bearer {API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": full_prompt}
                ],
                "temperature": 0.2,
                "max_tokens": 1024
            }
        )

        response.raise_for_status()
        result_text = response.json()["choices"][0]["message"]["content"]
        result_json = json.loads(result_text)
        return jsonify(result_json)

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Bias detection failed. Please try again later."}), 500

@app.route('/test')
def test():
    return "Backend is working!", 200

if __name__ == '__main__':
    app.run(debug=True, port=5000)
