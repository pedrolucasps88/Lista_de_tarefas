"use strict";
console.log("RODANDO COM SUCESSO");
let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let buttonElement = document.querySelector("#app button");
let priorElement = document.querySelector("#app urgenteCheckbox");
let listaSalva = localStorage.getItem("@listagem_tarefas");
console.log(listaSalva);
let tarefas = listaSalva !== null && JSON.parse(listaSalva) || null;
let tarefasConcluidas = [];
function listarTarefas() {
    listElement.innerHTML = "";
    tarefas.map(item => {
        let todoElement = document.createElement("li");
        let tarefaText = document.createTextNode(item);
        let linkElement = document.createElement("a");
        linkElement.setAttribute("href", "#");
        let posicao = tarefas.indexOf(item);
        linkElement.setAttribute("onclick", `deletarTarefa(${posicao})`);
        linkElement.setAttribute("id", "excluir");
        linkElement.setAttribute("style", "margin-left: 10px ");
        let checkboxElement = document.createElement("input");
        checkboxElement.setAttribute("type", "checkbox");
        checkboxElement.setAttribute("onchange", `marcarComoConcluida(${posicao})`);
        let linkText = document.createTextNode("Excluir");
        linkElement.setAttribute("style", "margin-left: 50px ");
        linkElement.appendChild(linkText);
        todoElement.appendChild(tarefaText);
        todoElement.appendChild(linkElement);
        listElement.appendChild(todoElement);
        todoElement.appendChild(checkboxElement);
    });
}
listarTarefas();
listarTarefasConcluidas();
function adicionarTarefa() {
    if (inputElement.value === "") {
        alert("Digite alguma tarefa!");
        return false;
    }
    else {
        let tarefaDigitada = inputElement.value;
        let isUrgente = document.querySelector("#urgenteCheckbox").checked;
        console.log(isUrgente);
        let novaTarefa = tarefaDigitada;
        if (isUrgente) {
            console.log("urgenteeeeee");
            novaTarefa = "⚠️ " + tarefaDigitada;
        }
        tarefas.push(novaTarefa);
        inputElement.value = "";
        console.log(tarefas);
        listarTarefas();
        salvarDados();
    }
}
buttonElement.onclick = adicionarTarefa;
function deletarTarefa(posicao) {
    tarefas.splice(posicao, 1);
    listarTarefas();
    salvarDados();
}
function salvarDados() {
    localStorage.setItem("@listagem_tarefas", JSON.stringify(tarefas));
}
function marcarComoConcluida(posicao) {
    let tarefa = tarefas[posicao];
    if (tarefa.startsWith("✔️ ")) {
        tarefasConcluidas.splice(tarefasConcluidas.indexOf(tarefa.substring(2)), 1);
        tarefas.splice(posicao, 1);
    }
    else {
        tarefas.splice(posicao, 1);
        tarefasConcluidas.push("✔️ " + tarefa);
    }
    listarTarefas();
    listarTarefasConcluidas();
    salvarDados();
    // Verificar se todas as tarefas foram concluídas
    if (tarefas.length === 0) {
        mostrarAnimacaoTrofeu();
    }
}
function listarTarefasConcluidas() {
    let listaConcluidas = document.querySelector("#concluidas ul");
    listaConcluidas.innerHTML = "";
    tarefasConcluidas.map((item, posicao) => {
        let todoElement = document.createElement("li");
        let tarefaText = document.createTextNode(item);
        let undoButton = document.createElement("button");
        undoButton.textContent = "Desfazer";
        undoButton.onclick = function () { desfazerTarefaConcluida(posicao); };
        todoElement.appendChild(tarefaText);
        todoElement.appendChild(undoButton);
        listaConcluidas.appendChild(todoElement);
    });
}
function desfazerTarefaConcluida(posicao) {
    tarefas.push(tarefasConcluidas[posicao].substring(2));
    tarefasConcluidas.splice(posicao, 1);
    listarTarefas();
    listarTarefasConcluidas();
    salvarDados();
}
function atualizarRelogio() {
    const relogioElement = document.querySelector("#relogio");
    const agora = new Date();
    relogioElement.textContent = agora.toLocaleString();
}
setInterval(atualizarRelogio, 1000);
function mostrarAnimacaoTrofeu() {
    const trofeuElement = document.getElementById('trofeu');
    if (trofeuElement) {
        trofeuElement.style.display = 'block';
    }
}
function continuar() {
    const trofeuElement = document.getElementById('trofeu');
    if (trofeuElement) {
        trofeuElement.style.display = 'none';
    }
}
