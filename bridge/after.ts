// 전송 수단을 위한 인터페이스 (구현부)
interface MessageSender {
  send(message: string): void;
}

// SMS 전송 구현
class SmsSender implements MessageSender {
  send(message: string): void {
    console.log(`[SMS] 전송 중... 내용: ${message}`);
  }
}

// Email 전송 구현
class EmailSender implements MessageSender {
  send(message: string): void {
    console.log(`[Email] 전송 중... 내용: ${message}`);
  }
}

// Kakao 전송 구현
class KakaoSender implements MessageSender {
  send(message: string): void {
    console.log(`[Kakao] 전송 중... 내용: ${message}`);
  }
}

// Telegram 전송 구현
class TelegramSender implements MessageSender {
  send(message: string): void {
    console.log(`[Telegram] 전송 중... 내용: ${message}`);
  }
}

// 추상부
// 사용자와 직접 대면하며 전체적인 흐름을 관리하는 쪽을
// 패턴에서는 추상화(Abstraction) 영역이라고 부릅니다.
// 최상위 추상 클래스
abstract class Noti {
  // 전송 수단(Sender)을 브리지로 연결
  constructor(protected sender: MessageSender) {}

  abstract notify(message: string): void;
}

// 일반 알림
class GeneralNotification extends Noti {
  notify(message: string): void {
    this.sender.send(`[일반] ${message}`);
  }
}

// 긴급 알림
class UrgentNotification extends Noti {
  notify(message: string): void {
    this.sender.send(`[URGENT!!] ${message}`);
  }
}

// 푸시 알림
class PushNotification extends Noti {
  notify(message: string): void {
    this.sender.send(`[PUSH] ${message}`);
  }
}

// 메일 형식 알림
class MailNotification extends Noti {
  notify(message: string): void {
    this.sender.send(`[MAIL-STYLE] ${message}`);
  }
}
/////////////////////////////
// CLIENT
/////////////////////////////
// 1. 긴급 알림을 카톡으로 보내기
const urgentKakao = new UrgentNotification(new KakaoSender());
urgentKakao.notify("서버 부하가 90%를 넘었습니다!");

// 2. 일반 알림을 이메일로 보내기
const generalEmail = new GeneralNotification(new EmailSender());
generalEmail.notify("비밀번호가 변경되었습니다.");

// 3. 푸시 알림을 텔레그램으로 보내기
const pushTelegram = new PushNotification(new TelegramSender());
pushTelegram.notify("새로운 공지사항이 있습니다.");

// 4. 메일 알림을 SMS로 보내기
const mailSms = new MailNotification(new SmsSender());
mailSms.notify("청구서 내용 확인 바랍니다.");
