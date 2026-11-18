const Storage = {
  ler(chave, padrao) {
    try {
      const v = localStorage.getItem(chave);
      return v ? JSON.parse(v) : padrao;
    } catch (e) {
      return padrao;
    }
  },
  gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  },

  getUsuarios() {
    return this.ler("usuarios", []);
  },
  cadastrar(usuario) {
    const usuarios = this.getUsuarios();
    if (usuarios.some((u) => u.email === usuario.email)) {
      return { ok: false, msg: "Este e-mail já está cadastrado." };
    }
    usuarios.push(usuario);
    this.gravar("usuarios", usuarios);
    return { ok: true, msg: "Cadastro realizado com sucesso!" };
  },

  login(email, senha) {
    const u = this.getUsuarios().find(
      (x) => x.email === email && x.senha === senha
    );
    if (!u) return { ok: false, msg: "E-mail ou senha incorretos." };
    this.gravar("usuarioLogado", { nome: u.nome, email: u.email });
    return { ok: true, msg: "Login realizado!" };
  },
  logout() {
    localStorage.removeItem("usuarioLogado");
  },
  getUsuarioLogado() {
    return this.ler("usuarioLogado", null);
  },
};