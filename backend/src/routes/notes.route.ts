import express from "express";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../controllers/note.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.get("/get-all-notes", protect, getAllNotes);
router.get("/get-note/:id", protect, validateObjectId("id"), getNote);
router.post("/create", protect, createNote);
router.patch("/update/:id", protect, validateObjectId("id"), updateNote);
router.delete("/delete/:id", protect, validateObjectId("id"), deleteNote);

export default router;