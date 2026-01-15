// 0. 최상위 부모 클래스
class Notice {
  constructor(protected message: string) {}
  send(): void {
    console.log("알림을 전송합니다.");
  }
}

// ==========================================
// 1. 일반 알림 (General) 그룹
// ==========================================
class GeneralSmsNotice extends Notice {
  send(): void {
    console.log(`[SMS] 일반 알림: ${this.message}`);
  }
}

class GeneralEmailNotice extends Notice {
  send(): void {
    console.log(`[Email] 일반 알림: ${this.message}`);
  }
}

class GeneralKakaoNotice extends Notice {
  send(): void {
    console.log(`[Kakao] 일반 알림: ${this.message}`);
  }
}

class GeneralTelegramNotice extends Notice {
  send(): void {
    console.log(`[Telegram] 일반 알림: ${this.message}`);
  }
}

// ==========================================
// 2. 긴급 알림 (Urgent) 그룹
// ==========================================
class UrgentSmsNotice extends Notice {
  send(): void {
    console.log(`[SMS] [URGENT] 긴급 알림: ${this.message}`);
  }
}

class UrgentEmailNotice extends Notice {
  send(): void {
    console.log(`[Email] [URGENT] 긴급 알림: ${this.message}`);
  }
}

class UrgentKakaoNotice extends Notice {
  send(): void {
    console.log(`[Kakao] [URGENT] 긴급 알림: ${this.message}`);
  }
}

class UrgentTelegramNotice extends Notice {
  send(): void {
    console.log(`[Telegram] [URGENT] 긴급 알림: ${this.message}`);
  }
}

// ==========================================
// 3. 푸시 알림 (Push) 그룹
// ==========================================
class PushSmsNotice extends Notice {
  send(): void {
    console.log(`[SMS] [PUSH] 푸시 알림: ${this.message}`);
  }
}

class PushEmailNotice extends Notice {
  send(): void {
    console.log(`[Email] [PUSH] 푸시 알림: ${this.message}`);
  }
}

class PushKakaoNotice extends Notice {
  send(): void {
    console.log(`[Kakao] [PUSH] 푸시 알림: ${this.message}`);
  }
}

class PushTelegramNotice extends Notice {
  send(): void {
    console.log(`[Telegram] [PUSH] 푸시 알림: ${this.message}`);
  }
}

// ==========================================
// 4. 메일 형식 알림 (Mail) 그룹
// ==========================================
class MailSmsNotice extends Notice {
  send(): void {
    console.log(`[SMS] [MAIL-STYLE] 메일형 알림: ${this.message}`);
  }
}

class MailEmailNotice extends Notice {
  send(): void {
    console.log(`[Email] [MAIL-STYLE] 메일형 알림: ${this.message}`);
  }
}

class MailKakaoNotice extends Notice {
  send(): void {
    console.log(`[Kakao] [MAIL-STYLE] 메일형 알림: ${this.message}`);
  }
}

class MailTelegramNotice extends Notice {
  send(): void {
    console.log(`[Telegram] [MAIL-STYLE] 메일형 알림: ${this.message}`);
  }
}

// ==========================================
// 실행 예시 (Client Code)
// ==========================================

// 긴급 알림을 카톡으로 보내려면?
const alert1 = new UrgentKakaoNotice("서버 메모리 초과!");
alert1.send();

// 일반 알림을 이메일로 보내려면?
const alert2 = new GeneralEmailNotice("뉴스레터가 도착했습니다.");
alert2.send();

// 푸시 알림을 텔레그램으로 보내려면?
const alert3 = new PushTelegramNotice("새 메시지가 있습니다.");
alert3.send();
