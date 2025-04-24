import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";

const generateSummaryByQuiz = async (req, res) => {
  const { notesId, number } = req.body;
  try {
    if (!notesId) throw new Error("Please provide notesId");
    if (!number) throw new Error("Please provide number of questions");
    const dbNotes = await prismaClient.notes.findUnique({
      where: {
        id: notesId,
      },
    });
    if (!dbNotes) throw new Error("No such notes found");
    //add quiz from summary
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};
