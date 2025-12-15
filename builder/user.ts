interface Address {
  city: string;
  state: string;
}

interface SecuritySettings {
  twoFaEnabled: boolean;
  backupCodes: string[];
}

interface Preferences {
  theme: "light" | "dark" | "sys";
  language: "ko" | "en";
  marketingOptIn: boolean;
}

class User {
  // 필수 필드
  id: string;
  email: string;
  password: string;

  // 선택 필드
  address?: Address;
  securitySettings?: SecuritySettings;
  preferences?: Preferences;

  // 필수 필드 리셋
  constructor() {
    (this.id = ""), (this.email = ""), (this.password = "");
  }
}

interface UserBuilder {
  initialize(id: string, email: string, password: string): this;
  buildAddress(address: Address): this;
  buildSecuritySettings(settings: SecuritySettings): this;
  buildPreferences(preferences: Preferences): this;
  getResult(): User;
}

class ConcreteUserBuilder implements UserBuilder {
  private user: User;

  constructor() {
    this.user = new User();
  }

  // 필수 필드를 받는 초기 메서드를 정의
  initialize(id: string, email: string, password: string): this {
    this.user.id = id;
    this.user.email = email;
    this.user.password = password;
    return this;
  }

  buildAddress(address: Address): this {
    this.user.address = address;
    return this;
  }

  buildSecuritySettings(settings: SecuritySettings): this {
    this.user.securitySettings = settings;
    return this;
  }

  buildPreferences(preferences: Preferences): this {
    this.user.preferences = preferences;
    return this;
  }

  getResult(): User {
    const result = this.user;
    this.user = new User(); // 재사용을 위한 리셋
    return result;
  }
}

const builder = new ConcreteUserBuilder();

const basicUser = builder.initialize("1", "basic@test.com", "1234").getResult();

const secureUser = builder
  .initialize("2", "secure@test.com", "abcd")
  .buildSecuritySettings({
    twoFaEnabled: true,
    backupCodes: [],
  })
  .getResult();

const fullUser = builder
  .initialize("3", "full@test.com", "qwer")
  .buildAddress({ city: "Seoul", state: "gangnam" })
  .buildPreferences({
    theme: "dark",
    language: "ko",
    marketingOptIn: false,
  })
  .buildSecuritySettings({
    twoFaEnabled: true,
    backupCodes: ["abc", "def"],
  })
  .getResult();

console.log(basicUser);
console.log(secureUser);
console.log(fullUser);

// 현재구조에서는 필요가 없고 만약에 Enterprise, standard, pro 유저 이렇게 만든다면 쓸모 있을지도?
// const director = new UserDirector(builder);
// class UserDirector {
//   constructor(private builder: UserBuilder) {}

//   buildStandardUser(): User {
//     return this.builder.getResult();
//   }

//   buildSecureUser(): User {
//     return this.builder
//       .buildSecuritySettings({
//         twoFaEnabled: true,
//         backupCodes: [],
//       })
//       .getResult();
//   }

//   buildFullUser(): User {
//     return this.builder
//       .buildAddress({
//         city: "Seoul",
//         state: "gangnam",
//       })
//       .buildPreferences({
//         theme: "dark",
//         language: "ko",
//         marketingOptIn: false,
//       })
//       .buildSecuritySettings({
//         twoFaEnabled: true,
//         backupCodes: ["abc", "def"],
//       })
//       .getResult();
//   }
// }

// // Client
// const builder1 = new ConcreteUserBuilder();
// const director1 = new UserDirector(builder1);

// const basicUser = director1.buildStandardUser();
// const secureUser = director1.buildSecureUser();
// const fullUser = director1.buildFullUser();

// console.log(basicUser);
// console.log(secureUser);
// console.log(fullUser);
