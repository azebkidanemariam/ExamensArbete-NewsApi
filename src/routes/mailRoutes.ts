import nodemailer from 'nodemailer'
import { Router } from "express";
import * as mailControllers from '../controllers/mailControllers'

const mailRouter = Router();

mailRouter.post('/member', mailControllers.addNewMemberAndSendEmail)

export default mailRouter