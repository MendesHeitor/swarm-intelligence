let maxPixels = 4;
let minPixels = 2;
let totalAgents = 100;
let agentSize = 4;

let goals = [];
let agents = [];

function setup() {
  createCanvas(700, 500);
  background(0); // Dark background
  
  
  // Initialize two circles with different colors
  goals.push(new DraggableCircle(200, 300, 20, color(255, 0, 0))); // Red circle
  goals.push(new DraggableCircle(600, 300, 20, color(0, 0, 255))); // Blue circle
  
  // Initialize the agents
  for (let i = 0; i < totalAgents; i++) {
    agents.push(new Agent());
  }
}

function draw() {
  background(0); // Dark background
  
  for (let goal of goals) {
    goal.update();
    goal.show();
  }
  
  for (let agent of agents) {
    fill(0, 255, 0);
    circle(agent.pos.x, agent.pos.y, agentSize);
    agent.updatePos();
    agent.checkReachGoal();
  }
}

class Agent {
  constructor (){
    this.pos = createVector(random(width), random(height));
    this.goal = floor(random(goals.length));
    this.dir = createVector(random(-1, 1), (random(-1, 1)));
    this.speed = random(minPixels, maxPixels);
    this.counters = []
    for (let _ of goals) {
      this.counters.push(random(width))
    }
  }
  
  updateCounter(){
    this.a += 1
    this.b += 1
  }
  
  updatePos() {
    this.updateCounter();
    
    let step = p5.Vector.mult(this.dir, this.speed);
    this.pos.add(step);
    
    // Check for collisions with canvas boundaries
    if (this.pos.x <= 0 || this.pos.x >= width) {
      this.dir.x *= -1; // Reverse direction on the x-axis
      this.pos.x = constrain(this.pos.x, 0, width); // Constrain position within boundaries
    }

    if (this.pos.y <= 0 || this.pos.y >= height) {
      this.dir.y *= -1; // Reverse direction on the y-axis
      this.pos.y = constrain(this.pos.y, 0, height); // Constrain position within boundaries
    }
    
    // Normalize direction vector after reflection
    this.dir.normalize();
  } 
  
  checkReachGoal() {
    for (let i=0; i < goals.length; i++) {
      let g = goals[i];
      let distance = dist(this.pos.x, this.pos.y, g.x, g.y);

      if (distance <= g.r) {
        this.counters[i] = 0;

        if (i == this.goal) {
          this.goal = (this.goal + 1) % goals.length; 
          this.dir.rotate(PI);
          this.dir.normalize();
        }
      }
    }
  }
  
  listen() {
    // iterate through all agents 
    // check if the distance é me
  }
  
  
}

class DraggableCircle {
  constructor(x, y, r, col) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.col = col;
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    fill(this.col);
    ellipse(this.x, this.y, this.r * 2);
  }

  pressed() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    if (d < this.r) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }
}

function mousePressed() {
  for (let goal of goals) {
    goal.pressed();
  }
}

function mouseReleased() {
  for (let goal of goals) {
    goal.released();
  }
}
