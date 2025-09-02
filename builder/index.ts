interface Builder {
  producePartA(): void;
  producePartB(): void;
  producePartC(): void;
}

class Product1 {
  public parts: string[] = [];
  public listParts(): void {
    console.log(`Product parts: ${this.parts.join(", ")}\n`);
  }
}

class ConcreteBuilder1 implements Builder {
  private product: Product1;
  // reset이 있는 이유는 인스턴스를 만들면 product에 이제까지 만든 부분이 할당(저장)되고 이걸 재사용하기 위해서는
  // 초기화 해줘야 하기 때문이다.
  constructor() {
    this.reset();
  }
  public reset(): void {
    this.product = new Product1();
  }
  public producePartA(): void {
    this.product.parts.push("PartA");
  }
  public producePartB(): void {
    this.product.parts.push("PartB");
  }
  public producePartC(): void {
    this.product.parts.push("PartC");
  }

  public getProduct(): Product1 {
    const result = this.product;
    this.reset();
    return result;
  }
}

class Director {
  // 클래스 필드: let 없이 선언해도 자동으로 변경 가능한 변수
  private builder: Builder;
  public setBuilder(builder: Builder): void {
    this.builder = builder;
  }
  public buildMinimalViableProduct(): void {
    this.builder.producePartA();
  }
  public buildFullFeaturedProduct(): void {
    this.builder.producePartA();
    this.builder.producePartB();
    this.builder.producePartC();
  }
}

function clientCode5(director: Director) {
  const builder = new ConcreteBuilder1();
  director.setBuilder(builder);

  console.log("Standard basic product:");
  director.buildMinimalViableProduct();
  builder.getProduct().listParts();

  console.log("Standard full featured product:");
  director.buildFullFeaturedProduct();
  builder.getProduct().listParts();

  // Remember, the Builder pattern can be used without a Director class.
  console.log("Custom product:");
  builder.producePartA();
  builder.producePartC();
  builder.getProduct().listParts();
}

const director = new Director();
clientCode5(director);
