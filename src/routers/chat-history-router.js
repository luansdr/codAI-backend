import express from "express";
import { body, param, validationResult } from "express-validator";
import FirestoreModel from "../models/chats-firestore-model.js";
const router = express.Router();
import Response from "../types/Response.js";

router.get(
  "/:chatId",
  [
    param("chatId")
      .notEmpty()
      .withMessage("O parâmetro 'chatId' não pode estar vazio"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // const chatContent = await FirestoreModel.getChatsUsingChatId(req);

    const { chatId } = req.params;

    const result = await FirestoreModel.getChatsUsingChatId(chatId);

    return res.status(result.status).json(result);
  }
);

router.get(
  "/user/:userId",
  [
    param("userId")
      .notEmpty()
      .withMessage("O parâmetro 'userId' não pode estar vazio"),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { userId } = req.params;

    const result = await FirestoreModel.getChatsForUser(userId, next);

    return res.status(result.status).json(result);
  }
);

router.patch(
  "/title/:chatId",
  [
    body("title").notEmpty().withMessage("O 'title' não pode estar vazio"),
    body("userId").notEmpty().withMessage("O 'userId' não pode estar vazio"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { title, userId } = req.body;

    const chat = await FirestoreModel.getChatsUsingChatId(chatId);

    if (!chat.data?.history) {
      return res.status(chat.status).json(chat);
    }

    const hasPermission = await FirestoreModel.checkUserChatPermission(
      chat,
      userId
    );

    if (hasPermission === true) {
      const result = await FirestoreModel.patchTitleChat(chatId, title);

      return res.status(result.status).json(result);
    }

    return res.status(hasPermission.status).json(hasPermission);
  }
);

router.patch(
  "/editor/:chatId",
  [
    body("editor").notEmpty().withMessage("O 'editor' não pode estar vazio"),
    body("userId").notEmpty().withMessage("O 'userId' não pode estar vazio"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;
    const { editor, userId } = req.body;

    const chat = await FirestoreModel.getChatsUsingChatId(chatId);

    if (!chat.data?.history) {
      return res.status(chat.status).json(chat);
    }

    const hasPermission = await FirestoreModel.checkUserChatPermission(
      chat,
      userId
    );

    if (hasPermission === true) {
      const result = await FirestoreModel.patchEditorChat(chatId, editor);

      return res.status(result.status).json(result);
    }

    return res.status(hasPermission.status).json(hasPermission);
  }
);

router.delete(
  "/:chatId",
  [
    param("chatId")
      .notEmpty()
      .withMessage("O parâmetro 'chatId' não pode estar vazio"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { chatId } = req.params;

    const result = await FirestoreModel.deleteChat(chatId);

    return res.status(result.status).json(result);
  }
);

export default router;
