import { Router } from "../deps.ts";

const router = Router();

// GET users listing.
router.get("/", (req, res, next) => {
  res.send("Users are coming shortly!");
});

export default router;
