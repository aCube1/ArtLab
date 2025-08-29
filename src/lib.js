// Chave usada no localStorage para salvar os livros
const STORAGE_KEY = "livraria::books"

// ========================
// Persistência (salvar, carregar, limpar os dados)
// ========================

// Carrega a lista de livros do localStorage
// Se não existir nada salvo, retorna um array vazio
const loadBooks = () => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

// Salva a lista de livros no localStorage (convertendo para texto JSON)
const saveBooks = books =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books))

// Remove todos os livros do localStorage
const clearBooks = () => {
  localStorage.removeItem(STORAGE_KEY)
  console.log("Livraria limpa.")
}

// Restaura uma lista inicial de livros (pré-cadastrados)
// Útil para resetar o sistema com dados de exemplo
const resetBooks = () => {
const books = [
  { id: 1, title: "Dom Casmurro", author: "Machado de Assis", year: 1899 },
  { id: 2, title: "Capitães da Areia", author: "Jorge Amado", year: 1937 },
  { id: 3, title: "A Hora da Estrela", author: "Clarice Lispector", year: 1977 },
  { id: 4, title: "Grande Sertão: Veredas", author: "Guimarães Rosa", year: 1956 },
  { id: 5, title: "O Primo Basílio", author: "Eça de Queirós", year: 1878 },
  { id: 6, title: "Os Maias", author: "Eça de Queirós", year: 1888 },
  { id: 7, title: "Ensaio sobre a Cegueira", author: "José Saramago", year: 1995 },
  { id: 8, title: "Memorial do Convento", author: "José Saramago", year: 1982 },
  { id: 9, title: "O Cortiço", author: "Aluísio Azevedo", year: 1890 },
  { id: 10, title: "Iracema", author: "José de Alencar", year: 1865 },
  { id: 11, title: "Senhora", author: "José de Alencar", year: 1875 },
  { id: 12, title: "Triste Fim de Policarpo Quaresma", author: "Lima Barreto", year: 1915 },
  { id: 13, title: "Quincas Borba", author: "Machado de Assis", year: 1891 },
  { id: 14, title: "Memórias Póstumas de Brás Cubas", author: "Machado de Assis", year: 1881 },
  { id: 15, title: "Vidas Secas", author: "Graciliano Ramos", year: 1938 },
  { id: 16, title: "São Bernardo", author: "Graciliano Ramos", year: 1934 },
  { id: 17, title: "Angústia", author: "Graciliano Ramos", year: 1936 },
  { id: 18, title: "Mar Morto", author: "Jorge Amado", year: 1936 },
  { id: 19, title: "Dona Flor e Seus Dois Maridos", author: "Jorge Amado", year: 1966 },
  { id: 20, title: "Gabriela, Cravo e Canela", author: "Jorge Amado", year: 1958 },
  { id: 21, title: "Terra Sonâmbula", author: "Mia Couto", year: 1992 },
  { id: 22, title: "O Outro Pé da Sereia", author: "Mia Couto", year: 2006 },
  { id: 23, title: "O Ano da Morte de Ricardo Reis", author: "José Saramago", year: 1984 },
  { id: 24, title: "Levantado do Chão", author: "José Saramago", year: 1980 },
  { id: 25, title: "O Guarani", author: "José de Alencar", year: 1857 },
  { id: 26, title: "Macunaíma", author: "Mário de Andrade", year: 1928 },
  { id: 27, title: "Serafim Ponte Grande", author: "Oswald de Andrade", year: 1933 },
  { id: 28, title: "O Amanuense Belmiro", author: "Cyro dos Anjos", year: 1937 },
  { id: 29, title: "Inocência", author: "Visconde de Taunay", year: 1872 },
  { id: 30, title: "Fogo Morto", author: "José Lins do Rego", year: 1943 },
  { id: 31, title: "Tenda dos Milagres", author: "Jorge Amado", year: 1969 },
  { id: 32, title: "Tieta do Agreste", author: "Jorge Amado", year: 1977 },
  { id: 33, title: "Os Subterrâneos da Liberdade", author: "Jorge Amado", year: 1954 },
  { id: 34, title: "Bahia de Todos os Santos", author: "Jorge Amado", year: 1945 },
  { id: 35, title: "Jubiabá", author: "Jorge Amado", year: 1935 },
  { id: 36, title: "O País do Carnaval", author: "Jorge Amado", year: 1931 },
  { id: 37, title: "Os Pastores da Noite", author: "Jorge Amado", year: 1964 },
  { id: 38, title: "Helena", author: "Machado de Assis", year: 1876 },
  { id: 39, title: "Iaiá Garcia", author: "Machado de Assis", year: 1878 },
  { id: 40, title: "Esaú e Jacó", author: "Machado de Assis", year: 1904 },
  { id: 41, title: "Memorial de Aires", author: "Machado de Assis", year: 1908 },
  { id: 42, title: "Ressurreição", author: "Machado de Assis", year: 1872 },
  { id: 43, title: "História do Cerco de Lisboa", author: "José Saramago", year: 1989 },
  { id: 44, title: "Caim", author: "José Saramago", year: 2009 },
  { id: 45, title: "Todos os Nomes", author: "José Saramago", year: 1997 },
  { id: 46, title: "As Intermitências da Morte", author: "José Saramago", year: 2005 },
  { id: 47, title: "Ensaio sobre a Lucidez", author: "José Saramago", year: 2004 },
  { id: 48, title: "Perto do Coração Selvagem", author: "Clarice Lispector", year: 1943 },
  { id: 49, title: "Laços de Família", author: "Clarice Lispector", year: 1960 },
  { id: 50, title: "O Lustre", author: "Clarice Lispector", year: 1946 }
]


  saveBooks(books) // salva os livros no localStorage
  console.log("Livros iniciais salvos.")
  return books              // retorna os livros
}

