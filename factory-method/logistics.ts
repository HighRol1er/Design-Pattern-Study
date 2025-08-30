// product
interface Transport {
  deliver(): void;
}

// concrete product
class Truck implements Transport {
  deliver() {
    console.log("🚚 트럭이 배송합니다.");
  }
}

class Train implements Transport {
  deliver() {
    console.log("🚂 기차가 배송합니다.");
  }
}

class Ship implements Transport {
  deliver() {
    console.log("🚢 선박이 배송합니다.");
  }
}

// creator , parent class
abstract class LogisticsCreator {
  abstract createTransport(): Transport;

  planDelivery() {
    const transport = this.createTransport();
    transport.deliver();
  }
}

// concrete creator , child class
class RoadLogistics extends LogisticsCreator {
  createTransport(): Transport {
    return new Truck();
  }
}

class SeaLogistics extends LogisticsCreator {
  createTransport(): Transport {
    return new Ship();
  }
}

// client code
function clientCode2(logistics: LogisticsCreator) {
  logistics.planDelivery();
}

clientCode2(new RoadLogistics());
clientCode2(new SeaLogistics());
