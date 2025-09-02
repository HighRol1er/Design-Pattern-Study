// House 클래스 - 제품(Product)
class House {
  public walls: string = "";
  public roof: string = "";
  public doors: string = "";
  public windows: string = "";
  public garage: string = "";
  public garden: string = "";
  public swimmingPool: string = "";
  public basement: string = "";

  public listParts(): void {
    console.log(
      `House parts: ${this.walls}, ${this.roof}, ${this.doors}, ${this.windows}, ${this.garage}, ${this.garden}, ${this.swimmingPool}, ${this.basement}\n`
    );
  }
}

// 빌더 인터페이스
interface IHouseBuilder {
  buildWalls(): void;
  buildRoof(): void;
  buildDoors(): void;
  buildWindows(): void;
  buildGarage(): void;
  buildGarden(): void;
  buildSwimmingPool(): void;
  buildBasement(): void;
  reset(): void;
  getResult(): House;
}

// 구상 빌더 - 기본 집
class BasicHouseBuilder implements IHouseBuilder {
  private house: House;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.house = new House();
  }

  public buildWalls(): void {
    this.house.walls = "Basic wooden walls";
  }

  public buildRoof(): void {
    this.house.roof = "Basic shingle roof";
  }

  public buildDoors(): void {
    this.house.doors = "Basic wooden door";
  }

  public buildWindows(): void {
    this.house.windows = "Basic glass windows";
  }

  public buildGarage(): void {
    this.house.garage = "No garage";
  }

  public buildGarden(): void {
    this.house.garden = "Small front garden";
  }

  public buildSwimmingPool(): void {
    this.house.swimmingPool = "No swimming pool";
  }

  public buildBasement(): void {
    this.house.basement = "No basement";
  }

  public getResult(): House {
    const result = this.house;
    this.reset();
    return result;
  }
}

// 구상 빌더 - 럭셔리 집
class LuxuryHouseBuilder implements IHouseBuilder {
  private house: House;

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.house = new House();
  }

  public buildWalls(): void {
    this.house.walls = "Premium stone walls";
  }

  public buildRoof(): void {
    this.house.roof = "Premium tile roof";
  }

  public buildDoors(): void {
    this.house.doors = "Premium wooden doors with carvings";
  }

  public buildWindows(): void {
    this.house.windows = "Premium double-glazed windows";
  }

  public buildGarage(): void {
    this.house.garage = "3-car garage";
  }

  public buildGarden(): void {
    this.house.garden = "Large landscaped garden with fountain";
  }

  public buildSwimmingPool(): void {
    this.house.swimmingPool = "Olympic-size swimming pool";
  }

  public buildBasement(): void {
    this.house.basement = "Finished basement with home theater";
  }

  public getResult(): House {
    const result = this.house;
    this.reset();
    return result;
  }
}

// 디렉터 클래스 - 집 건축 과정을 관리
class HouseDirector {
  private builder: IHouseBuilder;

  public setBuilder(builder: IHouseBuilder): void {
    this.builder = builder;
  }

  // 기본 집 건축
  public buildBasicHouse(): House {
    this.builder.buildWalls();
    this.builder.buildRoof();
    this.builder.buildDoors();
    this.builder.buildWindows();
    this.builder.buildGarden();
    return this.builder.getResult();
  }

  // 럭셔리 집 건축
  public buildLuxuryHouse(): House {
    this.builder.buildWalls();
    this.builder.buildRoof();
    this.builder.buildDoors();
    this.builder.buildWindows();
    this.builder.buildGarage();
    this.builder.buildGarden();
    this.builder.buildSwimmingPool();
    this.builder.buildBasement();
    return this.builder.getResult();
  }

  // 커스텀 집 건축
  public buildCustomHouse(
    hasGarage: boolean,
    hasPool: boolean,
    hasBasement: boolean
  ): House {
    this.builder.buildWalls();
    this.builder.buildRoof();
    this.builder.buildDoors();
    this.builder.buildWindows();
    this.builder.buildGarden();

    if (hasGarage) {
      this.builder.buildGarage();
    }
    if (hasPool) {
      this.builder.buildSwimmingPool();
    }
    if (hasBasement) {
      this.builder.buildBasement();
    }

    return this.builder.getResult();
  }
}

// 사용 예시 함수들
function demonstrateBuilderWithoutDirector() {
  console.log("=== 디렉터 없는 빌더 패턴 ===\n");

  // 클라이언트가 직접 빌더를 사용
  const basicBuilder = new BasicHouseBuilder();

  // 단계별로 집을 건축
  basicBuilder.buildWalls();
  basicBuilder.buildRoof();
  basicBuilder.buildDoors();
  basicBuilder.buildWindows();
  basicBuilder.buildGarden();

  const basicHouse = basicBuilder.getResult();
  console.log("기본 집이 완성되었습니다:");
  basicHouse.listParts();

  // 럭셔리 빌더로 다른 스타일의 집 건축
  const luxuryBuilder = new LuxuryHouseBuilder();

  luxuryBuilder.buildWalls();
  luxuryBuilder.buildRoof();
  luxuryBuilder.buildDoors();
  luxuryBuilder.buildWindows();
  luxuryBuilder.buildGarage();
  luxuryBuilder.buildGarden();
  luxuryBuilder.buildSwimmingPool();
  luxuryBuilder.buildBasement();

  const luxuryHouse = luxuryBuilder.getResult();
  console.log("럭셔리 집이 완성되었습니다:");
  luxuryHouse.listParts();
}

function demonstrateBuilderWithDirector() {
  console.log("=== 디렉터가 있는 빌더 패턴 ===\n");

  const director = new HouseDirector();

  // 기본 집 건축
  const basicBuilder = new BasicHouseBuilder();
  director.setBuilder(basicBuilder);

  console.log("디렉터가 기본 집을 건축합니다:");
  const basicHouse = director.buildBasicHouse();
  basicHouse.listParts();

  // 럭셔리 집 건축
  const luxuryBuilder = new LuxuryHouseBuilder();
  director.setBuilder(luxuryBuilder);

  console.log("디렉터가 럭셔리 집을 건축합니다:");
  const luxuryHouse = director.buildLuxuryHouse();
  luxuryHouse.listParts();

  // 커스텀 집 건축
  console.log(
    "디렉터가 커스텀 집을 건축합니다 (차고 있음, 수영장 있음, 지하실 없음):"
  );
  const customHouse = director.buildCustomHouse(true, true, false);
  customHouse.listParts();
}

// 메인 실행 함수
function main() {
  console.log("🏠 House Builder Pattern Examples\n");

  // 디렉터 없는 버전
  demonstrateBuilderWithoutDirector();

  // 디렉터 있는 버전
  demonstrateBuilderWithDirector();

  console.log("✅ 모든 예시가 완료되었습니다!");
}

// 실행
main();
