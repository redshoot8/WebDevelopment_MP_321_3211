document.addEventListener('DOMContentLoaded', () => {
    fetch('dishes.json')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд
            const sortedDishes = data['dishes'].sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд
            const soupSection = document.querySelectorAll('#soup .dish_block')[0];
            const mainDishSection = document.querySelectorAll('#main_dish .dish_block')[0];
            const drinkSection = document.querySelectorAll('#drink .dish_block')[0];

            function createCard(dish) {
                const card = document.createElement('div');
                card.classList.add('dish');

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
                volume.textContent = dish['volume'];

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
                sortedDishes.forEach(dish => {
                    if (dish['category'] === category) {
                        const card = createCard(dish);
                        sectionElement.appendChild(card);
                    }
                });
            }

            populateCards(soupSection, 'суп');
            populateCards(mainDishSection, 'главное блюдо');
            populateCards(drinkSection, 'напиток');

            // Добавление товаров в заказ и подсчет цены
            let totalPrice = 0;
            const totalPriceElement = document.getElementById('total_price');

            let selectedDishes = {
                'суп': null,
                'главное блюдо': null,
                'напиток': null
            };

            const chosenSoup = document.getElementById('chosen_soup');
            const chosenMain = document.getElementById('chosen_main');
            const chosenDrink = document.getElementById('chosen_drink');
            const soupLabel = document.getElementById('soup_label');
            const mainLabel = document.getElementById('main_label');
            const drinkLabel = document.getElementById('drink_label');
            const nothingSelectedMessage = document.querySelector('.order_section p:nth-of-type(2)');

            // Изначально элементы скрыты
            soupLabel.style.display = 'none';
            chosenSoup.style.display = 'none';
            mainLabel.style.display = 'none';
            chosenMain.style.display = 'none';
            drinkLabel.style.display = 'none';
            chosenDrink.style.display = 'none';
            totalPriceElement.style.display = 'none';

            function addToOrder(dish) {
                let isUpdated = false;

                if (dish['category'] === 'суп') {
                    updateCategory('суп', dish, chosenSoup, soupLabel);
                    isUpdated = true;
                } else if (dish['category'] === 'главное блюдо') {
                    updateCategory('главное блюдо', dish, chosenMain, mainLabel);
                    isUpdated = true;
                } else if (dish['category'] === 'напиток') {
                    updateCategory('напиток', dish, chosenDrink, drinkLabel);
                    isUpdated = true;
                }

                if (isUpdated) {
                    nothingSelectedMessage.style.display = 'none';
                }

                totalPriceElement.textContent = `Стоимость заказа: ${totalPrice}₽`;
                totalPriceElement.style.display = 'block';

                showEmptyCategories();
            }

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
            }
        });
});