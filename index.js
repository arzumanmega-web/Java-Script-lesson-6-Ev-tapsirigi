let mycanvas = document.getElementById("canvas");
let ctx = mycanvas.getContext('2d');

let size = 50;

let ball = {
    x: 30,
    y: 30,
    size: 30,
    color: 'orange'
};

let balls = [ball];
let counter = 0;

function checkExist(newX, newY,size) {
    const item = balls.find(p => (newX >= p.x - size && newX <= p.x + size) 
    && (newY >= p.y - size && newY <= p.Y + size))
    return item!=undefined ? true : false;
}

function draw(x, y) {
    counter += 1;

    if (counter % 40 == 0) {
        const newX = getRandomInt(30, 900);
        const newY = getRandomInt(30, 900);
        const randomSize=getRandomInt(10, 30);
        const result=!checkExist(newX, newY,randomSize);
        console.log(result);
        console.log(newX,newY);
        console.log(balls);
        if (result) {
            balls.push({
                x: newX,
                y: newY,
                size: randomSize,
                color: getRandomColor()
            })
        }

    }

    // size += 0.3;
    ctx.clearRect(0, 0, mycanvas.width, mycanvas.height);

    for (let i = 0; i < balls.length; i++) {
        const p = balls[i];
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size / 2, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(x - size / 2, y - size / 2,size / 1, 0, 2 * Math.PI);
    ctx.fill();
}

function myFunction(e) {
    let x = e.offsetX;
    let y = e.offsetY;

    draw(x, y);
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function getRandomColor() {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}