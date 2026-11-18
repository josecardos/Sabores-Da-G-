// ==========================================================
// Sabores da Gê – cardápio, carrinho, tema e status da loja
// ==========================================================
const WHATSAPP = "5521999999999";           // troque pelo número real
const ABRE = 11, FECHA = 15;                // seg a sex, 11h às 15h

// Edite aqui o cardápio (id único, categoria, foto da pasta img/, nome, descrição, preço)
const CARDAPIO = [
  { id: "r1", cat: "refeicoes", img: "feijoada.jpeg", nome: "Feijoada completa", desc: "Feijão preto com carnes, arroz, couve, farofa, torresmo e laranja.", preco: 28 },
  { id: "r2", cat: "refeicoes", img: "frangogrelhado.jpeg", nome: "Frango grelhado", desc: "Filé de frango na chapa, arroz, couve, farofa e vinagrete.", preco: 24 },
  { id: "r3", cat: "refeicoes", img: "bifefritas.jpeg", nome: "Bife com fritas", desc: "Bife ao molho, batata frita, arroz, couve e torresmo.", preco: 26 },
  { id: "r4", cat: "refeicoes", img: "carneassada.jpeg", nome: "Carne assada", desc: "Fatias de carne assada com arroz, couve, farofa e vinagrete.", preco: 27 },
  { id: "r5", cat: "refeicoes", img: "parmegiana.jpeg", nome: "Parmegiana de frango", desc: "Empanado com molho, queijo e manjericão, arroz e farofa.", preco: 26 },
  { id: "b1", cat: "bebidas", img: "coca.jpeg", nome: "Coca-Cola 2L", desc: "Sabor original.", preco: 14 },
  { id: "b2", cat: "bebidas", img: "guarana.jpeg", nome: "Guaraná Antarctica 1,5L", desc: "O original do Brasil.", preco: 11 },
  { id: "b3", cat: "bebidas", img: "sprite.jpeg", nome: "Sprite 2L", desc: "Sabor limão.", preco: 13 },
  { id: "b4", cat: "bebidas", img: "h2o.jpeg", nome: "H2OH! Limoneto 600ml", desc: "Sabor limão, baixo em calorias.", preco: 7 },
  { id: "b5", cat: "bebidas", img: "refresco.jpeg", nome: "Schweppes Citrus 350ml", desc: "Lata gelada.", preco: 6 },
  { id: "b6", cat: "bebidas", img: "guaracamp.jpeg", nome: "Guaracamp 285ml", desc: "Copo de guaraná natural.", preco: 4 },
  { id: "b7", cat: "bebidas", img: "aguasemgas.jpeg", nome: "Água sem gás 500ml", desc: "Água mineral Crystal.", preco: 3 },
  { id: "b8", cat: "bebidas", img: "aguacomgas.jpeg", nome: "Água com gás 500ml", desc: "Água mineral Crystal.", preco: 3.5 },
  { id: "s1", cat: "sobremesas", img: "pudim.jpeg", nome: "Pudim de leite", desc: "Fatia com calda de caramelo.", preco: 9 },
  { id: "s2", cat: "sobremesas", img: "tortalimao.jpeg", nome: "Torta de limão", desc: "Fatia com chantilly e limão.", preco: 10 },
];

const CHAVE_CARRINHO = "saboresDaGe.carrinho";
const CHAVE_TEMA = "saboresDaGe.tema";
let carrinho = {}; // { id: quantidade }

const $ = (id) => document.getElementById(id);
const moeda = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
const ler = (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } };

// ---------- Cardápio ----------
function cartaoItem(p) {
  const q = carrinho[p.id] || 0;
  const acao = q === 0
    ? `<button class="btn-add" onclick="mudarQtd('${p.id}',1)">Adicionar</button>`
    : `<div class="qtd"><button aria-label="Remover um ${p.nome}" onclick="mudarQtd('${p.id}',-1)">−</button><span>${q}</span><button aria-label="Adicionar um ${p.nome}" onclick="mudarQtd('${p.id}',1)">+</button></div>`;
  return `<article class="item"><img class="item-img" src="img/${p.img}" alt="${p.nome}" loading="lazy"><div class="item-corpo"><h3>${p.nome}</h3><p>${p.desc}</p><div class="item-rodape"><span class="preco">${moeda(p.preco)}</span>${acao}</div></div></article>`;
}

