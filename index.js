let canvas = document.getElementById("canvas");
let ctx = canvas.getContext('2d');

let player = {
    x: getRandomNumber(30, canvas.height - 30),
    y: getRandomNumber(30, canvas.height - 30),
    size: 30,
    speed: 3
};

let players = [];

let ball = {
    x: getRandomNumber(20, canvas.width - 20),
    y: getRandomNumber(20, canvas.height - 20),
    size: getRandomNumber(5, 10),
    color: 'orange'
};

let balls = [ball];
let step = 0;

let moveX = 0;
let moveY = 0;



function checkBall(newX, newY, ballSize) {
    const item = balls.find(p =>
        (newX >= p.x - ballSize && newX <= p.x + ballSize) &&
        (newY >= p.y - ballSize && newY <= p.y + ballSize)
    );
    return item != undefined ? true : false;
}

window.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        let circleDivision = false;

        if (player.size >= 150) {
            circleDivision = true;
            const newHalfSize = player.size / 2;
            player.size = newHalfSize;

            const newBackX = (moveX !== 0) ? -moveX : 0;
            const newBackY = (moveY !== 0 )? -moveY : 1;
            const newCut = newHalfSize + 15;

            players.push({
                x: player.x + newBackX * newCut,
                y: player.y + newBackY * newCut,
                size: newHalfSize,
                speed: player.speed,
                moveX: moveX,
                moveY: moveY
            });
        }

        const playersCount = players.length;
        for (let i = 0; i < playersCount; i++) {
            if (players[i].size >= 150) {
                circleDivision = true;
                const playersHalfSize = players[i].size / 2;
                players[i].size = playersHalfSize;

                const playersBackX = players[i].moveX !== 0 ? -players[i].moveX : 0;
                const playersBackY = players[i].moveY !== 0 ? -players[i].moveY : 1;
                const playersCut = playersHalfSize + 15;

                players.push({
                    x: players[i].x + playersBackX * playersCut,
                    y: players[i].y + playersBackY * playersCut,
                    size: playersHalfSize,
                    speed: players[i].speed,
                    moveX: players[i].moveX,
                    moveY: players[i].moveY
                });
            }
        }

        if (circleDivision) {
            e.preventDefault();
        }
    }
});

function myFunction(e) {
    const box = canvas.getBoundingClientRect();
    const mouseX = e.clientX - box.left;
    const mouseY = e.clientY - box.top;

    const diffX = mouseX - player.x;
    const diffY = mouseY - player.y;
    const dist = Math.hypot(diffX, diffY);

    if (dist > 0) {
        const angle = Math.atan2(diffY, diffX);
        moveX = Math.cos(angle);
        moveY = Math.sin(angle);
    }

    for (let i = 0; i < players.length; i++) {
        const players = players[i];
        const playersDiffX = mouseX - players.x;
        const playersDiffY = mouseY - players.y;
        const playersDist = Math.hypot(playersDiffX, playersDiffY);

        if (playersDist > 0) {
            const playersAngle = Math.atan2(playersDiffY, playersDiffX);
            players.moveX = Math.cos(playersAngle);
            players.moveY = Math.sin(playersAngle);
        }
    }
}

window.addEventListener("mousemove", myFunction);

function moveCamera() {
    const box = canvas.getBoundingClientRect();

    const ballPageX = box.left + window.scrollX + player.x;
    const ballPageY = box.top + window.scrollY + player.y;

    const goScrollX = ballPageX - window.innerWidth / 2;
    const goScrollY = ballPageY - window.innerHeight / 2;

    window.scroll(goScrollX, goScrollY);
}

function update() {
    player.x += moveX * player.speed;
    player.y += moveY * player.speed;

    const radius = player.size / 2;

    if (player.x < radius) {
        player.x = radius;
        moveX = 0;
    }
    if (player.x > canvas.width - radius) {
        player.x = canvas.width - radius;
        moveX = 0;
    }
    if (player.y < radius) {
        player.y = radius;
        moveY = 0;
    }
    if (player.y > canvas.height - radius) {
        player.y = canvas.height - radius;
        moveY = 0;
    }

    for (let i = 0; i < players.length; i++) {
        const players = players[i];
        const leader = i === 0 ? player : players[i - 1];
        const playersRadius = players.size / 2;
        const leaderRadius = leader.size / 2;

        const directionHeaderX = leader.x - players.x;
        const directionHeaderY = leader.y - players.y;
        const distHeader = Math.hypot(directionHeaderX, directionHeaderY);

        const minCut = leaderRadius + playersRadius + 14;

        if (distHeader > 0) {
            const normX = directionHeaderX / distHeader;
            const normY = directionHeaderY / distHeader;

            if (distHeader > minCut + 20) {
                players.x += normX * players.speed;
                players.y += normY * players.speed;
            } else if (distHeader < minCut) {
                players.x -= normX * players.speed;
                players.y -= normY * players.speed;
            }
        }

        if (players.x < playersRadius) {
            players.x = playersRadius;
        }
        if (players.x > canvas.width - playersRadius) {
            players.x = canvas.width - playersRadius;
        }
        if (players.y < playersRadius) {
            players.y = playersRadius;
        }
        if (players.y > canvas.height - playersRadius) {
            players.y = canvas.height - playersRadius;
        }
    }

    moveCamera();
}

function draw() {
    step += 1;

    if (step % 10 == 0) {
        const newX = getRandomNumber(30, canvas.width - 30);
        const newY = getRandomNumber(30, canvas.height - 30);
        const newSize = getRandomNumber(10,20);
        const additional = !checkBall(newX, newY, newSize);

        if (additional) {
            balls.push({
                x: newX,
                y: newY,
                size: newSize,
                color: getRandomColor()
            });
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const playerRadius = player.size / 2;

    for (let i = balls.length - 1; i >= 0; i--) {
        const item = balls[i];
        const itemRadius = item.size / 2;

        const dist = Math.hypot(player.x - item.x, player.y - item.y);

        if (dist <= playerRadius + itemRadius) {
            console.log(item.size / player.size);

            player.size += 1;

            balls.splice(i, 1);
            continue;
        }

        let deletedPlayers = false;
        for (let j = 0; j < players.length; j++) {
            const players = players[j];
            const playersRadius = players.size / 2;
            const playersDist = Math.hypot(players.x - item.x, players.y - item.y);

            if (playersDist <= playersRadius + itemRadius) {
                players.size += 1;
                balls.splice(i, 1);
                deletedPlayers = true;
                break;
            }
        }

        if (deletedPlayers) {
            continue;
        }

        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, itemRadius, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size / 2, 0, 2 * Math.PI);
    ctx.fill();

    for (let i = 0; i < players.length; i++) {
        const players = players[i];
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(players.x, players.y, players.size / 2, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function gameLoop() {
    if (player.x - player.size / 2 <= 0 && player.x + player.size / 2 >= canvas.width) {
        ctx.save();

        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "white";
        ctx.font = "bold 40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText("Oyun bitdi", canvas.width / 2, canvas.height / 2);

        ctx.restore();
        return;
    }
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

function getRandomNumber(min, max) {
    const minValue = Math.ceil(min);
    const maxValue = Math.floor(max);

    return Math.floor(Math.random() * (maxValue - minValue + 1) + minValue);
}

function getRandomColor() {
    return '#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, "0");
}