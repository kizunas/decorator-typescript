function Logger(logString: string) { // デコレーターは慣例的に最初の文字を大文字にする。デコレーターは最終的には関数として扱われる。
  // デコレーターファクトリ
  return function(constructor: Function) {
    console.log(logString);
    console.log(constructor);
  }
}

// @マークでデコレーターとして使うことを宣言する。クラスについての場合は引数は一つ。この場合はコンストラクタ関数。また、デコレーターはclassが宣言されたときに実行される。したがってPersonオブジェクトを作成中...（インスタンス化）よりも先に実行される。
// @Logger 
// デコレーターファクトリを使用する際は関数表記にする必要がある。つまり@Logger()とする。
@Logger("ログ出力中 - PERSON")
class Person {
  name = 'Max';
  
  constructor() {
    console.log("Personオブジェクトを作成中...");
  }
}

const pers = new Person(); // constructorが読みだされる。

console.log(pers);
