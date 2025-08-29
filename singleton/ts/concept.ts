/**
 * Singleton 클래스는 `instance` 게터(getter)를 정의하며,
 * 이를 통해 클라이언트가 유일한 싱글턴 인스턴스에 접근할 수 있습니다.
 */
class Singleton {
  static #instance: Singleton;

  /**
   * Singleton의 생성자는 `new` 연산자를 사용한 직접적인 객체 생성을
   * 방지하기 위해 항상 private이어야 합니다.
   */
  private constructor() {}

  /**
   * 싱글턴 인스턴스에 대한 접근을 제어하는 정적(static) 게터입니다.
   *
   * 이 구현 방식은 Singleton 클래스를 상속받더라도
   * 각 하위 클래스별로 단 하나의 인스턴스만 유지되도록 합니다.
   */
  public static get instance(): Singleton {
    if (!Singleton.#instance) {
      Singleton.#instance = new Singleton();
    }

    return Singleton.#instance;
  }

  /**
   * 마지막으로, 어떤 싱글턴이든 인스턴스에서 실행될 수 있는
   * 비즈니스 로직을 정의할 수 있습니다.
   */
  public someBusinessLogic() {
    // ...
  }
}

/**
 * 클라이언트 코드 예시
 */
function clientCode1() {
  const s1 = Singleton.instance;
  const s2 = Singleton.instance;

  if (s1 === s2) {
    console.log(
      "싱글턴이 잘 동작합니다. 두 변수는 동일한 인스턴스를 참조합니다."
    );
  } else {
    console.log(
      "싱글턴이 실패했습니다. 두 변수가 서로 다른 인스턴스를 가지고 있습니다."
    );
  }
}
