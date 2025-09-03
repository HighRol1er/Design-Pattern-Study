# Singleton

## 의도

싱글톤은 1회에 한해 인스턴스화가 가능하며 전역에서 접근 가능한 클래스를 지정한다.
→ Singleton 인스턴스는 앱 전역에서 공유되기 때문에 앱의 전역 상태를 관리하기에 적합하다.

## Counter 예제

먼저의 클래스 문법으로 작성된 Singleton 예제를 보자

```js
// 사용될 메서드 목록
 * getInstance() : 메서드는 인스턴스 자체를 반환
 * getCount() : 메서드는 counter 변수를 반환
 * increment() : 메서드는 counter 변수를 1 증가
 * decrement() : 메서드는 counter 변수를 1 감소
```

```js
let counter = 0;

class Counter {
  getInstance() {
    return this;
  }

  getCount() {
    return counter;
  }

  increment() {
    return ++counter;
  }

  decrement() {
    return --counter;
  }
}
```

> ⚠️조건<br/>
>
> 1. 1회에 한하여 인스턴스가 가능해야 한다.(인스턴스 생성을 통제하는 로직도 필요)<br/>
> 2. 전역에서 접근 가능한 클래스여야 한다.

위 코드는 Singleton 패턴의 조건을 만족하지 않는다. Singleton 패턴은 인스턴스를 단 한 번만 만들 수 있어야하지만 현재 위의 코드에서는 Counter 인스턴스를 여러 번 만들 수 있다.

```js
let counter = 0;

class Counter {
  getInstance() {
    return this;
  }

  getCount() {
    return counter;
  }

  increment() {
    return ++counter;
  }

  decrement() {
    return --counter;
  }
}

const counter1 = new Counter();
const counter2 = new Counter();

console.log(counter1.getInstance() === counter2.getInstance()); // false
```

`new` 생성자를 두번 호출하여 `counter1`과 `counter2` 인스턴스를 만들고
`getInstance()`를 호출해서 비교해보면 서로 반환되는 인스턴스는 같지 않다.
→`counter1`과 `counter2`는 동일한 인스턴스가 아니다.
