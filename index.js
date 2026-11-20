let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');


let player = {
    x: getRandomInt(30, canvas.width - 30),
    y: getRandomInt(30, canvas.height - 30),
    size: 30,
    speed: 3
};

let ball = {
    x: getRandomInt(20, canvas.width - 20),
    y: getRandomInt(20, canvas.height - 20),
    size: getRandomInt(10, 20),
    color: 'orange'
};

let balls = [ball];
let counter = 0;

let dirX = 0;
let dirY = 0;

function checkExist(newX, newY, ballSize) {
    const item = balls.find(p =>
        (newX >= p.x - ballSize && newX <= p.x + ballSize) &&
        (newY >= p.y - ballSize && newY <= p.y + ballSize)
    );
    return item != undefined ? true : false;
}

// Mouse sadəcə topun gedəcəyi istiqaməti seçir, kameranı tərpətmir
function myFunction(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseCanvasX = e.clientX - rect.left;
    const mouseCanvasY = e.clientY - rect.top;

    const ferqX = mouseCanvasX - player.x;
    const ferqY = mouseCanvasY - player.y;
    const mesafe = Math.hypot(ferqX, ferqY);

    if (mesafe > 0) {
        const bucaq = Math.atan2(ferqY, ferqX);
        dirX = Math.cos(bucaq);
        dirY = Math.sin(bucaq);
    }
}

window.addEventListener("mousemove", myFunction);

function cameraByBall() {
    const rect = canvas.getBoundingClientRect();

    const ballPageX = rect.left + window.scrollX + player.x;
    const ballPageY = rect.top + window.scrollY + player.y;

    const hedefScrollX = ballPageX - window.innerWidth / 2;
    const hedefScrollY = ballPageY - window.innerHeight / 2;

    window.scrollTo(hedefScrollX, hedefScrollY);
}

function update() {
    player.x += dirX * player.speed;
    player.y += dirY * player.speed;

    const radius = player.size / 2;

    if (player.x < radius) {
        player.x = radius;
        dirX = 0;
    }
    if (player.x > canvas.width - radius) {
        player.x = canvas.width - radius;
        dirX = 0;
    }
    if (player.y < radius) {
        player.y = radius;
        dirY = 0;
    }
    if (player.y > canvas.height - radius) {
        player.y = canvas.height - radius;
        dirY = 0;
    }

    cameraByBall();
}

function draw() {
    counter += 1;

    if (counter % 40 == 0) {
        const newX = getRandomInt(30, canvas.width - 30);
        const newY = getRandomInt(30, canvas.height - 30);
        const randomSize = getRandomInt(40, 60);
        const result = !checkExist(newX, newY, randomSize);

        if (result) {
            balls.push({
                x: newX,
                y: newY,
                size: randomSize,
                color: getRandomColor()
            });
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const playerRadius = player.size / 2;

    // Sondan əvvələ gedirik ki, splice edəndə indekslər qarışmasın
    for (let i = balls.length - 1; i >= 0; i--) {
        const p = balls[i];
        const ballRadius = p.size / 2;

        // Player mərkəzi ilə p mərkəzi arasındakı məsafə
        const mesafe = Math.hypot(player.x - p.x, player.y - p.y);

        // Player dairəsinin sərhədi p dairəsinin sərhədinə dəyibsə
        if (mesafe <= playerRadius + ballRadius) {
            
            player.size += p.size * 0.05;

            balls.splice(i, 1);
            continue;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, ballRadius, 0, 2 * Math.PI);
        ctx.fill();
    }


    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, 2 * Math.PI);
    ctx.fill();
}
function gameloop() {
    update();
    draw();
    requestAnimationFrame(gameloop);
}

gameloop();

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);

    return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}

function getRandomColor() {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}