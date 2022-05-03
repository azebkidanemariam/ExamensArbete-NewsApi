//User errors
export class UserError extends Error {
    errorCode: number;
    errorMessage: string;
    constructor(error?: Error) {
      super();
      this.errorCode = 400;
      this.errorMessage = error?.message || "An error occurred";
    }
  }
  
  export class InvalidLogin extends UserError {
    constructor() {
      super();
      this.errorCode = 401; //Unauthorized
      this.errorMessage = "Login unsuccessful";
    }
  }
  
  export class InvalidRegister extends UserError {
    constructor() {
      super();
      this.errorCode = 400; //Bad request
      this.errorMessage = "Missing credentials";
    }
  }
  
  export class InvalidUpdate extends UserError {
    constructor(error?: Error) {
      super();
      this.errorCode = 400; //Bad request
      this.errorMessage = "Missing account details";
    }
  }
  
  export class UserNotFound extends UserError {
    constructor() {
      super();
      this.errorCode = 404; //Not found
      this.errorMessage = "User not found";
    }
  }
  
  export class InvalidCredentials extends UserError {
    constructor() {
      super();
      this.errorCode = 400; //Forbidden
      this.errorMessage = "Invalid credentials";
    }
  }
  
  export class Unauthorized extends UserError {
    constructor() {
      super();
      this.errorCode = 401;
      this.errorMessage = "Unauthorized";
    }
  }
  
  export class MailExists extends UserError {
    constructor() {
      super();
      this.errorCode = 409; //conflict
      this.errorMessage = "Email already exists";
    }
  }
  
  export class ContentError extends UserError {
    constructor() {
      super();
      this.errorCode = 400;
      this.errorMessage = "Content request unsuccessful";
    }
  }