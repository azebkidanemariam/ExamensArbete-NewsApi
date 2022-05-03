import { Router } from "express";
import auth from "../middlewares/auth";
import * as userController from "../controllers/userControllers";
import * as mailController from "../controllers/mailControllers";

const userRouter = Router();

userRouter.post("/register", userController.register);

userRouter.post("/login", userController.login);

userRouter.get("/", auth, userController.get);

userRouter.post("/passwordreset", userController.passwordReset)

userRouter.put("/update", auth, userController.update);

userRouter.delete("/remove", auth, userController.remove);

userRouter.post('/member', auth, mailController.addNewMemberAndSendEmail)

userRouter.delete('/member', auth, mailController.removeMemberAndSendEmail)

export default userRouter;