function renderCardapio() {
  ["refeicoes", "bebidas", "sobremesas"].forEach((cat) => {
    $("lista-" + cat).innerHTML = CARDAPIO.filter((p) => p.cat === cat).map(cartaoItem).join("");
  });
}

// ---------- Carrinho ----------
function mudarQtd(id, delta) {
  const nova = (carrinho[id] || 0) + delta;
  if (nova <= 0) delete carrinho[id]; else carrinho[id] = nova;
  atualizar();
}

function itensDoCarrinho() {
  return CARDAPIO.filter((p) => carrinho[p.id]).map((p) => ({ ...p, qtd: carrinho[p.id] }));
}

function atualizar() {
  const itens = itensDoCarrinho();
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const qtd = itens.reduce((s, i) => s + i.qtd, 0);

  $("contador-itens").textContent = qtd;
  $("valor-total").textContent = moeda(total);
  $("modal-valor-total").textContent = moeda(total);
  $("carrinho-bar").classList.toggle("visivel", qtd > 0);

  $("lista-carrinho-modal").innerHTML = itens.length
    ? itens.map((i) => `<li><span>${i.qtd}× ${i.nome}</span><b>${moeda(i.preco * i.qtd)}</b></li>`).join("")
    : `<li class="vazio">Seu carrinho está vazio. Escolha um prato no cardápio.</li>`;

  try { localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho)); } catch (e) {}
  renderCardapio();
  if (!qtd) fecharCarrinho();
}

function abrirCarrinho() { $("modal-carrinho").classList.add("aberto"); }
function fecharCarrinho() { $("modal-carrinho").classList.remove("aberto"); }

function irParaCadastro() {
  if (!itensDoCarrinho().length) return;
  try { localStorage.setItem("saboresDaGe.obs", $("obs").value); } catch (e) {}
  window.location.href = "cadastro.html";
}

function finalizarPedido() {
  const itens = itensDoCarrinho();
  if (!itens.length) return;
  const total = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
  const obs = $("obs").value.trim();
  let msg = "Olá, vim pelo site e gostaria de fazer um pedido:\n\n";
  msg += itens.map((i) => `• ${i.qtd}x ${i.nome} – ${moeda(i.preco * i.qtd)}`).join("\n");
  msg += `\n\n*Total: ${moeda(total)}*`;
  if (obs) msg += `\n\nObservações: ${obs}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
}

// ---------- Tema claro / escuro ----------
function alternarTema() {
  const escuro = document.body.dataset.theme !== "dark";
  aplicarTema(escuro ? "dark" : "light");
  guardar(CHAVE_TEMA, escuro ? "dark" : "light");
}
function aplicarTema(t) {
  document.body.dataset.theme = t;
  document.documentElement.dataset.theme = t;
  $("btn-theme").textContent = t === "dark" ? "☀️" : "🌙";
}

// ---------- Aberto / fechado ----------
function atualizarStatus() {
  const agora = new Date();
  const dia = agora.getDay(), h = agora.getHours();
  const aberto = dia >= 1 && dia <= 5 && h >= ABRE && h < FECHA;
  const el = $("status");
  el.className = "status " + (aberto ? "aberto" : "fechado");
  el.querySelector("b").textContent = aberto ? "Aberto agora" : "Fechado agora";
}

// ---------- Categoria ativa ao rolar ----------
function iniciarChips() {
  const chips = document.querySelectorAll(".chip");
  const obs = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (e.isIntersecting) chips.forEach((c) => c.classList.toggle("ativo", c.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  ["refeicoes", "bebidas", "sobremesas"].forEach((id) => obs.observe($(id)));
}

// ---------- Início ----------
try { carrinho = JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || {}; } catch (e) { carrinho = {}; }
aplicarTema(ler(CHAVE_TEMA) || "light");
atualizarStatus();
setInterval(atualizarStatus, 60000);
iniciarChips();
atualizar();
