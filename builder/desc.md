# Builder Pattern

복잡도 : ★★☆<br/>
인기도 : ★★★

## 의도

빌더는 복잡한 객체들을 단계별로 생성할 수 있는 생성 디자인 패턴입니다.<br/>
이 패턴을 사용하면 동일한 제작코드를 통해 객체의 다양한 결과물(유형/표현)을 만들어낼 수 있습니다.

<img width="1280" height="800" alt="image" src="https://github.com/user-attachments/assets/606b2293-aff1-4c16-9605-1c939b918014" />

## 문제

많은 필드와 중첩된객체들을 힘들게 단계별로 초기화해야 하는 복잡한 객체를 상상해보세요. 이러한 초기화 코드는 일반적으로 많은 매개변수가 있는 괴물 같은 생성자 내부에 묻혀 있습니다.<br/>
또한 더 최악의 상황에는 클라이언트 코드 전체에 흩어져 있을 수도 있습니다.

### e.g) 안티패턴 코드

```ts
class Address {
  constructor(
    public line1: string,
    public line2: string | null,
    public city: string,
    public state: string | null,
    public zip: string | null,
    public country: string
  ) {}
}

class SecuritySettings {
  constructor(
    public mfaEnabled: boolean,
    public backupCodes: string[],
    public lastPasswordResetAt: Date | null
  ) {}
}

class Preferences {
  constructor(
    public theme: "light" | "dark",
    public language: Language,
    public marketingOptIn: boolean
  ) {}
}

class UserProfile {
  // 필드가 너무 많고, 중첩 객체도 있음
  constructor(
    public id: string,
    public email: string,
    public name: string,
    public phone: string | null,
    public birth: Date | null,
    public address: Address,
    public preferences: Preferences,
    public security: SecuritySettings,
    public createdAt: Date,
    public updatedAt: Date
  ) {}
}

const MonsterUser = new UserProfile(
  "exampleId",
  "example@email.com",
  "John Doe",
  new Address("Wall.St", null, "USA", null, null, "KR")
  new Preferences("dark", "ko", true),
  new SecuritySettings(true, ["A1", "B2"], null),
  new Date(),
  new Date()
);

// 인자 하나만 잘못 넣어도 런타임 에러 발생!
```

유저 하나를 생성하기 위해서 인자의 순서, 의미가 너무많아 코드 가독성은 현저히 떨어지게 됩니다.
안티패턴코드를 알아보았으니 다시 본문으로 가봅시다.

<img width="1200" height="700" alt="image" src="https://github.com/user-attachments/assets/9bdf08bd-fe1f-47dc-b5d8-fe8d1ff18f1f" />

예를 들어 `House`객체를 만드는 방법에 대해 생각해 봅시다. 간단히 집을 지으려면

- 4개의 벽
- 바닥
- 문
- 한쌍의 창문
- 지붕

이렇게 만들어야 합니다. 하지만 뒤뜰과 기타 물품(난방 시스템, 배관, 전기배선)이 있는 더 크고 현대적인 집을 원할경우 어떻게 해야 할가요?<br/>
위 문제의 가장 간단한 해결책은 기초 `House`클래스를 확장하고 매개변수의 모든 조합을 포함하는 자식 클래스들의 집합을 만드는 것입니다.<br/>
그러나 당신은 결국 상당한 수의 자식 클래스를 만들 수 밖에 없게 됩니다. 새로운 매개변수(e.g: 현관 스타일)를 추가할 때마다 이 계층구조는 훨씬 더 복잡해질 것입니다.

자식 클래스들을 늘리지 않는 다른 접근 방식이 있습니다. 기초 `House`클래스에 `House`객체를 제어하는 모든 가능한 매개변수를 포함한 거대한 생성자를 만드는 것입니다. 이 접근 방식은 실제로 자식 클래스들의 필요성을 제거하나, 다른 문제를 야기합니다.

<img width="1200" height="700" alt="image" src="https://github.com/user-attachments/assets/8805093b-e13e-47fe-ac6e-2e6ab2a52099" />

보통 대부분의 매개변수가 사용되지 않아 생성자 호출들의 코드가 매우 못생겨질 것입니다. 예를 들어 극소수의 집들에만 수영장이 있으므로 수영장과 관련된 매개변수는 잘 사용되지 않을 것입니다.

```ts
class House {
  constructor(
    windows: number,
    doors: number,
    rooms: number,
    hasGarage: boolean,
    hasSwinPool: boolean,
    hasStatues: boolean,
    hasGarden: boolean,
    //...
  );
}
// 보통 집
const house = new House(4, 2, 4 ,true, null, null, null);

// 부자 집
const richHouse = new House(4, 2, 4 ,true, true, true true);
```

## 해결책

빌더 패턴은 자신의 클래스에서 객체 생성 코드를 추출해 `builders`라는 별도의 객체들로 이동하도록 제안합니다.
<img width="820" height="560" alt="image" src="https://github.com/user-attachments/assets/39976261-6b85-42a5-8be4-ef3ce0bcb607" />

