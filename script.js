'use strict';

// DECLARAÇÃO DE VARIÁVEIS DOM
const divAlerta = document.getElementById('alerta');
const btnInserir = document.getElementById('botaoInserir');
const btnCompartilhar = document.getElementById('botaoCompartilhar'); // Variável para o botão Compartilhar
const descricaoItem = document.getElementById('inputDescricao');
const quantidadeItem = document.getElementById('inputQuantidade');
const precoItem = document.getElementById('inputPreco');
const tabelaTbody = document.getElementById('bodyItens');      
const inputFornecedor = document.getElementById('inputFornecedor'); // Variável para o campo Fornecedor

// LISTENERS
btnInserir.addEventListener('click', function (event) {
   event.preventDefault();
   valida();
});

// Adicionando listener para o botão Compartilhar
btnCompartilhar.addEventListener('click', function (event) {
   event.preventDefault();
   VerificaPermissaoCopiar();
   //compartilharTabela();
});

// FUNÇÕES
function insereNomeData(){
   // Obtém a data de hoje
   const hoje = new Date();

   // Formata a data no formato dd/mm/aaaa
   const dia = String(hoje.getDate()).padStart(2, '0');
   const mes = String(hoje.getMonth() + 1).padStart(2, '0'); // Janeiro é 0!
   const ano = hoje.getFullYear();

   // Junta as partes da data
   const dataFormatada = `${dia}/${mes}/${ano}`;
   
   // Insere a data formatada no label
   document.getElementById('appNameData').innerText = "APP Cotação - " + dataFormatada;
}



function valida() {
   let mensagemAlerta = "";

   if (descricaoItem.value === "") {
      mensagemAlerta = "*** Atenção Informe uma descrição ***";
   } else if (quantidadeItem.value === "") {
      mensagemAlerta = "*** Atenção Informe quantidade para o item ***";
   } else if (precoItem.value === "") {
      mensagemAlerta = "*** Atenção Informe o preço do item ***";
   }

   if (mensagemAlerta === "") {
      inserirLinha();
      inserirFootTotais();
      somaPreco();
      limpaCampos();
   }

   divAlerta.textContent = mensagemAlerta;
}



function limpaCampos() {
   descricaoItem.value = "";
   quantidadeItem.value = 1;
   precoItem.value = "";
   descricaoItem.focus();
}

function somaPreco() {
   const precoTotal = document.getElementById('totalPreco');
   const precos = document.querySelectorAll('.qtdxPreco:not(.somaPreco)');
   let total = 0;

   precos.forEach(function (preco) {
      total += parseFloat(preco.textContent);
   });

   precoTotal.textContent = "R$ " + total.toFixed(2);
}



function inserirFootTotais() {
   document.getElementById("footTotais").remove();

   const linha = document.createElement("tr");
   linha.id = "footTotais";

   const colunaTextoTotal = document.createElement("td");
   colunaTextoTotal.setAttribute('colspan', '3');
   colunaTextoTotal.className = "font-weight-bold";
   colunaTextoTotal.textContent = "TOTAL";

   const colunaTotalPreco = document.createElement("td");
   colunaTotalPreco.setAttribute('id', 'totalPreco');
   colunaTotalPreco.className = "font-weight-bold";

   const colunaVazia = document.createElement("td");
   colunaVazia.setAttribute('colspan', '1');

   linha.appendChild(colunaTextoTotal);
   linha.appendChild(colunaTotalPreco);
   linha.appendChild(colunaVazia);

   tabelaTbody.appendChild(linha);
}

