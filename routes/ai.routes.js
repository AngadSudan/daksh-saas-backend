import { Router } from "express";
import AiFeatures from "../utils/AiFeatures.js";
const TestingRouter = Router();

// const Features = new AiFeatures();
TestingRouter.post("/generateSummarizedText", async (req, res) => {
  const { text } = req.body;
  let response = await AiFeatures.generateSummarizedText(text);
  response = response.replace("```json", "```");
  response = response.replaceAll("```", "");
  response = response.replaceAll("'json", "'");
  console.log(response);
  return res.send(response);
});
TestingRouter.post("/generateSummarizedQuiz", async (req, res) => {
  const { text } = req.body;
  const response = await AiFeatures.generateSummarizedQuiz(text);

  const generatedResponse =
    response.response.candidates[0].content.parts[0].text;
  let reducesResponse = generatedResponse.replace("```", "");
  reducesResponse = generatedResponse.replace("```", "");
  return res.send(reducesResponse);
});

TestingRouter.post("/chatbot", async (req, res) => {
  const { question, prevConversation } = req.body;
  const response = await AiFeatures.generateAnswer(question, prevConversation);
  return res.send(response.response.candidates[0].content.parts[0].text);
});

export default TestingRouter;
