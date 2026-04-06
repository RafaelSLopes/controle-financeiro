const API_URL = "https://script.google.com/macros/s/AKfycbxV0gnvEGxW3Ed1foIjW2dByOSWVV2uSHkA6E15JOkkt4ZgusAAeEToctAgOMjsUyUleA/exec";

// ==========================
// Mostrar campo parcelas
// ==========================
document.querySelectorAll('input[name="tipo"]').forEach(el => {
  el.addEventListener("change", () => {
    const tipo = document.querySelector('input[name="tipo"]:checked').value;
    document.getElementById("parcelasDiv").style.display =
      tipo === "parcelado" ? "block" : "none";
  });
});

// ==========================
// Carregar meses
// ==========================
async function carregarMeses() {
  const res = await fetch(API_URL + "?acao=listarMeses");
  const meses = await res.json();

  const select = document.getElementById("mes");
  select.innerHTML = "";

  meses.forEach(m => {
    const opt = document.createElement("option");
    opt.value = m.nome;
    opt.textContent = m.nome;
    select.appendChild(opt);
  });
}

// ==========================
// Salvar lançamento
// ==========================
async function salvar() {
  const dados = {
    acao: "lancar",
    mes: document.getElementById("mes").value,
    cartao: document.getElementById("cartao").value,
    descricao: document.getElementById("descricao").value,
    valor: parseFloat(document.getElementById("valor").value),
    tipo: document.querySelector('input[name="tipo"]:checked').value,
    parcelas: parseInt(document.getElementById("parcelas").value) || 1
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(dados)
  });

  alert("Salvo com sucesso!");
}

// ==========================
// Configurações
// ==========================
function abrirConfig() {
  const opcao = prompt("Digite:\n1 - Criar mês\n2 - Ocultar mês");

  if (opcao == "1") {
    const mes = prompt("Mês (1-12)");
    const ano = prompt("Ano (ex: 2026)");

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        acao: "criarMes",
        mes: parseInt(mes),
        ano: parseInt(ano)
      })
    }).then(() => {
      alert("Mês criado!");
      carregarMeses();
    });
  }

  if (opcao == "2") {
    const nome = prompt("Nome da aba (ex: Maio/2026)");

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({
        acao: "ocultarMes",
        nomeAba: nome
      })
    }).then(() => {
      alert("Ocultado!");
      carregarMeses();
    });
  }
}

// ==========================
// Inicialização
// ==========================
carregarMeses();
