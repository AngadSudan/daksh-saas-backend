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
  updateSubjectInCommunity,
  removeSubjectFromCommunity,
  getSubjectsAndChaptersPerCommunity,
  addChapterToSubject,
  addNotesToChapters,
  updateNotesToChapter,
  removeNotesFromChapter,
  updateChaptersInSubjects,
  removeChapterFromSubject,
} from "../controllers/communites.controllers.js";
import verifyJWT from "../middlewares/auth.middlewares.js";
const communityRouter = Router();

communityRouter.get("/get-user-communities", verifyJWT, getCommunitiesByUser);
communityRouter.get("/communities/:communityid", verifyJWT, getCommunityById);
communityRouter.post("/communities", verifyJWT, createCommunity);
communityRouter.patch("/communities/:communityid", verifyJWT, updateCommunity);
communityRouter.delete("/communities/:communityid", verifyJWT, deleteCommunity);
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
communityRouter.delete(
  "/communities/:communityid/participants",
  verifyJWT,
  removeParticipantsFromCommunity
);

communityRouter.get(
  "/communities/:communityid/subjects",
  verifyJWT,
  getSubjectsAndChaptersPerCommunity
);
communityRouter.post(
  "/communities/:communityid/subjects",
  verifyJWT,
  addSubjectToCommunity
);
communityRouter.patch(
  "/subjects/:subjectid",
  verifyJWT,
  updateSubjectInCommunity
);
communityRouter.delete(
  "/subjects/:subjectid",
  verifyJWT,
  removeSubjectFromCommunity
);

communityRouter.post(
  "/subjects/:subjectid/chapters",
  verifyJWT,
  addChapterToSubject
);
communityRouter.patch(
  "/chapters/:chapterid",
  verifyJWT,
  updateChaptersInSubjects
);
communityRouter.delete(
  "/chapters/:chapterid",
  verifyJWT,
  removeChapterFromSubject
);

communityRouter.post(
  "/chapters/:chapterid/notes",
  verifyJWT,
  addNotesToChapters
);
communityRouter.patch("/notes/:noteid", verifyJWT, updateNotesToChapter);
communityRouter.delete("/notes/:noteid", verifyJWT, removeNotesFromChapter);

export default communityRouter;
