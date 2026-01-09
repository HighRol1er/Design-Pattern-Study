// ========== 외부 결제 시스템: PayPal (기존 라이브러리) ==========
class PayPalPaymentService {
  makePayment(dollars: number, currencyCode: string) {
    console.log(`PayPal: Processing $${dollars} ${currencyCode}`);
    return {
      paymentId: `PAYPAL-${Date.now()}`,
      state: "approved",
      amount: dollars,
    };
  }

  refundPayment(paymentId: string) {
    console.log(`PayPal: Refunding ${paymentId}`);
    return {
      refundId: `REFUND-${Date.now()}`,
      state: "completed",
    };
  }
}

// ========== 처음 만든 결제 서비스 (PayPal에 직접 의존) ==========
class PaymentService {
  private paypalService: PayPalPaymentService;

  constructor() {
    this.paypalService = new PayPalPaymentService();
  }

  // PayPal의 인터페이스를 직접 사용
  checkout(amount: number, currency: string = "USD"): void {
    console.log("\n--- Starting checkout ---");
    const result = this.paypalService.makePayment(amount, currency);

    if (result.state === "approved") {
      console.log(`✓ Payment successful! Transaction ID: ${result.paymentId}`);
    } else {
      console.log(`✗ Payment failed: ${result.state}`);
    }
  }

  processRefund(transactionId: string): void {
    console.log("\n--- Processing refund ---");
    const result = this.paypalService.refundPayment(transactionId);

    if (result.state === "completed") {
      console.log(`✓ Refund successful! Refund ID: ${result.refundId}`);
    } else {
      console.log(`✗ Refund failed: ${result.state}`);
    }
  }
}

// ========== 사용 예시 ==========
console.log("=== PayPal Only (Before Adapter Pattern) ===\n");

const paymentService = new PaymentService();

paymentService.checkout(99.99, "USD");
paymentService.processRefund("PAYPAL-12345");

paymentService.checkout(149.5, "USD");
paymentService.processRefund("PAYPAL-67890");

console.log("\n문제점: 나중에 Stripe를 추가하려면?");
console.log("→ PaymentService 코드를 전부 수정해야 함");
console.log("→ PayPal의 메서드명(makePayment, state 등)에 강하게 결합됨");
