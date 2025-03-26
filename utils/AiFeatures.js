import keyManager from "./gemini.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

class AiFeatures {
  constructor() {
    this.availableKey = keyManager.getAvailableKey();
    this.genAi = new GoogleGenerativeAI(this.availableKey);
    this.model = this.genAi.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateSummarizedText(text) {
    const prompt = `
        "You are an AI assistant tasked with summarizing academic PDFs while maintaining the richness of the content.
        Given a PDF, extract the key information, including definitions, explanations, and key takeaways.
        Ensure the summary is concise yet informative, structured in paragraphs or bullet points, and easy to understand.
        Retain essential technical terms but simplify complex sentences.
        If the document contains examples or case studies, summarize their key insights instead of omitting them.
        Make sure to include:

        Main concepts and core ideas
        Key definitions and important facts
        Explanations of critical points without excessive detail
        Bullet points for clarity when needed
        No loss of crucial information or misrepresentation of ideas
        Format the response as follows:
        less
        Copy
        Edit
        ## [Title of the Section]
        **Key Points:**  
        - [Summarized key idea 1]  
        - [Summarized key idea 2]  
        
        **Summary:**  
        [Concise but rich summary of the section]  
        Ensure the response does not alter the intended meaning of the content. If the document contains equations or figures, briefly describe their significance instead of ignoring them.
        Here's the text response: ${text}`;
    const response = await this.model.generateContent(prompt);
    return response;
  }

  async generateSummarizedQuiz(text) {
    const prompt = `
        "You are an AI specialized in text summarization and quiz generation. Given the extracted text from a PDF, perform the following tasks:
        1 Summarization: Generate a concise yet rich summary of the provided text while preserving its key details and concepts. Keep the summary informative, structured, and to the point.

        2 Quiz Generation (JSON format): Based on the summarized content, generate two types of multiple-choice questions:

        Single Correct Answer MCQs (1 correct option)
        Multiple Correct Answer MCQs (2 or more correct options)
        Ensure the questions cover different aspects of the summary and avoid repetition. The quiz should be returned in the following JSON format:

        generate me 10 questions of each topic.
        {   
        "quiz": {  
            "single_correct": [  
            {  
                "question": "What is the main purpose of X?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "correct_answer": "Option B"  
            },  
            {  
                "question": "Which statement is true about Y?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "correct_answer": "Option C"  
            }  
            ],  
            "multiple_correct": [  
            {  
                "question": "Which of the following are characteristics of Z?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "correct_answers": ["Option A", "Option C"]  
            },  
            {  
                "question": "What factors contribute to the growth of X?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "correct_answers": ["Option B", "Option D"]  
            }  
            ]  
        }  
        }  
        Constraints & Guidelines:

        Ensure accuracy in questions and answers.
        Maintain the richness of information while keeping the summary concise.
        Questions should cover different concepts from the summary.
        Keep the options plausible but not misleading.
        Ensure consistency in formatting and valid JSON syntax.
        Output only valid JSON with no extra text or explanation. Here's the text response: ${text}`;
    const response = await this.model.generateContent(prompt);
    return response;
  }
}

export default new AiFeatures();
