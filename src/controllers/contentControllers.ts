import { RequestHandler } from "express";
import { client } from "../contentful/contentfulClient";
import { Article, Category, Ad } from "../contentful/models";
import { ContentError, UserError, UserNotFound } from "../errors";
import { getUser, sortArticles } from "../utils"

export const getArticles: RequestHandler = async (req, res, next) => {
  try {
    const entries: { items: Article[] } = await client.getEntries({
      content_type: "article",
    });
    if (!entries.items) {
      throw new ContentError();
    }

    res.json({ content: entries.items });
  } catch (error) {
    next(error);
  }
};

export const getUserArticlesPaginated: RequestHandler = async (req, res, next) => {
  // @ts-ignore
  const user = await getUser(req.user.email)
  const { skip, limit } = req.body.pagination

  if (user) {
    const { follows, categories } = user

    try {
      const entries: { items: Article[] } = await client.getEntries({
        content_type: "article",
      });
  
      const sortedArticles = sortArticles(entries.items, categories, follows)    
      interface Pagination {
        total: number
        skip: number
        limit: number
        next: number | null
      }

      const pagination: Pagination = {
        total: sortedArticles.length,
        skip: skip || 0,
        limit: limit || 10,
        next: (skip || 0) + (limit || 10) || 10
      }

      const paginatedArticles = sortedArticles.slice(pagination.skip, pagination.skip + pagination.limit)

      res.json({pagination, content: paginatedArticles})
    } catch (error) {
      next(new UserError(error))
    }
  } else {
    next(new UserNotFound())
  }
}

export const getCelebArticles: RequestHandler = async (req, res, next) => {
  const id = req.params.celebrityId;

  try {
    const entries: { items: Article[] } = await client.getEntries({
      content_type: "article",
    });
    if (!entries.items) {
      throw new ContentError();
    }

    let celebArticles: Article[] = [];

    entries.items.map((article) => {
      if (article.fields.celebrities) {
        article.fields.celebrities.forEach((celeb) => {
          if (celeb.sys.id === id) {
            celebArticles.push(article);
          }
        });
      }
    });

    res.json({ content: celebArticles });
  } catch (error) {
    next(error);
  }
};

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const entries: { items: Category[] } = await client.getEntries({
      content_type: "category",
    });

    if (!entries.items) {
      throw new ContentError();
    }
    res.json({ content: entries.items });
  } catch (error) {}
};

export const getArticlesPaginated: RequestHandler = async (req, res, next) => {
  const { skip, limit } = req.body;
  try {
    const entries: {
      items: Article[];
      total: number;
      skip: number;
      limit: number;
    } = await client.getEntries({
      content_type: "article",
      skip,
      limit,
    });
    res.json({
      articles: entries.items,
      pagination: {
        total: entries.total,
        skip: entries.skip,
        limit: entries.limit,
      },
    });
  } catch (error) {}
};

/* export const getPlans: RequestHandler = async (req, res, next) => {
  try {
    const entries: { items: Plan[] } = await client.getEntries({
      content_type: "subscriptionPlan",
    });
    res.json({ content: entries.items });
  } catch (error) {}
}; */
/* export const getCelebrities: RequestHandler = async (req, res, next) => {
  try {
    const entries: { items: Plan[] } = await client.getEntries({
      content_type: "celebrity",
    });
    res.json({ content: entries.items });
  } catch (error) {}
}; */
export const getAds: RequestHandler = async (req, res, next) => {
  try {
    const entries: { items: Ad[] } = await client.getEntries({
      content_type: "ad",
    });

    res.json({ content: entries.items });
  } catch (error) {}
};

export const getCelebrityById: RequestHandler = async (req, res, next) =>{
  try {
    const entry = await client.getEntry(req.params.id)

    res.json({content: entry})
  } catch (error) {
    console.log(error);
    
  }

}


