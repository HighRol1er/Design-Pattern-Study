# Factory Method
복잡도 : ★☆☆<br/>
인기도 : ★★★ 

## 의도

Factory Method 패턴은 부모 클래스가 객체를 생성할 수 있는 공통 인터페이스를 제공하고<br/>
실제로 어떤 객체를 만들지는 자식 클래스가 결정하도록 하는 패턴이다.

## 문제

만약 물류 앱을 개발하고 있다고 가정해봅시다.<br/>
앱의 첫 번째 버전은 트럭 운송만을 처리할 수 있어서 대부분의 코드가 `Truck` Class에 있습니다.<br/>

얼마 후, 앱이 유명해지고 해상 물류 회사들로부터 해상 물류 기능을 앱에 추가해 달라는 요청을 받습니다.<br/>

그러나 현재 대부분의 코드는 `Truck` Class에 결합되어 있어 `Ship`클래스를 추가하려면 전체 코드 베이스를 변경해야 합니다.<br/>
**→ 추후 또 다른 운송수단을 추가하려면 아마 전체 코드 베이스를 수정해야 할 것입니다.**<br/>
그러면 결과적으로 많은 조건문이 운송 수단 객체들의 클래스에 따라 앱의 행동을 바꾸는 매우 복잡한 코드가 작성될 것입니다.<br/>

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

팩토리 메서드 패턴은 `new`를 직접 쓰는 대신 객체 생성을 전용 메서드(팩토리 메서드)로 추상화해서 처리하자고 제안합니다.<br/>
사실 내부적으로는 여전히 `new`를 통해서 인스턴스가 만들어지지만 이 로직을 팩토리 메서드 안으로 숨기는 거죠<br/>
그리고 팩토리 메서드가 return 하는 객체를 흔히 **Product**라고 부릅니다.<br/>

> 직접 `new`생성자 함수를 호출해서 인스턴스를 생성하는 대신 생성자 함수를 팩토리 메서드에게 위임하라는 뜻입니다.

<img width="1240" height="540" alt="image" src="https://github.com/user-attachments/assets/a19fa841-903e-4daa-8d77-ab3f0d76c1bc" />

이러한 변경은 무의미해 보일 수도 있습니다. 왜냐 생성자 호출을 프로그램의 한 부분에서 다른 부분으로 옮기기만 했을 뿐이기 때문입니다.<br/>
그러나 위와 같은 변경 덕분에 이제 자식 Class에서 팩토리 메서드를 오버라이딩하고 그 메서드에 의해 생성되는 제품들의 클래스를 변경할 수 있게 되었습니다.

> **생성되는 제품들의 클래스를 변경가능하다는게 무슨 말일까?**<br/>
> 1. 부모 클래스에는 공장(팩토리 메서드)만 정의되어 있음<br/>
> 2. 자식 클래스가 이 팩토리 메서드를 오버라이딩해서 실제 어떤 "Product Class"를 만들지를 바꿀 수 있다는 것 (e.g `Ship`, `Truck` 중 선택 가능)<br/>
> 부모 클래스는 `createProduct()`라는 팩토리 메서드만 있음<br/>
> 실제로 어떤 클래스를 만들지는 모르겠음(클라이언트의 영역)<br/>
> 자식 클래스는 내가 `createProduct()`를 오버라이드해서 어떤 Product를 만들지 정함<br/>

여기에는 제약이 있는데 다음과 같습니다.<br/>  
자식 클래스가 다른 **Product Class(제품 유형)**을 반환하기 위해서는 공통된 `class`나 `interface`를 가져야 합니다.<br/>
e.g) 앞에서 언급한 운송수단(`Truck`,`Ship`)은 `Transport`인터페이스를 구현하므로<br/>
부모 클래스인 `Logistics`은 팩토리 메서드 `createTransport`의 반환 타입을 `Transport`로 선언해야 합니다.<br/>

<img width="980" height="500" alt="image" src="https://github.com/user-attachments/assets/0d43f415-5375-4b10-a396-7be7357cd366" />

