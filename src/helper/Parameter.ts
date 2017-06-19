class Parameter {
  public exec: string;
  public value: string[];
  constructor(type: string, value: string[]) {
    this.exec = type;
    this.value = value;
  }
}

export default Parameter;
