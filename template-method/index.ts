class Drink {
  make() {
    this.boilWater(); // step1
    this.brew(); // step2
    this.pourInCup(); // step3
    this.addCondiments(); // step4
  }

  boilWater() {
    console.log("물을 끓이는 중");
  }
  brew() {
    console.log("액체를 우려내는중");
  }
  pourInCup() {
    console.log("컵에 따르는 중");
  }
  addCondiments() {
    console.log("향을 추가하는 중");
  }
}

class Coffee extends Drink {
  brew() {
    console.log("커피를 우려내는 중");
  }
  addCondiments() {
    console.log("설탕과 우유를 추가하는 중");
  }
}

class Tea extends Drink {
  brew() {
    console.log("차를 우려내는 중");
  }
  addCondiments() {
    console.log("레몬을 추가하는 중");
  }
}

const coffee = new Coffee();
coffee.make();

const tea = new Tea();
tea.make();
