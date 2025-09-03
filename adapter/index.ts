// 어댑터 패턴 예시: 주식 시장 모니터링 앱
// XML 형식의 주식 데이터를 JSON 형식으로 변환하는 어댑터

// 1. 클라이언트 인터페이스 (클라이언트가 기대하는 형태)
interface StockDataClient {
  getStockPrice(symbol: string): number;
  getStockVolume(symbol: string): number;
  getStockChange(symbol: string): number;
}

// 2. 서비스 클래스 (타사 라이브러리 - JSON 형식만 지원)
class ThirdPartyStockAnalyzer {
  private stockData: { [key: string]: any } = {};

  constructor() {
    // JSON 형식의 샘플 데이터
    this.stockData = {
      AAPL: { price: 150.25, volume: 1000000, change: 2.5 },
      GOOGL: { price: 2750.8, volume: 500000, change: -1.2 },
      MSFT: { price: 310.45, volume: 750000, change: 0.8 },
    };
  }

  // JSON 형식의 데이터만 받아서 분석
  analyzeStockData(jsonData: any): any {
    const symbol = jsonData.symbol;
    const data = this.stockData[symbol];

    if (!data) {
      throw new Error(`Stock data not found for symbol: ${symbol}`);
    }

    return {
      symbol: symbol,
      price: data.price,
      volume: data.volume,
      change: data.change,
      analysis: `Stock ${symbol} is ${
        data.change > 0 ? "up" : "down"
      } by ${Math.abs(data.change)}%`,
    };
  }

  getStockInfo(symbol: string): any {
    return this.stockData[symbol];
  }
}

// 3. 어댑터 클래스 (XML을 JSON으로 변환)
class StockDataAdapter implements StockDataClient {
  private analyzer: ThirdPartyStockAnalyzer;

  constructor(analyzer: ThirdPartyStockAnalyzer) {
    this.analyzer = analyzer;
  }

  // XML 데이터를 JSON으로 변환하는 헬퍼 메서드
  private xmlToJson(xmlData: string): any {
    // 간단한 XML 파싱 (실제로는 더 정교한 XML 파서 사용)
    const symbolMatch = xmlData.match(/<symbol>([^<]+)<\/symbol>/);
    const priceMatch = xmlData.match(/<price>([^<]+)<\/price>/);
    const volumeMatch = xmlData.match(/<volume>([^<]+)<\/volume>/);
    const changeMatch = xmlData.match(/<change>([^<]+)<\/change>/);

    if (!symbolMatch) {
      throw new Error("Invalid XML format: symbol not found");
    }

    return {
      symbol: symbolMatch[1],
      price: priceMatch ? parseFloat(priceMatch[1]) : 0,
      volume: volumeMatch ? parseInt(volumeMatch[1]) : 0,
      change: changeMatch ? parseFloat(changeMatch[1]) : 0,
    };
  }

  // 클라이언트 인터페이스 구현
  getStockPrice(symbol: string): number {
    const stockInfo = this.analyzer.getStockInfo(symbol);
    return stockInfo ? stockInfo.price : 0;
  }

  getStockVolume(symbol: string): number {
    const stockInfo = this.analyzer.getStockInfo(symbol);
    return stockInfo ? stockInfo.volume : 0;
  }

  getStockChange(symbol: string): number {
    const stockInfo = this.analyzer.getStockInfo(symbol);
    return stockInfo ? stockInfo.change : 0;
  }

  // XML 데이터를 분석하는 메서드
  analyzeXMLStockData(xmlData: string): any {
    const jsonData = this.xmlToJson(xmlData);
    return this.analyzer.analyzeStockData(jsonData);
  }
}

// 4. 클라이언트 클래스 (기존 비즈니스 로직)
class StockMarketApp {
  private stockClient: StockDataClient;

  constructor(stockClient: StockDataClient) {
    this.stockClient = stockClient;
  }

  displayStockInfo(symbol: string): void {
    const price = this.stockClient.getStockPrice(symbol);
    const volume = this.stockClient.getStockVolume(symbol);
    const change = this.stockClient.getStockChange(symbol);

    console.log(`=== ${symbol} Stock Information ===`);
    console.log(`Price: $${price.toFixed(2)}`);
    console.log(`Volume: ${volume.toLocaleString()}`);
    console.log(`Change: ${change > 0 ? "+" : ""}${change.toFixed(2)}%`);
    console.log("===============================\n");
  }

  generateChart(symbol: string): void {
    const price = this.stockClient.getStockPrice(symbol);
    const change = this.stockClient.getStockChange(symbol);

    console.log(`📊 Chart for ${symbol}:`);
    console.log(`💰 Current Price: $${price.toFixed(2)}`);
    console.log(
      `📈 Change: ${change > 0 ? "🟢" : "🔴"} ${
        change > 0 ? "+" : ""
      }${change.toFixed(2)}%`
    );
    console.log("");
  }
}

// 5. 사용 예시
function demonstrateAdapterPattern(): void {
  console.log("🚀 어댑터 패턴 데모 시작\n");

  // 타사 분석 라이브러리 인스턴스 생성
  const analyzer = new ThirdPartyStockAnalyzer();

  // 어댑터 생성 (XML을 JSON으로 변환)
  const adapter = new StockDataAdapter(analyzer);

  // 클라이언트 앱 생성 (어댑터를 통해 서비스 사용)
  const app = new StockMarketApp(adapter);

  // 기존 인터페이스를 통해 주식 정보 표시
  console.log("📱 기존 인터페이스를 통한 주식 정보 표시:");
  app.displayStockInfo("AAPL");
  app.displayStockInfo("GOOGL");
  app.displayStockInfo("MSFT");

  // 차트 생성
  console.log("📊 차트 생성:");
  app.generateChart("AAPL");
  app.generateChart("GOOGL");

  // XML 데이터 분석 (어댑터의 특별한 기능)
  console.log("🔄 XML 데이터 분석:");
  const xmlData =
    "<symbol>AAPL</symbol><price>150.25</price><volume>1000000</volume><change>2.5</change>";
  try {
    const analysis = adapter.analyzeXMLStockData(xmlData);
    console.log("XML 분석 결과:", analysis);
  } catch (error) {
    console.error("XML 분석 오류:", error);
  }

  console.log("\n✅ 어댑터 패턴 데모 완료!");
}

// 6. 실행
// 데모 함수를 직접 호출하여 실행
demonstrateAdapterPattern();

export {
  StockDataClient,
  ThirdPartyStockAnalyzer,
  StockDataAdapter,
  StockMarketApp,
  demonstrateAdapterPattern,
};
