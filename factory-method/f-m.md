# Factory

- 팩토리 함수의 핵심은 객체를 생성하고 반환하는 함수

```js
function factory() {
  return {...}
}
```

## 리터럴로 객체 생성하기 vs 팩토리 함수

```js
const someObj = {...}
```

팩토리 함수의 매력은 생성할 객체들이 공통된 특징을 가지고있으면서도 조금씩 다른 객체들을 만들어야 할 때 생기는 문제들을 깔끔하게 해결해 준다는 것

## 객체 리터럴? 안전할까요??

원초적인 방법으로 **"학생소개"** 프로그램을 짜봅시다.

```js
const studentOne = {
  name: "조성윤",
  talk() {
    return `안녕, 난 ${this.name} 이야.`;
  },
};

const studentTwo = {
  name: "홍길동",
  talk() {
    return `안녕, 난 ${this.name} 이야.`;
  },
};
```

첫 번째 문제는 **객체가 변경 가능**하다는 것을 깨달았을 때 생깁니다.
학생의 이름을 직접 변경하면 우리가 의도한 바와 다르게 흘러갑니다.

```js
studentOne.name = "호랑이";
studentOne.talk();
```

해당 객체의 프로퍼티가 노출되어 덮어 쓸 수 있다는 것에서 많은 버그가 나올 수 있습니다.
또한 학생마다 매번 `talk()` 메서드를 정의하는 것은 번거럽고 오류 발생률이 높습니다.

두 번째 문제는 코드베이스가 커짐에 따라서 생기는 코드 중복 → DRY (Don't Repeat Yourself)

## 팩토리함수로 극복하기!

```js
function studentFactory(studentName) {
  return {
    studentName: studentName,
    talk() {
      console.log(`안녕, 난 ${studentName} 이야.`);
    },
  };
}
```

해당 `studentFactory`함수를 사용하면 매번 같은 코드를 원하는 만큼 그리고 동일한 코드를 재작성하는 과정을 생략할 수 있습니다.

## Factory 한 줄 정리

Factory란 객체를 대신 생성해 주는 것 (함수,클래스 상관없이 포괄적인 **"개념"**)

---

# Factory Method Pattern

## 💡핵심 아이디어 

Factory Method is a creational design pattern that provides an interface for creating objects in a superclass, but allows subclasses to alter the type of objects that will be created.

> Factory Method는 부모 클래스에서 객체들을 생성할 수 있는 인터페이스를 제공하지만, 자식 클래스들이 생성될 객체들의 유형을 변경할 수 있도록 하는 생성 패턴입니다.

**1. 부모 클래스(super class)에서 객체들을 생성할 수 있는 인터페이스를 제공한다.**
**2. 자식 클래스들(sub classes)은 생성될 객체들의 유형을 변경할 수 있다.**(오버라이드)

## 다이어그램으로 보기 (참고용) 

<img width="1320" height="760" alt="image" src="https://github.com/user-attachments/assets/dde3ca12-b95c-46de-82e8-73125eef207f" />

<img width="2158" height="1280" alt="image" src="https://github.com/user-attachments/assets/17a34332-cccd-4ab6-b3ea-d55e06dcaf2b" />

## 부모 클래스에서 객체들을 생성할 수 있는 인터페이스란❓
```ts
// 1. 부모 클래스에서 객체들을 생성할 수 있는 인터페이스를 제공한다.
abstract class AuthFactory {
  abstract createUser(): User; // ← 객체 생성 인터페이스

  signup() {
    const user = this.createUser(); // ← 인터페이스를 통해 객체 생성
    user.signup();
  }
}
```
- `createUser()` 추상 메서드가 "객체 생성 인터페이스"
- `signup()` 메서드에서 구체적인 타입을 모르는 채로 `createUser()`를 호출

## 자식 클래스에서 생성 될 객체들의 유형 변경이란❓
```ts
// 2.자식 클래스는 생성될 객체들의 유형을 변경할 수 있다.
class NaverAuthFactory extends AuthFactory {
  createUser(): User {
    return new NaverUser(); // ← NaverUser 타입으로 변경
  }
}
```
- 각 자식 클래스가 `createUser()`를 구현하면서 실제로 생성될 객체의 구체적인 타입을 결정
- 부모 클래스(`AuthFactory`)는 어떤 타입이 생성될지 몰라도 동일한 로직(`signup()`)을 실행 가능

## "객체 생성 인터페이스"❓ 아니고 추상 클래스!
추상 클래스가 아니라 interface로 구현할 경우 무수한 반복 → DRY (Don't Repeat Yourself) 원칙을 고수할 것! 
```ts
interface AuthFactory {
  createUser(): User;
  signup(): void;
}

class NaverAuthFactory implements AuthFactory {
  createUser(): User { return new NaverUser(); }
  signup(): void {  // ← 매번 같은 로직을 구현해야 함
    const user = this.createUser();
    user.signup();
  }
}

class KakaoAuthFactory implements AuthFactory {
  createUser(): User { return new KakaoUser(); }
  signup(): void {  // ← 반복
    const user = this.createUser();
    user.signup();
  }
}
```

## Creator에 대한 오해

<img width="1320" height="760" alt="image" src="https://github.com/user-attachments/assets/199fc96b-2fe3-4095-ae69-18799228a1aa" />

`Creator`라는 이름에도 불구하고 `Creator`의 주책임은 제품을 생성하는 것이 아닙니다.</br>
일반적으로 `Creator` 클래스에는 이미 제품과 관련된 핵심 비즈니스 로직이 있으며,</br>
팩토리 메서드는 이 로직을 구상 제품 클래스들로부터 디커플링(분리) 하는 데 도움을 줄 뿐입니다.</br>

```ts
// ❌ 오해: 크리에이터가 객체만 만드는 공장?
abstract class AuthFactory {
  abstract createUser(): User;  // 그냥 객체만 만들어주는 역할?
}

// ✅ 실제: 크리에이터는 핵심 비즈니스 로직을 가진 클래스
abstract class AuthFactory {
  abstract createUser(): User;
  
  // 👇 이게 진짜 주 책임! 회원가입 프로세스 전체를 관리
  signup(email: string, password: string) {
    // 1. 이메일 유효성 검사
    this.validateEmail(email);
    
    // 2. 비밀번호 암호화
    const encryptedPw = this.encryptPassword(password);
    
    // 3. 사용자 생성 (여기만 유연하게!)
    const user = this.createUser();
    
    // 4. 데이터베이스 저장
    this.saveToDatabase(user);
    
    // 5. 환영 이메일 발송
    this.sendWelcomeEmail(user);
  }
  
  private validateEmail(email: string) { /* ... */ }
  private encryptPassword(pw: string) { /* ... */ }
  // ... 등등 핵심 로직들
}
```
- 팩토리 메서드는 **핵심 비즈니스 로직에서 구체적인 클래스 의존성을 분리**하기 위한 도구.

# 참고 자료

https://heyjoshlee.medium.com/factory-functions-in-javascript-the-how-and-why-d8988bda654a
https://reactiveprogramming.io/blog/en/design-patterns/factory-method
