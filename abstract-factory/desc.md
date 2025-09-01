# Abstract Factory 
복잡도:★★☆<br/>
인기도:★★★
## 의도 

추상 팩토리는 관련 객체들의 구상 클래스들을 지정하지 않고도 관련 객체들의 모음을 생성할 수 있도록 하는 생성패턴 

## 문제 
예를 들어 가구 판매를 위한 프로그램을 만들고 있다고 해봅시다. 코드는 다음을 나타내는 클래스들로 구성됩니다. 
1. 관련 제품들로 형성된 제품 : Chair, Sofa, Table
2. 해당 제품군듸 여러가지 변형 스타일 : Modern, Victorian, ArtDeco

<img width="840" height="600" alt="image" src="https://github.com/user-attachments/assets/21c4ae3e-e14f-49c4-b96d-6f53827b719b" />

이제 새로운 개별 가구 객체를 생성했을 때, 이 객체들이 기존의 같은 패밀리 내에 있는 다른 가구 객체들과 일치하는 스타일을 가지도록 할 방법이 필요합니다.

<img width="1200" height="600" alt="image" src="https://github.com/user-attachments/assets/d9018167-e105-4ec9-8527-2e5695542802" />

또 가구업체들은 카탈로그를 자주 변경하기 때문에 새로운 제품 또는 제품군을 추가할 때마다 기존 코드를 변경해야 하는 번거로움을 피하고 싶을 것입니다. 

## 해결책 

추상 팩토리 패턴을 적용할 때 첫 번째 단계는 제품군(패밀리)별로 인터페이스를 정의하는 것입니다.<br/>
>e.g) `Chair, Sofa, Table`
그리고 중요한 규칙 중 하나는 모든 구체 클래스는 반드시 해당 인터페이스를 구현해야 한다는 것입니다.
>e.g) 인터페이스를 기반으로 `ModernChair, VictorianChair, ArtDecoChair` 같은 구체 클래스들이 구현됩니다.

이렇게 하면 클라이언트는 `Chair`인터페이스만 보고도 다양한 의자의 변형들을 동일하게 다룰 수 있으며 패밀리 전체가 일관성있게 확장될 수 있습니다. 

<img width="840" height="560" alt="image" src="https://github.com/user-attachments/assets/2344b385-1c73-43f5-88f5-5cdb67baa575" />

```ts
interface Chair {
  hasLegs(): void
  sitOn(): void
}

class VictorianChair implements Chair {
  hasLegs() {
    console.log("의자 다리가 존재합니다");
  };
  sitOn() {
    console.log("의자에 앉습니다.");
  }
}

class ModernChair implements Chair {
  hasLegs() {
    console.log("의자 다리가 존재합니다");
  };
  sitOn() {
    console.log("의자에 앉습니다.");
  }
}
```

추상 팩토리 패턴의 두 번째 단계는 Abstact Factory 패턴을 선언하는 것입니다.<br/>
추상 팩토리 패턴은 제품 패밀리 내의 모든 개별 제품들의 생성 메서드들이 목록화되어있는 인터페이스입니다.
- `createChair`, `createSofa`, `createTable`

<img width="1280" height="640" alt="image" src="https://github.com/user-attachments/assets/bce8b24e-f57c-4720-b07c-f81e9d2182d5" />

```ts
interface FurnitureFactory {
  createChair(): Chair
  createTable(): Table
  createSofa(): Sofa
}

class ModernFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ModernChair()
  }
  createTable(): Table {
    return new ModernTable()
  }
  createSofa(): Sofa {
    return new ModernSofa()
  }
}

class VictorianFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new VictorianChair()
  }
  createTable(): Table {
    return new VictorianTable()
  }
  createSofa(): Sofa {
    return new VictorianSofa()
  }
}
```

다음은 제품 변형을 다룰 차례입니다.<br/>
제품 패밀리는 각 변형에 대해 `AbstractFactory` 추상 팩토리 인터페이스를 기반으로 별도의 팩토리 클래스를 생성합니다.
팩토리는 특정 종류의 제품을 반환하는 클래스 입니다.

위 코드에서도 보이듯이 `ModernFunitureFactory`에서는 다음 `ModernChair`, `ModernSofa`, `ModernTalbe`과 같은 Modern 패밀리에 해당하는 
객체들만 생성할 수 있습니다.

클라이언트 코드는 구체적인 클래스에 직접 의존하지 않고, 추상 인터페이스를 통해 팩토리와 제품을 사용해야 합니다.
이렇게 하면 클라이언트 코드를 수정하지 않고도 팩토리나 제품의 구체적인 변형(예: 모던, 빅토리안)을 자유롭게 교체할 수 있습니다.

