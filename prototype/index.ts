// 프로토타입 패턴 예시 코드

// 1. 기본 프로토타입 인터페이스
interface Prototype {
  clone(): Prototype;
}

// 2. 구체적인 프로토타입 클래스들
class Document implements Prototype {
  private title: string;
  private content: string;
  private author: string;
  private createdAt: Date;

  constructor(title: string, content: string, author: string) {
    this.title = title;
    this.content = content;
    this.author = author;
    this.createdAt = new Date();
  }

  // 프로토타입 패턴의 핵심: clone 메서드
  clone(): Document {
    const cloned = new Document(this.title, this.content, this.author);
    // Date 객체는 참조 타입이므로 새로운 인스턴스 생성
    cloned.createdAt = new Date(this.createdAt.getTime());
    return cloned;
  }

  // 깊은 복사를 위한 메서드 (참조 타입 필드가 있을 때)
  deepClone(): Document {
    const cloned = this.clone();
    // 추가적인 깊은 복사 로직이 필요한 경우 여기에 구현
    return cloned;
  }

  // getter 메서드들
  getTitle(): string {
    return this.title;
  }
  getContent(): string {
    return this.content;
  }
  getAuthor(): string {
    return this.author;
  }
  getCreatedAt(): Date {
    return this.createdAt;
  }

  // setter 메서드들
  setTitle(title: string): void {
    this.title = title;
  }
  setContent(content: string): void {
    this.content = content;
  }
  setAuthor(author: string): void {
    this.author = author;
  }

  display(): void {
    console.log(`제목: ${this.title}`);
    console.log(`내용: ${this.content}`);
    console.log(`작성자: ${this.author}`);
    console.log(`작성일: ${this.createdAt.toLocaleDateString()}`);
    console.log("---");
  }
}

// 3. 다른 타입의 프로토타입
class UserProfile implements Prototype {
  private username: string;
  private email: string;
  private preferences: string[];
  private lastLogin: Date;

  constructor(username: string, email: string, preferences: string[] = []) {
    this.username = username;
    this.email = email;
    this.preferences = [...preferences]; // 배열 복사
    this.lastLogin = new Date();
  }

  clone(): UserProfile {
    const cloned = new UserProfile(this.username, this.email, this.preferences);
    cloned.lastLogin = new Date(this.lastLogin.getTime());
    return cloned;
  }

  addPreference(pref: string): void {
    this.preferences.push(pref);
  }

  getUsername(): string {
    return this.username;
  }
  getEmail(): string {
    return this.email;
  }
  getPreferences(): string[] {
    return [...this.preferences];
  }
  getLastLogin(): Date {
    return new Date(this.lastLogin.getTime());
  }

  display(): void {
    console.log(`사용자: ${this.username}`);
    console.log(`이메일: ${this.email}`);
    console.log(`선호사항: ${this.preferences.join(", ")}`);
    console.log(`마지막 로그인: ${this.lastLogin.toLocaleString()}`);
    console.log("---");
  }
}

// 4. 프로토타입 레지스트리 (자주 사용하는 프로토타입들을 저장)
class PrototypeRegistry {
  private prototypes: Map<string, Prototype> = new Map();

  addPrototype(key: string, prototype: Prototype): void {
    this.prototypes.set(key, prototype);
  }

  getPrototype(key: string): Prototype | undefined {
    const prototype = this.prototypes.get(key);
    return prototype ? prototype.clone() : undefined;
  }

  removePrototype(key: string): boolean {
    return this.prototypes.delete(key);
  }

  listKeys(): string[] {
    return Array.from(this.prototypes.keys());
  }
}

// 5. 클라이언트 코드
class DocumentManager {
  private registry: PrototypeRegistry;

  constructor() {
    this.registry = new PrototypeRegistry();
    this.initializePrototypes();
  }

  private initializePrototypes(): void {
    // 기본 템플릿들을 프로토타입으로 등록
    const blankDocument = new Document("새 문서", "", "시스템");
    const welcomeDocument = new Document(
      "환영합니다",
      "이 문서는 새로 생성되었습니다.",
      "시스템"
    );
    const userTemplate = new UserProfile("사용자", "user@example.com", [
      "기본 설정",
    ]);

    this.registry.addPrototype("blank", blankDocument);
    this.registry.addPrototype("welcome", welcomeDocument);
    this.registry.addPrototype("user", userTemplate);
  }

  createDocumentFromTemplate(templateKey: string): Prototype | null {
    const prototype = this.registry.getPrototype(templateKey);
    if (prototype) {
      console.log(`템플릿 "${templateKey}"에서 새 문서를 생성했습니다.`);
      return prototype;
    } else {
      console.log(`템플릿 "${templateKey}"을 찾을 수 없습니다.`);
      return null;
    }
  }