> 빌더 패턴은 복잡한 객체들을 단계별로 생성할 수 있도록 합니다. 빌더는 제품이 생성되는 동안 다른 객체들이 제품에 접근하는 것을 허용하지 않습니다.

이 패턴은 객체 생성을 일련의 단계들(`buildWalls`, `buildDoor`등)로 정리하며 객체를 생성하고 싶으면 위 단계들을 `builder` 객체에 실행하면 됩니다. 또 중요한 점은 모든 단계를 호출할 필요가 없다는 것으로 객체의 특정 설정을 제작하는 데 필요한 단계들만 호출하면 됩니다.

일부 건축 단계들은 제품의 다양한 표현을 건축해야 하는 경우 다른 구현들이 필요할 수 있습니다. 예를 들어, 오두막의 벽은 나무로 지을 수 있지만 성벽은 돌로 지어야 합니다.

이런 경우 같은 건축 단계들의 집합을 다른 방식으로 구현하는 여러 다른 빌더 클래스를 생성할 수 있으며 그런 다음 건축 프로세스내에서 이러한 빌더들을 사용해 다양한 종류의 객체를 생성할 수 있습니다.

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/b5bb4d83-8ddb-4672-adb4-548d146a5ac1" />

> 다양한 빌더들은 다양한 방식으로 같은 작업을 실행합니다.

예를 들어 나무와 유리로 모든 것을 건축하는 builder, 돌과 철로 모든 것을 건축하는 builder, 금과 다이아로 모든것을 건축하는 builder가 있다고 상상해보세요<br/>
세 건축가에 대해 같은 단계들의 집합을 호출하면 첫 번째 builder로부터는 일반 주택을<br/>
두 번째 builder로부터는 작은 성을<br/>
세 번째 builder로부터는 궁전을 얻습니다.<br/>
그러나 위의 그림 예시의 경우 건축 단계들을 호출하는 클라이언트 코드가 공통 인터페이스를 사용하여 빌더들과 상호 작용할 수 있는 경우에만 작동합니다.

### 디렉터(관리자)

더 나아가 제품을 생성하는 데 사용하는 빌더 단계들에 대한 일련의 호출을 디렉터라는 별도의 클래스로 추출할 수 있습니다.<br/>
디렉터 클래스는 제작 단계들을 실행하는 순서를 정의해주면 빌더는 이러한 단계들에 대한 구현을 제공합니다.

- 디렉터 : 실행 순서 제공
- 빌더 : 실행 순서에 따른 구현 제공

<img width="687" height="600" alt="image" src="https://github.com/user-attachments/assets/5f0248e6-e67f-41f5-8ed7-0e7b4cb156e7" />

프로그램에 디렉터 클래스를 포함하는 것은 필수사항은 아닙니다.<br/>
당신은 언제든지 클라이언트 코드에서 생성 단계들을 직접 특정 순서로 호출할 수 있습니다.<br/>
하지만 디렉터 클래스는 다양한 생성 루틴들을 배치해 프로그램 전체에서 재사용할 수 있는 좋은 장소가 될 수 있습니다.

또한 디렉터 클래스는 클라이언트 코드에서 제품 생성의 세부 정보를 완전히 숨깁니다. 클라이언트는 빌더를 디렉터와 연관시키고 디렉터와 생성을 시행한 후 빌더로부터 결과를 얻기만 하면 됩니다.

## 구조

<img width="940" height="1160" alt="image" src="https://github.com/user-attachments/assets/87fd8ef6-e4f8-4086-9c1c-3907a43fe684" />

1. Builder : 빌더 인터페이스 모든 유형의 빌더들의 공통적인 제품 생산 단계들을 선언합니다.<br/>

2. Concrete Builder: 구상 빌더들은 생성 단계들의 다양한 구현을 제공합니다. 또 구상 빌더들은 공통 인터페이스를 따르지 않는 제품들도 생산할 수있습니다.<br/>

3. Product : 제품들은 구상빌더들의 결과로 나온 객체들입니다. 다른 빌더들에 의해 생성된 제품들은 같은 클래스 계층구조 또는 인터페이스에 속할 필요가 없습니다.<br/>

4. Director : 클래스는 생성 단계들을 호출하는 순서를 정의하므로 제품들의 특정 설정을 만들고 재사용할 수 있습니다.<br/>

5. Client : 클라이언트는 빌더 객체들 중 하나를 디렉터와 연결해야 합니다. 일반적으로 위 연결은 디렉터 생성자의 매개변수들을 통해 한 번만 수행되며, 그 후 디렉터는 모든 추가 생성에 대한 빌더 객체들을 사용합니다.<br/>
   그러나 클라이언트가 빌더 객체를 디렉터의 프로덕션 메서드에 전달할 때를 위한 대안적 접근 방식이 있습니다. 이 경우 디렉터와 함께 무언가를 만들 때마다 다른 빌더를 사용할 수 있습니다.
