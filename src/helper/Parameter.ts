class Parameter {
  public exec: string;
  public value: any;
  constructor(type: string, value: number) {
    this.exec = type;
    this.value = value;
  }
}

export default Parameter;
