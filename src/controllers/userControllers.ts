import { RequestHandler } from "express";
import { db, authenticate } from "../db/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import { stringify } from "querystring";
// import { kStringMaxLength } from "buffer";
// import { devNull } from "os";
import { transporter } from "../mail/client";
import {
  createId,
  actionCodeSettings,
  hashPassword,
  createTemporaryPassword,
  checkEmailExists,
} from "../utils/index";
import { User } from "../db/models";
import { verificationEmail, passwordResetEmail } from "../mail/templates";

import {
  InvalidRegister,
  InvalidCredentials,
  MailExists,
  UserNotFound,
} from "../errors";

export const get: RequestHandler = async (req, res, next) => {
  try {
    const querySnapshot = await db
      .collection("users")
      //@ts-ignore
      .doc(req.user.email)
      .get();
    if (!querySnapshot.data()) {
      throw new UserNotFound();
    }
    res.json({ users: querySnapshot.data() });
  } catch (error) {
    next(error);
  }
};

export const passwordReset: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  try {
    const checkEmail = await checkEmailExists(email);
    if (checkEmail === true) {
      const user = await authenticate.getUserByEmail(email);
      const password = createTemporaryPassword();
      const hashedPassword = await hashPassword(password);
      await authenticate.updateUser(user.uid, { password: hashedPassword });

      await db
        .collection("users")
        .doc(email)
        .update({ password: hashedPassword });
      res.json({ message: "Password updated" });

      await transporter.sendMail({
        from: '"24Gossip" <info@24Gossip.se>',
        to: email,
        subject: "New temporary password till 24Gossip!",
        html: passwordResetEmail(password),
      });
    } else {
      next(new InvalidCredentials());
    }
  } catch (error) {
    res.json(error);
    next(error);
  }
};

export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, dob, gender, account } = req.body;
    const hashedPassword = await hashPassword(password);
    const userId = createId();
    const checkEmail = await checkEmailExists(email);

    if (checkEmail === true) {
      res.json({ message: "Email already exists" });
      throw new InvalidRegister();
    } else {
      await authenticate
        .createUser({
          uid: userId,
          email: email,
          password: hashedPassword,
        })
        .then((userRecord) => {
          // See the UserRecord reference doc for the contents of userRecord.
          console.log("Successfully created new user:", userRecord.uid);
        })
        .catch((error) => {
          console.log("Error creating new user:", error);
        });

      await db.collection("users").doc(email).set({
        id: userId,
        name: name,
        email: email,
        password: hashedPassword,
        categories: [],
        favorites: [],
        follows: [],
        account: account,
        dob: dob,
        gender: gender,
      });

      res.json({ message: "User successfully created!" });

      await authenticate
        .generateEmailVerificationLink(email, actionCodeSettings)
        .then((link) => {
          // using custom SMTP server.
          transporter.sendMail({
            from: '"24Gossip" <info@24Gossip.se>',
            to: email,
            subject: "Bekräfta din e-postadress till 24 Gossip!",
            html: verificationEmail(link),
          });
        });
    }
  } catch (error) {
    res.json(error);
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const userRef = db.collection("users");
    const snapshot = await userRef.doc(email).get();
    const user = snapshot.data();
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET);
      res.json({ token, user });
    }
  } catch (error) {
    res.json({ error });
    next(error);
  }
};

export const update: RequestHandler = async (req, res, next) => {
  if (req.body.password) {
    //@ts-ignore
    const { password, currentPassword } = req.body;

    const userRef = db.collection("users");
    //@ts-ignore
    const snapshot = await userRef.doc(req.user.email).get();
    const user = snapshot.data();
    const valid = await bcrypt.compare(currentPassword, user.password);

    if (valid) {
      const hashedPassword = await hashPassword(password);
      const userAuth = await authenticate.getUserByEmail(user.email);
      await authenticate
        .updateUser(userAuth.uid, { password: hashedPassword })
        .then(() => {
          console.log("Successfully updated user");
        })
        .catch((error) => {
          console.log("Error updating user:", error);
        });

      await db
        .collection("users")
        .doc(user.email)
        .update({ password: hashedPassword });
      res.json({ message: "Password updated" });
      return;
    } else {
      next(new InvalidCredentials());
      return;
    }
  }

  if (req.body.email) {
    const userSnapshot = await db.collection("users").doc(req.body.email).get();
    if (userSnapshot.data()) {
      throw new MailExists();
    }
  }
  try {
    //@ts-ignore
    await db.collection("users").doc(req.user.email).update(req.body);
    res.json({ message: "User updated" });
  } catch (error) {
    next(error);
  }
};

export const remove: RequestHandler = async (req, res, next) => {
  try {
    //@ts-ignore
    const userAuth = await authenticate.getUserByEmail(req.user.email);
    await authenticate
      .deleteUser(userAuth.uid)
      .then(() => {
        console.log("Successfully deleted user");
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
    //@ts-ignore
    await db.collection("users").doc(req.user.email).delete();
    res.json({ message: "User successfully deleted" });
  } catch (error) {
    next(error);
  }
};
