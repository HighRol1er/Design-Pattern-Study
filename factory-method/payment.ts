// product interface

interface PaymentGateway {
  pay(amount: number): void;
}

// concrete product
class StripePaymentGateway implements PaymentGateway {
  pay(amount: number) {
    console.log(`${amount} 스트라이프 결제 처리`);
  }
}

class PaypalPaymentGateway implements PaymentGateway {
  pay(amount: number) {
    console.log(`${amount} 페이팔 결제 처리`);
  }
}

class ApplePayPaymentGateway implements PaymentGateway {
  pay(amount: number) {
    console.log(`${amount} 애플페이 결제 처리`);
  }
}

type Provider = "stripe" | "paypal" | "applePay";
// factory method
abstract class Payment {
  abstract createGateway(): PaymentGateway;

  static createGateway(provider: Provider): PaymentGateway {
    switch (provider) {
      case "stripe":
        return new StripePaymentGateway();
      case "paypal":
        return new PaypalPaymentGateway();
      case "applePay":
        return new ApplePayPaymentGateway();
      default:
        throw new Error(`Invalid provider: ${provider}`);
    }
  }
}

// client code

function checkout(amount: number, provier: Provider): void {
  const gateway = Payment.createGateway(provier);
  gateway.pay(amount);
}

checkout(100, "stripe");
checkout(200, "paypal");
checkout(300, "applePay");

// switch case 제거 코드
// 이건 좀 어렵네>? ㅋㅋ;;

// class Payment2 {
//   private static registry: Record<Provider, new () => PaymentGateway> = {
//     stripe: StripePaymentGateway,
//     paypal: PaypalPaymentGateway,
//     applePay: ApplePayPaymentGateway,
//   };

//   static register(provider: Provider, gateway: new () => PaymentGateway): void {
//     this.registry[provider] = gateway;
//   }
// }

// Payment2.register("stripe", StripePaymentGateway);
