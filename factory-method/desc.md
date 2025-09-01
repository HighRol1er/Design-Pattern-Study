# Factory Method

---

## 의도

Factory Method 패턴은 부모 클래스가 객체를 생성할 수 있는 공통 인터페이스를 제공하고
실제로 어떤 객체를 만들지는 자식 클래스가 결정하도록 하는 패턴이다.

## 문제

만약 물류 앱을 개발하고 있다고 가정해봅시다.
앱의 첫 번째 버전은 트럭 운송만을 처리할 수 있어서 대부분의 코드가 `Truck` Class에 있습니다.

얼마 후, 앱이 유명해지고 해상 물류 회사들로부터 해상 물류 기능을 앱에 추가해 달라는 요청을 받습니다.

그러나 현재 대부분의 코드는 `Truck` Class에 결합되어 있어 `Ship`클래스를 추가하려면 전체 코드 베이스를 변경해야 합니다.
**→ 추후 또 다른 운송수단을 추가하려면 아마 전체 코드 베이스를 수정해야 할 것입니다.**
그러면 결과적으로 많은 조건문이 운송 수단 객체들의 클래스에 따라 앱의 행동을 바꾸는 매우 복잡한 코드가 작성될 것입니다.

```js
// Truck에 강한 커플링 구조를 갖는 현재 앱 구조

class Truck {
  deliver(cargo, destination) {
    console.log(`🚚 트럭이 ${cargo}를 ${destination}까지 운송합니다.`);
  }
}

function startDeliver(cargo, destination) {
  const truck = new Truck();
  truck.deliver(cargo, destination);
}

startDeliver("상품", "서울");
```

만약 해당 코드에서 다른 운송수단(e.g `Ship`)을 추가하려면 전체 코드 베이스는 아래처럼 될 것입니다.

```js
class Truck {
  deliver(cargo, destination) {
    console.log(`🚚 트럭이 ${cargo}를 ${destination}까지 운송합니다.`);
  }
}
// 새로운 운송수단 추가
class Ship {
  deliver(cargo, destination) {
    console.log(`🚢 배가 ${cargo}를 ${destination}까지 운송합니다.`);
  }
}

function startDeliver(transportType, cargo, destination) {
  if (transportType === "truck") {
    const truck = new Truck();
    truck.deliver(cargo, destination);
  } else if (transportType === "ship") {
    const ship = new Ship();
    ship.deliver(carge, destination);
  } else {
    console.log("현재 지원되지 않는 운송수단입니다.");
  }
  // 다른 운송수단 추가시 계속 증가
}

startDeliver("truck", "상품", "서울");
startDeliver("ship", "상품", "부산항");
```

> 결과적으로 많은 조건문이 생성되며, 운송수단 객체들의 Class에 따라 앱의 행동을 바꾸는 복잡한 코드가 작성될 것입니다.

## 해결책

팩토리 메서드 패턴은 `new`를 직접 쓰는 대신 객체 생성을 전용 메서드(팩토리 메서드)로 추상화해서 처리하자고 제안합니다.
사실 내부적으로는 여전히 `new`를 통해서 인스턴스가 만들어지지만 이 로직을 팩토리 메서드 안으로 숨기는 거죠
그리고 팩토리 메서드가 return 하는 객체를 흔히 **Product**라고 부릅니다.

> 직접 `new`생성자 함수를 호출해서 인스턴스를 생성하는 대신 생성자 함수를 팩토리 메서드에게 위임하라는 뜻입니다.
