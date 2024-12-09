document.addEventListener('DOMContentLoaded', () => {
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд
            const sortedDishes = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд
            const selectedDishesSection = document.querySelectorAll('#selected_dishes .dish_block')[0];

            function createCard(dish) {
                const card = document.createElement('div');
                card.classList.add('dish');
                card.dataset.kind = dish['kind'];

                const img = document.createElement('img');
                img.src = dish['image'];
                img.alt = dish['name'];

                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = dish['price'] + '₽';

                const dishName = document.createElement('p');
                dishName.classList.add('dish_name');
                dishName.textContent = dish['name'];

                const volume = document.createElement('p');
                volume.classList.add('volume');
                volume.textContent = dish['count'];

                const buttonDiv = document.createElement('div');
                const button = document.createElement('button');
                button.textContent = 'Удалить';
                buttonDiv.appendChild(button);

                card.appendChild(img);
                card.appendChild(price);
                card.appendChild(dishName);
                card.appendChild(volume);
                card.appendChild(buttonDiv);

                // Функционал кнопки
                button.addEventListener('click', () => {
                    removeFromOrder(dish, card);
                });

                return card;
            }

            function populateCards(sectionElement) {
                const localStorageIds = [
                    window.localStorage.getItem('selected_soup'),
                    window.localStorage.getItem('selected_main-course'),
                    window.localStorage.getItem('selected_salad'),
                    window.localStorage.getItem('selected_drink'),
                    window.localStorage.getItem('selected_dessert'),
                ]

                sortedDishes.forEach( function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        const card = createCard(dish);
                        sectionElement.appendChild(card);
                    }
                });
            }

            populateCards(selectedDishesSection);

            // Добавление товаров в заказ и подсчет цены
            let totalPrice = 0;
            const totalPriceElement = document.getElementById('total_price');

            let selectedDishes = {
                'суп': null,
                'главное блюдо': null,
                'салат': null,
                'напиток': null,
                'десерт': null
            };

            const chosenSoup = document.getElementById('chosen_soup');
            const chosenMain = document.getElementById('chosen_main');
            const chosenDrink = document.getElementById('chosen_drink');
            const chosenSalad = document.getElementById('chosen_salad');
            const chosenDessert = document.getElementById('chosen_dessert');
            const soupLabel = document.getElementById('soup_label');
            const mainLabel = document.getElementById('main_label');
            const drinkLabel = document.getElementById('drink_label');
            const saladLabel = document.getElementById('salad_label');
            const dessertLabel = document.getElementById('dessert_label');
            const nothingSelectedMessages = document.querySelectorAll('.nothing_selected');

            // Изначально элементы скрыты
            soupLabel.style.display = 'none';
            chosenSoup.style.display = 'none';
            mainLabel.style.display = 'none';
            chosenMain.style.display = 'none';
            drinkLabel.style.display = 'none';
            chosenDrink.style.display = 'none';
            saladLabel.style.display = 'none';
            chosenSalad.style.display = 'none';
            dessertLabel.style.display = 'none';
            chosenDessert.style.display = 'none';
            totalPriceElement.style.display = 'none';

            function addToOrder(dish) {
                let isUpdated = false;

                if (dish['category'] === 'soup') {
                    updateCategory('суп', dish, chosenSoup, soupLabel);
                    isUpdated = true;
                    window.localStorage.setItem('selected_soup', dish['id']);
                } else if (dish['category'] === 'main-course') {
                    updateCategory('главное блюдо', dish, chosenMain, mainLabel);
                    isUpdated = true;
                    window.localStorage.setItem('selected_main-course', dish['id']);
                } else if (dish['category'] === 'salad') {
                    updateCategory('салат', dish, chosenSalad, saladLabel);
                    isUpdated = true;
                    window.localStorage.setItem('selected_salad', dish['id']);
                }
                else if (dish['category'] === 'drink') {
                    updateCategory('напиток', dish, chosenDrink, drinkLabel);
                    isUpdated = true;
                    window.localStorage.setItem('selected_drink', dish['id']);
                } else if (dish['category'] === 'dessert') {
                    updateCategory('десерт', dish, chosenDessert, dessertLabel);
                    isUpdated = true;
                    window.localStorage.setItem('selected_dessert', dish['id']);
                }

                if (isUpdated) {
                    nothingSelectedMessages[0].style.display = 'none';
                    nothingSelectedMessages[1].style.display = 'none';
                }

                totalPriceElement.textContent = `Стоимость заказа: ${totalPrice}₽`;
                totalPriceElement.style.display = 'block';

                showEmptyCategories();
            }

            function removeFromOrder(dish, card) {
                if (window.localStorage.getItem('selected_soup') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_soup');
                    totalPrice -= selectedDishes['суп']['price'];
                    selectedDishes['суп'] = null;
                } else if (window.localStorage.getItem('selected_main-course') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_main-course');
                    totalPrice -= selectedDishes['главное блюдо']['price'];
                    selectedDishes['главное блюдо'] = null;
                } else if (window.localStorage.getItem('selected_salad') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_salad');
                    totalPrice -= selectedDishes['салат']['price'];
                    selectedDishes['салат'] = null;
                } else if (window.localStorage.getItem('selected_drink') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_drink');
                    totalPrice -= selectedDishes['напиток']['price'];
                    selectedDishes['напиток'] = null;
                } else if (window.localStorage.getItem('selected_dessert') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_dessert');
                    totalPrice -= selectedDishes['десерт']['price'];
                    selectedDishes['десерт'] = null;
                }

                card.parentNode.removeChild(card);
                showEmptyCategories();

                const cards = document.querySelectorAll('.dish');
                if (cards.length === 0) {
                    soupLabel.style.display = 'none';
                    chosenSoup.style.display = 'none';
                    mainLabel.style.display = 'none';
                    chosenMain.style.display = 'none';
                    drinkLabel.style.display = 'none';
                    chosenDrink.style.display = 'none';
                    saladLabel.style.display = 'none';
                    chosenSalad.style.display = 'none';
                    dessertLabel.style.display = 'none';
                    chosenDessert.style.display = 'none';
                    totalPriceElement.style.display = 'none';

                    nothingSelectedMessages[0].style.display = '';
                    nothingSelectedMessages[1].style.display = '';
                }
            }

            function fromLocalStorage() {
                const localStorageIds = [
                    window.localStorage.getItem('selected_soup'),
                    window.localStorage.getItem('selected_main-course'),
                    window.localStorage.getItem('selected_salad'),
                    window.localStorage.getItem('selected_drink'),
                    window.localStorage.getItem('selected_dessert'),
                ]
                data.forEach( function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        addToOrder(dish);
                    }
                })
            }

            fromLocalStorage();

            function updateCategory(category, dish, chosenElement, labelElement) {
                    // Если блюдо из этой категории уже выбрано, вычитаем его цену
                    if (selectedDishes[category] !== null) {
                        totalPrice -= selectedDishes[category]['price'];
                    }

                    // Обновляем выбранное блюдо
                    selectedDishes[category] = dish;
                    chosenElement.textContent = `${dish['name']} ${dish['price']}₽`;
                    chosenElement.style.display = 'block';
                    labelElement.style.display = 'block';

                    // Добавляем цену выбранного блюда
                    totalPrice += dish['price'];
            }

            // Показываем пустые категории
            function showEmptyCategories() {
                if (selectedDishes['суп'] === null) {
                    chosenSoup.textContent = 'Блюдо не выбрано';
                    soupLabel.style.display = 'block';
                    chosenSoup.style.display = 'block';
                }
                if (selectedDishes['главное блюдо'] === null) {
                    chosenMain.textContent = 'Блюдо не выбрано';
                    mainLabel.style.display = 'block';
                    chosenMain.style.display = 'block';
                }
                if (selectedDishes['напиток'] === null) {
                    chosenDrink.textContent = 'Блюдо не выбрано';
                    drinkLabel.style.display = 'block';
                    chosenDrink.style.display = 'block';
                }
                if (selectedDishes['салат'] === null) {
                    chosenSalad.textContent = 'Блюдо не выбрано';
                    saladLabel.style.display = 'block';
                    chosenSalad.style.display = 'block';
                }
                if (selectedDishes['десерт'] === null) {
                    chosenDessert.textContent = 'Блюдо не выбрано';
                    dessertLabel.style.display = 'block';
                    chosenDessert.style.display = 'block';
                }
            }

            const combos = [
                { name: 'Ланч 1', items: ['суп', 'главное блюдо', 'салат', 'напиток'] },
                { name: 'Ланч 2', items: ['суп', 'главное блюдо', 'напиток'] },
                { name: 'Ланч 3', items: ['суп', 'салат', 'напиток'] },
                { name: 'Ланч 4', items: ['главное блюдо', 'салат', 'напиток'] },
                { name: 'Ланч 5', items: ['главное блюдо', 'напиток'] },
            ];

            function validateOrder(selectedItems) {
                let dishes = Object.keys(selectedItems).filter(key => key !== 'десерт' && selectedItems[key] !== null);
                let text = '';

                if (dishes.length === 0 && selectedItems['десерт'] === null) {
                    text = 'Ничего не выбрано. Выберите блюда для заказа'
                } else if (!(dishes.includes('напиток')) && dishes.length > 0) {
                    text = 'Выберите напиток';
                } else if ((dishes.includes('напиток') || !(selectedItems['десерт'] === null))) {
                    text = 'Выберите главное блюдо';
                }

                if (dishes.includes('суп') && !dishes.includes('главное блюдо') && !dishes.includes('салат')) {
                    text = 'Выберите главное блюдо или салат';
                } else if (dishes.includes('салат') && (!dishes.includes('главное блюдо') || !dishes.includes('суп'))) {
                    text = 'Выберите суп или главное блюдо';
                }

                let result;
                combos.forEach( function (combo) {
                    if (JSON.stringify(dishes) === JSON.stringify(combo.items)) {
                        result = {valid: true, message: 'Все блюда успешно выбраны'};
                    }
                });
                if (result) {
                    return result;
                }
                return {valid: false, message: text};
            }

            document.querySelector('form').addEventListener('submit', function (event) {
                const result = validateOrder(selectedDishes);
                event.preventDefault();
                if (!result.valid) {
                    displayNotification(result.message);
                } else {
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

                    const form = document.querySelector('#order_form .order_form');
                    const formData = new FormData(form);
                    formData.append('delivery_address', document.getElementById('address').value);
                    formData.append('delivery_type', delivery_type);
                    formData.append('delivery_time', delivery_time !== '' ? delivery_time : '12:00:00');
                    if (localStorageIds['soup_id'] !== null) {formData.append('soup_id', localStorageIds['soup_id']);}
                    if (localStorageIds['main_course_id'] !== null) {formData.append('main_course_id', localStorageIds['main_course_id']);}
                    if (localStorageIds['salad_id'] !== null) {formData.append('salad_id', localStorageIds['salad_id']);}
                    if (localStorageIds['drink_id'] !== null) {formData.append('drink_id', localStorageIds['drink_id']);}
                    if (localStorageIds['dessert_id'] !== null) {formData.append('dessert_id', localStorageIds['dessert_id']);}

                    for (let pair of formData.entries()) {
                        console.log(pair[0]+ ', ' + pair[1] + ', ' + typeof pair[1]);
                    }

                    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=b82a7396-638e-4eef-82fc-1f759b30701b', {
                        method: 'POST',
                        body: formData,
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data['error']) {
                                displayNotification(data['error']);
                            } else {
                                window.localStorage.removeItem('selected_soup');
                                window.localStorage.removeItem('selected_main-course');
                                window.localStorage.removeItem('selected_salad');
                                window.localStorage.removeItem('selected_drink');
                                window.localStorage.removeItem('selected_dessert');
                                displayNotification('Заказ оформлен!');
                                setTimeout(() => {location.reload();}, 3000);
                            }
                        })
                        .catch((error) => {
                            displayNotification(error);
                        })
                }
            });

            document.querySelector('form').addEventListener('reset', function () {
                soupLabel.style.display = 'none';
                chosenSoup.style.display = 'none';
                mainLabel.style.display = 'none';
                chosenMain.style.display = 'none';
                drinkLabel.style.display = 'none';
                chosenDrink.style.display = 'none';
                saladLabel.style.display = 'none';
                chosenSalad.style.display = 'none';
                dessertLabel.style.display = 'none';
                chosenDessert.style.display = 'none';
                totalPriceElement.style.display = 'none';

                nothingSelectedMessages[0].style.display = '';
                nothingSelectedMessages[1].style.display = '';

                selectedDishes = {
                    'суп': null,
                    'главное блюдо': null,
                    'салат': null,
                    'напиток': null,
                    'десерт': null
                };

                window.localStorage.removeItem('selected_soup');
                window.localStorage.removeItem('selected_main-course');
                window.localStorage.removeItem('selected_salad');
                window.localStorage.removeItem('selected_drink');
                window.localStorage.removeItem('selected_dessert');

                totalPrice = 0;

                const cards = document.querySelectorAll('.dish');
                cards.forEach(function (card) {
                    card.parentNode.removeChild(card);
                });
            });

            function displayNotification(message) {
                const notification = document.getElementById('notification');
                notification.style.opacity = '1';

                const notificationMessage = document.createElement('p');
                notificationMessage.textContent = message
                notification.appendChild(notificationMessage);

                const notificationButton = document.createElement('button');
                notificationButton.innerHTML = 'Окей <span>&#128076;</span>';
                notificationButton.addEventListener('click', function () {
                    const notification = document.getElementById('notification');
                    notification.innerHTML = '';
                    notification.style.opacity = '0';
                })
                notification.appendChild(notificationButton);
            }
        });
});