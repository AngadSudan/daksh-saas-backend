import ApiResponse from "../utils/ApiResponse.js";
import prismaClient from "../utils/db.js";

const getUserReport = async (req, res) => {
  try {
    const user = req.user.id;
    //check if user exists
    const dbUser = await prismaClient.user.findUnique({
      where: {
        id: user,
      },
    });
    if (!dbUser) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    const { id: quizId } = req.params;
    console.log(req.params);

    const dbQuiz = await prismaClient.quiz.findUnique({
      where: {
        id: quizId,
      },
    });
    if (!dbQuiz) {
      return res.status(404).json(new ApiResponse(404, "Quiz not found"));
    }
    //get all submissions for the quiz
    const submissions = await prismaClient.submission.findMany({
      where: {
        quizId: quizId,
        userId: user,
      },
    });
    if (!submissions || submissions.length === 0) {
      return res.status(200).json(new ApiResponse(200, "No submissions found"));
    }

    return res.status(200).json(
      new ApiResponse(200, "Submissions found", {
        quiz: dbQuiz,
        submissions: submissions,
      })
    );
  } catch (error) {
    console.error("Error in getUserReport:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", error)
      );
  }
};
const getAllUserReport = async (req, res) => {
  try {
    const user = req.user.id;
    const dbUser = await prismaClient.user.findUnique({
      where: {
        id: user,
      },
    });
    if (!dbUser) {
      return res.status(404).json(new ApiResponse(404, "User not found"));
    }
    const { id: quizId, community: communityId } = req.params;
    const dbQuiz = await prismaClient.quiz.findUnique({
      where: {
        id: quizId,
      },
    });
    if (!dbQuiz) {
      return res.status(404).json(new ApiResponse(404, "Quiz not found"));
    }
    if (dbQuiz.createdBy !== dbUser.id) {
      return res.status(203).json(new ApiResponse(403, "User not authorized"));
    }
    //get all submissions for the quiz
    const submissions = await prismaClient.submission.findMany({
      where: {
        quizId: quizId,
      },
    });

    return res.status(200).json(
      new ApiResponse(200, "Submissions found", {
        quiz: dbQuiz,
        submissions: submissions,
      })
    );
    //return the respose
  } catch (error) {
    console.error("Error in getUserReport:", error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", error)
      );
  }
};

export { getUserReport, getAllUserReport };
