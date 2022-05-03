import { db } from "../db/client";
import { User } from '../db/models'
import { Article } from "../contentful/models";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

const userRef = db.collection("users");

export const getUser = async (email: string): Promise<User | false> => {
  const userSnapshot = await userRef.doc(email).get();

  if (userSnapshot.data()) {
    return userSnapshot.data() as User;
  }

  return false;
}

export const sortArticles = (articles: Article[], follows: string[], categories: string[] ) => {
  let celebArticles: Article[] = []
  let categoryArticles: Article[] = []
  let unrelatedArticles: Article[] = []
  let relatedIds: string[] = []

  articles.forEach(art => {
    if (art.fields.celebrities) {
      art.fields.celebrities.forEach(celeb => {
        if (follows.includes(celeb.sys.id) && !relatedIds.includes(art.sys.id)) {
          celebArticles.push(art)              
          relatedIds.push(art.sys.id)
        }
      })
    }
    if (art.fields.categories) {
      art.fields.categories.forEach(cat => {
        if (categories.includes(cat.sys.id) && !relatedIds.includes(art.sys.id)) {
          categoryArticles.push(art)       
          relatedIds.push(art.sys.id)
        }
      })
    }
    if (!relatedIds.includes(art.sys.id)) {
      unrelatedArticles.push(art)
    }
  })

  return celebArticles.concat(categoryArticles).concat(unrelatedArticles)
}

export const checkEmailExists = async (email: string) => {
  
  const userSnapshot = await userRef.doc(email).get();

  if (userSnapshot.data()) {
    return true;
  }

  return false;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
};

export const createId = () => {
  return uuidv4();
};

export const createTemporaryPassword = () => {
  return generateString(8);
};

export const actionCodeSettings = {
  url: "https://gossip-341510.firebaseapp.com",
  handleCodeInApp: false,
  // iOS: {
  //   bundleId: 'com.example.ios',
  // },
  // android: {
  //   packageName: 'com.example.android',
  //   installApp: true,
  //   minimumVersion: '12',
  // },
  // FDL custom domain.
  // dynamicLinkDomain: 'gossip24.page.link',
};

const generateString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
