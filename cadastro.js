// ==========================================================
// Cadastro | Sabores da Gê
// Validação do formulário no navegador (front-end).
// ==========================================================

const form = document.getElementById("formCadastro");

const campos = {
  nome: document.getElementById("nome"),
  email: document.getElementById("email"),
  telefone: document.getElementById("telefone"),
  senha: document.getElementById("senha"),
  confirmaSenha: document.getElementById("confirmaSenha"),
  termos: document.getElementById("termos"),
};

// ---------- Funções de validação ----------
// Cada uma devolve "" se estiver tudo certo, ou a mensagem de erro.

function validarNome(valor) {
  const nome = valor.trim();
  if (nome === "") return "Informe seu nome completo.";
  if (nome.split(/\s+/).length < 2) return "Digite nome e sobrenome.";
  return "";
}

function validarEmail(valor) {
  const email = valor.trim();
  if (email === "") return "Informe seu e-mail.";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!regex.test(email)) return "Digite um e-mail válido.";
  return "";
}

function validarTelefone(valor) {
  const numeros = valor.replace(/\D/g, "");
  if (numeros === "") return "Informe seu WhatsApp.";
  if (numeros.length !== 11) return "Use DDD + 9 dígitos. Ex.: (21) 99999-9999.";
  return "";
}

function validarSenha(valor) {
  if (valor === "") return "Crie uma senha.";
  if (valor.length < 8) return "A senha precisa ter no mínimo 8 caracteres.";
  if (!/[A-Za-z]/.test(valor) || !/\d/.test(valor)) {
    return "Use letras e números na senha.";
  }
  return "";
}

function validarConfirmaSenha(valor) {
  if (valor === "") return "Confirme sua senha.";
  if (valor !== campos.senha.value) return "As senhas não são iguais.";
  return "";
}

function validarTermos(marcado) {
  return marcado ? "" : "Você precisa aceitar os termos para continuar.";
}

// ---------- Mostrar / limpar erro ----------

function mostrarResultado(nomeCampo, mensagem) {
  const campo = campos[nomeCampo];
  const erro = document.getElementById("erro-" + nomeCampo);

  erro.textContent = mensagem;

  if (campo.type !== "checkbox") {
    campo.classList.toggle("invalid", mensagem !== "");
    campo.classList.toggle("valid", mensagem === "" && campo.value !== "");
  }
  return mensagem === "";
}

function validarCampo(nomeCampo) {
  switch (nomeCampo) {
    case "nome":          return mostrarResultado("nome", validarNome(campos.nome.value));
    case "email":         return mostrarResultado("email", validarEmail(campos.email.value));
    case "telefone":      return mostrarResultado("telefone", validarTelefone(campos.telefone.value));
    case "senha":         return mostrarResultado("senha", validarSenha(campos.senha.value));
    case "confirmaSenha": return mostrarResultado("confirmaSenha", validarConfirmaSenha(campos.confirmaSenha.value));
    case "termos":        return mostrarResultado("termos", validarTermos(campos.termos.checked));
  }
}

// Valida cada campo ao sair dele
Object.keys(campos).forEach((nome) => {
  const evento = nome === "termos" ? "change" : "blur";
  campos[nome].addEventListener(evento, () => validarCampo(nome));
});

// ---------- Máscara do telefone: (00) 00000-0000 ----------

campos.telefone.addEventListener("input", () => {
  let n = campos.telefone.value.replace(/\D/g, "").slice(0, 11);

  if (n.length > 10) {
    n = n.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
  } else if (n.length > 6) {
    n = n.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
  } else if (n.length > 2) {
    n = n.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
  } else if (n.length > 0) {
    n = n.replace(/^(\d{0,2})/, "($1");
  }
  campos.telefone.value = n;
});

// ---------- Mostrar / ocultar senha ----------

document.querySelectorAll(".toggle-pass").forEach((botao) => {
  botao.addEventListener("click", () => {
    const input = document.getElementById(botao.dataset.target);
    const mostrando = input.type === "text";
    input.type = mostrando ? "password" : "text";
    botao.textContent = mostrando ? "Mostrar" : "Ocultar";
    botao.setAttribute("aria-label", mostrando ? "Mostrar senha" : "Ocultar senha");
  });
});

// ---------- Indicador de força da senha ----------

const barra = document.getElementById("barra-forca");
const textoForca = document.getElementById("texto-forca");

campos.senha.addEventListener("input", () => {
  const s = campos.senha.value;
  let pontos = 0;

  if (s.length >= 8) pontos++;
  if (s.length >= 12) pontos++;
  if (/[a-z]/.test(s) && /[A-Z]/.test(s)) pontos++;
  if (/\d/.test(s)) pontos++;
  if (/[^A-Za-z0-9]/.test(s)) pontos++;

  const niveis = [
    { largura: "0%",   cor: "transparent", texto: "" },
    { largura: "25%",  cor: "#b3261e",     texto: "Senha fraca" },
    { largura: "50%",  cor: "#e67e22",     texto: "Senha razoável" },
    { largura: "75%",  cor: "#d4a017",     texto: "Senha boa" },
    { largura: "100%", cor: "#2e7d32",     texto: "Senha forte" },
  ];

  let nivel = 0;
  if (s.length > 0) nivel = pontos <= 2 ? 1 : pontos === 3 ? 2 : pontos === 4 ? 3 : 4;

  barra.style.width = niveis[nivel].largura;
  barra.style.background = niveis[nivel].cor;
  textoForca.textContent = niveis[nivel].texto;
  textoForca.style.color = niveis[nivel].cor;

  // Se já digitou a confirmação, revalida
  if (campos.confirmaSenha.value !== "") validarCampo("confirmaSenha");
});

// ---------- Envio do formulário ----------

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const resultados = Object.keys(campos).map((nome) => validarCampo(nome));
  const tudoCerto = resultados.every(Boolean);

  const msg = document.getElementById("mensagem-sucesso");

  if (!tudoCerto) {
    msg.hidden = true;
    // Leva o foco ao primeiro campo com erro
    const primeiroErro = form.querySelector(".invalid");
    if (primeiroErro) primeiroErro.focus();
    return;
  }

  // Dados prontos para enviar (a senha só deve ir para o servidor, nunca ser guardada no navegador)
  const dados = {
    nome: campos.nome.value.trim(),
    email: campos.email.value.trim(),
    telefone: campos.telefone.value.replace(/\D/g, ""),
    senha: campos.senha.value,
  };

  // TODO (parte do grupo): enviar "dados" para o back-end, por exemplo:
  // fetch("/api/cadastro", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(dados),
  // });

  msg.textContent = "Cadastro realizado com sucesso! Bem-vindo(a) ao Sabores da Gê, " + dados.nome.split(" ")[0] + "!";
  msg.hidden = false;

  form.reset();
  Object.values(campos).forEach((c) => c.classList.remove("valid", "invalid"));
  barra.style.width = "0%";
  textoForca.textContent = "";
});