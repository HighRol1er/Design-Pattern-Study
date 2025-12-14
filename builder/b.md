# Builder Pattern

## 1. 개념
<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/a87645b6-d54a-492c-b97e-7eaa3b56bcd5" />

> 빌더 패턴은 복잡한 객체의 생성과 표현을 분리 - 위키피디아

> 빌더는 복잡한 객체들을 단계별로 생성할 수 있도록 하는 생성 디자인 패턴입니다. 이 패턴을 사용하면 같은 제작 코드를 사용하여 객체의 다양한 유형들과 표현을 제작할 수 있습니다. - 리팩토링 구루

1. 빌더는 복잡한 객체들을 단계별로 생성할 수 있게 해준다. <br/>
2. 같은 생성 코드를 사용해 객체의 다양한 유형들과 표현을 제작하게 해준다. <br/>

여기서 말하는 유형과 표현은 다음과 같다. 
|  | 차이점 | 
|:-:|:-:|
| 유형 | 생성되는 `Product`의 클래스 자체가 다름 |
| 표현 | 같은 `Product` 클래스 내에서 내부 구성이 다름 |

## 2. 안티 코드

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


