// Product
interface User {
  platform: string;
  email: string;
  password: string;
}

// Concrete Product
class NaverUser implements User {
  platform: string;
  email: string;
  password: string;

  constructor(platform: string, email: string, password: string) {
    this.platform = platform;
    this.email = email;
    this.password = password;
  }
}

// Creator
// ✅ 실제: 크리에이터는 핵심 비즈니스 로직을 가진 클래스
abstract class AuthFactory {
  abstract createUser(platform: string, email: string, password: string): User;

  // 👇 이게 진짜 주 책임! 회원가입 프로세스 전체를 관리
  signup(platform: string, email: string, password: string) {
    // 1. 이메일 유효성 검사
    this.validateEmail(email);

    // 2. 비밀번호 암호화
    const encryptedPw = this.encryptPassword(password);

    // 3. 사용자 생성 (여기만 유연하게!)
    const user = this.createUser(platform, email, password);

    // 4. 데이터베이스 저장
    this.saveToDatabase(user);

    // 5. 환영 이메일 발송
    this.sendWelcomeEmail(user);

    return {
      platform: user.platform,
      email: user.email,
    };
  }

  private validateEmail(email: string) {}
  private encryptPassword(pw: string) {}
  private saveToDatabase(user: User) {}
  private sendWelcomeEmail(user: User) {}
}

// Concrete Creator
class NaverAuthFactory extends AuthFactory {
  createUser(platform: string, email: string, password: string): User {
    return new NaverUser(platform, email, password);
  }
}

function getAuthFactory(platform: string): AuthFactory {
  switch (platform) {
    case "Naver":
      return new NaverAuthFactory();
    // case "Kakao": return new KakaoAuthFactory();
    // case "Google": return new GoogleAuthFactory();
    default:
      throw new Error("Unknown type");
  }
}

// Client Code : Client는 구체적인 팩토리는 몰라도 됨
const factory = getAuthFactory("Naver"); // ← 추상 타입만 알면 OK
const user = factory.signup("Naver", "joe", "123");
console.log("user", user);
