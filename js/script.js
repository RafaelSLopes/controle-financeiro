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
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  alert("Salvo com sucesso!");

  // 🧹 LIMPAR CAMPOS
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
  document.getElementById("parcelas").value = "";

  // Resetar tipo para "à vista"
  document.querySelector('input[value="avista"]').checked = true;
  document.getElementById("parcelasDiv").style.display = "none";
  document.getElementById("descricao").focus();
}

// ==========================
// Configurações
// ==========================
function abrirConfig() {
  const box = document.getElementById("configBox");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

// ==========================
// Criar meses
// ==========================
function criarMes() {
  const mes = parseInt(document.getElementById("configMes").value);
  const ano = parseInt(document.getElementById("configAno").value);

  if (!ano) {
    alert("Informe o ano");
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      acao: "criarMes",
      mes: mes,
      ano: ano
    })
  }).then(() => {
    alert("Mês criado!");
    carregarMeses();
  });
}

// ==========================
// Ocultar meses
// ==========================
function ocultarMes() {
  const mes = document.getElementById("mes").value;

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      acao: "ocultarMes",
      nomeAba: mes
    })
  }).then(() => {
    alert("Mês ocultado!");
    carregarMeses();
  });
}

// ==========================
// Inicialização
// ==========================
carregarMeses();
