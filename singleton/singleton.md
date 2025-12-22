# Singleton

## 정의

> 싱글턴 패턴을 따르는 클래스는 생성자가 여러 차례 호출되더라도 실제로 생성되는 객체는 하나이고 최소 생성 이후에 호출된 생성된 생성자는 최초의 생성자가 생성한 객체를 반환한다. - 위키피디아

> 싱글턴은 클래스에 인스턴스가 하나만 있도록 하면서 해당 인스턴스에 대한 전역 접근 지점을 제공하는 생성 디자인 패턴 - 리팩토링 구루

1. 생성자 여러 차례 호출 → 반환되는 객체는 최초의 생성된 객체
2. 전역 접근을 지원

## 싱글톤은 단일책임 원칙을 위반한다?

1. 인스턴스의 생명주기를 관리

- 클래스 스스로 단 **하나의 인스턴스만**존재해야 한다는 조건을 관리하는 책임을 짐

- 싱글톤은 스스로 생성 로직을 제어, 중복 생성을 막는 로직까지 포함

2. 고유 비즈니스 로직 수행

- 해당 클래스가 원래 설계된 목적(비즈니스 로직)또한 같이 수행

## 싱글톤의 공통 구현 과정 (2step)

- 다른 객체들이 싱글톤 클래스와 함께 `new`연산자를 사용하지 못하도록 디폴트 생성자를 비공개로 설정

- 미리 생성된 정적 메서드를 반환하기 `getInstance()`

## 다이어그램

<img width="860" height="580" alt="image" src="https://github.com/user-attachments/assets/46e18212-81b1-4c9f-b951-c2dca19cfcdd" />

## 예시 코드

```ts
class Singleton {
  private static instance: Singleton;

  private consturctor() {}

  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }

    return Singleton.instance;
  }

  public someLogic() {
    console.log("로직 실행");
  }
}

const client1 = Singleton.getInstance();
const client2 = Singleton.getInstance();

console.log(client1 === client2); // true
```

# 추가

## 싱글톤은 안티 패턴이다?
