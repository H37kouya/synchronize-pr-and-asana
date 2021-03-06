export abstract class ValueObject<T> {
  constructor(protected value: T) {}
  public get() {
    return this.value;
  }

  public eq<Instance extends ValueObject<T>>(
    this: Instance,
    valueObject: Instance
  ): boolean {
    return valueObject.get() === this.value;
  }

  public static of = function <T, Instance extends ValueObject<T>>(
    this: new (value: T) => Instance,
    value: ReturnType<Instance['get']>
  ) {
    return new this(value);
  };
}
