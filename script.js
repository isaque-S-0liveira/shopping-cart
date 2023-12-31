// Esse tipo de comentário que estão antes de todas as funções são chamados de JSdoc,
// experimente passar o mouse sobre o nome das funções e verá que elas possuem descrições!! 
// Fique a vontade para modificar o código já escrito e criar suas próprias funções!
/**
 * Função responsável por criar e retornar o elemento de imagem do produto.
 * @param {string} imageSource - URL da imagem.
 * @returns {Element} Elemento de imagem do produto.
 */
const createProductImageElement = (imageSource) => {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
};

/**
 * Função responsável por criar e retornar qualquer elemento.
 * @param {string} element - Nome do elemento a ser criado.
 * @param {string} className - Classe do elemento.
 * @param {string} innerText - Texto do elemento.
 * @returns {Element} Elemento criado.
 */
const createCustomElement = (element, className, innerText) => {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
};

/**
 * Função responsável por criar e retornar o elemento do produto.
 * @param {Object} product - Objeto do produto. 
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.thumbnail - URL da imagem do produto.
 * @returns {Element} Elemento de produto.
 */

const cartItens = () => document.querySelector('.cart__items');

const createProductItemElement = ({ id, title, thumbnail }) => {
  const section = document.createElement('section');
  section.className = 'item';
   section.appendChild(createCustomElement('span', 'item_id', id));
   section.appendChild(createCustomElement('span', 'item__title', title));
   section.appendChild(createProductImageElement(thumbnail));
   section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
};
/**
 * Função que recupera o ID do produto passado como parâmetro.
 * @param {Element} product - Elemento do produto.
 * @returns {string} ID do produto.
 */
// const getIdFromProductItem = (product) => product.querySelector('span.id').innerText;
/**
 * Função responsável por criar e retornar um item do carrinho.
 * @param {Object} product - Objeto do produto.
 * @param {string} product.id - ID do produto.
 * @param {string} product.title - Título do produto.
 * @param {string} product.price - Preço do produto.
 * @returns {Element} Elemento de um item do carrinho.
 */

const saveItens = () => {
  const lista = document.querySelectorAll('li');
  // peguei a ideia de armazenar  os itens em um array do Leonardo Marcatti
  const armazenador = [];
  lista.forEach((li) => {
    armazenador.push(li.innerHTML);
  });
   const armazenadorStg = JSON.stringify(armazenador);
   saveCartItems(armazenadorStg);
};

const sumItens = () => {
  const li = document.querySelectorAll('li');
  const sum = [];
   li.forEach((lis) => {
   const price = Number(lis.innerHTML.split('|')[2].split('$')[1]);
   sum.push(price);
  });
  const resultSum = sum.reduce((acc, curr) => acc + curr);
  return resultSum;
 };

const cartItemClickListener = (event) => {
  const p = document.querySelector('.total-price');
  const price = Number(event.target.innerHTML.split('|')[2].split('$')[1]);
   p.innerHTML = sumItens() - price;
  event.target.remove();
};

 const createCartItemElement = ({ id, title, price }) => {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `ID: ${id} | TITLE: ${title} | PRICE: $${price}`;
   li.addEventListener('click', cartItemClickListener);
  return li;
};

const adcSumHtml = () => {
  const p = document.querySelector('.total-price');
  p.innerHTML = sumItens();
 };

const geraItens = async (event) => {
  const olItens = cartItens();
  const prId = event.target.parentNode.firstChild;
  const item = await fetchItem(prId.innerText);
  olItens.appendChild(createCartItemElement(item));
  saveItens();
  adcSumHtml();
  adcSumHtml();
 };

const adcItens = () => {
  const buttonAdd = document.querySelectorAll('.item__add');
 buttonAdd.forEach((bt) => {
   bt.addEventListener('click', geraItens);
 });
 };

 const buscaItens = () => {
  const itensSalvos = localStorage.getItem('cartItems');
  const itensSalvosArr = (!itensSalvos) ? [] : JSON.parse(itensSalvos);
  const ol = cartItens();
  itensSalvosArr.forEach((lis) => {
    const li = document.createElement('li');
    li.addEventListener('click', cartItemClickListener);
    li.className = 'cart__item';
    li.innerHTML = lis;
    ol.appendChild(li);
  });
  // getSavedCartItems()
};

const limpaCarrinho = () => {
  const clearButton = document.querySelector('.empty-cart');
  const ol = cartItens();
  clearButton.className = 'empty-cart';
  clearButton.addEventListener('click', () => {
    localStorage.clear();
    ol.innerHTML = '';
  });
  };

const geraProdutos = async () => {
  const json = await fetchProducts('computador');
  const items = document.querySelector('.items');
  json.results.forEach((pr) => { 
    items.appendChild(createProductItemElement(pr));
  });
  adcItens();
  limpaCarrinho();
};

window.onload = () => {
  geraProdutos();
  buscaItens();
};