// ========================
// CRUD funcional (Create, Read, Update, Delete)
// ========================

// Adiciona um novo livro (retorna um novo array)
const addBook = (books, newBook) => [...books, newBook]

// Atualiza um livro existente (caso encontre o id)
const updateBook = (books, id, updates) =>
  books.map(book => (book.id === id ? { ...book, ...updates } : book))

// Remove um livro pelo id
const deleteBook = (books, id) =>
  books.filter(book => book.id !== id)

// ========================
// Listagem e formatação
// ========================

// Lista os livros em formato de texto simples
const listBooks = books =>
  books.map(book => `${book.id} - "${book.title}" (${book.author}, ${book.year})`).join('\n')

// Lista apenas os livros de um autor específico
const listBooksByAuthor = (books, authorName) =>
  books.filter(book => book.author === authorName)

// Conta quantos livros cada autor possui
// Exemplo de retorno: { "Machado de Assis": 5, "Jorge Amado": 8 }
const countBooksByAuthor = (books) =>
  books.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1
    return acc
  }, {})

// Permite formatar a lista de livros de forma flexível
// Recebe uma função "formatFn" que define como cada livro deve aparecer
const formatBooks = (books, formatFn) =>
  books.map((book, index) => formatFn(book, index)).join('\n')

// Formatação curta: apenas o título com numeração
const shortFormat = (book, i) => `${i + 1}. ${book.title}`

// Formatação completa: id, título, autor e ano
const fullFormat = book =>
  `${book.id} - "${book.title}" (${book.author}, ${book.year})`

// ========================
// Transformações adicionais
// ========================

// Marca livros antigos com base em um ano de corte
// Adiciona a propriedade "old: true/false"
const markOldBooks = (books, cutoffYear) =>
  books.map(book => ({ ...book, old: book.year < cutoffYear }))

// Adiciona uma categoria com base no autor (função fornecida pelo usuário)
const addCategoryByAuthor = (books, classifyAuthorFn) =>
  books.map(book => ({ ...book, category: classifyAuthorFn(book.author) }))

// Aplica uma transformação nos títulos (ex: deixar tudo maiúsculo)
const updateTitles = (books, transformFn) =>
  books.map(book => ({ ...book, title: transformFn(book.title) }))

// Permite renomear os campos de cada livro (ex: trocar "title" por "nome")
const renameFields = (books, renamerFn) =>
  books.map(book => renamerFn(book))

// ========================
// Exporta todas as funções como um objeto Livraria
// Isso facilita o uso em outros arquivos (ex: ui.js)
// ========================
export const Livraria = {
  // Persistência
  loadBooks, saveBooks, resetBooks, clearBooks,

  // CRUD
  addBook, updateBook, deleteBook,

  // Exibição
  listBooks, listBooksByAuthor, countBooksByAuthor,
  formatBooks, shortFormat, fullFormat,

  // Transformações
  markOldBooks, addCategoryByAuthor, updateTitles, renameFields
}