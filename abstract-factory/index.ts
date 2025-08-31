interface Chair {
  hasLegs(): boolean;
  sitOn(): void;
}

interface Table {
  hasLegs(): boolean;
  sitOn(): void;
}

interface Sofa {
  hasLegs(): boolean;
  sitOn(): void;
}

// 구체 제품 (Chair 인터페이스 구현)
class ModernChair implements Chair {
  hasLegs() {
    return true;
  }
  sitOn() {
    console.log("🪑 Sitting on a modern chair");
  }
}

class ModernTable implements Table {
  hasLegs() {
    return true;
  }
  sitOn() {
    console.log("🪑 Sitting on a modern table");
  }
}

class ModernSofa implements Sofa {
  hasLegs() {
    return true;
  }
  sitOn() {
    console.log("🪑 Sitting on a modern sofa");
  }
}

class VictorianChair implements Chair {
  hasLegs() {
    return true;
  }
  sitOn() {
    console.log("👑 Sitting on a victorian chair");
  }
}

abstract class FurnitureFactory {
  abstract createChair(): Chair;
  abstract createTable(): Table;
  abstract createSofa(): Sofa;
}

class ModernFurnitureFactory implements FurnitureFactory {
  createChair(): Chair {
    return new ModernChair();
  }
  createTable(): Table {
    return new ModernTable();
  }
  createSofa(): Sofa {
    return new ModernSofa();
  }
}

// client code

function clientCodeForFurnitureFactory(factory: FurnitureFactory) {
  const chair = factory.createChair();
  const table = factory.createTable();
  const sofa = factory.createSofa();

  // 생성된 가구들을 사용
  chair.sitOn();
  table.sitOn();
  sofa.sitOn();
}

// 추상 팩토리 패턴 데모 (예시)
console.log("🪑 추상 팩토리 패턴 데모:");
clientCodeForFurnitureFactory(new ModernFurnitureFactory());

// 실제 클라이언트에서 사용하는 방법들
console.log("\n📝 실제 클라이언트 사용법:");

// 1. 팩토리 인스턴스 생성
const modernFactory = new ModernFurnitureFactory();

// 2. 원하는 가구만 선택해서 생성
const myChair = modernFactory.createChair();
const myTable = modernFactory.createTable();

// 3. 생성된 가구 사용
myChair.sitOn();
myTable.sitOn();

// 4. 직접 클래스로도 생성 가능 (하지만 팩토리 패턴의 장점을 잃음)
console.log("\n📝 직접 클래스로 생성:");
const directChair = new ModernChair();
directChair.sitOn();
