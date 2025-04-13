import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";

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
    const { id: interactionId } = req.params.id;
    if (!interactionId) throw new Error("please enter a interaction id");
    const dbInteraction = await prismaClient.interactions.findUnique({
      where: { id: interactionId },
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
export {
  registerInteraction,
  getChapterInteraction,
  deleteInteraction,
  updateInteraction,
  getDoubts,
};
