function Logger(constructor: Function) { // デコレーターは慣例的に最初の文字を大文字にする。デコレーターは最終的には関数として扱われる。
  console.log("ログ出力中...");
  console.log(constructor);
}

@Logger // @マークでデコレーターとして使うことを宣言する。クラスについての場合は引数は一つ。この場合はコンストラクタ関数。また、デコレーターはclassが宣言されたときに実行される。したがってPersonオブジェクトを作成中...（インスタンス化）よりも先に実行される。
class Person {
  name = 'Max';
  
  constructor() {
    console.log("Personオブジェクトを作成中...");
  }
}

const pers = new Person(); // constructorが読みだされる。

console.log(pers);
