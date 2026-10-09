/* ============================================================
   CONFIGURAÇÃO — mexa só aqui para trocar número, horário e preços
   ============================================================ */
const WHATSAPP = "5521999999999";   // ← troque pelo número real da Gê (55 + DDD + número)
const ABRE = 11, FECHA = 15;        // horário de funcionamento (Seg a Sex)

const CARDAPIO = {
    refeicoes: [
        { id: "parmegiana", nome: "Parmegiana de frango", desc: "Refeição individual completa com frango parmegiana.", preco: 25.00, img: "parmegiana.jpeg" },
        { id: "feijoada",   nome: "Feijoada",             desc: "Feijoada individual à moda da casa.",                  preco: 25.00, img: "feijoada.jpeg" },
        { id: "bife",       nome: "Bife com fritas",      desc: "Bife com fritas individual completo.",                 preco: 35.00, img: "bifefritas.jpeg" },
        { id: "carne",      nome: "Carne assada",         desc: "Carne assada individual completa.",                    preco: 20.00, img: "carneassada.jpeg" }
    ],
    bebidas: [
        { id: "h2o",       nome: "Limoneto H2O",          preco: 5.00,  img: "h2o.jpeg" },
        { id: "coca",      nome: "Coca-Cola 2L",          preco: 10.00, img: "coca.jpeg" },
        { id: "sprite",    nome: "Sprite 2L",             preco: 9.00,  img: "sprite.jpeg" },
        { id: "guarana",   nome: "Guaraná Antarctica 2L", preco: 9.00,  img: "guarana.jpeg" },
        { id: "schweppes", nome: "Schweppes lata",        preco: 5.50,  img: "refresco.jpeg" },
        { id: "guaracamp", nome: "Guaracamp",             preco: 3.00,  img: "guaracamp.jpeg" },
        { id: "aguagas",   nome: "Água com gás",          preco: 3.00,  img: "aguacomgas.jpeg" }
        // tem foto pronta de "aguasemgas.jpeg" — se vender, é só adicionar uma linha aqui
    ],
    sobremesas: [
        { id: "pudim", nome: "Pudim",          preco: 3.50, img: "pudim.jpeg" },
        { id: "torta", nome: "Torta de limão", preco: 3.50, img: "tortalimao.jpeg" }
    ]
};

/* ============================================================ */
const fmt = v => "R$ " + v.toFixed(2).replace(".", ",");
const todos = [...CARDAPIO.refeicoes, ...CARDAPIO.bebidas, ...CARDAPIO.sobremesas];
const porId = id => todos.find(i => i.id === id);

let carrinho = {};  // { id: quantidade }
try { carrinho = JSON.parse(localStorage.getItem("sg-carrinho")) || {}; } catch (e) {}
const salvar = () => { try { localStorage.setItem("sg-carrinho", JSON.stringify(carrinho)); } catch (e) {} };

/* ---------- Render do cardápio ---------- */
function cardHTML(item, tipo) {
    const foto = `<img src="imagens/${item.img}" alt="${item.nome}" loading="lazy">`;
    const acao = `<div class="acao" id="acao-${item.id}"></div>`;
    if (tipo === "prato") {
        return `<article class="card prato">${foto}
            <div class="corpo">
                <h3 class="nome">${item.nome}</h3>
                <p class="desc">${item.desc}</p>
                <div class="rodape"><span class="preco">${fmt(item.preco)}</span>${acao}</div>
            </div></article>`;
    }
    return `<article class="card compacto">${foto}
        <div class="corpo">
            <h3 class="nome">${item.nome}</h3>
            <div class="rodape"><span class="preco">${fmt(item.preco)}</span>${acao}</div>
        </div></article>`;
}

function renderCardapio() {
    document.getElementById("lista-refeicoes").innerHTML  = CARDAPIO.refeicoes.map(i => cardHTML(i, "prato")).join("");
    document.getElementById("lista-bebidas").innerHTML    = CARDAPIO.bebidas.map(i => cardHTML(i, "compacto")).join("");
    document.getElementById("lista-sobremesas").innerHTML = CARDAPIO.sobremesas.map(i => cardHTML(i, "compacto")).join("");
    todos.forEach(atualizarAcao);
}

function atualizarAcao(item) {
    const el = document.getElementById("acao-" + item.id);
    const q = carrinho[item.id] || 0;
    el.innerHTML = q === 0
        ? `<button class="btn-pedir" onclick="alterar('${item.id}', 1)">Adicionar</button>`
        : `<div class="qtd"><button onclick="alterar('${item.id}', -1)" aria-label="Menos">−</button><span>${q}</span><button onclick="alterar('${item.id}', 1)" aria-label="Mais">+</button></div>`;
}

