const productMainCategories = {
    "home & kitchen": "Дом & Кухня",
    "tv, audio & cameras": "ТВ, аудио & камеры",
    "sports & fitness": "Спорт & фитнес",
    "beauty & health": "Красота & здоровье"
}


document.addEventListener('DOMContentLoaded', async () => {
    let products = await fetch("http://api.std-900.ist.mospolytech.ru/exam-2024-1/api/goods?api_key=e8edbd36-da5f-4862-bda5-06eeb0c60a19");
    products = await products.json();
    
    populateCards(products);
});

function populateCards(products) {
    const container = document.getElementById("productsContainer");
    products.forEach((product) => {
        const card = createCard(product);
        container.appendChild(card);
    });    
}

function createCard(product) {

    const card = document.createElement("div");
    card.classList.add("card");
    

    const img = document.createElement("img");
    img.src = product.image_url;
    const handleCardClick = () => goToProduct(product);
    img.addEventListener(`click`, handleCardClick);
    card.appendChild(img);

    const infoDiv = document.createElement("div");
    card.appendChild(infoDiv);
    
    const price = document.createElement("p");
    price.textContent = `${product.actual_price} ₽`;
    infoDiv.appendChild(price);

    const productType = document.createElement("p");
    productType.textContent = productMainCategories[product.category];
    infoDiv.appendChild(productType);

    const title = document.createElement("h2");
    title.textContent = product.name;
    infoDiv.appendChild(title);

    const button = document.createElement("button");
    const handleProductClick = () => addToCart(product);
    button.addEventListener(`click`, handleProductClick);
    button.textContent = "Добавить";
    infoDiv.appendChild(button);
    
    return card;
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (!cart.includes(product.id)) {
        cart.push(product.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`Продукт "${product.name}" добавлен в корзину.`);
    }
}
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function goToProduct(product) {
    location.assign(`product.html?id=${product.id}`);
}