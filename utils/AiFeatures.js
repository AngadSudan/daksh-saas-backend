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
        Ensure the summary is informative, structured in paragraphs or bullet points, and easy to understand.
        Retain essential technical terms but simplify complex sentences.
        If the document contains examples or case studies, summarize their key insights instead of omitting them.
        Make sure to include:

        Main concepts and core ideas
        Key definitions and important facts
        Explanations of critical points without excessive detail
        Please always give me response in JSON format for example :

    [
    
        {
            "data": "Your response here",
            type: "paragraph"
        },
        {
            data: "Your response here",
            type: "heading1"
        },{
          data:"Your response here",
          type: "heading2"
        }

    ]

    In the code don't add code block delimiter or triple backtick Just give me the code.
        Format the response as follows:
        ## [Title of the Section]
        **Key Points:**  
        - [Summarized key idea 1]  
        - [Summarized key idea 2]  
        
        **Summary:**  
        [ rich summary of the section]  
        Ensure the response does not alter the intended meaning of the content. If the document contains equations or figures, briefly describe their significance instead of ignoring them.
        Here's the text response: ${text}`;
    const response = await this.model.generateContent(prompt);
    return response.response.candidates[0].content.parts[0].text;
  }

  async generateSummarizedQuiz(text, number, mode) {
    const prompt = `
        "You are an AI specialized in text summarization and quiz generation. Given the extracted text from a PDF, perform the following tasks:
        2 Quiz Generation (JSON format): Based on the summarized content, generate questions:

        Single Correct Answer MCQs (1 correct option)
        Ensure the questions cover different aspects of the summary and avoid repetition. The quiz should be returned in the following JSON format:

        generate me ${number} questions of each topic for this ${mode}.
        incase of easy mode make questions that are tricky but easy to solve.
        incase of medium mode make question that are tough and confusing.
        incase of hard mode make both hard question which are indepth from the text and confusing to answer.

        If there are some formulas in the text then generate numericals too and give exactly the number of questions as asked by the users.

       the response is a json then the text is all the data in the objects.
        {   
        "quiz": {  
            "single_correct": [  
            {  
                "question": "What is the main purpose of X?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "answer": "Option B"  
            },  
            {  
                "question": "Which statement is true about Y?",  
                "options": ["Option A", "Option B", "Option C", "Option D"],  
                "answer": "Option C"  
            }  
            ] 
        }  
        }  
        Constraints & Guidelines:

        Ensure accuracy in questions and answers.
        Questions should cover different concepts from the summary.
        Keep the options plausible but not misleading.
        Ensure consistency in formatting and valid JSON syntax.
        Output only valid JSON with no extra text or explanation. Here's the text response: ${text}`;
    const response = await this.model.generateContent(prompt);
    return response.response.candidates[0].content.parts[0].text;
  }
  async generateAnswer(question, prevConversation, text) {
    const prompt = `Purpose: This AI chatbot is designed by Team Daksh to provide concise, accurate, and study-related answers while maintaining a polite and professional tone.
      Incase if the user feels demotivated, provide a motivational quote to uplift their spirits.  
    Functionality Guidelines:
      If someone asks for the website or platform then tell them to explore the application and figure out while enjoying the UX
      The administration contact details are :- contact.daksh@gmail.com
      Question Handling:
      The chatbot should answer questions in less than 100 words.
      Responses must strictly pertain to academic or study-related topics.
      If the question is irrelevant (e.g., a joke or off-topic), the response should politely redirect the user:
      "I'm a chatbot here to assist with study questions! Let's stay focused and get back to learning."
      Feedback Management:
  
      Positive Feedback: Respond with gratitude and a motivational tone. Example:
      "Thank you for your kind words! I'm glad I could help. Let me know if you have more questions!"
      Negative Feedback: Respond with an apology and a willingness to improve. Example:
      "I'm sorry to hear that. Your feedback is valuable, and I’ll strive to improve. Please let me know how I can help!"
      Tone: Ensure the tone remains friendly, supportive, and focused on education to encourage productive interactions.
  
      Optimization Goals:
  
      Improve user satisfaction with study-related queries.
      Maintain engagement through polite feedback loops.
      Efficiently handle irrelevant queries to keep the focus on learning.
  
      Here's the Question-${question}
      and this is the previous conversation that occured -${prevConversation}
      Dont add any ** or any * or use any symbols, instead of bullets add numbering.
      `;

    const response = await this.model.generateContent(prompt);
    return response;
  }
}

export default new AiFeatures();
