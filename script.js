let video;
let sonido;
let capibaras = [];
let capibaraImgs = [];
let cumplidos = [
    "\u00a1Eres muy hermosa! 😍",
    "Amo Tu sonrisa! 😊",
    "Eres increíble! 😘",
    "Tienes un corazón muy bonito! 🤍",
    "Siempre alegras mi día! ✨",
    "Eres una estrella! 🌟",
    "Siempre haces que todo sea mejor! 😎",
    "Te amo mucho Camila! ❤️"
];
let coloresCorazon = ["#FF69B4", "#FF1493", "#DC143C", "#FF4500", "#FFD700", "#9400D3"];
let suelo;
let mensajeActual = "";
let mensajeX, mensajeY;
let colorCorazon;
let colorTexto;
let videoCargado = false;
let tamanoCorazon = 5;
let capibaraTamano = 110;
let botonMusica;

function preload() {
    video = createVideo("fondo.mp4", () => {
        videoCargado = true;
        video.loop();
        video.volume(0.5);
        video.show();
    });
    
    video.attribute("playsinline", "true");
    video.attribute("muted", "true");
    video.play();
    video.hide();

    sonido = loadSound("musica.mp3");

    for (let i = 0; i < 7; i++) {
        capibaraImgs[i] = loadImage(`cap${i + 1}.webp`);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    suelo = height - 50;
    video.position(0, 0);
    video.size(width, height);
    video.style("z-index", "-1");
    video.style("object-fit", "cover"); // Evita estirado en móviles
    nuevoCapibara();

    botonMusica = createButton("Pausame");
    botonMusica.position(width / 2 - 50, height - 100);
    botonMusica.style("background-color", "#8B0000");
    botonMusica.style("color", "white");
    botonMusica.style("border", "none");
    botonMusica.style("padding", "15px 30px");
    botonMusica.style("font-size", "20px");
    botonMusica.style("border-radius", "20px");
    botonMusica.style("cursor", "pointer");
    botonMusica.mousePressed(toggleMusica);
}

function draw() {
    if (!videoCargado) {
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Cargando...", width / 2, height / 2);
        return;
    }

    image(video, 0, 0, width, height);

    for (let capibara of capibaras) {
        capibara.mover();
        capibara.mostrar();
        capibara.aplicarGravedad();
    }

    if (mensajeActual !== "") {
        drawHeart(mensajeX, mensajeY, tamanoCorazon, colorCorazon);
        fill("white");
        textSize(16);
        textAlign(CENTER, CENTER);
        text(mensajeActual, mensajeX, mensajeY - 5);
    }
}

let musicaIniciada = false;
let musicaPausada = false;

function iniciarMusica() {
    if (!musicaIniciada) {
        userStartAudio();
        sonido.play();
        sonido.setVolume(0.5);
        musicaIniciada = true;
        musicaPausada = false;
        document.removeEventListener("click", iniciarMusica);
        document.removeEventListener("touchstart", iniciarMusica);
        document.removeEventListener("scroll", iniciarMusica);
    }
}

document.addEventListener("click", iniciarMusica);
document.addEventListener("touchstart", iniciarMusica);
document.addEventListener("scroll", iniciarMusica);

function toggleMusica() {
    if (!musicaIniciada) return;

    if (musicaPausada) {
        sonido.play();
        musicaPausada = false;
        botonMusica.html("Te amo!❤️");
        botonMusica.style("background-color", "#800080");
    } else {
        sonido.pause();
        musicaPausada = true;
        botonMusica.html("Pausame");
        botonMusica.style("background-color", "#8B0000");
    }
}

function mousePressed() {
    if (mouseY > height - 150) return;
    if (capibaras.length > 0) {
        capibaras[capibaras.length - 1].saltar();
        mostrarCumplido();
    }
}

function touchStarted() {
    if (mouseY > height - 150) return;
    if (capibaras.length > 0) {
        capibaras[capibaras.length - 1].saltar();
        mostrarCumplido();
    }
    return false;
}

function nuevoCapibara() {
    let img = random(capibaraImgs);
    capibaras.push(new Capibara(img));
}

function mostrarCumplido() {
    mensajeActual = random(cumplidos);
    colorCorazon = random(coloresCorazon);
    colorTexto = "white"; // Siempre blanco para mejor visibilidad
    mensajeX = random(width * 0.3, width * 0.7);
    mensajeY = random(height * 0.1, height * 0.3);
}

function drawHeart(x, y, size, color) {
    fill(color);
    noStroke();
    beginShape();
    for (let i = 0; i < TWO_PI; i += 0.1) {
        let px = x + size * 16 * pow(sin(i), 3);
        let py = y - size * (13 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i));
        vertex(px, py);
    }
    endShape(CLOSE);
}

class Capibara {
    constructor(imagen) {
        this.img = imagen;
        this.x = 50;
        this.y = height - 120;
        this.velX = 2;
        this.velY = 0;
        this.gravedad = 0.6;
        this.salto = -15;
        this.enSuelo = true;
    }

    mover() {
        this.x += this.velX;
        if (this.x > width) {
            nuevoCapibara();
            capibaras.shift();
        }
    }

    saltar() {
        if (this.enSuelo) {
            this.velY = this.salto;
            this.enSuelo = false;
        }
    }

    aplicarGravedad() {
        this.y += this.velY;
        this.velY += this.gravedad;
        if (this.y >= suelo - 70) {
            this.y = suelo - 70;
            this.velY = 0;
            this.enSuelo = true;
        }
    }

    mostrar() {
        image(this.img, this.x, this.y, capibaraTamano, capibaraTamano * 0.75);
    }
}
