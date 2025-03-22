let fondo;
let sonido;
let capibaraImgs = [];
let capibara;
let cumplidos = [
    "¡Eres muy hermosa! 😍",
    "Amo tu sonrisa! 😊",
    "Eres increíble! 😘",
    "Tienes un corazón muy bonito! 🤍",
    "Siempre alegras mi día! ✨",
    "Eres una estrella! 🌟",
    "Siempre haces que todo sea mejor! 😎",
    "Te amo mucho Camila! ❤️"
];

let coloresCorazon = ["#FF69B4", "#FF1493", "#DC143C", "#FF4500", "#FFD700", "#9400D3"];
let mensajeActual = "";
let mensajeX, mensajeY;
let colorCorazon;
let colorTexto = "white";
let tamanoCorazon = 5;
let capibaraTamano = 90;
let botonMusica;
let contadorSaltos = 0;
let imgX, imgY, imgWidth, imgHeight;

function preload() {
    fondo = loadImage("fondo.jpg");
    sonido = loadSound("musica.mp3");

    for (let i = 0; i < 7; i++) {
        capibaraImgs[i] = loadImage(`cap${i + 1}.webp`);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    ajustarFondo();
    capibara = new Capibara(random(capibaraImgs)); // Se crea un solo capibara

    botonMusica = createButton("Pause");
    botonMusica.position(imgX + imgWidth - 120, imgY + imgHeight - 80); // Posición encima de la firma
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
    background(0);
    ajustarFondo();
    image(fondo, imgX, imgY, imgWidth, imgHeight);

    capibara.mover();
    capibara.mostrar();
    capibara.aplicarGravedad();

    if (mensajeActual !== "") {
        drawHeart(mensajeX, mensajeY, tamanoCorazon, colorCorazon);
        // Ajusté la alineación del texto y agregué saltos de línea si es necesario.
        fill("white");
        textSize(13);
        textAlign(CENTER, CENTER);
        let textoDividido = mensajeActual.split(" ");
        let lineHeight = 20;
        for (let i = 0; i < textoDividido.length; i++) {
            text(textoDividido[i], mensajeX, mensajeY - 17 + (i * lineHeight));
        }

    }

    // Contador de saltos
    fill("white");
    textSize(24);
    textAlign(LEFT, TOP);
    text(`Besos a cobrar: ${contadorSaltos}`, imgX + 20, imgY + 10);
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
        botonMusica.html("Te amo!");
        botonMusica.style("background-color", "#800080");
    } else {
        sonido.pause();
        musicaPausada = true;
        botonMusica.html("Hermosa");
        botonMusica.style("background-color", "#8B0000");
    }
}

function mousePressed() {
    if (mouseY > imgY + imgHeight - 150) return;
    capibara.saltar();
    contadorSaltos++;
    mostrarCumplido();
}

function touchStarted() {
    if (mouseY > imgY + imgHeight - 150) return;
    capibara.saltar();
    contadorSaltos++;
    mostrarCumplido();
    return false;
}

function mostrarCumplido() {
    mensajeActual = random(cumplidos);
    colorCorazon = random(coloresCorazon);
    colorTexto = "white";
    mensajeX = random(imgX + imgWidth * 0.2, imgX + imgWidth * 0.8);
    mensajeY = random(imgY + imgHeight * 0.1, imgY + imgHeight * 0.3);
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

function ajustarFondo() {
    let imgRatio = fondo.width / fondo.height;
    let screenRatio = width / height;

    if (screenRatio > imgRatio) {
        imgWidth = height * imgRatio;
        imgHeight = height;
    } else {
        imgWidth = width;
        imgHeight = width / imgRatio;
    }

    imgX = (width - imgWidth) / 2;
    imgY = (height - imgHeight) / 2;
}

class Capibara {
    constructor(imagen) {
        this.img = imagen;
        this.x = imgX + 10;
        this.y = imgY + imgHeight - 120;
        this.velX = 2;
        this.velY = 0;
        this.gravedad = 0.6;
        this.saltoBase = -15;
        this.enSuelo = true;

        // Movimiento automático para caminar con saltitos
        setInterval(() => {
            if (this.enSuelo) {
                this.velY = random(-3, -1.5); // Pequeños saltitos simulando caminar
            }
        }, 500);
    }

    mover() {
        this.x += this.velX;
        if (this.x > imgX + imgWidth) {
            this.x = imgX + 10; // Reinicia cuando sale del área visible
            this.img = random(capibaraImgs); // Cambia de imagen al reiniciar
        }
    }
    

    saltar() {
        if (this.enSuelo) {
            this.velY = random(this.saltoBase - 5, this.saltoBase + 5); // Salto con altura variable
            this.enSuelo = false;
        }
    }

    aplicarGravedad() {
        this.y += this.velY;
        this.velY += this.gravedad;
        if (this.y >= imgY + imgHeight - 70) {
            this.y = imgY + imgHeight - 70;
            this.velY = 0;
            this.enSuelo = true;
        }
    }

    mostrar() {
        image(this.img, this.x, this.y, capibaraTamano, capibaraTamano * 0.75);
    }
}
