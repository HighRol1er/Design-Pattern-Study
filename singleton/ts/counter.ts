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
function clientCode2() {
  const c1 = Counter.instance;
  const c2 = Counter.instance;

  console.log("c1에서 증가:", c1.increment()); // 1
  console.log("c2에서 증가:", c2.increment()); // 2
  console.log("c1 값 확인:", c1.value); // 2
  console.log("c2 값 확인:", c2.value); // 2

  console.log(c1 === c2); // true → 두 변수는 같은 인스턴스
}

clientCode2();
