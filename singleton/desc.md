# 📌 핵심 개념

Singleton은 <span style="color:indianred">**1회에 한하여 인스턴스화가 가능**</span>하며 전역에서 접근 가능한 클래스를 지정한다.
→ Singleton 인스턴스는 앱 전역에서 공유되기 때문에 앱의 전역 상태를 관리하기에 적합하다.

# 📌 Counter 예제

먼저 ES2015의 클래스로 작성된 Singleton 예제를 보자

```js
// method 목록들

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

> <span style="color:orange">**⚠️조건**</span> > <span style="color:skyblue">**1.**</span> 1회에 한하여 인스턴스가 가능하여야 한다. (인스턴스 생성을 **통제**하는 로직필요)
> <span style="color:skyblue">**2.**</span> 전역에서 접근 가능한 클래스여야 한다.

위 코드는 Singleton 패턴의 조건을 만족하지 않는다. Singleton 패턴은 인스턴스를 단 한 번만 만들 수 있어야하지만 현재 위의 코드에서는 `Counter` 인스턴스를 여러 번 만들 수 있다.

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

`new` 메서드를 두번 호출하여 `counter1`과 `counter2` 인스턴스를 만들고
`getInstance()`를 호출해서 비교해보면 서로 반환되는 인스턴스는 같지 않다.
**→ <span style="color:indianred">`counter1`과 `counter2`는 동일한 인스턴스가 아니다.</span>**
![](https://velog.velcdn.com/images/hunter_joe99/post/ae1248d5-a4cc-46a3-8e72-9c3fd5018352/image.png)

인스턴스를 한번만 생성할 수 있도록 하기 위해서는 **인스턴스를 통제**할 수 있는 로직이 필요하다고 앞서 언급했다.

통제를 위한 로직으로`instance`라는 변수를 만들고 `Counter` 클래스의 생성자에서 `instance`변수가 새로 생성된 인스턴스를 가르키도록 한다.

이제 `instance`라는 변수가 값이 있음을 검사하는 것으로 새로운 인스턴스의 생성을 막을 수 있다.

# 📌 통제 로직이 들어간 Counter 예제

```js
let instance;
let counter = 0;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("인스턴스는 한번만 생성이 가능합니다.");
    }
    console.log("인스턴스 생성 완료");
    instance = this;
  }

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
// Error: 인스턴스는 한번만 생성이 가능합니다.
```

이제 인스턴스를 여러 번 만드려고 한다면 `if`에 따라 더 이상 만들 수 없게 됩니다.

이렇게 만들어진 `Counter` 인스턴스를 export하기 전에 인스턴스를 `freeze`해야합니다.
`Object.freeze`메서드는 객체를 사용하는 쪽에서 직접 객체를 수정할 수 없도록 해줍니다.
`freeze`처리 된 인스턴스는 프로퍼티의 추가 및 수정이 불가하므로 Singleton 인스턴스의 프로퍼티를 덮어쓰는 실수를 예방할 수 있습니다.

# 📌 freeze를 활용한 Singleton

```js
let instance;
let counter = 0;

