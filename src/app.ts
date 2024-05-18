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
  // このジェネリクス型はclassを受け取る必要がある。クラスを制約にする場合は中括弧{}を書いてオブジェクトを書く
  // 中括弧の中にnewを書く。typescriptにオブジェクトだがnewキーワードを使ってインスタンスを作れる、すなわちコンストラクタ関数であることを伝える。
  // new関数は任意の数の引数を持ち、オブジェクトを返す。
  return function<T extends {new(...args: any[]): {name: string}}>(originalConstructor: T) {
    // classに追加されるデコレーターはコンストラクタ関数を返す
    return class extends originalConstructor { // classはコンストラクタ関数のシンタックスシュガーである。class名は不要。
      constructor(..._: any[]) { // 新しいコンストラクタ
        super(); // originalConstructorコンストラクタ関数が呼び出される。継承したclassでコンストラクタ関数を追加した場合は必要
        console.log('Template-デコレーター関数');
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          // class Personのnameを表示させる
          hookEl.querySelector('h1')!.textContent = this.name
        }
      }
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

function Log2(target: any, name: string, descriptor: PropertyDescriptor) { // PropertyDescriptorはtypescriptに組み込まれている型
  console.log("Accessor デコレータ");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) { // PropertyDescriptorはtypescriptに組み込まれている型
  console.log("Method デコレータ");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) { // nameはメソッド名, 引数の３番目はパラメータの位置
  console.log("Parameter デコレータ");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log // プロパティにデコレーターを追加することが可能（引数は二つ受け取れる）
  title: string;
  private _price: number;

  // アクセサーにデコレータを追加する。（引数は三つ）
  @Log2
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

  @Log3 // メソッドにデコレータを追加する。（引数は三つ）
  getPriceWithTax(@Log4 tax: number) { // パラメーターにデコレーターを追加　（引数は三つ）
    return this._price * (1 + tax);
  }
}

function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false, // for inのループにこのメソッドは表示されない
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor
}

class Printer {
  message = 'クリックしました。';

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector("button")!;

button.addEventListener('click', p.showMessage);