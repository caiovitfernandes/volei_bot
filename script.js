// URL base da API do Azure Static Web App (vamos ajustar depois)
const API_BASE = 'volei-bot-backend.azurewebsites.net';

const inputNome = document.getElementById('nome');
const btnAdicionar = document.getElementById('btnAdicionar');
const listaJogadores = document.getElementById('listaJogadores');
const mensagem = document.getElementById('mensagem');

async function carregarJogadores() {
  listaJogadores.innerHTML = '<li>Carregando...</li>';
  try {
    const resp = await fetch(`${API_BASE}/getPlayers`);
    if (!resp.ok) throw new Error('Erro ao buscar jogadores');
    const jogadores = await resp.json();
    exibirJogadores(jogadores);
  } catch (err) {
    listaJogadores.innerHTML = `<li>Erro ao carregar lista</li>`;
  }
}

function exibirJogadores(jogadores) {
  if (!jogadores.length) {
    listaJogadores.innerHTML = '<li>Nenhum jogador cadastrado</li>';
    return;
  }
  listaJogadores.innerHTML = jogadores
    .sort((a, b) => b.Rating - a.Rating)
    .map(j => `<li><strong>${j.RowKey}</strong> — ${j.Rating} pontos</li>`)
    .join('');
}

btnAdicionar.addEventListener('click', async () => {
  const nome = inputNome.value.trim();
  if (!nome) {
    mostrarMensagem('Digite um nome válido', true);
    return;
  }

  const body = { nome };

  try {
    const resp = await fetch(`/addPlayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await resp.json();

    if (resp.ok) {
      mostrarMensagem(data.message, false);
      inputNome.value = '';
      carregarJogadores();
    } else {
      mostrarMensagem(data.error || 'Erro ao adicionar jogador', true);
    }
  } catch (err) {
    mostrarMensagem('Erro de conexão com o servidor', true);
  }
});

function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.className = erro ? 'mensagem erro' : 'mensagem sucesso';
}

carregarJogadores();
