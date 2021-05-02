import { Router } from "../deps.ts";

const router = Router();

// GET users listing.
router.get("/", (_req, res, _next) => {
  res.send("Users are coming shortly!");
});

export default router;
