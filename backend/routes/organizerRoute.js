import express from 'express';
const router = express.Router();

import { createOrganiser, deleteOrganiser } from '../controller/organiserController.js';
router.post("/create", createOrganiser);
router.post("/delete", deleteOrganiser);
 
export default router;