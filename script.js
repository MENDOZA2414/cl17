let fondo;
let capibaras = [];
let capibaraImgs = [];
let cumplidos = [
    "¡Eres increíble!",
    "¡Sigue brillando!",
    "¡Eres asombroso!",
    "¡Lo estás haciendo genial!",
    "¡Nunca te rindas!",
    "¡Eres una estrella!",
    "¡Tu energía es contagiosa!"
];
let suelo;
let mensajeActual = "";
let mensajeX, mensajeY;

function preload() {
    fondo = loadImage("fondo.jpg");
    for (let i = 0; i < 7; i++) {
        capibaraImgs[i] = loadImage(`cap${i + 1}.webp`);
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    suelo = height - 50;
    nuevoCapibara();
}

function draw() {
    image(fondo, 0, 0, width, height); // Fondo ajustado a toda la pantalla
    
    for (let capibara of capibaras) {
        capibara.mover();
        capibara.mostrar();
        capibara.aplicarGravedad();
    }
    
    if (mensajeActual !== "") {
        fill(255);
        textSize(24);
        textAlign(CENTER);
        text(mensajeActual, mensajeX, mensajeY);
    }
}

function mousePressed() {
    if (capibaras.length > 0) {
        capibaras[capibaras.length - 1].saltar();
        mostrarCumplido();
    }
}

function touchStarted() {
    if (capibaras.length > 0) {
        capibaras[capibaras.length - 1].saltar();
        mostrarCumplido();
    }
    return false; // Evita el desplazamiento en móviles
}

function nuevoCapibara() {
    let img = random(capibaraImgs);
    capibaras.push(new Capibara(img));
}

function mostrarCumplido() {
    mensajeActual = random(cumplidos);
    mensajeX = random(50, width - 50);
    mensajeY = random(50, height - 50);
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
            capibaras.shift(); // Elimina el capibara anterior cuando sale de pantalla
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
        image(this.img, this.x, this.y, 80, 60);
    }
}
