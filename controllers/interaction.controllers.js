import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";
import primsaClient from "../utils/db.js";

const registerInteraction = async (req, res) => {
  const user = req.user.id;
  try {
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("user not found");
    const { messageType, message, chapterId } = req.body;
    if (!messageType) throw new Error("please enter a message type");
    if (!message) throw new Error("please enter a message");
    if (!chapterId) throw new Error("please enter a chapter id");

    const dbChapter = await prismaClient.chapters.findUnique({
      where: { id: chapterId },
    });
    if (!dbChapter) throw new Error("No Such Chapter Found");
    const createdInteraction = await prismaClient.interactions.create({
      data: {
        raisedBy: dbUser.id,
        messageType,
        message,
        chapterId: dbChapter.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!createdInteraction) throw new Error("Unable to create interaction");
    return res
      .status(200)
      .json(new ApiResponse(200, "Interaction Created", createdInteraction));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const getChapterInteraction = async (req, res) => {
  const user = req.user.id;
  try {
    const { id: chapterId } = req.params;
    console.log("chapterId", chapterId, user);
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("user not found");
    if (!chapterId) throw new Error("please enter a chapter id");

    const dbChapter = await prismaClient.chapters.findUnique({
      where: { id: chapterId },
    });

    if (!dbChapter) throw new Error("No Such Chapter Found");

    const interactions = await prismaClient.interactions.findMany({
      where: { chapterId: dbChapter.id, messageType: "ANNOUNCEMENT" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!interactions)
      return res
        .status(200)
        .json(new ApiResponse(200, "No interactions found", []));
    return res
      .status(200)
      .json(new ApiResponse(200, "Interactions Found", interactions));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const deleteInteraction = async (req, res) => {
  const user = req.user.id;
  try {
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("user not found");
    const { id } = req.params;
    console.log(req.params);
    if (!id) throw new Error("please enter a interaction id");
    const dbInteraction = await prismaClient.interactions.findUnique({
      where: { id },
    });
    if (!dbInteraction) throw new Error("No Such Interaction Found");
    const deletedInteraction = await prismaClient.interactions.delete({
      where: { id: dbInteraction.id },
    });
    if (!deletedInteraction) throw new Error("Unable to delete interaction");
    return res
      .status(200)
      .json(new ApiResponse(200, "Interaction Deleted", deletedInteraction));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const updateInteraction = async (req, res) => {
  const user = req.user.id;
  try {
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("user not found");
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const getDoubts = async (req, res) => {
  const user = req.user.id;
  try {
    const { id: chapterId } = req.params;
    console.log("chapterId", chapterId, user);
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("user not found");
    if (!chapterId) throw new Error("please enter a chapter id");

    const dbChapter = await prismaClient.chapters.findUnique({
      where: { id: chapterId },
    });

    if (!dbChapter) throw new Error("No Such Chapter Found");

    const interactions = await prismaClient.interactions.findMany({
      where: { chapterId: dbChapter.id, messageType: "DOUBTS" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!interactions)
      return res
        .status(200)
        .json(new ApiResponse(200, "No interactions found", []));
    return res
      .status(200)
      .json(new ApiResponse(200, "Interactions Found", interactions));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};

const getQuiz = async (req, res) => {
  const user = req.user.id;
  try {
    const { id } = req.params;
    const dbUser = await primsaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("user not found");
    if (!id) throw new Error("please enter a quiz id");
    const dbQuiz = await prismaClient.quiz.findUnique({
      where: { id },
      include: {
        questions: true,
      },
    });

    const dbQuestions = await prismaClient.question.findMany({
      where: { quizId: id },
    });

    if (!dbQuiz) throw new Error("No Such Quiz Found");
    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz Found", { dbQuiz, dbQuestions }));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};

const getAllQuiz = async (req, res) => {
  try {
    const { id: noteid } = req.params;
    const user = req.user.id;

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });

    if (!dbUser) throw new Error("user not found");
    if (!noteid) throw new Error("please enter a note id");

    const dbQuiz = await prismaClient.quiz.findMany({
      where: { notesId: noteid },
      include: {
        notes: {
          include: {
            chapters: {
              include: {
                subject: {
                  include: {
                    community: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!dbQuiz)
      return res.status(200).json(new ApiResponse(200, "No Quiz Found", []));
    return res.status(200).json(new ApiResponse(200, "Quiz Found", dbQuiz));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const getAllOnlineQuiz = async (req, res) => {
  try {
    const { id: noteid } = req.params;
    const user = req.user.id;

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user, isLive: "ONLINE" },
    });

    if (!dbUser) throw new Error("user not found");
    if (!noteid) throw new Error("please enter a note id");

    const dbQuiz = await prismaClient.quiz.findMany({
      where: { notesId: noteid },
    });

    if (!dbQuiz)
      return res.status(200).json(new ApiResponse(200, "No Quiz Found", []));
    return res.status(200).json(new ApiResponse(200, "Quiz Found", dbQuiz));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const submitQuiz = async (req, res) => {
  const { id: quizid } = req.params;
  const {
    totalQuestion,
    totalAttemptedQuestion,
    totalCorrectQuestion,
    totalWrongQuestion,
    correct,
    incorrect,
    unattempted,
  } = req.body;
  try {
    const user = req.user.id;
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("user not found");
    if (!quizid) throw new Error("please enter a quiz id");

    const dbQuiz = await prismaClient.quiz.findUnique({
      where: { id: quizid },
    });

    if (!dbQuiz) throw new Error("No Such Quiz Found");
    const dbAnswers = await prismaClient.submission.create({
      data: {
        quizId: dbQuiz.id,
        userId: dbUser.id,
        totalQuestion,
        totalAttemptedQuestion,
        totalCorrectQuestion,
        totalWrongQuestion,
        correct: JSON.stringify(correct),
        Incorrect: JSON.stringify(incorrect),
        unattempted: JSON.stringify(unattempted),
      },
    });

    if (!dbAnswers) throw new Error("Unable to submit answers");
    return res
      .status(200)
      .json(new ApiResponse(200, "Answers Submitted", dbAnswers));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};

const toggleQuizStatus = async (req, res) => {
  try {
    const { id: quizid } = req.params;
    const { status } = req.body;
    const dbQuiz = await prismaClient.quiz.findUnique({
      where: { id: quizid },
    });

    if (!dbQuiz) throw new Error("No Such Quiz Found");

    const updatedQuiz = await prismaClient.quiz.update({
      data: {
        isLive: status,
      },
      where: { id: quizid },
    });

    if (!updatedQuiz) throw new Error("Unable to update quiz status");
    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz Status Updated", updatedQuiz));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};
const updateQuiz = async (req, res) => {
  try {
    const body = req.body;
    let questions = body.questions;
    console.log(questions);

    for (let i = 0; i < questions.length; i++) {
      console.log(
        "=================================================================="
      );

      console.log(questions[i]);
      const { question, options, answers } = questions[i];
      console.log("correct answer is : ", answers);

      const updatedQuestion = await prismaClient.question.update({
        data: {
          question,
          options,
          answers,
        },
        where: { id: questions[i].id },
      });

      if (!updatedQuestion) throw new Error("Unable to update question");
      console.log("updatedQuestion", updatedQuestion);

      questions[i] = updatedQuestion;
      console.log(
        "=================================================================="
      );
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Quiz Updated", questions));
  } catch (error) {
    console.log(error);
    return res
      .status(200)
      .json(
        new ApiResponse(500, error.message || "something went wrong", null)
      );
  }
};

export {
  registerInteraction,
  getChapterInteraction,
  deleteInteraction,
  updateInteraction,
  getDoubts,
  getQuiz,
  getAllQuiz,
  submitQuiz,
  getAllOnlineQuiz,
  toggleQuizStatus,
  updateQuiz,
};

//create quiz
//update quiz details
