document.addEventListener('DOMContentLoaded', () => {
    loadDishes().then((dishesList) => {
        loadOrders().then((ordersList) => {
            const ordersTable = document.querySelector('#orders tbody');
            fillTable(ordersTable, dishesList, ordersList);
        });
    });
})

function loadDishes() {
    return fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function loadOrders() {
    return fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=b82a7396-638e-4eef-82fc-1f759b30701b', {
            method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            return data;
        });
}

function fillTable(table, dishes, orders) {
    for (let i = 1; i <= orders.length; i++) {
        pushToTable(table, i, orders[i - 1], dishes);
    }
}

function pushToTable(table, number, order, dishes) {
    const selectedDishes = [
        order['soup_id'],
        order['main_course_id'],
        order['salad_id'],
        order['drink_id'],
        order['dessert_id']
    ];
    let selectedDishesNames = '';
    let totalPrice = 0;

    dishes.forEach((dish) => {
        if (selectedDishes.includes(dish['id'])) {
            selectedDishesNames += selectedDishesNames.length === 0 ? dish['name'] : ', ' + dish['name'];
            totalPrice += dish['price'];
        }
    })

    let newRow = table.insertRow();

    let numCell = newRow.insertCell();
    let numText = document.createTextNode(number);
    numCell.appendChild(numText);

    const date = order['created_at'].split('T')[0].split('-');
    const time = order['created_at'].split('T')[1].substring(0, 5);
    const dtime = order['delivery_time'] !== null ? order['delivery_time'].substring(0, 5) : 'Как можно скорее (с 07:00 до 23:00)'

    let dateCell = newRow.insertCell();
    let dateText = document.createTextNode(`${date[2]}.${date[1]}.${date[0]} ${time}`);
    dateCell.appendChild(dateText);

    let dishesCell = newRow.insertCell();
    let dishesText = document.createTextNode(selectedDishesNames);
    dishesCell.appendChild(dishesText);

    let priceCell = newRow.insertCell();
    let priceText = document.createTextNode(totalPrice + '₽');
    priceCell.appendChild(priceText);

    let timeCell = newRow.insertCell();
    let timeText = document.createTextNode(dtime);
    timeCell.appendChild(timeText);

    let actionsCell = newRow.insertCell();
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const readButton = document.createElement('button');
    const readModal = new Modal('readModal', readButton, dishes, order);
    const readImg = document.createElement('img');
    readImg.src = 'icons/read.svg';
    readButton.appendChild(readImg);

    const editButton = document.createElement('button');
    const editModal = new Modal('editModal', editButton, dishes, order);
    const editImg = document.createElement('img');
    editImg.src = 'icons/edit.svg';
    editButton.appendChild(editImg);

    const deleteButton = document.createElement('button');
    const deleteModal = new Modal('deleteModal', deleteButton, dishes, order);
    const deleteImg = document.createElement('img');
    deleteImg.src = 'icons/delete.svg';
    deleteButton.appendChild(deleteImg);

    actionsDiv.appendChild(readButton);
    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    actionsCell.appendChild(actionsDiv);
}