  // registry에 접근할 수 있는 public 메서드 추가
  getAvailableTemplates(): string[] {
    return this.registry.listKeys();
  }

  createCustomDocument(
    title: string,
    content: string,
    author: string
  ): Document {
    const doc = new Document(title, content, author);
    console.log("사용자 정의 문서를 생성했습니다.");
    return doc;
  }
}

// 6. 사용 예시
function demonstratePrototypePattern(): void {
  console.log("=== 프로토타입 패턴 데모 ===\n");

  // 1. 직접 복제 예시
  console.log("1. 직접 복제 예시:");
  const originalDoc = new Document(
    "원본 문서",
    "이것은 원본 문서입니다.",
    "김철수"
  );
  originalDoc.display();

  const clonedDoc = originalDoc.clone();
  clonedDoc.setTitle("복제된 문서");
  clonedDoc.setContent("이것은 복제된 문서입니다.");
  clonedDoc.display();

  // 2. 프로토타입 레지스트리 사용 예시
  console.log("2. 프로토타입 레지스트리 사용 예시:");
  const docManager = new DocumentManager();

  console.log("사용 가능한 템플릿:", docManager.getAvailableTemplates());

  const blankDoc = docManager.createDocumentFromTemplate("blank");
  if (blankDoc instanceof Document) {
    blankDoc.setTitle("내 첫 문서");
    blankDoc.setContent("프로토타입에서 생성된 문서입니다.");
    blankDoc.setAuthor("나");
    blankDoc.display();
  }

  const welcomeDoc = docManager.createDocumentFromTemplate("welcome");
  if (welcomeDoc instanceof Document) {
    welcomeDoc.display();
  }

  // 3. 사용자 프로필 복제 예시
  console.log("3. 사용자 프로필 복제 예시:");
  const originalUser = new UserProfile("홍길동", "hong@example.com", [
    "독서",
    "여행",
  ]);
  originalUser.display();

  const clonedUser = originalUser.clone();
  clonedUser.addPreference("음악");
  clonedUser.display();

  // 4. 깊은 복사 vs 얕은 복사 비교
  console.log("4. 깊은 복사 vs 얕은 복사 비교:");
  const userWithPrefs = new UserProfile("김영희", "kim@example.com", ["영화"]);
  const shallowClone = userWithPrefs.clone();

  // 원본의 preferences 배열에 항목 추가
  userWithPrefs.addPreference("게임");

  console.log("원본 사용자 선호사항:", userWithPrefs.getPreferences());
  console.log("복제된 사용자 선호사항:", shallowClone.getPreferences());
  console.log(
    "배열이 깊은 복사되었는지 확인:",
    userWithPrefs.getPreferences() !== shallowClone.getPreferences()
  );
}

// 7. JavaScript의 내장 복제 방법들과 비교
function compareWithBuiltInMethods(): void {
  console.log("\n=== JavaScript 내장 복제 방법들과 비교 ===\n");

  const original = {
    name: "테스트",
    age: 25,
    hobbies: ["독서", "여행"],
    profile: { city: "서울", country: "한국" },
  };

  console.log("원본 객체:", original);

  // 1. Object.assign (얕은 복사)
  const shallowCopy = Object.assign({}, original);
  shallowCopy.hobbies.push("음악");
  shallowCopy.profile.city = "부산";
  console.log("Object.assign 복사 후:", shallowCopy);
  console.log("원본 hobbies 영향:", original.hobbies);
  console.log("원본 profile 영향:", original.profile);

  // 2. 스프레드 연산자 (얕은 복사)
  const spreadCopy = { ...original };
  spreadCopy.hobbies = [...original.hobbies]; // 배열만 깊은 복사
  spreadCopy.hobbies.push("운동");
  console.log("스프레드 연산자 복사 후:", spreadCopy);
  console.log("원본 hobbies 영향:", original.hobbies);

  // 3. JSON 방식 (깊은 복사, 단점: 함수/Date 등 제한적)
  const jsonCopy = JSON.parse(JSON.stringify(original));
  jsonCopy.hobbies.push("요리");
  console.log("JSON 방식 복사 후:", jsonCopy);
  console.log("원본 hobbies 영향:", original.hobbies);
}

// 실행 (브라우저 환경에서도 동작하도록 수정)
// 브라우저에서 실행하려면 아래 주석을 해제하세요
// demonstratePrototypePattern();
// compareWithBuiltInMethods();

export { Prototype, Document, UserProfile, PrototypeRegistry, DocumentManager };
