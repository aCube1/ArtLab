// Importa a classe/módulo principal que contém as funções de manipulação da livraria
import { Livraria } from './lib.js';

// ===== Dados e elementos =====

// Carrega os livros salvos no localStorage.
// Se não houver nada salvo, reinicia com os livros padrão (resetBooks).
let books = Livraria.loadBooks()

// Garante que o estado atual seja salvo no localStorage
Livraria.saveBooks(books);

// Seleciona elementos HTML que serão manipulados pelo JavaScript
const output = document.getElementById('output');   // Área de exibição de resultados
const forms = document.getElementById('forms');     // Área onde formulários aparecem dinamicamente
const buttons = document.getElementById('buttons'); // Div que contém os botões de ações

// ===== Forms =====
// Cada função abaixo cria dinamicamente um formulário e adiciona
// eventos de "submit" para executar a ação correspondente na livraria.

// --- Formulário de adicionar livro ---
function showAddForm() {
  forms.innerHTML = `
    <h3>Adicionar Livro</h3>
    <form id="addForm">
      <input type="number" id="addId" placeholder="ID" required />
      <input type="text" id="addTitle" placeholder="Título" required />
      <input type="text" id="addAuthor" placeholder="Autor" required />
      <input type="number" id="addYear" placeholder="Ano" required />
      <button type="submit">Adicionar</button>
    </form>
  `;
  // Quando o formulário é enviado
  document.getElementById('addForm').addEventListener('submit', e => {
    e.preventDefault(); // Evita recarregar a página
    const newBook = {
      id: Number(document.getElementById('addId').value),
      title: document.getElementById('addTitle').value,
      author: document.getElementById('addAuthor').value,
      year: Number(document.getElementById('addYear').value)
    };
    books = Livraria.addBook(books, newBook); // Chama a função da lib
    Livraria.saveBooks(books); // Salva no localStorage
    forms.innerHTML = ''; // Limpa o formulário
    output.textContent = 'Livro adicionado!';
  });
}

// --- Formulário de atualizar livro ---
function showUpdateForm() {
  forms.innerHTML = `
    <h3>Atualizar Livro</h3>
    <form id="updateForm">
      <input type="number" id="updateId" placeholder="ID do livro" required />
      <input type="text" id="updateTitle" placeholder="Novo título" />
      <input type="text" id="updateAuthor" placeholder="Novo autor" />
      <input type="number" id="updateYear" placeholder="Novo ano" />
      <button type="submit">Atualizar</button>
    </form>
  `;
  document.getElementById('updateForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = Number(document.getElementById('updateId').value);
    const updates = {};
    const title = document.getElementById('updateTitle').value;
    const author = document.getElementById('updateAuthor').value;
    const year = document.getElementById('updateYear').value;
    if(title) updates.title = title;
    if(author) updates.author = author;
    if(year) updates.year = Number(year);
    books = Livraria.updateBook(books, id, updates); // Atualiza dados
    Livraria.saveBooks(books);
    forms.innerHTML = '';
    output.textContent = 'Livro atualizado!';
  });
}

// --- Formulário de remover livro ---
function showDeleteForm() {
  forms.innerHTML = `
    <h3>Remover Livro</h3>
    <form id="deleteForm">
      <input type="number" id="deleteId" placeholder="ID do livro" required />
      <button type="submit">Remover</button>
    </form>
  `;
  document.getElementById('deleteForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = Number(document.getElementById('deleteId').value);
    books = Livraria.deleteBook(books, id); // Remove
    Livraria.saveBooks(books);
    forms.innerHTML = '';
    output.textContent = 'Livro removido!';
  });
}

// --- Formulário para listar livros por autor ---
function showListByAuthorForm() {
  forms.innerHTML = `
    <h3>Listar livros por autor</h3>
    <form id="authorForm">
      <input type="text" id="authorName" placeholder="Nome do autor" required />
      <button type="submit">Listar</button>
    </form>
  `;
  document.getElementById('authorForm').addEventListener('submit', e => {
    e.preventDefault();
    const author = document.getElementById('authorName').value;
    const filtered = Livraria.listBooksByAuthor(books, author);
    forms.innerHTML = '';
    // Mostra livros ou mensagem caso não encontre
    output.textContent = filtered.length === 0 ? 'Nenhum livro encontrado.' : Livraria.listBooks(filtered);
  });
}

// ===== Gráfico de livros por autor =====
function showAuthorChart() {
  // Cria um canvas para o gráfico
  forms.innerHTML = `<canvas id="authorChart"></canvas>`;
  output.textContent = '';

  // Conta livros agrupados por autor
  const counts = Livraria.countBooksByAuthor(books);

  // Ordena do menor para o maior
  const sorted = Object.entries(counts).sort((a,b) => a[1]-b[1]);

  // Extrai rótulos (autores) e valores (quantidade)
  const labels = sorted.map(([autor]) => autor);
  const data = sorted.map(([_, qtd]) => qtd);

  // Gera cores aleatórias para as barras
  const colors = labels.map(() => `hsl(${Math.random()*360}, 70%, 60%)`);

  // Cria o gráfico de barras horizontais usando Chart.js
  const ctx = document.getElementById('authorChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{ label: 'Livros', data, backgroundColor: colors }]
    },
    options: {
      indexAxis: 'y', // Barras horizontais
      plugins: { legend: { display: false } }, // Remove legenda
      scales: { x: { beginAtZero: true }, y: { ticks: { autoSkip: false } } }
    }
  });
}

// ===== Actions =====
// Dicionário que associa cada ação a uma função
const actions = {
  init: () => {
    books = Livraria.resetBooks();
    output.textContent = "📚 Livraria iniciada com lista de livros padrão!";
    forms.innerHTML = "";
  },
  list: () => { forms.innerHTML = ''; output.textContent = Livraria.listBooks(books); },
  add: () => showAddForm(),
  update: () => showUpdateForm(),
  delete: () => showDeleteForm(),
  clear: () => { forms.innerHTML = ''; Livraria.clearBooks(); books=[]; output.textContent='Livraria esvaziada.'; },
  listByAuthor: () => showListByAuthorForm(),
  countByAuthor: () => showAuthorChart(),
  exit: () => { forms.innerHTML = ''; output.textContent='Bye, bye! :)'; }
};

// ===== Event listener =====
// Captura cliques nos botões do menu e chama a ação correspondente
buttons.addEventListener('click', e => {
  if(e.target.tagName === 'BUTTON') {
    const action = e.target.dataset.action; // Lê o "data-action" do botão
    if(action && actions[action]) actions[action](); // Executa a função correspondente
  }
});