function readOrder(dishes, order) {
    const selectedDishes = [
        order['soup_id'],
        order['main_course_id'],
        order['salad_id'],
        order['drink_id'],
        order['dessert_id']
    ];
    let totalPrice = 0;
    let selectedDishesNames = {
        'soup': '',
        'soup-price': '',
        'soup-display': 'none',
        'main-course': '',
        'main-price': '',
        'main-display': 'none',
        'salad': '',
        'salad-price': '',
        'salad-display': 'none',
        'drink': '',
        'drink-price': '',
        'drink-display': 'none',
        'dessert': '',
        'dessert-price': '',
        'dessert-display': 'none'
    }

    dishes.forEach((dish) => {
        if (dish['id'] === order['soup_id']) {
            selectedDishesNames['soup'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['soup-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['soup-display'] = 'block';
        } else if (dish['id'] === order['main_course_id']) {
            selectedDishesNames['main-course'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['main-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['main-display'] = 'block';
        } else if (dish['id'] === order['salad_id']) {
            selectedDishesNames['salad'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['salad-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['salad-display'] = 'block';
        } else if (dish['id'] === order['drink_id']) {
            selectedDishesNames['drink'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['drink-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['drink-display'] = 'block';
        } else if (dish['id'] === order['dessert_id']) {
            selectedDishesNames['dessert'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['dessert-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['dessert-display'] = 'block';
        }
    })

    const date = order['created_at'].split('T')[0].split('-');
    const time = order['created_at'].split('T')[1].substring(0, 5);
    const dtime = order['delivery_time'] !== null ? order['delivery_time'].substring(0, 5) : 'Как можно скорее (с 07:00 до 23:00)'
    document.querySelector('#readModal .modal-body').innerHTML = `
        <div>
            <p>Дата оформления</p>
            <p>${date[2]}.${date[1]}.${date[0]} ${time}</p>
        </div>
        <h3>Доставка</h3>
        <div>
            <p>Имя получателя</p>
            <p>${order['full_name']}</p>
        </div>
        <div>
            <p>Адрес доставки</p>
            <p>${order['delivery_address']}</p>
        </div>
        <div>
            <p>Время доставки</p>
            <p>${dtime}</p>
        </div>
        <div>
            <p>Телефон</p>
            <p>${order['phone']}</p>
        </div>
        <div>
            <p>Email</p>
            <p>${order['email']}</p>
        </div>
        <h3>Комментарий</h3>
        <p>${order['comment'] !== null ? order['comment'] : '-'}</p>
        <h3>Состав заказа</h3>
        <div>
            <p id="selectedSoup">Суп</p>
            <p>${selectedDishesNames['soup']} ${selectedDishesNames['soup-price']}</p>
        </div>
        <div>
            <p id="selectedMain">Основное блюдо</p>
            <p>${selectedDishesNames['main-course']} ${selectedDishesNames['main-price']}</p>
        </div>
        <div>
            <p id="selectedSalad">Салат</p>
            <p>${selectedDishesNames['salad']} ${selectedDishesNames['salad-price']}</p>
        </div>
        <div>
            <p id="selectedDrink">Напиток</p>
            <p>${selectedDishesNames['drink']} ${selectedDishesNames['drink-price']}</p>
        </div>
        <div>
            <p id="selectedDessert">Десерт</p>
            <p>${selectedDishesNames['dessert']} ${selectedDishesNames['dessert-price']}</p>
        </div>
        <h3>Стоимость: ${totalPrice}₽</h3>
    `

    const selectedSoupLabel = document.getElementById('selectedSoup');
    selectedSoupLabel.style.display = selectedDishesNames['soup-display'];
    const selectedMainLabel = document.getElementById('selectedMain');
    selectedMainLabel.style.display = selectedDishesNames['main-display'];
    const selectedSaladLabel = document.getElementById('selectedSalad');
    selectedSaladLabel.style.display = selectedDishesNames['salad-display'];
    const selectedDrinkLabel = document.getElementById('selectedDrink');
    selectedDrinkLabel.style.display = selectedDishesNames['drink-display'];
    const selectedDessertLabel = document.getElementById('selectedDessert');
    selectedDessertLabel.style.display = selectedDishesNames['dessert-display'];
}

function editOrder(dishes, order) {
    const selectedDishes = [
        order['soup_id'],
        order['main_course_id'],
        order['salad_id'],
        order['drink_id'],
        order['dessert_id']
    ];
    let totalPrice = 0;
    let selectedDishesNames = {
        'soup': '',
        'soup-price': '',
        'soup-display': 'none',
        'main-course': '',
        'main-price': '',
        'main-display': 'none',
        'salad': '',
        'salad-price': '',
        'salad-display': 'none',
        'drink': '',
        'drink-price': '',
        'drink-display': 'none',
        'dessert': '',
        'dessert-price': '',
        'dessert-display': 'none'
    }

    dishes.forEach((dish) => {
        if (dish['id'] === order['soup_id']) {
            selectedDishesNames['soup'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['soup-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['soup-display'] = 'block';
        } else if (dish['id'] === order['main_course_id']) {
            selectedDishesNames['main-course'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['main-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['main-display'] = 'block';
        } else if (dish['id'] === order['salad_id']) {
            selectedDishesNames['salad'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['salad-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['salad-display'] = 'block';
        } else if (dish['id'] === order['drink_id']) {
            selectedDishesNames['drink'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['drink-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['drink-display'] = 'block';
        } else if (dish['id'] === order['dessert_id']) {
            selectedDishesNames['dessert'] = dish['name'];
            totalPrice += dish['price'];
            selectedDishesNames['dessert-price'] = `(${dish['price']}₽)`;
            selectedDishesNames['dessert-display'] = 'block';
        }
    })

    const date = order['created_at'].split('T')[0].split('-');
    const time = order['created_at'].split('T')[1].substring(0, 5);
    const dtime = order['delivery_time'] !== null ? order['delivery_time'].substring(0, 5) : 'Как можно скорее (с 07:00 до 23:00)'
    document.querySelector('#editModal .modal-body').innerHTML = `
        <form class="order_form">
            <div>
                <p>Дата оформления</p>
                <p>${date[2]}.${date[1]}.${date[0]} ${time}</p>
            </div>
            <h3>Доставка</h3>
            <div>
                <label for="full_name">Имя получателя</label>
                <input type="text" id="full_name" name="full_name" value="${order['full_name']}" required>
            </div>
            <div>
                <label for="address">Адрес доставки</label>
                <input type="text" id="address" name="address" value="${order['delivery_address']}" required>
            </div>
            <div>
                <p>Тип доставки</p>
                <div id="type-label">
                    <label><input type="radio" value="asap" name="time-type" required> Как можно скорее</label>
                    <label><input type="radio" value="specific" name="time-type" required> К указанному времени</label>
                </div>
            </div>
            <div>
                <label for="delivery-time">Время доставки</label>
                <input type="time" id="delivery-time" name="time" min="07:00" max="23:00" step="300" value="${dtime}">
            </div>
            <div>
                <label for="phone">Номер телефона</label>
                <input type="tel" id="phone" name="phone" value="${order['phone']}" required>
            </div>
            <div>
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${order['email']}" required>
            </div>
            <h3>Комментарий</h3>
            <textarea id="comment" rows="2">${order['comment'] !== null ? order['comment'] : ''}</textarea>
            <h3>Состав заказа</h3>
            <div>
                <p id="selectedSoup">Суп</p>
                <p>${selectedDishesNames['soup']} ${selectedDishesNames['soup-price']}</p>
            </div>
            <div>
                <p id="selectedMain">Основное блюдо</p>
                <p>${selectedDishesNames['main-course']} ${selectedDishesNames['main-price']}</p>
            </div>
            <div>
                <p id="selectedSalad">Салат</p>
                <p>${selectedDishesNames['salad']} ${selectedDishesNames['salad-price']}</p>
            </div>
            <div>
                <p id="selectedDrink">Напиток</p>
                <p>${selectedDishesNames['drink']} ${selectedDishesNames['drink-price']}</p>
            </div>
            <div>
                <p id="selectedDessert">Десерт</p>
                <p>${selectedDishesNames['dessert']} ${selectedDishesNames['dessert-price']}</p>
            </div>
            <h3>Стоимость: ${totalPrice}₽</h3>
        </form>
    `

    const radios = document.querySelectorAll('#type-label input');
    if (order['delivery_type'] === 'now') {
        radios[0].checked = true;
    } else {
        radios[1].checked = true;
    }

    const selectedSoupLabel = document.getElementById('selectedSoup');
    selectedSoupLabel.style.display = selectedDishesNames['soup-display'];
    const selectedMainLabel = document.getElementById('selectedMain');
    selectedMainLabel.style.display = selectedDishesNames['main-display'];
    const selectedSaladLabel = document.getElementById('selectedSalad');
    selectedSaladLabel.style.display = selectedDishesNames['salad-display'];
    const selectedDrinkLabel = document.getElementById('selectedDrink');
    selectedDrinkLabel.style.display = selectedDishesNames['drink-display'];
    const selectedDessertLabel = document.getElementById('selectedDessert');
    selectedDessertLabel.style.display = selectedDishesNames['dessert-display'];

    document.getElementById('saveButton').addEventListener('click', () => {
        let delivery_type = 'by_time';
        if (document.querySelectorAll('input[name="time-type"]:checked')[0].value === 'asap') {
            delivery_type = 'now';
        }

        const delivery_time = document.getElementById('delivery-time').value;

        const localStorageIds = {
            'soup_id': window.localStorage.getItem('selected_soup'),
            'main_course_id': window.localStorage.getItem('selected_main-course'),
            'salad_id': window.localStorage.getItem('selected_salad'),
            'drink_id': window.localStorage.getItem('selected_drink'),
            'dessert_id': window.localStorage.getItem('selected_dessert')
        }

        const form = document.querySelector('.order_form');
        const formData = new FormData(form);
        formData.append('delivery_address', document.getElementById('address').value);
        formData.append('delivery_type', delivery_type);
        if (delivery_time !== '') {formData.append('delivery_time', delivery_time);}
        if (localStorageIds['soup_id'] !== null) {formData.append('soup_id', localStorageIds['soup_id']);}
        if (localStorageIds['main_course_id'] !== null) {formData.append('main_course_id', localStorageIds['main_course_id']);}
        if (localStorageIds['salad_id'] !== null) {formData.append('salad_id', localStorageIds['salad_id']);}
        if (localStorageIds['drink_id'] !== null) {formData.append('drink_id', localStorageIds['drink_id']);}
        if (localStorageIds['dessert_id'] !== null) {formData.append('dessert_id', localStorageIds['dessert_id']);}

        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1] + ', ' + typeof pair[1]);
        }

        fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${order['id']}?api_key=b82a7396-638e-4eef-82fc-1f759b30701b`, {
            method: 'PUT',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data['error']) {
                    alert(data['error']);
                } else {
                    location.reload();
                }
            })
            .catch((error) => {
                alert(error);
            })
    })
}

function deleteOrder(order) {
    fetch(`https://edu.std-900.ist.mospolytech.ru/labs/api/orders/${order['id']}?api_key=b82a7396-638e-4eef-82fc-1f759b30701b`, {
        method: 'DELETE'
    })
        .then(response => response.json()).then((data) => {
            if (data['error']) {
                alert(data['error']);
            } else {
                location.reload();
            }
        })
        .catch((error) => {
            alert(error);
        })
}

class Modal {
    constructor(modalId, openButton, dishes, order) {
        this.modal = document.getElementById(modalId);
        this.body = document.querySelector(`#${modalId} .modal-body`);
        this.buttons = document.querySelector(`#${modalId} .modal-buttons`);
        this.openButton = openButton;
        this.closeButton = this.modal.querySelector('.close');

        if (this.buttons.querySelector('.cancel')) {
            this.buttons.querySelector('.cancel').addEventListener('click', () => this.close());
        }

        this.openButton.addEventListener('click', () => this.open(dishes, order));
        this.closeButton.addEventListener('click', () => this.close());

        document.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });
    }

    open(dishes, order) {
        this.modal.style.display = 'block';

        if (this.buttons.querySelector('#deleteButton')) {
            document.getElementById('deleteButton').addEventListener('click', () => deleteOrder(order));
        } else if (this.buttons.querySelector('#saveButton')) {
            editOrder(dishes, order);
        } else {
            readOrder(dishes, order);
        }
    }

    close() {
        this.modal.style.display = 'none';
    }
}
