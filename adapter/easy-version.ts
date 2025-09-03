// 🚀 쉬운 어댑터 패턴 예제: 전원 플러그 어댑터
// 한국식 플러그를 일본식 소켓에 연결하는 상황

// 1. 한국식 플러그 (클라이언트)
interface KoreanPlug {
  getVoltage(): number; // 220V
  getShape(): string; // "한국식 둥근 플러그"
}

class KoreanPowerPlug implements KoreanPlug {
  getVoltage(): number {
    return 220;
  }

  getShape(): string {
    return "한국식 둥근 플러그";
  }
}

// 2. 일본식 소켓 (서비스 - 수정할 수 없는 외부 시스템)
class JapaneseSocket {
  private voltage: number = 100;
  private shape: string = "일본식 평면 소켓";

  // 일본식 소켓은 일본식 플러그만 받음
  canConnect(plugShape: string): boolean {
    return plugShape === "일본식 평면 플러그";
  }

  // 전원 공급
  supplyPower(plugShape: string): string {
    if (this.canConnect(plugShape)) {
      return `일본식 소켓에서 ${this.voltage}V 전원 공급 중...`;
    } else {
      return "플러그 모양이 맞지 않습니다! 연결할 수 없습니다.";
    }
  }

  getSocketInfo(): string {
    return `${this.shape}, ${this.voltage}V`;
  }
}

// 3. 어댑터 (한국식 플러그를 일본식 소켓에 맞춰주는 변환기)
class PowerAdapter implements KoreanPlug {
  private japaneseSocket: JapaneseSocket;

  constructor(japaneseSocket: JapaneseSocket) {
    this.japaneseSocket = japaneseSocket;
  }

  // 한국식 플러그 인터페이스 구현
  getVoltage(): number {
    // 일본은 100V, 한국은 220V이므로 변환 필요
    return 100; // 어댑터가 전압을 변환
  }

  getShape(): string {
    // 한국식 둥근 플러그를 일본식 평면 플러그로 변환
    return "일본식 평면 플러그";
  }

  // 어댑터의 핵심 기능: 한국식 플러그를 일본식 소켓에 연결
  connectKoreanPlug(): string {
    const adaptedShape = this.getShape();

    if (this.japaneseSocket.canConnect(adaptedShape)) {
      return this.japaneseSocket.supplyPower(adaptedShape);
    } else {
      return "어댑터 오류: 연결할 수 없습니다.";
    }
  }

  // 전압 변환 정보
  getVoltageInfo(): string {
    return `한국 220V → 일본 100V로 변환됨`;
  }
}

// 4. 한국 전자기기 (클라이언트)
class KoreanDevice {
  private plug: KoreanPlug;
  private deviceName: string;

  constructor(plug: KoreanPlug, deviceName: string) {
    this.plug = plug;
    this.deviceName = deviceName;
  }

  // 전원 연결 시도
  tryToConnect(): void {
    console.log(`🔌 ${this.deviceName} 전원 연결 시도...`);
    console.log(`   플러그 모양: ${this.plug.getShape()}`);
    console.log(`   전압: ${this.plug.getVoltage()}V`);
  }

  // 어댑터를 통한 전원 공급
  getPowerThroughAdapter(adapter: PowerAdapter): string {
    return adapter.connectKoreanPlug();
  }
}

// 5. 사용 예시
function demonstrateSimpleAdapter(): void {
  console.log("🇰🇷🇯🇵 전원 플러그 어댑터 패턴 데모\n");

  // 1. 일본식 소켓 생성 (수정할 수 없는 외부 시스템)
  const japaneseSocket = new JapaneseSocket();
  console.log("📍 일본식 소켓 정보:", japaneseSocket.getSocketInfo());
  console.log("");

  // 2. 한국식 플러그 생성
  const koreanPlug = new KoreanPowerPlug();
  console.log("🇰🇷 한국식 플러그 정보:");
  console.log("   모양:", koreanPlug.getShape());
  console.log("   전압:", koreanPlug.getVoltage() + "V");
  console.log("");

  // 3. 직접 연결 시도 (실패!)
  console.log("❌ 직접 연결 시도:");
  console.log(japaneseSocket.supplyPower(koreanPlug.getShape()));
  console.log("");

  // 4. 어댑터 생성
  const adapter = new PowerAdapter(japaneseSocket);
  console.log("🔌 어댑터 생성 완료!");
  console.log("   전압 변환:", adapter.getVoltageInfo());
  console.log("");

  // 5. 어댑터를 통한 연결 (성공!)
  console.log("✅ 어댑터를 통한 연결:");
  console.log(adapter.connectKoreanPlug());
  console.log("");

  // 6. 한국 전자기기 사용
  const laptop = new KoreanDevice(koreanPlug, "노트북");
  console.log("💻 한국 전자기기 사용:");
  laptop.tryToConnect();
  console.log(
    "   어댑터를 통한 전원 공급:",
    laptop.getPowerThroughAdapter(adapter)
  );
  console.log("");

  console.log("🎉 어댑터 패턴으로 호환성 문제 해결 완료!");
}

// 6. 실행
demonstrateSimpleAdapter();
