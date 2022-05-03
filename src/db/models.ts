export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // Rätt typ? Använda bcrypt kanske?
    categories: string[];
    favorites: string[];
    follows: string[];
    account: Account;
    dob: Dob;
    gender: string;
  }
  
  export interface Dob {
    day: number;
    month: string;
    year: number;
  }
  
  export enum AccountType {
    basic = "basic",
    family = "family",
  }
  
  export interface Account {
    payment: string;
    type: AccountType;
    freeMonthExpires: Date;
    notifications: boolean;
  }
  
  export interface Comments {
    authorId: string;
    articleId: string;
    commentText: string;
  }
  