`Truck`과 `Ship` 클래스들은 모두 `Transport` 인터페이스를 토대로 만들어지며 `Transport` 인터페이스는 `deliver` 메서드를 선언합니다.<br/>
그러나 각 구체 클래스는 이 메서드를 다르게 구현합니다.<br/>
트럭은 육로로 화물을 배달하며 선박은 해상으로 화물을 배달합니다.<br/>
- `RoadLogistics` 클래스에 포함된 팩토리 메서드는 `Truck`객체들을 반환합니다.<br/>
- `SeaLogistics`클래스에 포함된 팩토리 메서드는 `ship` 객체들을 반환합니다.<br/>

```ts
// Product
interface Transport {
  deliver(): void;
}

// Concrete product
class Truck implements Transport {
  deliver() {
    console.log("🚚 트럭이 배송합니다.");
  }
}

class Ship implements Transport {
  deliver() {
    console.log("🚢 선박이 배송합니다.");
  }
}

// Creator 
abstract class Logistics { 
  abstract createTransport(): Transport;

  planDelivery() {
    const transport = this.createTransport();
    transport.deliver();
  }
}

// 지상 물류
class RoadLogistics extends Logistics {
  createTransport(): Transport {
    return new Truck();
  }  
}

// 해양 물류
class SeaLogistics extends Logistics {
  createTransport(): Transport {
    return new Ship();
  }
}
```

### Client code 
팩토리 메서드를 사용하는 코드를 Client code라고 부르며, Client code는 다양한 자식 클래스들에서 실제로 반환되는 여러 제품간의 차이를 알지 못합니다. Client code는 모든 제품을 추상`Transport`로 간주합니다.<br/>
클라이언트는 모든 `Transport`객체들이 `deliver` 메서드를 가져야 한다는 사실만을 알고 있을 뿐, 이 메서드가 정확히 어떻게 작동하는지는 클라이언트에게 중요하지 않습니다. 
```ts
function clientCode(logistics: Logistics) {
  logistics.planDelivery();
}

clientCode(new RoadLogistics());
clientCode(new SeaLogistics());
```
<img width="368" height="137" alt="스크린샷 2025-09-01 오후 6 58 20" src="https://github.com/user-attachments/assets/3d4f88b2-d694-4c15-8e3b-a620aa45d38a" />

## 구조 

<img width="1320" height="760" alt="image" src="https://github.com/user-attachments/assets/4de99a80-7ce8-4eec-bc7a-d22a81830cab" />

1. Product 인터페이스 선언 : 인터페이스는 생성자와 자식 클래스들이 생성할 수 있는 모든 공통 객체<br/>
2. Concrete Product : 제품 인터페이스의 구양한 실제 구현들<br/>
3. Creator 클래스는 새로운 제품 객체들을 반환하는 팩토리 메서드를 선언 :<br/>
   - 중요한 점은 팩토리 메서드의 return type이 Product 인터페이스와 일치해야 합니다.(`factory method return === Product interface`)<br/>
   - 당신은 팩토리 메서드를 `abstract`로 선언하여 모든 자식 클래스들이 각각 이 메서드의 자체 버전들을 구현하도록 강제할 수 있으며 또 기초 팩토리 메서드가 기본값을 가지는 제품 타입을 반환하도록 만들 수도 있습니다.
   - Creator라는 이름에도 불구하고 Creator의 주요한 책임은 제품을 생성하는 것은 아닙니다. 일반적으로 Creator 클래스에는 이미 제품과 관련된 핵심 비즈니스 로직이 있으며, 팩토리 메서드는 이 로직을 구체 제품 클래스들로부터 디커플링(분리) 하는데 도움을 줄 뿐입니다.
4. Concrete Creator : 기초 팩토리 메서드를 오버라이드하여 다른 type의 product를 반환하게 합니다.
   - 참고로 팩토리 메서드는 항상 새로운 인스턴스를 생성할 필요가 없습니다. 팩토리 메서드는 기존 객체들을 cache, obejct pool 또는 다른 소스로부터 반환할 수 있습니다.