class Counter {
  constructor() {
    if (instance) {
      throw new Error("You can only create one instance!");
    }
    instance = this;
  }

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

const singletonCounter = Object.freeze(new Counter());
export default singletonCounter;
```

# 📌 단점과 장점 feat. 안티패턴

인스턴스를 하나만 만들도록 강제하면 많은 메모리 공간을 절약할 수 있다.
매번 새로운 인스턴스를 만들어 메모리 공간을 차지하도록 하는 대신에 앱 전체에서 사용가능한 하나의 인스턴스를 저장하기 위한 메모리를 사용했다.
<span style="color:indianred">**하지만 JavaScript에서 Singleton 패턴은 안티패턴으로 여겨지곤한다.**</span>

Java, C++ 같은 다양한 언어들은 JavaScript처럼 객체를 직접적으로 만들어 낼 수 없다.
이런 객체지향 프로그래밍 언어에서는 객체를 만들기 위한 클래스를 꼭 작성해야 한다.
이렇게 만든 객체는 위의 `instance`변수와 같이 클래스의 인스턴스가 된다.

JavaScript에서는 클래스를 작성하지 않아도 객체를 만들 수 있기 때문에 이제껏 살펴본 예제들은 약간의 오버 엔지니어링(안티패턴)이라고 볼 수 있다.
객체 리터럴을 사용해서도 동일한 구현을 할 수 있다.

> **객체 리터럴**

```js
let count = 0;
>
const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  },
};
```

# 📌 Singleton과 전역 상태의 문제점

<span style="color:skyblue">**1. 전역 변수의 오염 위험**</span>

- Singleton 인스턴스는 앱 전체에서 접근 가능 → 전역 변수처럼 동작.
- 전역 변수는 잘못된 값으로 덮어쓰이면 앱 전체에서 예외 발생 가능.

<span style="color:skyblue">**2.ES2015(ES6) 이후 변화**</span>

- `let`, `const` 도입 → 블록 스코프 제공, 실수로 전역 변수 생성하는 문제 방지.
- `import/export` 모듈 시스템 → 전역 객체를 오염시키지 않고 모듈 단위에서 전역처럼 사용 가능.

<span style="color:skyblue">**3. Singleton의 전역 상태 문제**</span>

- 앱 전반에서 공유·수정되는 하나의 객체를 직접 접근하도록 하면 예외 발생 위험 ↑
- 데이터 초기화/사용 순서가 중요해져서 버그가 생기기 쉬움.
- 규모가 커질수록 전역 상태를 참조하는 컴포넌트 간 의존관계 파악이 어려워짐.

# 📌 React 의 상태 관리

React에선 전역 상태 관리를 위해 Singleton 객체를 만드는 것 대신 Redux나 React Context를 자주 사용한다. Singleton과 유사해 보이지만 Singleton은 인스턴스의 값을 직접 수정할 수 있는 반면에, 언급한 도구들은 읽기 전용 상태를 제공한다. Redux를 사용할 땐 오직 컴포넌트에서 디스패쳐를 통해 넘긴 액션에 대해 실행된 순수함수 리듀서를 통해서만 상태를 업데이트할 수 있다.

위에서 언급한 전역 상태에 대한 단점이 모두 사라지는 것은 아니지만. 컴포넌트가 직접 상태를 업데이트하게 두는 것은 아니고 개발자가 의도한대로만 수정되도록 하고 있는 것이다.

# 📌 언제 사용하면 좋을까?

Singleton 패턴은 프로그램의 클래스에 모든 클라이언트가 사용할 수 있는 단일 인스턴스만 있어야 할 때 사용하면 좋습니다.
e.g) **프로그램의 다른 부분들에서 공유되는 단일 데이터베이스 객체처럼!!**

# 📌 Counter 예제 - GihHub

- https://github.com/HighRol1er/Design-Pattern-Study/tree/main/singleton

# 타입스크립트로 작성된 Singleton

Singleton은 전역 변수들과 거의 같은 장단점을 가지고 있다
→ 편리하나 코드의 모듈성을 깨트린다.
복잡도 : ★☆☆
인기도 : ★★☆

## 카운터 예제

```ts
/**
 * 카운터를 관리하는 Singleton 클래스
 */
class Counter {
  // 유일한 인스턴스를 담을 private 정적 변수
  static #instance: Counter;

  // 내부 상태 (count 값)
  private count = 0;

  // 외부에서 new Counter()로 직접 만들지 못하도록 private 생성자
  private constructor() {}

  // Singleton 인스턴스에 접근하는 정적 getter
  public static get instance(): Counter {
    if (!Counter.#instance) {
      Counter.#instance = new Counter(); // 처음 요청 시에만 인스턴스 생성
    }
    return Counter.#instance; // 이후에는 같은 인스턴스를 반환
  }

  // 카운터 증가
  public increment() {
    this.count++;
    return this.count;
  }

  // 카운터 감소
  public decrement() {
    this.count--;
    return this.count;
  }

  // 현재 값 반환
  public get value() {
    return this.count;
  }
}

/**
 * 클라이언트 코드 (여러 군데에서 Counter.instance를 가져다 씀)
 */
function clientCode() {
  const c1 = Counter.instance;
  const c2 = Counter.instance;

  console.log("c1에서 증가:", c1.increment()); // 1
  console.log("c2에서 증가:", c2.increment()); // 2
  console.log("c1 값 확인:", c1.value); // 2
  console.log("c2 값 확인:", c2.value); // 2

  console.log(c1 === c2); // true → 두 변수는 같은 인스턴스
}

clientCode();
```

# 참고자료

- https://patterns-dev-kr.github.io/design-patterns/singleton-pattern/
- https://refactoring.guru/ko/design-patterns/singleton/typescript/example#example-0
