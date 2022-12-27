class Clock {
  oltTime; currentTime;

  constructor() {
    this.oldTime = Date.now();
  }

  clockDelta() {
    this.currentTime = Date.now();
    let elapsedTime = this.currentTime - this.oldTime;
    this.oldTime = this.currentTime;
    return elapsedTime;
  }
}