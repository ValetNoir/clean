class InputManager {
  callbacks; currentlyPressedKeys; mouseVelocity; mousePos;

  constructor(inputHandler) {
    this.callbacks = {};
    this.currentlyPressedKeys = {};
    this.mouseVelocity = [0, 0];
    this.mousePos = [0, 0];

    inputHandler.addEventListener("keydown", e => { e.preventDefault(); this.onKeyDown(e.key); });
    inputHandler.addEventListener("keyup", e => { e.preventDefault(); this.onKeyUp(e.key); });
    inputHandler.addEventListener("mousedown", e => { e.preventDefault(); this.onKeyDown("mouse" + e.button); });
    inputHandler.addEventListener("mouseup", e => { e.preventDefault(); this.onKeyUp("mouse" + e.button); });

    inputHandler.addEventListener("mousemove", e => { e.preventDefault(); this.onMouseMove(e); this.onKeyDown("mousemove")});
  }

  addListener(key, callbackStart, callbackEnd) {
    this.callbacks[key] = [callbackStart, callbackEnd];
  }

  deleteListener(key) {
    this.callbacks[key] = undefined;
  }

  onKeyDown(key) {
    this.currentlyPressedKeys[key] = true;
  }

  onKeyUp(key) {
    this.currentlyPressedKeys[key] = false;
    if(this.callbacks[key]) this.callbacks[key][1]();
  }

  onMouseMove(e) {
    this.mouseVelocity = [e.movementX, e.movementY];
    this.mousePosition = [e.x, e.y];
  }

  checksCallbacks(deltatime) {
    Object.keys(this.currentlyPressedKeys).forEach((key) => {
      if(this.currentlyPressedKeys[key] && this.callbacks[key]) this.callbacks[key][0](deltatime, this.mouseVelocity, this.mousePosistion);
      if(this.currentlyPressedKeys["mousemove"]) this.currentlyPressedKeys["mousemove"] = false;;
    });
  }
}