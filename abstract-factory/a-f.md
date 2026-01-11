# Abstract Factory

## 정의

1. 추상 팩토리 패턴은 다양한 구성 요소 별로 '객체의 집합'을 생성해야 할 때 유용하다.</br>
   이 패턴을 사용하여 상황에 알맞은 객체를 생성할 수 있다.

2. 추상 팩토리는 관련 객체들의 구상 클래스들을 지정하지 않고도 관련 객체들의 모음을 생성할 수 있도록 하는 생성패턴입니다.

> 구성요소?? 객체의 집합?? 관련 객체들의 모음?
> 정의는 가장 핵심적인 축약이기도 하기 때문에 항상 주의 깊게 읽어야한다. 하나씩 한번 뜯어보자..

## 구성요소 별로 객체의 집합을 생성한다. = 관련 객체들의 모음을 생성

A에는 A에 해당하는 객체의 집합을 모아둔다.</br>
B에는 B에 해당하는 객체의 집합을 모아둔다.</br>
이렇게 설명할 수 있을거같다.

## 구상 클래스들을 지정하지 않고 어떻게 관련 객체들의 모음을 만들 수 있을까?

<img width="1400" height="900" alt="image" src="https://github.com/user-attachments/assets/fdd9967d-2888-42e2-9dc1-2ae68d0b4f8c" />

다이어그램을 보면 `Abstract ProductA`, `Abstract ProductB` 이건 구성요소에 해당할 것이다. (다만 구체적인것이 아닌 추상)
`Abstract Factory`에는 `createProductA()`,`createProductB()` 관련있는 객체를 생성하는 팩토리가 있다.

구체적인 팩토리와 프로덕트는 모두 `ConcreteFactory`에서 만들어지는 것을 확인 할 수 있다.

<img width="1280" height="900" alt="image" src="https://github.com/user-attachments/assets/82bc69a9-611b-422e-a374-9147b58077c3" />

## 구체적인예시 - DB를 PROD, DEV 상황에 따라 연결을 달리할 때

### 1. Abstract Product & Abstract Factory 생성하기

```ts
interface DBConnection {
  connect(): string;
}

interface DBQuery {
  query(query: string): string;
}

interface DBFactory {
  createConnect(): DBConnection;
  createQuery(): DBQuery;
}
```

### 2. Concrete Product & Concrete Factory 생성하기

```ts
// Concrete Product
class MongoConnection implements DBConnection {
  connect() {
    return "MongoDB connected successfully.";
  }
}

class MongoQuery implements DBQuery {
  query(query: string) {
    return "Execute Mongo query.";
  }
}

class PsqlConnection implements DBConnection {
  connect() {
    return "PostgreSQL connected successfully.";
  }
}

class PsqlQuery implements DBQuery {
  query(query: string) {
    return "Execute PostgreSQL query.";
  }
}

// Concrete Factory

class MongoFactory implements DBFactory {
  createConnetion(): DBConnection {
    return new MongoConnection();
  }

  createQuery(): DBQuery {
    return new MongoQuery();
  }
}

class PsqlFactory implements DBFactory {
  createConnetion(): DBConnection {
    return new PsqlConnection();
  }

  createQuery(): DBQuery {
    return new PsqlQuery();
  }
}
```

### 3. Client 코드

```ts
class Services {
  private connection: DBConnection;
  private query: DBQuery;

  constructor(factory: DBFactory) {
    this.connection = factory.createConnection();
    this.query = factory.createQuery();
  }

  public loadUser(userId: string) {
    console.log(this.conn.connect());
    const sql = `SELECT * FROM users WHERE id = ${userId}`;
    console.log(this.query.executeQuery(sql));
    return `User data loaded via ${this.conn.constructor.name}.`;
  }
}

let dbFactory: DataAccessFactory;

console.log("--- Production Environment (Postgres) ---");
dbFactory = new PostgresFactory();
const prodService = new UserService(dbFactory);
console.log(prodService.loadUser("prod_user_123"));

console.log("\n--- Development Environment (Mongo) ---");
// CASE 2: 개발 환경 (Mongo 사용)
dbFactory = new MongoFactory();
const devService = new UserService(dbFactory);
console.log(devService.loadUser("dev_user_456"));
```
