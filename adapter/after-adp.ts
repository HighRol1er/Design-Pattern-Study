// 우리 애플리케이션이 기대하는 통일된 결제 인터페이스
interface PaymentProcessor {
  processPayment(amount: number, currency: string): PaymentResult;
  refund(transactionId: string): RefundResult;
}

interface PaymentResult {
  success: boolean;
  transactionId: string;
  message: string;
}

interface RefundResult {
  success: boolean;
  refundId: string;
  message: string;
}

// ========== 외부 결제 시스템 1: Stripe (기존 라이브러리) ==========
class StripePaymentService {
  // Stripe는 센트 단위로 처리하고 다른 메서드 이름을 사용
  charge(amountInCents: number, curr: string) {
    console.log(`Stripe: Charging ${amountInCents} cents in ${curr}`);
    return {
      id: `stripe_${Date.now()}`,
      status: "succeeded",
      amount: amountInCents,
    };
  }

  createRefund(chargeId: string) {
    console.log(`Stripe: Creating refund for ${chargeId}`);
    return {
      id: `refund_${Date.now()}`,
      status: "succeeded",
    };
  }
}

// ========== 외부 결제 시스템 2: PayPal (기존 라이브러리) ==========
class PayPalPaymentService {
  // PayPal은 다른 형식의 응답을 반환
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

// ========== 어댑터 1: Stripe를 우리 인터페이스에 맞게 변환 ==========
class StripePaymentAdapter implements PaymentProcessor {
  private stripeService: StripePaymentService;

  constructor(stripeService: StripePaymentService) {
    this.stripeService = stripeService;
  }

  processPayment(amount: number, currency: string): PaymentResult {
    // 달러를 센트로 변환
    const amountInCents = Math.round(amount * 100);
    const result = this.stripeService.charge(amountInCents, currency);

    return {
      success: result.status === "succeeded",
      transactionId: result.id,
      message: `Stripe payment ${result.status}`,
    };
  }

  refund(transactionId: string): RefundResult {
    const result = this.stripeService.createRefund(transactionId);

    return {
      success: result.status === "succeeded",
      refundId: result.id,
      message: `Refund ${result.status}`,
    };
  }
}

// ========== 어댑터 2: PayPal을 우리 인터페이스에 맞게 변환 ==========
class PayPalPaymentAdapter implements PaymentProcessor {
  private paypalService: PayPalPaymentService;

  constructor(paypalService: PayPalPaymentService) {
    this.paypalService = paypalService;
  }

  processPayment(amount: number, currency: string): PaymentResult {
    const result = this.paypalService.makePayment(amount, currency);

    return {
      success: result.state === "approved",
      transactionId: result.paymentId,
      message: `PayPal payment ${result.state}`,
    };
  }

  refund(transactionId: string): RefundResult {
    const result = this.paypalService.refundPayment(transactionId);

    return {
      success: result.state === "completed",
      refundId: result.refundId,
      message: `Refund ${result.state}`,
    };
  }
}

// ========== 클라이언트 코드 ==========
class PaymentService {
  private processor: PaymentProcessor;

  constructor(processor: PaymentProcessor) {
    this.processor = processor;
  }

  // 결제 시스템에 상관없이 동일한 인터페이스로 사용
  checkout(amount: number, currency: string = "USD"): void {
    console.log("\n--- Starting checkout ---");
    const result = this.processor.processPayment(amount, currency);

    if (result.success) {
      console.log(
        `✓ Payment successful! Transaction ID: ${result.transactionId}`
      );
    } else {
      console.log(`✗ Payment failed: ${result.message}`);
    }
  }

  processRefund(transactionId: string): void {
    console.log("\n--- Processing refund ---");
    const result = this.processor.refund(transactionId);

    if (result.success) {
      console.log(`✓ Refund successful! Refund ID: ${result.refundId}`);
    } else {
      console.log(`✗ Refund failed: ${result.message}`);
    }
  }
}

// ========== 사용 예시 ==========
console.log("=== Adapter Pattern Demo ===\n");

// Stripe 사용
const stripeService = new StripePaymentService();
const stripeAdapter = new StripePaymentAdapter(stripeService);
const stripePayment = new PaymentService(stripeAdapter);

stripePayment.checkout(99.99, "USD");
stripePayment.processRefund("stripe_12345");

// PayPal 사용 - 동일한 인터페이스!
const paypalService = new PayPalPaymentService();
const paypalAdapter = new PayPalPaymentAdapter(paypalService);
const paypalPayment = new PaymentService(paypalAdapter);

paypalPayment.checkout(149.5, "USD");
paypalPayment.processRefund("PAYPAL-67890");

// 핵심: PaymentService는 어떤 결제 시스템을 사용하는지 몰라도 됨
// 어댑터가 각 시스템의 차이를 흡수함
