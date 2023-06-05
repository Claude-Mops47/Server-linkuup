import express from "express";

import { getCookies, delCookie } from "../controllers/cookiesParser.js";

const router = express.Router();

router.route("/get").get(getCookies);
router.route("/del").post(delCookie);

export default router;
