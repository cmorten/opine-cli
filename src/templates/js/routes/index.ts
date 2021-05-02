import { Router } from "../deps.ts";

const router = Router();

// GET home page.
router.get("/", (_req, res, _next) => {
  res.render("index", {
    title: "Opine",
  });
});

export default router;
