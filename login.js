const formLogin = document.getElementById("formLogin");
const msg = document.getElementById("msg");

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  document.getElementById("erro-email").textContent = emailOk ? "" : "Digite um e-mail válido.";
  document.getElementById("erro-senha").textContent = senha ? "" : "Informe sua senha.";
  msg.hidden = true;

  if (!emailOk || !senha) return;

  const resultado = Storage.login(email, senha);

  if (!resultado.ok) {
    document.getElementById("erro-senha").textContent = resultado.msg;
    return;
  }

  msg.textContent = "Login realizado! Redirecionando...";
  msg.hidden = false;

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1000);
});