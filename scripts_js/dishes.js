document.addEventListener('DOMContentLoaded', () => {
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд
            const sortedDishes = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд
            const soupSection = document.querySelectorAll('#soup .dish_block')[0];
            const mainDishSection = document.querySelectorAll('#main .dish_block')[0];
            const drinkSection = document.querySelectorAll('#drink .dish_block')[0];
            const saladSection = document.querySelectorAll('#salad .dish_block')[0];
            const dessertSection = document.querySelectorAll('#dessert .dish_block')[0];

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
                button.textContent = 'Добавить';
                buttonDiv.appendChild(button);

                card.appendChild(img);
                card.appendChild(price);
                card.appendChild(dishName);
                card.appendChild(volume);
                card.appendChild(buttonDiv);

                // Функционал кнопки
                button.addEventListener('click', () => {
                    addToOrder(dish);
                });

                return card;
            }

            function populateCards(sectionElement, category) {
                const categoryCompare = {
                    'soup': 'суп',
                    'main-course': 'главное блюдо',
                    'salad': 'салат',
                    'drink': 'напиток',
                    'dessert': 'десерт'
                }

                sortedDishes.forEach(dish => {
                    if (categoryCompare[dish['category']] === category) {
                        const card = createCard(dish);
                        sectionElement.appendChild(card);
                    }
                });
            }

            populateCards(soupSection, 'суп');
            populateCards(mainDishSection, 'главное блюдо');
            populateCards(saladSection, 'салат');
            populateCards(drinkSection, 'напиток');
            populateCards(dessertSection, 'десерт');

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
                    console.log(dishes, combo.items)
                    if (JSON.stringify(dishes) === JSON.stringify(combo.items)) {
                        result = {valid: true, message: 'Все блюда успешно выбраны'};
                    }
                });
                if (result) {
                    return result;
                }
                return {valid: false, message: text};
            }

            const order_info = document.getElementById('order_info');
            const msg = document.getElementById('order_message');
            msg.style.display = 'none';
            order_info.style.display = 'none';

            function addToOrder(dish) {
                if (dish['category'] === 'soup') {
                    updateCategory('суп', dish);
                    window.localStorage.setItem('selected_soup', dish['id']);
                } else if (dish['category'] === 'main-course') {
                    updateCategory('главное блюдо', dish);
                    window.localStorage.setItem('selected_main-course', dish['id']);
                } else if (dish['category'] === 'salad') {
                    updateCategory('салат', dish);
                    window.localStorage.setItem('selected_salad', dish['id']);
                }
                else if (dish['category'] === 'drink') {
                    updateCategory('напиток', dish);
                    window.localStorage.setItem('selected_drink', dish['id']);
                } else if (dish['category'] === 'dessert') {
                    updateCategory('десерт', dish);
                    window.localStorage.setItem('selected_dessert', dish['id']);
                }

                totalPriceElement.textContent = `Стоимость заказа: ${totalPrice}₽`;
                totalPriceElement.style.display = 'block';

                order_info.style.display = '';

                const result = validateOrder(selectedDishes);
                if (result.valid) {
                    msg.style.display = '';
                    console.log(msg.style);
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
                sortedDishes.forEach( function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        addToOrder(dish);
                    }
                });
            }

            fromLocalStorage();

            function updateCategory(category, dish) {
                    // Если блюдо из этой категории уже выбрано, вычитаем его цену
                    if (selectedDishes[category] !== null) {
                        totalPrice -= selectedDishes[category]['price'];
                    }

                    // Обновляем выбранное блюдо
                    selectedDishes[category] = dish;

                    // Добавляем цену выбранного блюда
                    totalPrice += dish['price'];
            }

            const soupFilters = document.querySelectorAll('.soup-filter');
            const mainFilters = document.querySelectorAll('.main-filter');
            const drinkFilters = document.querySelectorAll('.drink-filter');
            const saladFilters = document.querySelectorAll('.salad-filter');
            const dessertFilters = document.querySelectorAll('.dessert-filter');

            function addFiltersToCategory(filters) {
                filters.forEach(filter => {
                    filter.addEventListener('click', function(e) {
                        e.preventDefault();

                        const className = filter.classList[0].split('-')[0];
                        const dishes = document.querySelectorAll(`#${className} .dish`);

                        if (!filter.classList.contains('active')) {
                            filters.forEach(f => f.classList.remove('active'));
                            filter.classList.add('active');
                            const kind = filter.dataset.kind;
                            dishes.forEach(dish => {
                                if (dish.dataset.kind === kind) {
                                    dish.classList.remove('hidden');
                                } else {
                                    dish.classList.add('hidden');
                                }
                            });
                        } else {
                            filter.classList.remove('active');
                            dishes.forEach(dish => dish.classList.remove('hidden'));
                        }
                    });
                });
            }

            addFiltersToCategory(soupFilters);
            addFiltersToCategory(mainFilters);
            addFiltersToCategory(saladFilters);
            addFiltersToCategory(drinkFilters);
            addFiltersToCategory(dessertFilters);
        });
});