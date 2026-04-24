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
// Formata o campo de valor
// ==========================
const inputValor = document.getElementById("valor");

inputValor.addEventListener("input", (e) => {
  let v = e.target.value;

  // remove tudo que não é número
  v = v.replace(/\D/g, "");

  // evita vazio
  if (v === "") {
    e.target.value = "";
    return;
  }

  // converte para número em centavos
  v = (parseInt(v) / 100).toFixed(2);

  // formata com vírgula
  v = v.replace(".", ",");

  e.target.value = v;
});

// ==========================
// Desabilitar o botão de salvar antes de carregar o campo
// ==========================
const btnSalvar = document.getElementById("btnSalvar");
btnSalvar.disabled = true;

// ==========================
// Carregar meses
// ==========================
async function carregarMeses() {
  const btnSalvar = document.getElementById("btnSalvar");
  btnSalvar.disabled = true;

  try {
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

  } catch (erro) {
    console.error("Erro ao carregar meses:", erro);
  }

  btnSalvar.disabled = false; // ✅ libera após carregar
}

// ==========================
// Salvar lançamento
// ==========================
async function salvar() {
  const btnSalvar = document.getElementById("btnSalvar");

  // 🚫 bloqueia clique duplo
  if (btnSalvar.disabled) return;
  
  btnSalvar.disabled = true;
  btnSalvar.textContent = "Salvando...";

  try {
    const dados = {
      acao: "lancar",
      mes: document.getElementById("mes").value,
      cartao: document.getElementById("cartao").value,
      descricao: document.getElementById("descricao").value,
      valor: parseFloat(
        document.getElementById("valor").value.replace(",", ".")
      ),
      tipo: document.querySelector('input[name="tipo"]:checked').value,
      parcelas: parseInt(document.getElementById("parcelas").value) || 1
    };

    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(dados)
    });

    alert("Salvo com sucesso!");

    // 🧹 limpar campos
    document.getElementById("descricao").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("parcelas").value = "";
    document.querySelector('input[value="avista"]').checked = true;
    document.getElementById("parcelasDiv").style.display = "none";
    document.getElementById("descricao").focus();

  } catch (erro) {
    console.error("Erro:", erro);
    alert("Erro ao salvar");
  }

  btnSalvar.disabled = false; // ✅ reativa só no final
  btnSalvar.textContent = "Salvar";
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
