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
<img width="1320" height="760" alt="image" src="https://github.com/user-attachments/assets/dde3ca12-b95c-46de-82e8-73125eef207f" />

<img width="2158" height="1280" alt="image" src="https://github.com/user-attachments/assets/17a34332-cccd-4ab6-b3ea-d55e06dcaf2b" />


# 참고 자료

https://heyjoshlee.medium.com/factory-functions-in-javascript-the-how-and-why-d8988bda654a
https://reactiveprogramming.io/blog/en/design-patterns/factory-method
