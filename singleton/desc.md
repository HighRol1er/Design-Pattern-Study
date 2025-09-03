# Singleton

복잡도 : ★☆☆<br/>
인기도 : ★★☆

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

위 코드는 Singleton 패턴의 조건을 만족하지 않습니다. Singleton 패턴은 인스턴스를 단 한 번만 만들 수 있어야하지만 현재 위의 코드에서는 `Counter` 인스턴스를 여러 번 만들 수 있다는 문제가 있습니다..

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

`new` 생성자를 두번 호출하여 `counter1`과 `counter2` 인스턴스를 만들고<br/>
`getInstance()`를 호출해서 비교해보면 서로 반환되는 인스턴스는 같지 않다.<br/>
→`counter1`과 `counter2`는 동일한 인스턴스가 아니다.

<img width="787" height="597" alt="스크린샷 2025-09-03 오후 2 49 27" src="https://github.com/user-attachments/assets/64cb9c8c-5897-4a8e-b4ed-a082c676cf05" />

인스턴스를 한번만 생성할 수 있도록 하기 위해서는 인스턴스를 통제할 수 있는 로직이 필요하다고 앞서 언급했습니다.<br/>
통제를 위한 로직으로instance라는 변수를 만들고 Counter 클래스의 생성자에서 instance변수가 새로 생성된 인스턴스를 가르키도록 한다.<br/>
이제 instance라는 변수가 값이 있음을 검사하는 것으로 새로운 인스턴스의 생성을 막을 수 있습니다.

## 통제로직이 들어간 Counter 예제 

```js
let instance
let counter = 0

class Counter {
  constructor() {
    if (instance) {
      throw new Error('인스턴스는 한번만 생성이 가능합니다.')
    }
    console.log('인스턴스 생성 완료');
    instance = this
  }

  getInstance() {
    return this
  }

  getCount() {
    return counter
  }

  increment() {
    return ++counter
  }

  decrement() {
    return --counter
  }
}

const counter1 = new Counter()
const counter2 = new Counter()
// Error: 인스턴스는 한번만 생성이 가능합니다.
```

이제 인스턴스를 여러개 만드려고 한다면 `if`조건문에 따라 더 이상 만들 수 없게 됩니다.<br/>
이렇게 만들어진 `Counter`인스턴스를 `export`하기 전에 만들어둔 인스턴스를 `freeze`해야합니다.<br/>
`Object.freeze`메서드는 객체를 사용하는 쪽에서 직접 객체를 수정할 수 없도록 해줍니다.<br/>
`freeze`처리 된 인스턴스는 프로퍼티의 추가 및 수정이 불가하므로 Singleton 인스턴스의 프로퍼티를 덮어쓰는 실수를 예방할 수 있습니다.

## freeze를 활용한 Singleton

```js
let instance
let counter = 0

class Counter {
  constructor() {
    if (instance) {
      throw new Error('You can only create one instance!')
    }
    instance = this
  }

  getInstance() {
    return this
  }

  getCount() {
    return counter
  }

  increment() {
    return ++counter
  }

  decrement() {
    return --counter
  }
}

const singletonCounter = Object.freeze(new Counter())
export default singletonCounter
```

## 단점과 장점 feat. 안티패턴

인스턴스를 하나만 만들도록 강제하면 매번 새로운 인스턴스를 생성하는 대신 앱 전체에서 공유할 하나의 인스턴스만 유지하므로 메모리를 절약할 수 있습니다. 
> 하지만 JavaScript에서 싱글톤 패턴은 종종 안티패턴으로 여겨집니다.<br/>
왜냐 Java, C++ 같은 다양한 언어들은 JavaScript처럼 객체를 직접적으로 만들어 낼수 없습니다.<br/>
이런 객체지향 프로그래밍 언어에서는 객체를 만들기 위한 클래스를 꼭 작성해합니다.<br/>
이렇게 만든 객체는 위의 `instance`변수와 같이 클래스의 인스턴스가 됩니다.

JavaScript에서는 클래스를 작성하지 않아도 객체를 만들 수 있기 때문에 이제껏 살펴본 예제들은 약간의 오버 엔지니어링(안티패턴)이라고 볼 수 있습니다.<br/>
또한 객체 리터럴을 사용해서도 동일한 구현을 할 수 있습니다.

```js
// 객체 리터럴
let count = 0;

const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  },
};
```

## Singleton과 전역 상태의 문제점 

1. 전역 변수의 오염 위험

- Singleton 인스턴스는 앱 전체에서 접근 가능 → 전역 변수처럼 동작.
- 전역 변수는 잘못된 값으로 덮어쓰이면 앱 전체에서 예외 발생 가능.
  
2.ES2015(ES6) 이후 변화

- `let`, `const` 도입 → 블록 스코프 제공, 실수로 전역 변수 생성하는 문제 방지.
`import/export` 모듈 시스템 → 전역 객체를 오염시키지 않고 모듈 단위에서 전역처럼 사용 가능.

3. Singleton의 전역 상태 문제

- 앱 전반에서 공유·수정되는 하나의 객체를 직접 접근하도록 하면 예외 발생 위험 ↑
- 데이터 초기화/사용 순서가 중요해져서 버그가 생기기 쉬움.
- 규모가 커질수록 전역 상태를 참조하는 컴포넌트 간 의존관계 파악이 어려워짐.

## React 의 상태 관리

React에선 전역 상태 관리를 위해 Singleton 객체를 만드는 것 대신 Redux나 React Context를 자주 사용합니다.<br/>
Singleton과 유사해 보이지만 Singleton은 인스턴스의 값을 직접 수정할 수 있는 반면, Redux나 React Context들은 읽기 전용 상태를 제공합니다.<br/>

>Redux를 사용할 땐 오직 컴포넌트에서 디스패쳐를 통해 넘긴 액션에 대해 실행된 순수함수 리듀서를 통해서만 상태를 업데이트할 수 있습니다.

위에서 언급한 전역 상태에 대한 단점이 모두 사라지는 것은 아니지만, 컴포넌트가 직접 상태를 업데이트하게 두는 것은 아니고 개발자가 의도한대로만 수정되도록 하고 있는 것입니다.
