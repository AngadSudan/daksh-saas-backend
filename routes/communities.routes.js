import { Router } from "express";
import {
  getCommunitiesByUser,
  getCommunityById,
  createCommunity,
  updateCommunity,
  deleteCommunity,
  joinCommunityByLink,
  addParticipantsToCommunity,
  removeParticipantsFromCommunity,
  addSubjectToCommunity,
  getSubjectsAndChaptersPerCommunity,
  updateSubjectInCommunity,
  removeSubjectFromCommunity,
  addChapterToSubject,
  addNotesToChapters,
  getNotesForChapters,
  updateNotesToChapter,
  removeNotesFromChapter,
  updateChaptersInSubjects,
  removeChapterFromSubject,
} from "../controllers/communites.controllers.js";

import upload from "../middlewares/multer.middleware.js";

import verifyJWT from "../middlewares/auth.middlewares.js";
const communityRouter = Router();

// tested
communityRouter.get("/get-user-communities", verifyJWT, getCommunitiesByUser);
//tested
communityRouter.get("/communities/:communityid", verifyJWT, getCommunityById);
//tested
communityRouter.post("/communities", verifyJWT, createCommunity);
//tested
communityRouter.patch("/communities/:communityid", verifyJWT, updateCommunity);
//tested
communityRouter.delete("/communities/:communityid", verifyJWT, deleteCommunity);
//tested
communityRouter.post(
  "/communities/:communityid/join",
  verifyJWT,
  joinCommunityByLink
);

communityRouter.post(
  "/communities/:communityid/participants",
  verifyJWT,
  addParticipantsToCommunity
);

//tested and working
communityRouter.post(
  "/:communityid/add-subjects",
  verifyJWT,
  addSubjectToCommunity
);

communityRouter.delete(
  "/communities/:communityid/participants",
  verifyJWT,
  removeParticipantsFromCommunity
);

// tested
communityRouter.get(
  "/communities/:communityid/subjects",
  verifyJWT,
  getSubjectsAndChaptersPerCommunity
);

communityRouter.post("/subject/:subjectid", verifyJWT, addChapterToSubject);
communityRouter.post(
  "/chapter/:chapterid",
  verifyJWT,
  upload.single("notes"),
  addNotesToChapters
);
communityRouter.get(
  "/chapter/:chapterid/notes",
  verifyJWT,
  getNotesForChapters
);
export default communityRouter;
