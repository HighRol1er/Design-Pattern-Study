# 개요

프로토타입 패턴은 생성할 객체들의 타입이 프로토타입인 인스턴스로부터 결정되도록 하며, 인스턴스는 새 객체를 만들기 위해 자신을 복제 하게된다 - 위키피디아

프로토타입은 코드를 그들의 클래스들에 의존시키지 않고 기존 객체들을 복사할 수 있도록 하는 생성 디자인 패턴입니다. - 리팩토링 구루

# 문제

객체가 있고 그 객체의 정확한 복사본을 만들고 싶다면 어떻게 할까요?<br/>
먼저 같은 클래스의 새 객체를 생성해야 합니다. 그런 다음 원본 객체의 모든 필드들을 살펴본 후 해당 값들을 새 객체에 복사해야 합니다.

## 얕은복사 깊은 복사 문제

```js
// # 얕은 복사, 깊은 복사
const obj = {
  a: 1,
  b: { c: 1 },
};

const clone = { ...obj };

clone.a = 22;
clone.b.c = 33;

console.log(obj);
```

- `obj`, `clone`는 같은 메모리 공간을 공유하므로 원본도 변경이 됨<br/>
  원시타입의 경우 새로 생성되지만 레퍼런스 타입은 복사가 아닌 기존 메모리에 할당된 원본 값을 참조

## 객체를 '외부'로부터 복사하는 것은 항상 가능하지 않습니다.

```ts
class BankAccount {
  public owner: string;
  private balance: number; // private fields

  constructor(owner: string, initialBalance: number) {
    this.owner = owner;
    this.balance = initialBalance;
  }

  public getBalance() {
    console.log(`OWNER: ${this.owner}, BALANCE: ${this.balance}`);
  }
}

const og = new BankAccount("Joe", 100);

const clone = new BankAccount(og.owner, og.blanace); // Property 'blanace' does not exist on type 'BankAccount'.(2339)
```

- `private`속성으로 인해 컴파일 언어인 타입스크립트에서는 `og.balance`는 접근이 불가

## 강한 커플링 문제 발생

객체의 복제본을 생성하려면 객체의 클래스를 알아야하고 → 이것은 곧 코드가 해당 클래스에 의존하게 됨

```ts
class Dog {
  constuctor(public name: string) {}
}

class Cat {
  constuctor(public name: string) {}
}

function clonePet(pet: Dog) {
  return new Dog(pet.name);
}

const myDog = new Dog("뽀삐");
const cloneDog = clonePet(myDog);
```

강한 커플링 : `clonePet`함수가`Dog`클래스에 강하게 결합되어 있어 고양이 복제 이런건 불가능하게 됨

## 객체의 인터페이스만을 알고 구상 클래스는 알지 못할 때

메서드의 매개변수가 일부 인터페이스를 따르는 모든 객체를 Param으로 받을 수 있을 때 그 객체가 따르는 인터페이스만을 알고 그 객체의 구상 클래스는 알지 못할 수 있습니다.

```ts
interface Flyable {
  fly(): void;
}

function takeOff(target: Flyable) {
  console.log("이륙준비");
  target.fly();
}

class Airplane {
  fly() {
    console.log("비행기가 엔진을 켭니다.");
  }
}

class Superman {
  fly() {
    console.log("슈퍼맨이 하늘로 솟구칩니다.");
  }
}
takeOff(new Airplane()); // O
takeOff(new Superman()); // O
```

구상 클래스를 알지 못하니 추측에 의해서 `fly()`라는 메서드를 가진 객체라고 생각해서 만드는 문제 발생

# 다이어그램

<img width="1000" height="800" alt="image" src="https://github.com/user-attachments/assets/6100690e-30cb-416b-921b-5aa897bb6b41" />

1. 프로토타입 인터페이스는 복제 메서드들을 선언 (대부분 단일 `clone`메서드)
2. 구상프로토타입 클래스는 복제 메서드를 구현
3. 클라이언트는 프로토타입 인터페이스를 따르는 모든 객체의 복사본 생성 가능

# 해결방법

위에서 설명한 문제를 다시 얘기해보면 다음과 같습니다.

1. 객체의 원본 훼손 문제
2. 객체의 '외부' 복사 문제
3. 강한 커플링 문제
4. 구상 클래스를 모르는 문제

이러한 문제점을 해결하기 위해서 프로토타입 패턴을 사용하면 좋습니다.<br/>

> **주의**
> 프로토 타입은 단순히 값을 `Object.assign()`처럼 복사하는 것이 아니라 **복제하는 방식을 구조화 한 것입니다.**

프로토타입 패턴은 실제로 복제되는 객체들에 복제 프로세스를 위임합니다. 패턴은 복제를 지원하는 모든 객체에 대한 공통 인터페이스를 선언합니다.
이 인터페이스를 사용하면 코드를 객체의 클래스에 결합하지 않고도 해당 객체를 복제할 수 있습니다. 일반적으로 이러한 인터페이스에는 단일 clone 메서드만 포함됩니다.

# 전체 코드

```ts
// 프로토타입
abstract class Shape {
  public x: number;
  public y: number;
  public color: string;

  constructor(source?: Shape) {
    if (source) {
      // 프로토타입 생성자 역할: 기존 객체의 값을 복사
      this.x = source.x;
      this.y = source.y;
      this.color = source.color;
    } else {
      // 일반 생성자 기본값 초기화
      this.x = 0;
      this.y = 0;
      this.color = "white";
    }
  }

  abstract clone(): Shape;
}

// 구상 프로토타입 (원, 사각형)
class Rectangle extends Shape {
  public width: number;
  public height: number;

  constructor(source?: Rectangle) {
    super(source);
    if (source) {
      this.width = source.width;
      this.height = source.height;
    } else {
      this.width = 0;
      this.height = 0;
    }
  }

  public clone(): Shape {
    return new Rectangle(this);
  }
}

class Circle extends Shape {
  public radius: number;

  constructor(source?: Circle) {
    super(source);
    if (source) {
      this.radius = source.radius;
    } else {
      this.radius = 0;
    }
  }

  public clone(): Shape {
    return new Circle(this);
  }
}

// client
class App {
  private shapes: Shape[] = [];

  constructor() {
    // 원본 원(Circle) 생성
    const circle = new Circle();
    circle.x = 10;
    circle.y = 10;
    circle.radius = 20;
    circle.color = "red";
    this.shapes.push(circle);

    // clone()을 통해 똑같은 사본 생성
    const anotherCircle = circle.clone();
    this.shapes.push(anotherCircle);

    // 사각형(Rectangle) 생성
    const rectangle = new Rectangle();
    rectangle.width = 10;
    rectangle.height = 20;
    rectangle.color = "blue";
    this.shapes.push(rectangle);
  }

  public businessLogic(): void {
    // 추상화된 Shape 배열을 복사
    const shapesCopy: Shape[] = [];

    /**
     * 다형성(Polymorphism)의 핵심:
     * 요소가 Circle인지 Rectangle인지 몰라도 'clone()'만 호출하면
     * 각 클래스에 정의된 적절한 복제 로직이 실행됩니다.
     */
    for (const s of this.shapes) {
      shapesCopy.push(s.clone());
    }

    console.log("원본 배열 크기:", this.shapes.length);
    console.log("복제 배열 크기:", shapesCopy.length);
    console.log(
      "복제된 첫 번째 원의 반지름:",
      (shapesCopy[0] as Circle).radius
    );
  }
}

// 실행
const app = new App();
app.businessLogic();
```
