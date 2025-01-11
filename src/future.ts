type OK<T> = (value: T) => void;
type NO = (e: any) => void;
export class Waitable<T> {
  public ok!: OK<T>;
  public no!: NO;
  protected _promise!: Promise<T>;
  protected _done!: boolean;
  constructor() {
    this.reset();
  }
  reset() {
    this._done = false;
    this._promise = new Promise<T>((ok, no) => {
      this.ok = (x:T) => {
        ok(x);
        this._done = true;
      }
      this.no = (e:Error) => no(e);
    });
  }
  // non-blocking wait
  wait<S>(done:(x:T) => S, yet?:() => void):Promise<S> { try {
    return this._promise.then(done);
  } finally {
    if (yet && !this._done) yet(); // 未完了の場合はyetを呼ぶ
  } }
  get done() { return this._done }
  // 値を更新する. 未完了の場合はok(x)を呼ぶ. 完了済みの場合はpromiseを更新する
  update(x:T) {
    if (!this._done) return this.ok(x);
    this._promise = Promise.resolve(x);
  }
}

// waitableを待つ関数を作る
export const waiter = <T, R, A extends any[]>(
  w:Waitable<T>,
  done: (x:T) => (...args:A) => Promise<R>|R,
) => async (...args:A) => w.wait((x:T) => done(x)(...args));

export const ready = <T extends {ready:Future<Required<T>&T>}>
  (x:T|undefined):x is Required<T>&T => x !== undefined ? x.ready.done : false;
export const readies = <T extends {ready:Future<Required<T>&T>}>
  (xs:(T|undefined)[]) => xs.filter(ready) as (Required<T>&T)[];

// awaitable future
export class Future<T> extends Waitable<T> {
  constructor(protected taker?:() => Promise<T>|T) { super() }
  async then(ok?:OK<T>, no?:NO) {
    if (this.taker && !this._done) {
      this._done = true; // takerの二重実行を避ける
      try {
        this.ok(await this.taker());
      } catch (e) {
        if (no) no(e);
        this.no(e);
      }
    }
    return this._promise.then(ok, no);
  }
  invalidate() {
    if (!this._done) return;
    this._done = false;
  }
  get promise() { return this._promise }
}
"./future.spec.ts"

export const book = <T>(taker:() => Promise<T>|T) => new Future(taker);