function inserirLinha() {
   const linha = document.createElement("tr");

   const colunaDescricao = document.createElement("td");
   colunaDescricao.classList.add("maiusculoCentro");
   colunaDescricao.textContent = descricaoItem.value;

   const colunaQuantidade = document.createElement("td");
   colunaQuantidade.textContent = quantidadeItem.value;

   const colunaPreco = document.createElement("td");
   colunaPreco.textContent = precoItem.value;

   const colunaQuantxPreco = document.createElement("td");
   colunaQuantxPreco.classList.add("qtdxPreco");
   colunaQuantxPreco.textContent = (quantidadeItem.value * precoItem.value).toFixed(2);

   const colunaBotaoExcluir = document.createElement("td");

   const checkboxExcluir = document.createElement("input");
   checkboxExcluir.setAttribute("type", "checkbox");
   checkboxExcluir.style.transform = "scale(1.5)";
   checkboxExcluir.addEventListener("change", somaPreco);

   colunaBotaoExcluir.appendChild(checkboxExcluir);

   linha.appendChild(colunaDescricao);
   linha.appendChild(colunaQuantidade);
   linha.appendChild(colunaPreco);
   linha.appendChild(colunaQuantxPreco);
   linha.appendChild(colunaBotaoExcluir);

   tabelaTbody.appendChild(linha);
}



botaoExcluir.addEventListener('click', function () {
   removeLinha();
});



function removeLinha() {
   const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
   checkboxes.forEach(function (checkbox) {
      checkbox.parentElement.parentElement.remove();
   });
   somaPreco();
}



function VerificaPermissaoCopiar(){
   if (navigator.permissions) {
      navigator.permissions.query({ name: 'clipboard-write' }).then(function(permissionStatus) {
         // Verifica se a permissão foi concedida
         if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
               compartilharTabela();
         } else {
               alert("Por favor, conceda permissão para acessar a área de transferência.");
         }
      });
   } else {
      compartilharTabela();
   }
}



// Função para compartilhar a tabela
function compartilharTabela() {         
   const fornecedor = inputFornecedor.value.trim();
   if (!fornecedor) {
      alert("Por favor, insira o nome do fornecedor.");
      return;
   }

   const nomeData = document.getElementById('appNameData');
   const dataFormatada = nomeData.textContent
  

   let textoCompartilhamento = `${dataFormatada}\n\n`;
   textoCompartilhamento += "Descrição\tQtd\t\tPreço\tTotal\n";

   const linhas = tabelaTbody.querySelectorAll("tr");
   linhas.forEach(linha => {
      // Verifica se a linha não é a linha de totais
      if (linha.id !== "footTotais") {
         const colunas = linha.querySelectorAll("td");
         textoCompartilhamento += `${colunas[0].textContent}...........${colunas[1].textContent}.......${colunas[2].textContent}.....${colunas[3].textContent}\n`;
      }
   });

   const total = document.getElementById('totalPreco').textContent;
   textoCompartilhamento += `\nTotal: ${total}`;

   // Copia o texto para a área de transferência
   navigator.clipboard.writeText(textoCompartilhamento).then(() => {
      alert("Tabela copiada para a área de transferência!");
   }).catch(() => {
      alert("Erro ao copiar a tabela.");
   });
}





window.addEventListener('beforeunload', function (event) {
   event.preventDefault(); 
   event.returnValue = ''; 

   // Exibe a modal e bloqueia a atualização da página
   showConfirmationModal().then((userConfirmed) => {
      if (userConfirmed) {
         window.removeEventListener('beforeunload', arguments.callee); // Remove o evento para evitar loop
         window.location.reload(); // Atualiza a página
      }
   });

   return ''; // Necessário para exibir o aviso padrão do navegador em alguns casos
});

// Função para exibir a modal de confirmação
function showConfirmationModal() {
   const modal = document.getElementById('confirmationModal');
   modal.style.display = 'flex';

   return new Promise((resolve) => {
      const confirmBtn = document.getElementById('confirmLeave');
      const cancelBtn = document.getElementById('cancelLeave');

      confirmBtn.onclick = () => {
         modal.style.display = 'none';
         resolve(true);
      };

      cancelBtn.onclick = () => {
         modal.style.display = 'none';
         resolve(false);
      };
   });
}










insereNomeData();