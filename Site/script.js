/* ==========================================================================
   CONFIGURAÇÕES GERAIS
   ========================================================================== */
const dataDoPedido = new Date('2026-03-13T00:00:00');
let timerInterval;

const URL_GOOGLE_SCRIPT = "https://script.google.com/macros/s/AKfycbxdGCv6teeqIBAu7D2qyrd1qJw4GDNt-9PxnSXhiwX6aB-p2SEZ_9JPO7BsDEzmyJxl/exec";

/* ==========================================================================
   TELA DE COFRE (LOGIN)
   ========================================================================== */
document.getElementById('senha-input').addEventListener('input', function (e) {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    e.target.value = valor;
});

function verificarSenha() {
    const senha = document.getElementById('senha-input').value;
    const erro = document.getElementById('erro-senha');

    if (senha === "13/03/2026") {
        document.getElementById('cofre-login').style.display = 'none';
        document.getElementById('preloader').classList.remove('hidden');
    } else {
        erro.classList.remove('hidden');
        document.getElementById('senha-input').style.borderColor = "red";
    }
}

/* ==========================================================================
   INICIAR SITE (PÓS COFRE)
   ========================================================================== */
function iniciarSite() {
    const preloader = document.getElementById('preloader');
    preloader.style.opacity = '0';

    setTimeout(() => {
        preloader.style.display = 'none';
        const mainContent = document.getElementById('main-content');
        mainContent.classList.remove('hidden');

        gerarCoracoes();
        inicializarBucketList();
        configurarModoCinema();
    }, 800);
}

/* ==========================================================================
   EFEITO CORAÇÕES
   ========================================================================== */
function gerarCoracoes() {
    const bg = document.getElementById('hearts-bg');
    for (let i = 0; i < 25; i++) {
        let heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 6 + 6) + 's';
        heart.style.animationDelay = (Math.random() * 5) + 's';
        const colors = ['rgba(255, 51, 102, 0.2)', 'rgba(255, 179, 198, 0.3)', 'rgba(204, 0, 51, 0.2)'];
        heart.style.color = colors[Math.floor(Math.random() * colors.length)];
        bg.appendChild(heart);
    }
}

/* ==========================================================================
   MODO CINEMA (BUG CORRIGIDO)
   ========================================================================== */
function configurarModoCinema() {
    const videos = document.querySelectorAll('video');
    const overlay = document.getElementById('cinema-overlay');

    videos.forEach(video => {
        video.addEventListener('play', () => {
            overlay.style.display = 'block';
            video.closest('.video-section').classList.add('video-focus');
        });

        video.addEventListener('pause', () => {
            overlay.style.display = 'none';
            video.closest('.video-section').classList.remove('video-focus');
        });

        video.addEventListener('ended', () => {
            overlay.style.display = 'none';
            video.closest('.video-section').classList.remove('video-focus');
        });
    });
}

/* ==========================================================================
   GALERIA INTERATIVA (SLIDER)
   ========================================================================== */
let slideIndex = 0;
function mudarSlide(n) {
    const slides = document.getElementsByClassName("slide");
    const contador = document.getElementById("contador-slide");

    if (slides.length === 0) return;

    slides[slideIndex].classList.remove("active");
    slideIndex += n;

    if (slideIndex >= slides.length) { slideIndex = 0; }
    if (slideIndex < 0) { slideIndex = slides.length - 1; }

    slides[slideIndex].classList.add("active");
    contador.innerText = (slideIndex + 1) + " / " + slides.length;
}

/* ==========================================================================
   BOTÃO COMEMORAR & TIMER
   ========================================================================== */
function celebrarMes() {
    document.getElementById('sessao-interativa').classList.add('hidden');
    const msgFinal = document.getElementById('mensagem-final');
    msgFinal.classList.remove('hidden');

    msgFinal.scrollIntoView({ behavior: 'smooth', block: 'start' });

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
    updateTimer();

    dispararConfetes();
}

