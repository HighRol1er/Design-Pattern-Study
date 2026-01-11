# Builder Pattern

## 개념

<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/a87645b6-d54a-492c-b97e-7eaa3b56bcd5" />

> 빌더 패턴은 복잡한 객체의 생성과 표현을 분리 - 위키피디아

> 빌더는 복잡한 객체들을 단계별로 생성할 수 있도록 하는 생성 디자인 패턴입니다. 이 패턴을 사용하면 같은 제작 코드를 사용하여 객체의 다양한 유형들과 표현을 제작할 수 있습니다. - 리팩토링 구루

1. 빌더는 복잡한 객체들을 단계별로 생성할 수 있게 해준다. <br/>
2. 같은 생성 코드를 사용해 객체의 다양한 유형들과 표현을 제작하게 해준다. <br/>

여기서 말하는 유형과 표현은 다음과 같다.
| | 차이점 |
|:-:|:-:|
| 유형 | 생성되는 `Product`의 클래스 자체가 다름 |
| 표현 | 같은 `Product` 클래스 내에서 내부 구성이 다름 |

## 문제

### 문제1. 안티 코드

```ts
class Address {
  constructor(
    public city: string,
    public state: string | null,
    public 도로명주소: string | null,
    public 우편번호: string
   ){}
}

class SecuritySettings {
  constructor(
    public 2faEnabled: boolean,
    public backupCodes: string[],
    public lastPasswordResetAt: Date | null
  ) {}
}

class Preferences {
  constructor(
    public theme: "light" | "dark",
    public language: Language,
    public marketingOptIn: boolean
  ) {}
}

class UserProfile {
  // 필드가 너무 많고, 중첩 객체도 있음
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public phone: string | null,
    public birth: Date | null,
    public address: Address,
    public preferences: Preferences,
    public security: SecuritySettings,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

// 유저 생성
const MonsterUser = new UserProfile(
  "exampleId",
  "example@email.com",
  "John Doe",
  new Address("Wall.St", null, "USA", null, null, "KR")
  new Preferences("dark", "ko", true),
  new SecuritySettings(true, ["A1", "B2"], null),
  new Date(),
  new Date()
);
// 문제점: 인자 하나만 잘못 넣어도 런타임 에러가 발생
```

유저 하나를 생성하기 위해서 상당한 수의 자식 클래스가 생성되며 새로운 매개변수를 추가할 때마다 계층구조는 복잡해지게 됩니다.

### 문제2. 확장하기

간단한 `user`객체에서 요구사항을 늘리면 어떻게 될까요? (성별, 키, 몸무게, 등)

가장 간단한 해결책은 `User` 클래스를 확장(extend)하고 매개변수의 모든 조합을 포함하는 자식 클래스들의 집합을 만들면됩니다. <br/>
`UserWithHeight`, `UserWithGender`, `UserWithWeight` 하지만 이런식으로 확장하게 될 경우 많은 수의 자식 클래스를 생성할 수밖에 없게 됩니다.

### 문제3. 자식 클래스를 늘리지 않고 확장하기

자식 클래스들을 늘리지 않기 위한 방식으로는 기초 `User`클래스에 `User`객체를 제어하는 모든 가능한 매개변수를 포함한 거대한 생성자를 만드는 것

```ts
interface User {
  id: stirng;
  email: stirng;
  password: string;
  height: number;
  weight: number;
  gender: "M" | "W";
  // ...more
}
```

하지만 이 방식은 대부분의 매개변수가 사용되지 않을수도 있습니다.<br/>

`new User("asdf","test@email.com", "1234", null, null, null)`<br/>
`new User("asdf","test@email.com", "1234", null, 70, "M")`

## 문제를 해결하기 위한 Builder

- 빌더 패턴은 자신의 클래스에서 **객체 생성 코드**를 → Builders라는 별도의 객체(클래스)들로 분리

<img width="686" height="406" alt="스크린샷 2025-12-15 오후 5 15 43" src="https://github.com/user-attachments/assets/3ef62fca-340d-4129-893b-48ed7c6d9a99" />

빌더 패턴은 복잡한 객체를 단계별로 생성할 수 있도록 돕는다.<br/>
객체를 생성하고 싶으면 빌더에게 요청해서 실행시키면됩니다. 또 빌더는 모든 단계를 호출할 필요가 없습니다.(속성을 선택할 수 있음)

## Director - 작업 순서 관리자

디렉터는 제품을 생성하는 데 필요한 단계들에 대한 호출을 담당합니다.<br/>
디렉터 클래스는 제작 단계들의 순서를 조율해줍니다.

> 단 디렉터 클래스는 선택사항합니다. 언제든지 클라이언트 코드에서 생성 단계들을 직접 특정 순서로 호출할 수 있습니다.
> 디렉터는 다양한 생성 루틴을 배치하여 프로그램 전체에서 재사용할 수 있는 장소입니다.

## 다이어그램

<img width="940" height="1160" alt="image" src="https://github.com/user-attachments/assets/1710925e-76ae-46e5-a635-1e831fc5384b" />

## 전체 코드

```ts
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
```
