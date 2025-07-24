import express from "express";
import { approveReq, eventApproval, rejectReq } from "../controller/adminController.js";
import { auth, isAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/event-approval", eventApproval);

router.post("/approve-event", auth, isAdmin, approveReq);
router.post("/reject-event", auth, isAdmin, rejectReq);

export default router;