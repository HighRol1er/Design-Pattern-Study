/**
 * 팩토리 메서드 패턴
 *
 * # 정의
 * 객체 생성을 캡슐화하는 디자인 패턴
 * 어떤 객체를 생성할지는 하위 클래스(서브 클래스)가 결정하도록 위임한다.
 *
 * 즉, 클래스 인스턴스를 만드는 일을 별도의 메서드(팩토리 메서드)에 맡기고
 * 코드가 주체적인 클래스에 의존하지 않게 한다.
 *
 * 만약 여러 종류의 버튼을 만들고 싶다고 해보자 HTMLButton, WindowsButton, LinuxButton 등등
 * 만약 new HTMLBtn() 처럼 직접 생성자를 호출하면 클라이언트 코드가 구체 클래스에 강하게 의존하게 된다.
 *
 */

// 직접 new 생성자를 통해서 호출하게되면 구체 클래스에 강하게 의존하는 예제 코드

class HTMLBtn {
  click() {
    console.log("html btn clicked");
  }
}

class WindowsBtn {
  click() {
    console.log("windows btn clicked");
  }
}

class LinuxBtn {
  click() {
    console.log("linux btn clicked");
  }
}

// 이 상황에서 클라이언트 코드가 아래와 같이 사용된다면?

const btn1 = new HTMLBtn();
const btn2 = new WindowsBtn();
const btn3 = new LinuxBtn();

// 이렇게 new HTMLBtn() 처럼 직접 생성자를 호출하면 클라이언트 코드가 구체 클래스에 강한 커플링이 된다.

/**
 * 새로운 버튼 유형을 추가할 때마다 클라이언트 코드를 수정해야 된다. -> OCP(개방-폐쇄 원칙) 위배
 */

// 이런 문제를 해결하기 위해서 팩토리 메서드 패턴을 사용할 수 있다.
// 어떤 구체 클래스의 인스턴스를 반환할지는 하위 클래스가 결정하도록 만든다.

/**
 * . 구조
 * Product (제품 인터페이스): 공통 인터페이스 (예: Button)
 * ConcreteProduct (구체 제품): 실제 생성될 객체 (예: HTMLButton, WindowsButton)
 * Creator (생산자): 팩토리 메서드를 정의한 추상 클래스/인터페이스
 * ConcreteCreator (구체 생산자): 팩토리 메서드를 구현하여 특정 객체를 반환
 */

// 1. Product interface

interface IButton {
  render(): void;
  onClick(): void;
}

// 2. ConcreteProduct

class HtmlButton implements IButton {
  render() {
    console.log("html button rendered");
  }

  onClick() {
    console.log("html button clicked");
  }
}

class WindowsButton implements IButton {
  render() {
    console.log("windows button rendered");
  }

  onClick() {
    console.log("windows button clicked");
  }
}

// 3. Creator (팩토리 메서드 포함)

abstract class Dialog {
  abstract createButton(): IButton;

  // 비즈니스 로직 (공통 동작)
  renderDialog() {
    const okButton = this.createButton();
    okButton.onClick();
    okButton.render();
  }
}

// Concrete Creator
class WebDialog extends Dialog {
  createButton(): IButton {
    return new HtmlButton();
  }
}

class WindowsDialog extends Dialog {
  createButton(): IButton {
    return new WindowsButton();
  }
}

// 5. 클라이언트 코드
function clientCode(dialog: Dialog) {
  dialog.renderDialog();
}

// 실행
clientCode(new WebDialog()); // HTML 버튼
clientCode(new WindowsDialog()); // Windows 버튼
