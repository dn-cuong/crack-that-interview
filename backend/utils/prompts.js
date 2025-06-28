const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions
) => `
    You are an AI trained to generate technical interview questions and answers.
    
    Task:
    - Role: ${role}
    - Candidate Experience: ${experience} years
    - Focus Topics: ${topicsToFocus}
    - Write ${numberOfQuestions} interview questions.
    - For each question, generate a detailed but beginner-friendly answer.
    - If the answer needs a code example, add a small code block inside.
    - Keep formatting very clean.
    - Return a pure JSON array like:
    [
      {
        "question": "Question here?",
        "answer": "Answer here."
      },
      ...
    ]
    Important: Do NOT add any extra text. Only return valid JSON.
    `;

const conceptExplainPrompt = (question) => `
    You are an AI trained to generate explanations for a given interview question.
    
    Task:
    
    - Explain the following interview question and its concept in depth as if you're teaching a beginner developer.
    - Question: "${question}"
    - After the explanation, provide a short and clear title that summarizes the concept for the article or page header.
    - If the explanation includes a code example, provide a small code block.
    - Keep the formatting very clean and clear.
    - Return the result as a valid JSON object in the following format:
    
    {
        "title": "Short title here?",
        "explanation": "Explanation here."
    }
    
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

const compareAnswerPrompt = (question, userAnswer, correctAnswer) => `
    You are an expert interviewer and evaluator. Compare the user's answer with the correct answer for the following interview question.

    Question: "${question}"

    User's Answer: "${userAnswer}"

    Correct Answer: "${correctAnswer}"

    Please provide a detailed analysis in the following JSON format:
    {
      "score": number (0-100),
      "feedback": "Detailed feedback about the user's answer",
      "strengths": ["List of strengths in the user's answer"],
      "weaknesses": ["List of areas for improvement"],
      "suggestions": ["Specific suggestions for better answers"],
      "sampleAnswer": "A practical, interview-style sample answer that demonstrates how to structure a real interview response. Make it conversational, include specific examples, and show the STAR method (Situation, Task, Action, Result) when applicable. Keep it realistic and actionable."
    }

    Focus on:
    - Technical accuracy
    - Completeness of the answer
    - Communication clarity
    - Relevant examples provided
    - Industry best practices mentioned
    - Interview-style delivery (conversational, structured, confident)

    For the sample answer, make it:
    - Conversational and natural (like how you'd actually speak in an interview)
    - Include specific, real-world examples
    - Use the STAR method when telling stories
    - Show confidence without being arrogant
    - Include technical details but explain them clearly
    - Keep it concise but comprehensive (2-3 minutes when spoken)
    - Start with a direct answer, then elaborate with examples

    Be constructive and encouraging while being honest about areas for improvement.
    Important: Do NOT add any extra text outside the JSON format. Only return valid JSON.
    `;

module.exports = { 
  questionAnswerPrompt, 
  conceptExplainPrompt,
  compareAnswerPrompt 
};
