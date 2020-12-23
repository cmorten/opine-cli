import { Router } from "../deps.ts";

const router = Router();

// GET home page.
router.get("/", (req, res, next) => {
  res.render("index", {
    title: "Opine",
  });
});

export default router;
