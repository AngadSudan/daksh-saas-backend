import prismaClient from "../utils/db.js";
import ApiResponse from "../utils/ApiResponse.js";

//left to do
// updateSubjectInCommunity,
//   removeSubjectFromCommunity,
//   addChapterToSubject,
//   addNotesToChapters,
//   updateNotesToChapter,
//   removeNotesFromChapter,
//   updateChaptersInSubjects,
//   removeChapterFromSubject,
import cloudinaryService from "../utils/fileUpload.js";
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
          {
            AND: [{ createdBy: user }, { visible: "VISIBLE" }],
          },
          {
            participants: {
              some: { userId: user },
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
      where: { id: communityid, visible: "VISIBLE" },
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
    const { name, description, websiteUrl } = req.body;

    const { communityid } = req.params;
    if (!communityid) throw new Error("community if was not found");
    const dbcommunity = prismaClient.community.findUnique({
      where: { id: communityid },
    });

    if (!dbcommunity) throw new Error("no such community found");

    if (!name && !description && !websiteUrl)
      throw new Error(
        "Atleast one data field needs to be changed inorder to update the community"
      );

    const updatedCommunity = await prismaClient.community.update({
      where: { id: dbcommunity.id },
      data: {
        title: title ?? dbcommunity.title,
        description: description ?? dbcommunity.description,
        websiteUrl: websiteUrl ?? dbcommunity.websiteUrl,
      },
    });

    if (!updatedCommunity) throw new Error("Community not updated");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Community updated successfully", updatedCommunity)
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

const deleteCommunity = async (req, res) => {
  try {
    const { communityid } = req.params;
    if (!communityid) throw new Error("Community not found");

    const dbcommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbcommunity) throw new Error("Community not found");

    const deletedCommunity = await prismaClient.community.update({
      where: { id: dbcommunity.id },
      data: { visible: "HIDDEN" },
    });

    if (!deleteCommunity) throw new Error("community couldnot be deleted");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Community deleted successfully", deletedCommunity)
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

const joinCommunityByLink = async (req, res) => {
  try {
    const { communityid } = req.body;
    if (!communityid) throw new Error("no such community was found");

    const dbCommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbCommunity) throw new Error("no such community was found");

    const user = req.user.id;
    if (!user) throw new Error("User not found");

    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("User not found");

    const userCommunity = await prismaClient.community.findFirst({
      where: {
        AND: [
          { id: communityid },
          { participants: { some: { userId: user } } },
        ],
      },
    });

    if (userCommunity) throw new Error("user already exists in this community");

    const joinedCommunty = await prismaClient.communityParticipants.create({
      data: {
        userId: dbUser.id,
        communityId: dbCommunity.id,
      },
    });

    if (!joinedCommunty) throw new Error("User couldnot join the community");

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "User joined the community successfully",
          joinedCommunty
        )
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

const addParticipantsToCommunity = async (req, res) => {
  try {
    const { userId } = req.body;
    const { communityid } = req.params;
    const user = req.user.id;
    if (!user) throw new Error("no usertoken found");

    if (!communityid) throw new Error("no such community found");
    const dbCommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbCommunity) throw new Error("no such community found");
    const AdminUser = await prismaClient.communityParticipants.findUnique({
      where: {
        AND: [{ communityId: communityid }, { id: user }],
      },
    });
    if (!AdminUser)
      throw new Error("no admin user found with the given token id");

    if (AdminUser.role !== "ADMIN")
      throw new Error("only admin can add participants to the community");

    if (!userId) throw new Error("no participant token  found");
    const dbUser = await prismaClient.user.findUnique({
      where: { id: userId },
    });
    if (!dbUser) throw new Error("no such participant found");

    const newMember = await prismaClient.communityParticipants.create({
      data: {
        userId: dbUser.id,
        communityId: dbCommunity.id,
      },
    });
    if (!newMember)
      throw new Error("new member couldnot be added to the community");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "new member added to the community", newMember)
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

const removeParticipantsFromCommunity = async (req, res) => {
  try {
    const { userid } = req.body;
    const { communityid } = req.params;
    const user = req.user.id;

    if (!user) throw new Error("no admin user token found");

    if (!communityid) throw new Error("no community tokenId found");

    const dbCommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbCommunity) throw new Error("no such community found");

    const AdminUser = await prismaClient.communityParticipants.findUnique({
      where: {
        AND: [{ communityId: communityid }, { id: user }],
      },
    });

    if (!AdminUser)
      throw new Error("no admin user found with the given token id");
    if (AdminUser.role !== "ADMIN")
      throw new Error("only admin can remove participants from the community");

    if (!userid) throw new Error("no participant token found");
    const dbUser = await prismaClient.user.findUnique({
      where: { id: userid },
    });
    if (!dbUser) throw new Error("no such participant found");

    if (dbCommunity.createdBy === dbUser.id)
      throw new Error("Owner cannot be removed from the community");

    const deletedMember = await prismaClient.communityParticipants.delete({
      where: {
        AND: [{ userId: dbUser.id }, { communityId: dbCommunity.id }],
      },
    });

    if (!deletedMember)
      throw new Error("Member couldnot be deleted from the community");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Member removed from the community", deletedMember)
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

//Subjects
const addSubjectToCommunity = async (req, res) => {
  try {
    const { communityid } = req.params;
    const user = req.user.id;
    if (!communityid) throw new Error("no such community was found");

    const dbCommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbCommunity) throw new Error("no such community was found");

    const dbParticipant = await prismaClient.communityParticipants.findMany({
      where: {
        userId: user,
        communityId: communityid,
      },
    });
    if (!dbParticipant)
      throw new Error("User is not a participant of this community");

    if (dbParticipant.role !== "ADMIN" && dbCommunity.createdBy !== user)
      throw new Error("Only Admin can add subjects to the community");

    const { name, description } = req.body;
    if (!name) throw new Error("name is required to create a subject");

    const createdSubject = await prismaClient.subjects.create({
      data: {
        name,
        description,
        communityId: dbCommunity.id,
      },
    });
    if (!createdSubject) throw new Error("Subject couldnot be created");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Subject created successfully", createdSubject)
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
    const { subjectid } = req.params;
    if (!subjectid) throw new Error("no such subject found");
    const dbSubject = await prismaClient.subjects.findUnique({
      where: { id: subjectid },
    });

    if (!dbSubject) throw new Error("no such subject found");

    const deletedSubject = await prismaClient.subjects.delete({
      where: { id: dbSubject.id },
    });
    if (!deletedSubject) throw new Error("Subject couldnot be deleted");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Subject deleted successfully", deletedSubject)
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

//Chapters
const getSubjectsAndChaptersPerCommunity = async (req, res) => {
  try {
    const { communityid } = req.params;
    if (!communityid) throw new Error("no community token found");
    const user = req.user.id;
    if (!user) throw new Error("no user token found");
    const dbUser = await prismaClient.user.findUnique({
      where: { id: user },
    });
    if (!dbUser) throw new Error("no user found");

    const dbCommunity = await prismaClient.community.findUnique({
      where: { id: communityid },
    });
    if (!dbCommunity) throw new Error("no community found");

    const dbParticipant = await prismaClient.communityParticipants.findMany({
      where: { userId: dbUser.id, communityId: dbCommunity.id },
    });
    if (!dbParticipant)
      throw new Error("User is not a participant of this community");

    const CommunitySubjects = await prismaClient.community.findUnique({
      where: { id: communityid },
      include: {
        subjects: {
          include: {
            chapters: true,
          },
        },
      },
    });

    if (!CommunitySubjects)
      throw new Error("no community chapters and subjects found");

    return res
      .status(200)
      .json(new ApiResponse(200, "Success", CommunitySubjects));
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
    const { subjectid } = req.params;
    const { name } = req.body;

    if (!subjectid) throw new Error("no such subject found");
    if (!name) throw new Error("name is required to create a chapter");
    const dbSubject = await prismaClient.subjects.findUnique({
      where: { id: subjectid },
    });

    if (!dbSubject) throw new Error("no such subject found");

    const createdChapter = await prismaClient.chapters.create({
      data: {
        name,
        subjectId: dbSubject.id,
      },
    });

    if (!createdChapter) throw new Error("Chapter couldnot be created");

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Chapter created successfully", createdChapter)
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

//cloudinary / s3 stuff to be done
const addNotesToChapters = async (req, res) => {
  try {
    console.log(req.file);
    const NoteUrl = req.file.path;
    const { title, description } = req.body;
    const { chapterid } = req.params;

    if (!chapterid) throw new Error("no such chapter found");
    if (!title) throw new Error("title is required to create a note");
    if (!description)
      throw new Error("description is required to create a note");
    if (!NoteUrl)
      return res
        .status(400)
        .json(new ApiResponse(400, "Note is required", null));

    const dbChapter = await prismaClient.chapters.findUnique({
      where: { id: chapterid },
    });
    if (!dbChapter) throw new Error("no such chapter found in the db");
    const fileLink = await cloudinaryService.uploadToCloudinary(NoteUrl);
    console.log(fileLink);
    const createdNote = await prismaClient.notes.create({
      data: {
        title,
        description,
        ChaptersId: dbChapter.id,
        documentLink: fileLink,
      },
    });

    if (!createdNote) throw new Error("Note couldnot be created");
    return res
      .status(200)
      .json(new ApiResponse(200, "Note created successfully", createdNote));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponse(500, error.message || "Internal Server Error", null)
      );
  }
};

//cloudinary / s3 stuff to be done
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

//cloundinary/s3 stuff to be done
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

const getNotesForChapters = async (req, res) => {
  try {
    const { chapterid } = req.params;
    if (!chapterid) throw new Error("no chapter found");

    const dbChapter = await prismaClient.chapters.findUnique({
      where: { id: chapterid },
    });

    if (!dbChapter) throw new Error("no such chapter found");
    const dbNotesFound = await prismaClient.chapters.findMany({
      where: { id: dbChapter.id },
      include: {
        notes: true,
      },
    });

    if (!dbNotesFound)
      res
        .status(200)
        .json(new ApiResponse(200, "no notes found for the chapter", []));
    return res.status(200).json(new ApiResponse(200, "Success", dbNotesFound));
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
  getNotesForChapters,
};
