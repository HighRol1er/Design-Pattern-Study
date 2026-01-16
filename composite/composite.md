# Composite(복합체) 

## 개요 
> 객체들을 트리 구조들로 구성한 후, 이러한 구조들을 개별 객체들처럼 다룰 수 있도록 하는 구조 패턴 -리팩토링 구루<br/>

> 객체들의 관계를 트리 구조로 구성하여 부분-전체 계층을 표현하는 패턴, 사용자가 단일 객체와 복합 객체 모두 동일하게 다루도록 한다. - 위키피디아

**트리 구조**의 개별 객체와 그룹을 동일한 인터페이스로 다룰 수 있다.

## 구조-다이어그램 feat(정처기.. UML)

<img width="533" height="304" alt="스크린샷 2026-01-16 오전 2 44 55" src="https://github.com/user-attachments/assets/54ccf945-6298-4896-8001-0d721fa2dc6c" />

1. 실선 + 빈 삼각형 화살표 (일반화 - Generalization)
- 객체지향의 상속 또는 인터페이스 구현의 의미
- 하위 클래스 (`Leaf, Composite`)가 상위 클래스(`Component`)의 속성과 메서드를 물려 받았다는 뜻.
- `Leaf` `Composite`는 모두 `Component`라는 공통된 타입을 가짐 -> 이 덕에 클라이언트는 둘을 구분하지 않고 동일한 메서드(`operation()`)를 다룰(호출)할 수 있음

2. 빈 마름모: (집합- Aggregation)
- 연관 관계중 하나로 다른 객체를 포함하는 부분-전체 관계를 의미 (has-a)
- 느슨한 관계(서로 독립적)로 포함하는 쪽(`Composite`)이 사라져도 무방
- 0..*`Component` child ---◇ parent `Composite`
- `Composite`객체 속에 여러 개의 `Component`를 가지고 있다.
- 특히 복합체 패턴에서는 자기 자신을 참조하는 재귀적 구조를 표현하고 있어, 트리 구조의 핵심이 됨

> 이러한 재귀적 구조 덕분에 Composite 안에 `Leaf`, `Composite`를 여러개 넣을 수 있는 트뤼 구조구나!

## 코드
```ts  
type Role = 'admin' | 'guest'

// <<interface>> Component
interface Component {
  operator(role: Role) : void;
  getName(): string
}

// leaf
class Filex implements Component {
  constructor(
    private readonly name: string,
    private readonly allowedRoles : Role[]
  ) {}

  public getName(): string { return this.name}

  public operator(role: Role) : void {
    if (!this.allowedRoles.includes(role)) {
      console.log(`${this.name}: access denied`)
      return;
    };

    console.log(`${this.name}: access accepted`);
  } 

}
// Composite
class Directoryx implements Component {
private components: Component[] = [];

  constructor(
    private readonly name: string,
    private readonly allowedRoles: Role[] 
  ) {}

public getName(): string { return this.name; }

  public add(n: Component): void {
    this.components.push(n);
  }

  public operator(role: Role): void {
    console.log(`---User Role : ${role}---`)
    if (!this.allowedRoles.includes(role)) {
      console.log(`${this.name}: access denied`)
      return;
    }

    console.log(`${this.name}: access accepted`);
    for (const c of this.components) {
      c.operator(role);
    }
  }
}

const clientx = (role: Role) => {
  const rootDir = new Directoryx('Root', ['admin', 'guest']);
  const publicFile = new Filex('notice.txt', ['admin', 'guest']);


  const adminDir = new Directoryx('admin', ['admin']);
  const secretFile = new Filex('top_secret.txt', ['admin']);
  
  adminDir.add(secretFile);

  rootDir.add(publicFile);
  rootDir.add(adminDir);

  rootDir.operator(role);
};

clientx('guest'); 
// clientx('admin');
```

## 장/단점

- 장점
1. 다형성과 재귀 사용(중복제거) -> 복잡한 트리 구조에 굿<br>
2. OCP 원칙

- 단점
1. 기능이 너무 다른 클래스들에는 공통 인터페이스를 제공하기 어려울 수 있으며, 어떤 경우에는 컴포넌트 인터페이스를 과도하게 일반화해야 하여 이해하기 어렵게 만들 수 있습니다.

> 억지로 같지 않은 것을 같게 만들려고 할 때 발생하는 부작용

### LSP(Liskov Substitution Principle), 리스코프 치환 원칙

<img width="1012" height="207" alt="스크린샷 2026-01-16 오후 5 39 41" src="https://github.com/user-attachments/assets/894be4ec-f365-4b95-9ca6-a14ddbb1331f" />
> 인파 : https://inpa.tistory.com/entry/OOP-%F0%9F%92%A0-%EC%95%84%EC%A3%BC-%EC%89%BD%EA%B2%8C-%EC%9D%B4%ED%95%B4%ED%95%98%EB%8A%94-LSP-%EB%A6%AC%EC%8A%A4%EC%BD%94%ED%94%84-%EC%B9%98%ED%99%98-%EC%9B%90%EC%B9%99

### 자식의 잘못된 메소드 오버로딩
- 예외를 던져버림
```java
class Animal {
    int speed = 100;

    int go(int distance) {
        return speed * distance;
    }
}
// ❌return 타입도, 매개변수도 바꿔버림❌
class Eagle extends Animal {
    String go(int distance, boolean flying) {
        if (flying)
            return distance + "만큼 날아서 갔습니다.";
        else
            return distance + "만큼 걸어서 갔습니다.";
    }
}
```
### 잘못된 상속 관계 구성으로 인한 메서드 정의
자식 클래스가 부모 인터페이스의 기능을 수행하지 못해 예외를 던져야만 하는 상황
```java
abstract class Animal {
    void speak() {}
}

class Cat extends Animal {
    void speak() {
        System.out.println("냐옹");
    }
}

class Dog extends Animal {
    void speak() {
        System.out.println("멍멍");
    }
}

class Fish extends Animal {
    void speak() {
        try {
            throw new Exception("물고기는 말할 수 없음");
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
```