클라이언트가 팩토리에 의자를 주문했다고 가정해봅시다.<br/>
이때 클라이언트는 팩토리의 구체적인 클래스나 어떤 변형의 의자가 생성되는지 알 필요가 없습니다.<br/>
클라이언트는 단지 추상 `Chair` 인터페이스를 통해 의자를 주문할 뿐이며 현대식의자든 빅토리아식의자든 동일한 방식으로 사용할 수 있습니다. <br/>
클라이언트가 아는 유일한 사실은 의자가 sitOn과 같은 메서드를 제공한다는 점뿐입니다.<br/>
그리고 이렇게 팩토리가 생성하는 의자, 소파, 테이블은 모두 동일한 변형(예: Modern, Victorian)으로 일관성을 유지합니다.

## 구조

<img width="1400" height="900" alt="image" src="https://github.com/user-attachments/assets/b17a5710-2f32-4567-9559-92cbb2ca7037" />

1. Abstract Product: 제품 패밀리를 구성하는 개별 연관 제품들의 집합에 대한 인터페이스를 선언합니다.<br/>
2. Concrete Product: 변형들로 그룹화된 추상 제품들의 다양한 구현들에 해당합니다.<br/> 
  - 추상 제품: (의자/소파/테이블)<br/>
  - 변형: (빅토리안/모던/아르데코)<br/>
    
3. Abstract Factory: 인터페이스는 각각의 추상 제품들을 생성하기 위한 메서드들의 집합입니다.<br/>

4. Concrete Factory: 추상 팩토리의 생성 메서드들을 구현합니다. 각 구상 팩토리는 제품들의 특정 변형들에 해당하며 해당 특정 변형들만 생성합니다.<br/>
5. 구상 팩토리들은 실제 제품을 인스턴스화하지만, 그 생성 메서드의 반환 타입은 해당 추상제품이어야합니다.<br/>
이렇게 해야 클라이언트가 특정 제품 변형에 의존하지 않게 됩니다. 클라이언트는 추상 인터페이스를 통해서만 팩토리의 제품과 상호작용하므로<br/>
어떤 구상 팩토리나 제품 변형이든 문제없이 교체하여 사용할 수 있습니다.

### 코드로 알아보는 구조 

```ts 
// 1. Abstract Product: 제품 패밀리를 구성하는 개별 연관 제품들의 집합에 대한 인터페이스를 선언합니다.
interface Chair {
  sitOn(): void;
}

interface Table {
  putOn(): void;
}

// 2. Concrete Product: 변형들로 그룹화된 추상 제품들의 다양한 구현들에 해당합니다.
class ModernChair implements Chair {
  sitOn() {
    console.log("의자에 앉습니다.");
  }
}

class ModernTable implements Table {
  putOn() {
    console.log("책상에 무언가를 놓습니다.");
  }
}

class VictorianChair implements Chair {
  sitOn() {
    console.log("의자에 앉습니다.");
  }
}

class VictorianTable implements Table {
  putOn() {
    console.log("책상에 무언가를 놓습니다.");
  }
}

// 3. Abstract Factory: 인터페이스는 각각의 추상 제품들을 생성하기 위한 메서드들의 집합입니다.
interface FurnitureFactory {
  createChair(): Chair;
  createTable(): Table;
}

// 4. Concrete Factory: 추상 팩토리의 생성 메서드들을 구현합니다. 각 구상 팩토리는 제품들의 특정 변형들에 해당하며 해당 특정 변형들만 생성합니다.
class ModernFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ModernChair();
  }
  createTable(): Table {
    return new ModernTable();
  }
}

class VictorianFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new VictorianChair();
  }
  createTable(): Table {
    return new VictorianTable();
  }
}

// 5. 클라이언트는 단지 추상 `Chair` 인터페이스를 통해 의자를 주문할 뿐이며 현대식의자든 빅토리아식의자든 동일한 방식으로 사용할 수 있습니다.
function orderFurniture(factory: FurnitureFactory) {
  const chair: Chair = factory.createChair();
  const table: Table = factory.createTable();
  chair.sitOn();
  table.putOn();
};

let factory: FunitureFactory = new ModernFurnitureFactory();
orderFurniture(factory);

// 패밀리 교체 (클라이언트 코드 변경 X)
factory = new VictorianFurnitureFactory();
orderFurniture(factory);

```



