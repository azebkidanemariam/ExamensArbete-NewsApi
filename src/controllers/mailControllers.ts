import { RequestHandler } from "express";
import { db } from "../db/client";
import { transporter } from "../mail/client";
import {
  createTemporaryPassword,
  hashPassword,
  createId,
  checkEmailExists,
} from "../utils";
import * as templates from "../mail/templates";
import { MailExists } from "../errors";

type MemberPayload = {
  owner: {
    name: string;
    email: string;
  };
  receiver: string;
};

export const addNewMemberAndSendEmail: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { owner, receiver } = req.body as MemberPayload;
    const password = createTemporaryPassword();
    const hashedPassword = await hashPassword(password);
    const userId = createId();
    const userRef = db.collection("users");

    const emailExists = await checkEmailExists(receiver);

    if (emailExists) {
      throw new MailExists();
      // res.json({ success: false, message: "Email already exists" });
      // return;
    } else {
      try {
        await userRef.doc(receiver).set({
          id: userId,
          email: receiver,
          password: hashedPassword,
          categories: [],
          favorites: [],
          follows: [],
        });

        const response = await userRef.doc(owner.email).get();
        const account = response.data().account;
        account.members.push(receiver);

        await userRef.doc(owner.email).update({ account });
      } catch (error) {
        // console.log("NOOOOO");
        // console.log(error);
        next(error);
      }
    }

    const info = await transporter.sendMail({
      from: '"24Gossip" <info@24Gossip.se>',
      to: receiver,
      subject: "Välkommen till 24Gossip!",
      html: templates.addMemberEmail(owner.name, password),
    });

    if (info.accepted) {
      res.json({ success: true });
    } else {
      res.json({ success: false, info });
    }
  } catch (error) {
    console.log(error);
    console.log("nope");
    res.json({ success: false, error });
  }
};

export const removeMemberAndSendEmail: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const { owner, receiver } = req.body as MemberPayload;

    const userRef = db.collection("users");
    const response = await userRef.doc(owner.email).get();
    const account = response.data().account;
    account.members = account.members.filter(
      (member: string) => member !== receiver
    );

    const update = await userRef.doc(owner.email).update({ account });
    const htmlTemplate = templates.removeMemberEmail(owner.name);

    const info = await transporter.sendMail({
      from: '"24Gossip" <info@24Gossip.se>',
      to: receiver,
      subject: "Du har inte längre ett kopplat 24Gossip konto",
      html: htmlTemplate,
    });

    if (info.accepted) {
      res.json({ success: true, update });
    } else {
      res.json({ success: false, info });
    }
  } catch (error) {
    next(error);
  }
};
