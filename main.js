
let canvas;
let context;
let secondsPassed = 0;
let oldTimeStamp = 0;
let movingSpeed = 50;
let fps;
let rectX = 0;
let rectY = 0;
let canvasWidth = 750;
let canvasHeight = 400;

const restitution = 0.90;


let gameObjects = [];

function createWorld(){
    gameObjects = [
        new Circle(context, 250, 50, 50, 50,1,10),
        new Circle(context, 250, 300, 20, 30,1,10),
        new Circle(context, 150, 0, 100, 100,5,20),
        new Circle(context, 250, 150, 40, 70,1,10),
        new Circle(context, 350, 75, 50, 50,1,10),
        new Circle(context, 300, 300, 40, 60,1,10),
        new Circle(context, 100, 300, 150, -50,100,60),
        new Circle(context, 50, 300, 70, 30,5,20),
        new Circle(context, 300, 50, 20, 60,50,5,20),
        new Circle(context, 300, 100, 50, 50,5,20),
        new Circle(context, 300, 150, 50, 30,5,20),
        new Circle(context, 200, 180, 70, 70,5,20),
        new Circle(context, 200, 100, 30, 40,5,20),
        new Circle(context, 230, 120, 40, 40,5,20),
        new Circle(context, 250, 30, 60, 30,5,20),
        new Circle(context, 220, 80, 60, 50,5,20),
        new Circle(context, 200, 200, 60, 60,5,20),
        new Circle(context, 100, 100, 30, 80,5,20),
        new Circle(context, 100, 150, 80, 20,5,20),
    ];
}

window.onload = init;

function init(){
	canvas = document.getElementById('myCanvas');
	context = canvas.getContext("2d");
    canvas.width = document.body.clientWidth;
    canvas.height  = document.body.clientHeight;
    canvasWidth = canvas.width;
    canvasHeight = canvas.height;
	createWorld();

	window.requestAnimationFrame(gameLoop);
}



function clearCanvas() {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(timeStamp) {
    // Update game objects in the loop

    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
    }

    clearCanvas();
    // Do the same to draw
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].draw();
    }

    detectCollisions();
    //detectEdgeCollisions();
    window.requestAnimationFrame(gameLoop);
}



function detectCollisions(){
    let obj1;
    let obj2;

    // Reset collision state of all objects
    for (let i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }

    // Start checking for collisions
    for (let i = 0; i < gameObjects.length; i++)
    {
        obj1 = gameObjects[i];
        for (let j = i + 1; j < gameObjects.length; j++)
        {
            obj2 = gameObjects[j];

            // Compare object1 with object2
            if (circleIntersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius)){
               // obj1.isColliding = true;
               // obj2.isColliding = true;
                let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
                let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
                let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance};
                let vRelativeVelocity = {x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy};
				let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y;
				if (speed < 0){
				    break;
				}
				let impulse = 2 * speed / (obj1.mass + obj2.mass);
				obj1.vx -= (impulse * obj2.mass * vCollisionNorm.x);
				obj1.vy -= (impulse * obj2.mass * vCollisionNorm.y);
				obj2.vx += (impulse * obj1.mass * vCollisionNorm.x);
				obj2.vy += (impulse * obj1.mass * vCollisionNorm.y);
                obj1.handleCollision();
                obj2.handleCollision();
            }
        }
    }
}


function circleIntersect(x1, y1, r1, x2, y2, r2) {

    // Calculate the distance between the two circles
    let CircleDistance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);

    // When the distance is smaller or equal to the sum
    // of the two radius, the circles touch or overlap
    return CircleDistance <= ((r1 + r2) * (r1 + r2))
}

function detectEdgeCollisions()
 {
     let obj;
     for (let i = 0; i < gameObjects.length; i++)
     {
         obj = gameObjects[i];

         // Check for left and right
         if (obj.x < obj.radius){
             obj.vx = Math.abs(obj.vx) * restitution;
             obj.x = obj.radius;
         }else if (obj.x > canvasWidth - obj.radius){
             obj.vx = -Math.abs(obj.vx) * restitution;
             obj.x = canvasWidth - obj.radius;
         }

         // Check for bottom and top
         if (obj.y < obj.radius){
             obj.vy = Math.abs(obj.vy) * restitution;
             obj.y = obj.radius;
         } else if (obj.y > canvasHeight - obj.radius){
             obj.vy = -Math.abs(obj.vy) * restitution;
             obj.y = canvasHeight - obj.radius;
         }
     }
}