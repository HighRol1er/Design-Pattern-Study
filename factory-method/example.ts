interface User {
  signup(): void;
}

class NaverUser implements User {
  signup(): void {
    console.log("naver user signup");
  }
}

class GoogleUser implements User {
  signup(): void {
    console.log("google user signup");
  }
}

abstract class AuthFactory {
  abstract createUser(): User;

  signup() {
    const user = this.createUser();
    user.signup();
  }
}

class NaverAuthFactory extends AuthFactory {
  createUser(): User {
    return new NaverUser();
  }
}

class GoogleAuthFactory extends AuthFactory {
  createUser(): User {
    return new GoogleUser();
  }
}

// client code

const naverAuthFactory = new NaverAuthFactory();
naverAuthFactory.signup();

const googleAuthFactory = new GoogleAuthFactory();
googleAuthFactory.signup();

// 어렵넹..
