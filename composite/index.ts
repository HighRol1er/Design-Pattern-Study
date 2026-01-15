interface Component {
  operation(): void;
}

class Leaf implements Component {
  constructor(private name: string) {}

  operation(): void {
    console.log(`Leaf(${this.name}) 호출`);
  }
}

class Composite implements Component {
  constructor(private name: string) {}
  components: Component[] = [];

  public add(c: Component) {
    this.components.push(c);
  }

  public remove(c: Component) {
    // component index
    const cIndex = this.components.indexOf(c);
    this.components.splice(cIndex, 1);
  }

  public operation(): void {
    console.log(`Composite(${this.name}) 호출`);
    for (const c of this.components) {
      c.operation();
    }
  }

  public getChild(): Component[] {
    return this.components;
  }
}

// client code
const cli = () => {
  const composite1 = new Composite("c1");

  const leaf1 = new Leaf("l1");
  const composite2 = new Composite("c2");

  composite1.add(leaf1);
  composite1.add(composite2);

  const leaf2 = new Leaf("l2");
  const leaf3 = new Leaf("l3");
  const leaf4 = new Leaf("l4");

  composite2.add(leaf2);
  composite2.add(leaf3);
  composite2.add(leaf4);

  composite1.operation();
};
