function Logger(logString: string) { // デコレーターは慣例的に最初の文字を大文字にする。デコレーターは最終的には関数として扱われる。
  // デコレーターファクトリ
  console.log('Logger');
  return function(constructor: Function) {
    console.log('Logger-デコレーター関数');
    console.log(logString);
    console.log(constructor);
  }
}

function WithTemplate(template: string, hookId: string) {
  console.log('Template');
  return function(constructor: any) {
    console.log('Template-デコレーター関数');
    const hookEl = document.getElementById(hookId);
    const p = new constructor();
    if (hookEl) {
      hookEl.innerHTML = template;
      // class Personのnameを表示させる
      hookEl.querySelector('h1')!.textContent = p.name
    }
  }
}

// @マークでデコレーターとして使うことを宣言する。クラスについての場合は引数は一つ。この場合はコンストラクタ関数。また、デコレーターはclassが宣言されたときに実行される。したがってPersonオブジェクトを作成中...（インスタンス化）よりも先に実行される。
// @Logger 
// デコレーターファクトリを使用する際は関数表記にする必要がある。つまり@Logger()とする。

// 処理は@Logger, @WithTemplateの順に実行されるが、デコレーター関数は下から上の順に実行される。
// すなわち上の関数はLogger, Template, Template-デコレーター関数, Logger-デコレーター関数の順にコンソールへ表示されることになる。
@Logger("ログ出力中 - PERSON")
@WithTemplate("<h1>Personオブジェクト</h1>", "app")
class Person {
  name = 'Max';
  
  constructor() {
    console.log("Personオブジェクトを作成中...");
  }
}

const pers = new Person(); // constructorが読みだされる。

console.log(pers);

// デコレーターを追加するにはclassが必要だが直接classに追加する必要はない

function Log(target: any, propertyName: string | Symbol) {
  console.log("Property デコレーター");
  console.log(target, propertyName);
}

class Product {
  @Log // プロパティにデコレーターを追加することが可能（引数は二つ受け取れる）
  title: string;
  private _price: number;

  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("不正な価格です - 0以下は設定できません")
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}