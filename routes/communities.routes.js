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

const communityRouter = Router();

communityRouter.get("/communities/:communityid", getCommunityById);
communityRouter.get("/users/:user/communities", getCommunitiesByUser);
communityRouter.post("/communities", createCommunity);
communityRouter.patch("/communities/:communityid", updateCommunity);
communityRouter.delete("/communities/:communityid", deleteCommunity);
communityRouter.post("/communities/:communityid/join", joinCommunityByLink);

communityRouter.post(
  "/communities/:communityid/participants",
  addParticipantsToCommunity
);
communityRouter.delete(
  "/communities/:communityid/participants",
  removeParticipantsFromCommunity
);

communityRouter.get(
  "/communities/:communityid/subjects",
  getSubjectsAndChaptersPerCommunity
);
communityRouter.post(
  "/communities/:communityid/subjects",
  addSubjectToCommunity
);
communityRouter.patch("/subjects/:subjectid", updateSubjectInCommunity);
communityRouter.delete("/subjects/:subjectid", removeSubjectFromCommunity);

communityRouter.post("/subjects/:subjectid/chapters", addChapterToSubject);
communityRouter.patch("/chapters/:chapterid", updateChaptersInSubjects);
communityRouter.delete("/chapters/:chapterid", removeChapterFromSubject);

communityRouter.post("/chapters/:chapterid/notes", addNotesToChapters);
communityRouter.patch("/notes/:noteid", updateNotesToChapter);
communityRouter.delete("/notes/:noteid", removeNotesFromChapter);

export default communityRouter;
