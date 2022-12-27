document.body.style.margin = "0px";
document.body.innerHTML = "";
document.body.requestPointerLock = document.body.requestPointerLock || document.body.mozRequestPointerLock;
document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;

var ressourceManager = new RessourceManager(
  ["susan", "teapot", "axis"],
  ["test.obj", "teapot.obj", "axis.obj"]
);
var inputManager = new InputManager(window);
var context = new Context(document.body, window.innerWidth, window.innerHeight - 5);
var painter = new Painter(context);
var logger = new Logger("yellow");
var scene = [
  new Mesh([
      [0, 0, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [1, 1, 0],
      [1, 0, 1],
      [0, 1, 1],
      [1, 1, 1],
    ], [
      [0, 2, 4],
      [0, 4, 1],
      [1, 4, 7],
      [1, 7, 5],
      [5, 7, 6],
      [5, 6, 3],
      [3, 6, 2],
      [3, 2, 0],
      [2, 6, 7],
      [2, 7, 4],
      [5, 3, 0],
      [5, 0, 1],
    ], [], [], [], [0, 0, 15], [0, 0, 0], [0, 0, 0], [1, 1, 1], [0, 0, 0]),
];

async function main() {
  // setup deltatime
  var tp1 = Date.now();
  var tp2;

  var isLocked = false;
  document.addEventListener("pointerlockchange", () => {isLocked = !isLocked});

  // setup inputs
  inputManager.addListener(" ", (deltatime) => { if(!isLocked) {return;} camera[1] += 4 * deltatime; }, () => {});
  inputManager.addListener("Shift", (deltatime) => { if(!isLocked) {return;} camera[1] -= 4 * deltatime; }, () => {});
  inputManager.addListener("d", (deltatime) => { if(!isLocked) {return;} camera = v_sub_v(camera, v_mul_n(v_cross(up, lookDir), 4 * deltatime)); }, () => {});
  inputManager.addListener("q", (deltatime) => { if(!isLocked) {return;} camera = v_add_v(camera, v_mul_n(v_cross(up, lookDir), 4 * deltatime)); }, () => {});
  inputManager.addListener("z", (deltatime) => { if(!isLocked) {return;} camera = v_add_v(camera, v_mul_n(lookDir, 4 * deltatime)); }, () => {});
  inputManager.addListener("s", (deltatime) => { if(!isLocked) {return;} camera = v_sub_v(camera, v_mul_n(lookDir, 4 * deltatime)); }, () => {});
  
  inputManager.addListener("ArrowLeft", (deltatime) => { if(!isLocked) {return;} yaw -= 2 * deltatime; }, () => {});
  inputManager.addListener("ArrowRight", (deltatime) => { if(!isLocked) {return;} yaw += 2 * deltatime; }, () => {});
  inputManager.addListener("mousemove", (deltatime, mv, mp) => { if(!isLocked) {return;} yaw += deltatime * (mv[0] * mouse_sensivity); xaw += deltatime * (mv[1] * mouse_sensivity); }, () => {});

  inputManager.addListener("mouse0", (deltatime, mv, mp) => { if(!isLocked) document.body.requestPointerLock(); }, () => {});

  // setup logger
  logger.setVar("FPS", 0);
  logger.setVar("FPS true avg", 0);
  logger.setVar("Deltatime (ms)", 0);
  logger.addGraph("Deltatime (ms)", [255, 0, 0, 255], "lightyellow");
  logger.addGraph("FPS", [0, 0, 255, 255], "lightyellow");
  logger.addGraph("FPS true avg", [0, 255, 0, 255], "lightyellow");

  // waiting for ressources to load
  while(!ressourceManager.hasLoaded()) {
    console.log("waiting for ressources to load");
    await sleep(500);
  }

  // setup when ressources have loaded
  scene[0].loadFromObjString(ressourceManager.ressources["teapot"].value);
  scene[0].origin = scene[0].getGravityCenter();

  // for(let i = 0; i < 1; i++) {
  while(true) {
    // calculating deltatime
    tp2 = Date.now();
    let elapsedTime = (tp2 - tp1);
    tp1 = tp2;
    let deltatime = elapsedTime / 1000;

    // feeding logger
    logger.setVar("Deltatime (ms)", elapsedTime);
    logger.setVar("FPS", Math.round(1000 / elapsedTime));
    logger.setVar("FPS true avg", round(1000 / logger.graphs["Deltatime (ms)"].avg, 1));

    // checking user inputs
    inputManager.checksCallbacks(deltatime);
  
    // rendering
    newFrame(deltatime, painter, scene);
    logger.display();
    await sleep(0);
  }
}

main();

function newFrame(elapsedTime, painter, scene) {
  painter.new_frame();

  let trianglesToRaster = [];
  for(let i = 0; i < scene.length; i++) {
    // scene[i].move(elapsedTime);
    scene[i].rotate(elapsedTime);
    trianglesToRaster = trianglesToRaster.concat(scene[i].getDrawTriangles());
  }
  // Painter algorythm
  trianglesToRaster = trianglesToRaster.sort((a, b) => v_len(v_sub_v(camera, t_avg(b))) - v_len(v_sub_v(camera, t_avg(a))) );

  painter.drawFaces(trianglesToRaster, 90, 0.1, 100, [255, 255, 0, 255]);

  painter.send_frame();
}