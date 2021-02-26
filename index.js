const reqQuestoes    = new Request("https://raw.githubusercontent.com/Ocramoi/QuestoesBauru/main/assets/questoes.json"),
      mainTexto      = document.getElementById("mainTexto"),
      elQuestoes     = document.getElementById("questoes"),
      audioCorreto   = new Audio("assets/correto.mp3"),
      audioErrado    = new Audio("assets/errado.mp3"),
      tituloPergunta = document.getElementById("pergunta"),
      opcoes         = [document.getElementById("opcao1"),
                        document.getElementById("opcao2"),
                        document.getElementById("opcao3"),
                        document.getElementById("opcao4")];

let questoes,
    totalQuestoes = 5,
    numCorretas = 0;

document.getElementById("botaoComecar").onclick = (e) => {
    mainTexto.style.display = "none";
    elQuestoes.style.display = "grid";

    novaQuestao(0);
};

window.onload = (e) => {
    fetch(reqQuestoes)
        .then(resposta => resposta.json().then(data => carregaQuestoes(data)))
        .catch(exception => {
            console.log(exception);
            alert("Erro ao carregar o jogo! Favor recarregue a página novamente.")
            throw new Error("Não foi possível carregar as questões!");
        });
};

function carregaQuestoes(data) {
    questoes = shuffle(data.questoes).slice(0, totalQuestoes);
    document.getElementById("loadscreen").style.display = "none";

}

function novaQuestao(questaoAtual) {
    if (questaoAtual == totalQuestoes) {
        fimDeJogo();
        return;
    }

    opcoes.forEach((opcao, idx, opcs) => {
        opcao.style.color = null;
    });

    let erradas = shuffle(questoes[questaoAtual].erradas),
        posCorreta = Math.floor(Math.random() * 4),
        cont = 0;

    tituloPergunta.innerText = questoes[questaoAtual].pergunta;
    opcoes[posCorreta].innerHTML = `<span>${questoes[questaoAtual].correta}</span>`;
    for (let i = 0; i < 4; ++i)
        if (i != posCorreta) opcoes[i].innerHTML = `<span>${erradas[cont++]}</span>`;

    opcoes.forEach((opcao, idx, opcs) => {
        opcao.onclick = (e) => {
            trataSelecao(idx, posCorreta, questaoAtual);
        };
    });
}

function fimDeJogo() {
    mainTexto.style.display = "grid";
    elQuestoes.style.display = "none";

    let els = mainTexto.children;
    els[0].innerHTML = `Fim de jogo!`;
    els[1].innerHTML = `<span style="text-align: center; width: 100%;">Seu placar final foi ${numCorretas}/${totalQuestoes}!</span>`;
    els[2].innerHTML = `<button id="botaoComecar" onclick='location.reload()' style="font-size: 1.3rem">Novo jogo</button>`;
}

function trataSelecao(selecionada, correta, questaoAtual) {
    opcoes.forEach((opcao, idx, opcs) => {
        if (idx == correta)
            opcao.style.color = 'var(--light-green)';
        else
            opcao.style.color = "red";
    });
    if (selecionada == correta) {
        numCorretas++;
        audioCorreto.play();
    }
    else
        audioErrado.play();

    setTimeout((e) => {
        novaQuestao(++questaoAtual);
    }, 1500);
}

/**
 * @param {any[]} array Array of any type to be shuffled
 * @return {any[]} shuffledArray
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
