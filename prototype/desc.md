# 의도 
프로토타입은 코드를 그들의 클래스들에 의존시키지 않고 기존 객체들을 복사할 수 있도록 하는 생성 디자인 패턴입니다.<br/>
→ **클래스에 의존(커플링)하지 않고 기존 객체를 복사해서 새로운 객체를 만들 수 있다.**

> **⚠️추가 설명**<br/>
> 보통 객체를 만들 때는 `new SomeClass()`같은 식으로 클래스에 의존하게 됩니다.<br/>
> 그런데 이렇게 하면 코드가 특정 클래스에 강하게 결합되는 현상이 발생됩니다.<br/>
> 프로토타입 패턴은 `new`대신 이미 존재하는 객체를 복사해 새로운 객체를 만듭니다.<br/>
> 이 방식에서 클라이언트가 구체적인 클래스 정보를 알 필요 없이 단순히 "복사해 주세요"라고만 요청하면 됩니다.<br/>
> 따라서 복잡한 초기화 과정을 반복하지 않고 손쉽게 동일한 속성을 가진 객체를 만들 수 있게 됩니다.

## 문제

객체가 존재하고 그 객체의 정확한 복사본을 만들고 싶다면 어떻게 해야할까요? 먼저 같은 클래스의 새로운 객체를 생성해야 합니다.<br/>
그런 다음 원본 객체의 모든 필드들을 살펴본 후 해당 값들을 새 객체에 복사해야 합니다.

하지만 주의할 점이 있습니다. 객체의 일부 필드가 비공개(private)라면 외부에서는 접근할 수 없으므로 모든 객체를 단순히 복사하는 방식으로는 재현할 수 없습니다.

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/ea97beb6-0de4-4476-9abb-d67520fd97ad" />

>객체를 '외부로부터' 복사하는 것은 항상 가능하지는 않습니다.

이 직접적인 접근 방식에는 한 가지 문제가 더 있습니다. 객체의 복제본을 생성하려면 객체의 클래스를 알아야 하므로, 당신의 코드가 해당 클래스에 결국 의존하게됩니다.<br/>
예를 들어 어떤 메서드가 특정 인터페이스를 따르는 객체를 매개변수로 받았을 때 우리는 그 객체가 따르는 인터페이스만 알 뿐 구체적인 구현 클래스는 알 수 없습니다.

## 해결책 
프로토타입은 복제 과정을 실제 복제 대상 객체에 위임합니다.<br/>
이 패턴은 복제를 지원하는 모든 객체가 따라야 할 공통 인터페이스를 정의합니다. 이 인터페이스를 통해 클라이언트 코드는 객체의 클래스에 결합되지 않고도 객체를 복제할 수 있습니다.<br/>
보통 이러한 인터페이스에는 `clone`메서드 하나만 포함됩니다. 

`clone`메서드의 구현 방식은 대부분의 클래스에서 비슷합니다. 미 메서드는 현재 클래스의 새로운 객체를 생성하고, 기존 객체의 모든 필드 값을 새 객체에 복사합니다.<br/>
대부분의 프로그래밍 언어에서는 동일한 클래스에 속한 객체낄는 서로의 `private`필드에도 접근할 수 있기 때문에 `private`필드도 복사할 수 있습니다. 

복제를 지원하는 객체를 프로토타입이라고 부릅니다.<br/>
객체에 수십 개의 필드와 수백 가지의 가능한 설정이 있는 경우, 이러한 객체를 복제하는 방식은 서브클래싱의 대안이 될 수 있습니다.

<img width="687" height="600" alt="image" src="https://github.com/user-attachments/assets/1641c29f-baf1-42ff-8589-ce57c3ddc309" />

프로토타이핑은 다음과 같이 작동합니다. 일단 다양한 방식으로 설정된 객체들의 집합을 만듭니다. 그 후 설정한 것과 비슷한 객체가 필요할 경우 처음부터 새 객체를 생성하는 대신 프로토타입을 복제하면 됩니다. 

## 실제상황 적용 

실제 산업에서의 프로토타입은 제품의 대량 생산을 시작하기 전 다양한 테스트를 수행하는데 사용됩니다.<br/>
그러나 프로그래밍의 프로토타입의 경우 프로토타입들은 실제 생산과정에 참여하지 않고 대신 수동적인 역할을 합니다.

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/998e04f0-3e05-4228-a7fe-3d59b0cb9e6d" />

산업 프로토타입들은 실제로 자신을 복제하지 않기 때문에, **프로토타입 패턴**에 더 가까운 예시는 세포의 유사분열과정입니다. 유사분열 후에는 한 쌍의 같은 세포가 형성됩니다. 원본 세포는 프로토타입 역할을 하며 복사본을 만드는 데 능동적 역할을 합니다.

## 구조 

<img width="1040" height="820" alt="image" src="https://github.com/user-attachments/assets/1f7546dd-c99b-47bb-ada3-8cad5823340c" />

1. Prototype Interface : 인터페이스는 복제 메서드들을 선언하며, 이 메서드들의 대부분은 단일 `clone`메서드 입니다.

