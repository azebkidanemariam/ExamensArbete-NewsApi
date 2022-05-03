import { Router } from "express";
import auth from "../middlewares/auth";
import * as contentController from "../controllers/contentControllers";

const contentRouter = Router();

contentRouter.get("/articles", auth, contentController.getArticles);
contentRouter.post("/articles", auth, contentController.getUserArticlesPaginated)
contentRouter.get("/articles/:celebrityId", auth, contentController.getCelebArticles)
contentRouter.get("/categories", auth, contentController.getCategories);
contentRouter.get("/articles/paginate", auth, contentController.getArticlesPaginated);
contentRouter.get('/celebrities/:id', contentController.getCelebrityById)
contentRouter.get("/ads",  contentController.getAds);

export default contentRouter;