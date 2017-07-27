class Position {
  absoluteCol: number;
  line:        number;
  relativeCol: number;
  length:      number;

  constructor(absoluteCol: number, line: number, relativeCol: number, length: number) {
    this.absoluteCol = absoluteCol;
    this.line        = line;
    this.relativeCol = relativeCol;
    this.length      = length;
  }
}

export default Position;


