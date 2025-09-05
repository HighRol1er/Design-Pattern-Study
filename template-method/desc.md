# Template Method Pattern

## 의도 

템플릿 메서드는 부모 클래스에서 알고리즘의 골격을 정의하지만, 해당 알고리즘의 구조를 변경하지 않고 자식 클래스들이 알고리즘의 특정 단계들을 오버라이드(재정의)할 수 있도록 하는 행동 디자인 패턴입니다. 

## 문제 

회사 문서들을 분석하는 데이터 다이닝 앱을 만들고 있다고 가정해봅시다.<br/>
사용자들은 앱에 다양한 형식 (PDF, DOC, CSV)의 문서들을 제공하고 앱은 이러한 문서들에서 일관된 형식으로 의미 있는 데이터를 추출하려고 시도합니다. 

앱의 첫 번째 버전은 DOC 파일과만 작동할 수 있었고, 다음 버전에서는 CSV 파일을 지원할 수 있었습니다. 또 후에 당신은 앱이 PDF 파일에서 데이터를 추출할 수 있도록 가르쳤습니다.

<img width="1240" height="920" alt="image" src="https://github.com/user-attachments/assets/c8a057aa-5518-435d-844d-ad3f3d016a54" />

> 데이터 마이닝 클래스들에는 중복 코드가 많이 포함되어 있습니다.

```ts
// 그림에 있는 메서드들을 나열해본 예시

class DocDataMiner {
  protected file: IFile
  protected rawData: IData
  protected analysis : IAnalysis

  extractDocData(file) {
    // ... some code
  }

  parseDocData(rawData) {
    // ... some code 
  }

  analyzeData(data) {
    // ... some code
  }

  sendReport(analysis) {
    // ... some code
  }
  closeFile(file {
    // ... some code
  }
}

class CSVDataMiner {
  protected file: IFile
  protected rawData: IData
  protected analysis : IAnalysis

  extractDocData(file) {
    // ... some code
  }

  parseDocData(rawData) {
    // ... some code 
  }

  analyzeData(data) {
    // ... some code
  }

  sendReport(analysis) {
    // ... some code
  }
  closeFile(file {
    // ... some code
  }
}

class PDFDataMiner {
  protected file: IFile
  protected rawData: IData
  protected analysis : IAnalysis

  extractDocData(file) {
    // ... some code
  }

  parseDocData(rawData) {
    // ... some code 
  }

  analyzeData(data) {
    // ... some code
  }

  sendReport(analysis) {
    // ... some code
  }
  closeFile(file {
    // ... some code
  }
}
```

어느 날 당신은 세 클래스 모두에 유사한 코드가 많다는 것을 알게되었습니다. 댜양한 형식들을 처리하는 코드는 클래스마다 완전히 다르지만 데이터 처리 및 분석을 위한 코드는 거의 같습니다. 알고리즘 구조는 그대로 두되 **중복 코드는 제거하는게 좋지 않을까요?**

이 클래스들을 사용하는 클라이언트 코드와 관련된 또 다른 문제가 있었습니다. 이 코드에는 작업을 처리하고 있는 클래스에 따라 적절한 행동들을 선택하는 조건문이 많이 있었습니다. 세 처리 클래스에 전부 공통 인터페이스나 공통 기초 클래스가 있었다면, 클라이언트 코드에서 조건문들을 제거하고 처리 객체에 메서드를 호출할 때 다형성을 사용할 수 있었을 겁니다. 

### 다형성(polymorphism)을 사용할 수 있다란?**<br/>
여러 객체가 같은 인터페이스를 통해서 같은 방식으로 호출될 수 있는 성질<br/>
이러면 클라이언트 코드에서 "무엇인지 확인하고 분기"할 필요가 없습니다.<br/>
 
```ts
interface Processor {
    process(): void;
}

class FileProcessor implements Processor {
    process() { console.log("파일 처리"); }
}

class NetworkProcessor implements Processor {
    process() { console.log("네트워크 처리"); }
}

class DatabaseProcessor implements Processor {
    process() { console.log("DB 처리"); }
}

// client code
function handle(processor: Processor) {
    processor.process(); // 어떤 종류든 process()만 호출
}
```

## 해결책
템플릿 메서드 패턴은 알고리즘을 일련의 단계들로 나누고 이러한 단계들을 메서드들로 변한한 뒤, 단일 템플릿메서드 내부에 이러한 메서드들에 대한 일련의 호출들을 넣으라고 제안합니다.<br/>
이러한 단계들은 `abstract`이거나 일부 기본값 구현을 가질 것입니다.<br/>
알고리즘을 사용하기 위해 클라이언트는 자신의 자식 클래스를 제공해야 하고, 모든 추상 단계를 구현해야 하며, 필요하다면 (템플릿 메서드를 제외한) 선택적 단계 중 일부를 오버라이드(재정의) 해야 합니다.

이것은 당신의 데이터 마이닝 앱에서 어떻게 작동하는지 봅시다.<br/>
세 가지 파싱 알고리즘들은 모두 base가 되는 클래스를 통해서 만들 수 있습니다. 이 기초 클래스에서 다양한 문서 처리 단계들에 대한 일련의 호출들로 구성된 템플릿 메서드를 정의합니다. 

<img width="1200" height="840" alt="image" src="https://github.com/user-attachments/assets/26707b53-804f-429c-b937-1fd70111c766" />

> 템플릿 메서드는 알고리즘을 단계로 나누어 정의하고 자식 클래스가 그 단계들을의 세부 구현만 재정의(오버라이드) 할 수 있도록 합니다. 알고리즘의 전체 흐름(템플릿)은 변경할 수 없고 세부 단계만 재정의가 가능합니다.


