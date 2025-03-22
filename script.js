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

let coloresCorazon = ["#FF69B4", "#FF1493", "#DC143C", "#FF4500", "#9400D3"];
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
    botonMusica.position(imgX + imgWidth - 120, imgY + imgHeight - 80);
    botonMusica.style("background-color", "rgba(139, 0, 0, 0.7)"); // 🔹 Transparencia (70% de opacidad)
    botonMusica.style("color", "white");
    botonMusica.style("border", "none");
    botonMusica.style("padding", "15px 30px");
    botonMusica.style("font-size", "20px");
    botonMusica.style("border-radius", "20px");
    botonMusica.style("cursor", "pointer");
    botonMusica.mousePressed(toggleMusica);
}

function draw() {
    let colorFondo = fondo.get(floor(fondo.width / 2), floor(fondo.height / 2)); // Obtiene un color central del fondo
    background(colorFondo); // 🔹 Cambia el color de los bordes negros al color del fondo
    ajustarFondo();
    image(fondo, imgX, imgY, imgWidth, imgHeight);

    capibara.mover();
    capibara.mostrar();
    capibara.aplicarGravedad();

    if (mensajeActual !== "") {
        drawHeart(mensajeX, mensajeY, tamanoCorazon, colorCorazon);
        
        // Ajuste de texto más ancho dentro del corazón
        fill("white");
        textSize(18);
        textAlign(CENTER, CENTER);
        let maxLineWidth = tamanoCorazon * 18; // Ajuste según tamaño del corazón
        let textoDividido = splitText(mensajeActual, maxLineWidth);
    
        let lineHeight = 25;
        for (let i = 0; i < textoDividido.length; i++) {
            text(textoDividido[i], mensajeX, mensajeY + 10 - (textoDividido.length - 1) * (lineHeight / 2) + (i * lineHeight));
        }
    }
    

    // Contador de saltos
    fill("white");
    textSize(18);
    textAlign(LEFT, TOP);
    text(`Cada salto, un Beso: ${contadorSaltos}`, imgX + 20, imgY + 10);
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
        botonMusica.style("background-color", "rgba(128, 0, 128, 0.7)"); // 🔹 Púrpura con 70% de opacidad
    } else {
        sonido.pause();
        musicaPausada = true;
        botonMusica.html("Hermosa");
        botonMusica.style("background-color", "rgba(139, 0, 0, 0.7)"); // 🔹 Rojo oscuro con 70% de opacidad
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

    // 🔹 Ajustar la posición del corazón para evitar el texto de arriba
    let margenSuperior = imgY + 50; // 🔹 Evita que los corazones aparezcan muy arriba
    let margenInferior = imgY + imgHeight * 0.6; // 🔹 Permite que los corazones aparezcan más abajo

    mensajeX = random(imgX + imgWidth * 0.2, imgX + imgWidth * 0.8);
    mensajeY = random(margenSuperior, margenInferior); // 🔹 Limita la posición en Y
}


function drawHeart(x, y, size, color) {
    fill(color);
    noStroke();
    beginShape();
    for (let i = 0; i < TWO_PI; i += 0.1) {
        let px = x + size * 18 * pow(sin(i), 3); // 🔹 Hacer el corazón más ancho
        let py = y - size * (12 * cos(i) - 5 * cos(2 * i) - 2 * cos(3 * i) - cos(4 * i)); // 🔹 Hacerlo un poco más corto
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

function splitText(text, maxWidth) {
    let words = text.split(" ");
    let lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        let testLine = currentLine + " " + words[i];
        let testWidth = textWidth(testLine);

        if (testWidth > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
        } else {
            currentLine = testLine;
        }
    }
    lines.push(currentLine);
    return lines;
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
