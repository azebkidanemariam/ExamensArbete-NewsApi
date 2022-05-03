import { createClient } from "contentful";

export const client = createClient({
  space: process.env.CF_SPACE_ID,
  accessToken: process.env.CF_ACCESS_KEY,
});