/* ---------- Carrinho ---------- */
function alterar(id, delta) {
    const nova = (carrinho[id] || 0) + delta;
    if (nova <= 0) delete carrinho[id]; else carrinho[id] = nova;
    salvar();
    atualizarAcao(porId(id));
    atualizarCarrinhoUI();
}

function totais() {
    let qtd = 0, soma = 0;
    for (const id in carrinho) { qtd += carrinho[id]; soma += carrinho[id] * porId(id).preco; }
    return { qtd, soma };
}

function atualizarCarrinhoUI() {
    const { qtd, soma } = totais();
    document.getElementById("contador-itens").innerText = qtd;
    document.getElementById("valor-total").innerText = fmt(soma);
    document.getElementById("modal-valor-total").innerText = fmt(soma);
    document.getElementById("carrinho-bar").classList.toggle("vazio", qtd === 0);

    const lista = document.getElementById("lista-carrinho-modal");
    const ids = Object.keys(carrinho);
    if (ids.length === 0) {
        lista.innerHTML = '<li class="vazio-msg">Seu carrinho está vazio 🍽️</li>';
        return;
    }
    lista.innerHTML = ids.map(id => {
        const it = porId(id), q = carrinho[id];
        return `<li class="item-modal">
            <div class="info"><b>${it.nome}</b><small>${fmt(it.preco)} cada · ${fmt(it.preco * q)}</small></div>
            <div class="qtd"><button onclick="alterar('${id}', -1)" aria-label="Menos">−</button><span>${q}</span><button onclick="alterar('${id}', 1)" aria-label="Mais">+</button></div>
        </li>`;
    }).join("");
}

function abrirCarrinho()  { document.getElementById("modal-carrinho").style.display = "flex"; }
function fecharCarrinho() { document.getElementById("modal-carrinho").style.display = "none"; }

/* Salva o resumo do pedido e vai para a página de cadastro */
function irParaCadastro() {
    const ids = Object.keys(carrinho);
    if (ids.length === 0) { alert("Seu carrinho está vazio!"); return; }

    const pedido = {
        itens: ids.map(id => {
            const it = porId(id);
            return { id, nome: it.nome, preco: it.preco, qtd: carrinho[id] };
        }),
        total: totais().soma,
        obs: document.getElementById("obs").value.trim()
    };
    try { localStorage.setItem("sg-pedido", JSON.stringify(pedido)); } catch (e) {}
    window.location.href = "cadastro.html";
}

function finalizarPedido() {
    const ids = Object.keys(carrinho);
    if (ids.length === 0) { alert("Seu carrinho está vazio!"); return; }

    let msg = "Olá, Gê! Gostaria de fazer o seguinte pedido:\n\n";
    ids.forEach(id => {
        const it = porId(id), q = carrinho[id];
        msg += `• ${q}x ${it.nome} — ${fmt(it.preco * q)}\n`;
    });
    msg += `\n*Total: ${fmt(totais().soma)}*`;
    const obs = document.getElementById("obs").value.trim();
    if (obs) msg += `\n\nObservações: ${obs}`;

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
}

/* ---------- Tema ---------- */
function alternarTema() {
    const escuro = document.body.getAttribute("data-theme") !== "dark";
    document.body.setAttribute("data-theme", escuro ? "dark" : "light");
    document.getElementById("btn-theme").innerText = escuro ? "☀️" : "🌙";
    try { localStorage.setItem("sg-tema", escuro ? "dark" : "light"); } catch (e) {}
}
try {
    if (localStorage.getItem("sg-tema") !== "light") alternarTema();
} catch (e) {}

/* ---------- Aberto / Fechado (Seg a Sex, 11h–15h) ---------- */
function atualizarStatus() {
    const agora = new Date();
    const dia = agora.getDay(), h = agora.getHours();
    const aberto = dia >= 1 && dia <= 5 && h >= ABRE && h < FECHA;
    const el = document.getElementById("status");
    el.classList.toggle("fechado", !aberto);
    el.innerHTML = aberto
        ? `<i class="bolinha"></i><b>Aberto agora</b> · até ${FECHA}h`
        : `<i class="bolinha"></i><b>Fechado agora</b> · abrimos Seg a Sex às ${ABRE}h`;
}

/* ---------- Chip ativo conforme a rolagem ---------- */
function observarSecoes() {
    const chips = [...document.querySelectorAll(".chip")];
    const obs = new IntersectionObserver(entradas => {
        entradas.forEach(e => {
            if (e.isIntersecting) {
                chips.forEach(c => c.classList.toggle("ativo", c.getAttribute("href") === "#" + e.target.id));
            }
        });
    }, { rootMargin: "-30% 0px -60% 0px" });
    document.querySelectorAll("main section").forEach(s => obs.observe(s));
}

renderCardapio();
atualizarCarrinhoUI();
atualizarStatus();
observarSecoes();
