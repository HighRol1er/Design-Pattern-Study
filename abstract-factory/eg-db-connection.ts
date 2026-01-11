interface DBConnection {
  connect(): string;
}

interface DBQuery {
  executeQuery(sql: string): string;
}

interface DataAccessFactory {
  createConnection(): DBConnection;
  createQuery(): DBQuery;
}

// --- MongoDB 제품군 ---
class MongoConnection implements DBConnection {
  connect() {
    return "MongoDB connected successfully.";
  }
}
class MongoQuery implements DBQuery {
  executeQuery(sql: string) {
    return `Executing NoSQL command on Mongo: ${sql}`;
  }
}

// --- PostgreSQL 제품군 ---
class PostgresConnection implements DBConnection {
  connect() {
    return "PostgreSQL connected successfully.";
  }
}
class PostgresQuery implements DBQuery {
  executeQuery(sql: string) {
    return `Executing SQL query on Postgres: ${sql}`;
  }
}

// --- MongoDB 팩토리 ---
class MongoFactory implements DataAccessFactory {
  createConnection(): DBConnection {
    return new MongoConnection();
  }
  createQuery(): DBQuery {
    return new MongoQuery();
  }
}

// --- PostgreSQL 팩토리 ---
class PostgresFactory implements DataAccessFactory {
  createConnection(): DBConnection {
    return new PostgresConnection();
  }
  createQuery(): DBQuery {
    return new PostgresQuery();
  }
}

// 클라이언트 (핵심 서비스 로직)
class UserService {
  private conn: DBConnection;
  private query: DBQuery;

  constructor(factory: DataAccessFactory) {
    // 런타임에 주입된 팩토리를 통해 필요한 객체들을 생성합니다.
    this.conn = factory.createConnection();
    this.query = factory.createQuery();
  }

  public loadUser(userId: string) {
    console.log(this.conn.connect());
    const sql = `SELECT * FROM users WHERE id = ${userId}`;
    console.log(this.query.executeQuery(sql));
    return `User data loaded via ${this.conn.constructor.name}.`;
  }
}

// --- 실행 ---
let dbFactory: DataAccessFactory;

// CASE 1: 운영 환경 (Postgres 사용)
console.log("--- Production Environment (Postgres) ---");
dbFactory = new PostgresFactory();
const prodService = new UserService(dbFactory);
console.log(prodService.loadUser("prod_user_123"));

console.log("\n--- Development Environment (Mongo) ---");
// CASE 2: 개발 환경 (Mongo 사용)
dbFactory = new MongoFactory();
const devService = new UserService(dbFactory);
console.log(devService.loadUser("dev_user_456"));