2. Concrete Prototype : 클래스는 복제 메서드를 구현합니다. 원본 객체의 데이터를 복제본에 복사하는 것 외에도 이 메서드는 복제 프로세스와 관련된 일부 예외적인 경우들도 처리할 수 있습니다. (e.g. 연결된 객체 복제, 재귀 종속성 풀기)

3. Client : 프로토타입 인터페이스를 따르는 모든 객체의 복사본을 생성할 수 있습니다.

### Prototype Registry 

<img width="1100" height="980" alt="image" src="https://github.com/user-attachments/assets/43c9d550-0a0c-4d8e-a14b-660c85ac975e" />

1. 프로토타입 레지스트리는 자주 사용하는 프로토타입들에 쉽게 접근하는 방법을 제공합니다.<br/>
이 레지스트리는 복사될 준비가 된 미리 만들어진 객체들의 집합을 저장합니다. 가장 프로토타입 레지스트리는 `name → prototype` 해시 맵 입니다.<br/>
그러나 단순히 이름을 검색하는 것보다 더 나은 검색 기준이 필요한 경우 훨씬 더 탄탄한 레지스트리를 구축할 수 있습니다.

## 의사코드 

아래 예시에서의 프로토타입 패턴은 코드를 기하학적(도형) 객체들의 클래스들에 결합하지 않고도 해당 객체들의 정확한 복사본을 생성할 수 있습니다.

<img width="940" height="660" alt="image" src="https://github.com/user-attachments/assets/b4fc90bf-c02d-43e1-8986-c7a5b219e77c" />

모든 `Shape` 클래스는 같은 인터페이스를 따르며, 이 인터페이스는 복제 메서드를 제공합니다. 자식 클래스는 자신의 필드 값들을 생성된 객체에 복사하기 전에 부모의 복제 메서드를 호출할 수 있니다.

```ts
// Prototype 패턴: 공통 복제 인터페이스를 가진 추상 클래스
abstract class Shape {
  x: number;
  y: number;
  color: string;

  // 일반/프로토타입 생성자 겸용: source가 있으면 복사, 없으면 기본값
  constructor(source?: Shape) {
    if (source) {
      this.x = source.x;
      this.y = source.y;
      this.color = source.color;
    } else {
      this.x = 0;
      this.y = 0;
      this.color = "#000000";
    }
  }

  // 구체 클래스가 자신 타입의 복제본을 반환하도록 강제
  abstract clone(): Shape;
}

// 구상 프로토타입 1: Rectangle
class Rectangle extends Shape {
  width: number;
  height: number;

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

  clone(): Rectangle {
    // 현재 인스턴스를 인수로 넘겨 동일한 값들로 새 인스턴스 생성
    return new Rectangle(this);
  }
}

// 구상 프로토타입 2: Circle
class Circle extends Shape {
  radius: number;

  constructor(source?: Circle) {
    super(source);
    if (source) {
      this.radius = source.radius;
    } else {
      this.radius = 0;
    }
  }

  clone(): Circle {
    return new Circle(this);
  }
}

// 클라이언트 코드
class Application {
  shapes: Shape[] = [];

  constructor() {
    const circle = new Circle();
    circle.x = 10;
    circle.y = 10;
    circle.radius = 20;
    circle.color = "#ff0000";
    this.shapes.push(circle);

    const anotherCircle = circle.clone(); // circle의 동일 사본
    this.shapes.push(anotherCircle);

    const rectangle = new Rectangle();
    rectangle.width = 10;
    rectangle.height = 20;
    rectangle.x = 5;
    rectangle.y = 5;
    rectangle.color = "#00ff00";
    this.shapes.push(rectangle);
  }

  businessLogic(): Shape[] {
    // 요소의 구체 타입을 몰라도 clone()만 호출하면 적절한 복제가 일어남
    const shapesCopy: Shape[] = [];
    for (const s of this.shapes) {
      shapesCopy.push(s.clone());
    }
    return shapesCopy;
  }
}

// 사용 예시
const app = new Application();
const copies = app.businessLogic();
console.log(app.shapes, copies);
```
> 위 예시는 숫자와 문자열 같은 불변/원시 값만 복사합니다. 만약 필드에 객체(배열,Map)가 있다면, 복제가 얕은 복사가 되지 않도록 각 구상 클래스의 `constructor(source)`에서 해당 필드에 맞는 깊은 복사 로직을 추가하세요.

## js/ts에서는 잘 사용하지 않는 패턴 

JS/TS 에서는 해당 프로토타입 패턴을 잘 사용하지 않는 이유가 있습니다.<br/>
왜냐하면 JavaScript 객체는 본질적으로 프로토타입 체인을 이용해서 상속을 처리합니다. 이렇기에 별도의 프로토타입 패턴을 구현할 필요가 적습니다. 

이미 JavaScript 객체에는 `Object.create`, `({ ...obj})`, `Object.assign`과 같은 객체 복제 메서드가 존재합니다.