function updateTimer() {
    const now = new Date();
    const diff = now - dataDoPedido;

    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diff / 1000 / 60) % 60);
    const segundos = Math.floor((diff / 1000) % 60);

    document.getElementById('t-dias').innerText = String(dias).padStart(2, '0');
    document.getElementById('t-horas').innerText = String(horas).padStart(2, '0');
    document.getElementById('t-mins').innerText = String(minutos).padStart(2, '0');
    document.getElementById('t-segs').innerText = String(segundos).padStart(2, '0');
}

/* ==========================================================================
   CONFETES
   ========================================================================== */
function dispararConfetes() {
    var duration = 5 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 35, spread: 360, ticks: 60, zIndex: 999 };

    function randomInRange(min, max) { return Math.random() * (max - min) + min; }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) { return clearInterval(interval); }
        var particleCount = 60 * (timeLeft / duration);

        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#ff3366', '#ffffff', '#ffb3c6', '#cc0033'] }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#ff3366', '#ffffff', '#ffb3c6', '#cc0033'] }));
    }, 250);
}

function miniConfetes() {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#ff3366', '#ffffff'] });
}

/* ==========================================================================
   LÓGICA DO LOCALSTORAGE (SALVAR A BUCKET LIST)
   ========================================================================== */
function inicializarBucketList() {
    const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');

    checkboxes.forEach(box => {
        if (box.disabled) return;

        const id = box.getAttribute('data-id');
        const salvo = localStorage.getItem('sullhy_meta_' + id);

        if (salvo === 'true') {
            box.checked = true;
            box.parentElement.classList.add('riscado');
        }

        box.addEventListener('change', function () {
            localStorage.setItem('sullhy_meta_' + id, this.checked);

            if (this.checked) {
                this.parentElement.classList.add('riscado');
                miniConfetes();
            } else {
                this.parentElement.classList.remove('riscado');
            }
        });
    });
}

/* ==========================================================================
   ENVIAR MENSAGEM PARA O GOOGLE SHEETS
   ========================================================================== */
function enviarMensagem() {
    const texto = document.getElementById('texto-mensagem').value;
    const status = document.getElementById('msg-status');
    const botao = document.getElementById('btn-enviar-msg');

    if (texto.trim() === "") {
        status.innerText = "Escreva alguma coisinha primeiro, amor!";
        status.style.color = "#ffb3c6";
        status.classList.remove('hidden');
        return;
    }

    if (URL_GOOGLE_SCRIPT === "COLE_SEU_LINK_AQUI") {
        alert("O Rafael precisa colar o link do Google Script no código!");
        return;
    }

    status.innerText = "Enviando pro Rafa...";
    status.style.color = "#ffffff";
    status.classList.remove('hidden');
    botao.disabled = true;
    botao.style.opacity = "0.5";

    fetch(URL_GOOGLE_SCRIPT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'mensagem=' + encodeURIComponent(texto)
    })
        .then(() => {
            status.innerText = "Mensagem guardada com sucesso! ❤️";
            status.style.color = "#00ff00";
            document.getElementById('texto-mensagem').value = "";
            miniConfetes();
        })
        .catch(error => {
            status.innerText = "Deu um errinho. Tenta de novo!";
            status.style.color = "red";
            botao.disabled = false;
            botao.style.opacity = "1";
        });
}

/* ==========================================================================
   EASTER EGG (3 CLIQUES)
   ========================================================================== */
let cliquesCoracao = 0;
let resetCliqueTimer;
document.getElementById('titulo-coracao').addEventListener('click', function () {
    cliquesCoracao++;
    clearTimeout(resetCliqueTimer);

    if (cliquesCoracao === 3) {
        document.getElementById('easter-egg-modal').style.display = 'flex';
        dispararConfetes();
        cliquesCoracao = 0;
    } else {
        resetCliqueTimer = setTimeout(() => { cliquesCoracao = 0; }, 1500);
    }
});

function fecharEgg() {
    document.getElementById('easter-egg-modal').style.display = 'none';
}