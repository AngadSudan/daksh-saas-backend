import PDF from "pdf-parse-debugging-disabled";
import PPTX2Json from "pptx2json";
import AiFeatures from "./AiFeatures.js";
import prismaClient from "./db.js";
const ExtractTextAndGenerateSummary = async (file, noteid, number) => {
  try {
    if (!file) throw new Error("No file provided");
    console.log("file is", file);
    const mimeType = file.mimetype;

    let extractedText = "";
    if (mimeType === "application/pdf") {
      const pdfData = await PDF(await file.buffer);
      extractedText = pdfData.text;
    } else if (
      //extract via pptx-parse
      mimeType ===
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      console.log("entered pptx parse");

      const pptParser = new PPTX2Json();
      const pptParsed = await pptParser.buffer2json(await file.buffer);

      // Extract text from all slides
      extractedText = extractTextFromPptx(pptParsed);
      console.log(
        "Extracted text from PPTX:",
        extractedText.substring(0, 100) + "..."
      );
    } else {
      console.log("unsupported file type", file);
      throw new Error("Unsupported file type");
    }

    if (!extractedText) {
      throw new Error("Error in extracting text from file");
    }
    const summarizedText =
      await AiFeatures.generateSummarizedText(extractedText);
    const generatedQuestions = await AiFeatures.generateSummarizedQuiz(
      extractedText,
      number ? number : 10
    );
    if (!summarizedText)
      throw new Error("Error in getting response from AI features");
    if (!generatedQuestions)
      throw new Error("Error in getting response from AI features");
    const createdQuiz = await prismaClient.summarizedContent.create({
      data: {
        notesId: noteid,
        summary: summarizedText,
        quiz: generatedQuestions,
      },
    });
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Function to extract text from PPTX JSON structure
function extractTextFromPptx(pptJson) {
  let allText = [];

  // Process all slide files
  Object.keys(pptJson).forEach((key) => {
    if (key.includes("ppt/slides/slide") && key.endsWith(".xml")) {
      try {
        const slideContent = pptJson[key];
        const slideTexts = [];

        // Process slide content to extract text
        function extractTextRecursive(obj) {
          if (!obj) return;

          // Check for text content in a:t elements
          if (obj["a:t"]) {
            if (Array.isArray(obj["a:t"])) {
              obj["a:t"].forEach((textItem) => {
                if (typeof textItem === "string") {
                  slideTexts.push(textItem);
                } else if (textItem && textItem["_"]) {
                  slideTexts.push(textItem["_"]);
                }
              });
            } else if (typeof obj["a:t"] === "string") {
              slideTexts.push(obj["a:t"]);
            } else if (obj["a:t"] && obj["a:t"]["_"]) {
              slideTexts.push(obj["a:t"]["_"]);
            }
          }

          // Recursively search all properties
          if (typeof obj === "object" && obj !== null) {
            Object.values(obj).forEach((val) => {
              if (Array.isArray(val)) {
                val.forEach((item) => extractTextRecursive(item));
              } else if (typeof val === "object" && val !== null) {
                extractTextRecursive(val);
              }
            });
          }
        }

        // Start extraction from slide content
        if (
          slideContent &&
          slideContent["p:sld"] &&
          slideContent["p:sld"]["p:cSld"]
        ) {
          extractTextRecursive(slideContent["p:sld"]["p:cSld"]);
        }

        // Add this slide's text to the collection
        if (slideTexts.length > 0) {
          allText.push(slideTexts.join(" "));
        }
      } catch (err) {
        console.log(`Error processing slide ${key}:`, err);
      }
    }
  });

  // Join all slides' text with line breaks
  return allText.join("\n\n");
}

export default ExtractTextAndGenerateSummary;
