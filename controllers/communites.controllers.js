import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";

//Community Operations
const getCommunitiesByUser = async (req, res) => {
  try {
    const user = req.user.id;
    if (!user) throw new Error("User not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("User Communities not found");

    const userCommunities = await prismaClient.community.findMany({
      where: {
        OR: [
          { createdBy: user }, // Communities created by the user
          {
            participants: {
              some: { userId: user }, // Communities where the user is a participant
            },
          },
        ],
      },
    });

    if (!userCommunities) throw new Error("User Communities not found");

    return res
      .status(200)
      .json(new ApiResponse(200, "Success", userCommunities));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const getCommunityById = async (req, res) => {
  try {
    const { communityid } = req.params;
    const user = req.user.id;
    if (!user) throw new Error("User not found");
    if (!communityid) throw new Error("Community not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("User not found");

    const dbcommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbcommunity) throw new Error("Community not found");

    return res.status(200).json(new ApiResponse(200, "Success", dbcommunity));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const createCommunity = async (req, res) => {
  try {
    const { name, description, websiteUrl } = req.body;
    if (!name) throw new Error("name is required to create a community");
    if (!description)
      throw new Error("description is required to create a community");
    // Your logic here
    const user = req.user.id;
    if (!user) throw new Error("User not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("User not found in the database");

    const createdCommunity = await prismaClient.community.create({
      data: {
        name,
        description,
        websiteUrl,
        createdBy: user,
      },
    });
    if (!createdCommunity) throw new Error("Community not created");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Community created successfully", createdCommunity)
      );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const deleteCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const joinCommunityByLink = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const addParticipantsToCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const removeParticipantsFromCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//Subjects
const addSubjectToCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateSubjectInCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const removeSubjectFromCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//Chapters
const getSubjectsAndChaptersPerCommunity = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const addChapterToSubject = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const addNotesToChapters = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateNotesToChapter = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const removeNotesFromChapter = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const updateChaptersInSubjects = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

const removeChapterFromSubject = async (req, res) => {
  try {
    // Your logic here
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

export {
  getCommunitiesByUser,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunityByLink,
  addParticipantsToCommunity,
  removeParticipantsFromCommunity,
  addSubjectToCommunity,
  updateSubjectInCommunity,
  removeSubjectFromCommunity,
  getSubjectsAndChaptersPerCommunity,
  addChapterToSubject,
  addNotesToChapters,
  updateNotesToChapter,
  removeNotesFromChapter,
  updateChaptersInSubjects,
  removeChapterFromSubject,
};
