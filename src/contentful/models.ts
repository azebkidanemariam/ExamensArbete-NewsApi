export interface Content {
  sys: {
    id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface Article extends Content {
  fields: {
    title:string;
    headline: string;
    preamble: string;
    body: {
      content: any;
    };
    celebrities: Celebrity[];
    categories: Category[];
    images?: ContentImage[];
    featureImage: ContentImage;
    tags: Tag[];
    ads: Ad[]
    video?: ContentVideo;
    comment:IComment[]
  };
}

export interface ContentImage extends Content {
  fields: {
    file: {
      url: string;
    };
  };
}
export interface ContentVideo extends Content {
  fields: {
    file: {
      url: string;
    };
  };
}

export interface Celebrity extends Content {
  fields: {
    name: string;
    bio: { content: any[] };
    image: ContentImage;
    articles: Article[];
  };
}


export interface Tag extends Content {
  fields: {
    name: string;
  };
}
export interface Ad extends Content {
  fields: {
    text: string;
    image:ContentImage;
    url: string
  };
}

export interface Category extends Content {
  fields: {
    title: string;
    tags: Tag[];
  };
}
export interface IComment extends Content {
  name: string
  date: Date
  content: string
}
