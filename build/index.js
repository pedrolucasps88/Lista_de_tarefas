"use strict";
console.log("RODANDO COM SUCESSO");
// Seleção dos elementos do DOM
let listElement = document.querySelector("#app ul");
let inputElement = document.querySelector("#app input");
let buttonElement = document.querySelector("#app button");
let listaSalva = localStorage.getItem("@listagem_tarefas");
console.log(listaSalva);
let tarefas = listaSalva !== null && JSON.parse(listaSalva) || null;
let tarefasConcluidas = [];
// Função para listar as tarefas
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
// Inicializar a lista de tarefas
listarTarefas();
// Função para adicionar uma nova tarefa
function adicionarTarefa() {
    if (inputElement.value === "") {
        alert("Digite alguma tarefa!");
        return false;
    }
    else {
        let tarefaDigitada = inputElement.value;
        // Verificar se a tarefa é urgente
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
// Associar a função de adicionarTarefa ao clique do botão
buttonElement.onclick = adicionarTarefa;
// Função para deletar uma tarefa
function deletarTarefa(posicao) {
    tarefas.splice(posicao, 1);
    listarTarefas();
    salvarDados();
}
// Salvar os dados no localStorage
function salvarDados() {
    localStorage.setItem("@listagem_tarefas", JSON.stringify(tarefas));
}
// Marcar uma tarefa como concluída
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
// Função para listar tarefas concluídas
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
// Desfazer uma tarefa concluída
function desfazerTarefaConcluida(posicao) {
    tarefas.push(tarefasConcluidas[posicao].substring(2));
    tarefasConcluidas.splice(posicao, 1);
    listarTarefas();
    listarTarefasConcluidas();
    salvarDados();
}
// Atualizar o relógio a cada segundo
function atualizarRelogio() {
    const relogioElement = document.querySelector("#relogio");
    const agora = new Date();
    relogioElement.textContent = agora.toLocaleString();
}
setInterval(atualizarRelogio, 1000);
// Mostrar a animação do troféu
function mostrarAnimacaoTrofeu() {
    const trofeuElement = document.getElementById('trofeu');
    if (trofeuElement) {
        trofeuElement.style.display = 'block';
    }
}
// Continuar após a animação do troféu
function continuar() {
    const trofeuElement = document.getElementById('trofeu');
    if (trofeuElement) {
        trofeuElement.style.display = 'none';
    }
}
// Configurar notificação
const botaoNotificacao = document.getElementById('configurar-notificacao');
if (botaoNotificacao) {
    botaoNotificacao.addEventListener('click', () => {
        const hora = prompt("Digite a hora para receber a notificação (no formato HH:mm):");
        if (hora) {
            const [hours, minutes] = hora.split(':');
            const data = new Date();
            data.setHours(Number(hours), Number(minutes), 0);
            if (data < new Date()) {
                alert('A hora que você inseriu já passou!');
                return;
            }
            const tempoAteNotificacao = data.getTime() - new Date().getTime();
            setTimeout(() => {
                Notification.requestPermission().then((permission) => {
                    if (permission === 'granted') {
                        const notificacao = new Notification('Lembrete de Tarefa', {
                            body: 'É hora de realizar as tarefas!',
                            icon: '../imgs/notificacao.png'
                        });
                        notificacao.onclick = () => {
                            alert('Hora de fazer as tarefas!');
                        };
                        setTimeout(() => notificacao.close(), 5000);
                    }
                    else {
                        alert('A permissão para notificações não foi concedida.');
                    }
                });
            }, tempoAteNotificacao);
        }
    });
}
