const chatScenarios = {
    user1: [
        {
            id: 1,
            message: "Привет! А я на новую работу устроилась)\nА ты всё говорил, что не получиться туда попасть 😛\n<img src='./images/name 1/photo1.png' alt='Фото'>",
            responses: ["Здорово! Поздравляю 🎉"]
        },
        {
            id: 2,
            condition: "Здорово! Поздравляю 🎉",
            message: "Спасибо)\nПо этому поводу у нас будет сбор на выходных\nНе хочешь присоединиться?",
            responses: ["Было бы здорово!", "Не, извини. Работы много..."]
        },
        {
            id: 3,
            condition: "Было бы здорово!",
            message: "Супер! Тогда поедем вместе. Это загородный домик моей подруги.",
            responses: ["Буду ждать выходных 🙌"]
        },
        {
            id: 4,
            condition: "Не, извини. Работы много...",
            message: "Эх, ладно... Буду присылать фоточки",
            responses: ["Окей )"]
        }
    ],

    user2: [ // Директор организации
        {
            id: 1,
            message: "Здравствуйте! Хотел уточнить, всё ли у вас работает исправно?",
            responses: ["Да, всё отлично!", "Есть небольшие проблемы..."]
        },
        {
            id: 2,
            condition: "Да, всё отлично!",
            message: "Прекрасно! Если вдруг появятся вопросы или трудности, сразу сообщайте.",
            responses: ["Обязательно, спасибо!"]
        },
        {
            id: 3,
            condition: "Есть небольшие проблемы...",
            message: "Понял. Опишите, что именно не так, и я постараюсь помочь.",
            responses: ["Система иногда зависает", "Не работает доступ к базе данных"]
        },
        {
            id: 4,
            condition: "Система иногда зависает",
            message: "Я передам это нашим специалистам. Они проверят логи и устранят проблему.",
            responses: ["Спасибо! Буду ждать."]
        },
        {
            id: 5,
            condition: "Не работает доступ к базе данных",
            message: "Попробуйте перезапустить систему. Если проблема останется, свяжитесь с IT-отделом.",
            responses: ["Хорошо, попробую."]
        }
    ],

    user3: [ // Библиотекарь
        {
            id: 1,
            message: "Здравствуйте! Мы решили вам напомнить, что у нас появилось много новых книг и интересных мероприятий. Может, вас что-то заинтересует?",
            responses: ["Да", "Нет"]
        },
        {
            id: 2,
            condition: "Да",
            message: "📚 Скидка на всю литературу по биологии!\n📖 Встреча с автором бестселлера Антоном Серебровым, автором книги «Тайны неизведанной природы»!",
            responses: ["Интересно, я точно приду )"]
        },
        {
            id: 3,
            condition: "Нет",
            message: "Понял. Опишите, что именно не так, и я постараюсь помочь.",
            responses: ["Спасибо за предложение )"]
        },
    ],

    group: [ // Группа (только чтение)
        {
            id: 1,
            delay: 10000, // 10 секунд
            message: "Всем привет! Напоминаем, что завтра в 10:00 состоится собрание."
        },
        {
            id: 2,
            delay: 20000, // 20 секунд
            message: "Не забудьте подготовить отчеты по текущим проектам."
        },
        {
            id: 3,
            delay: 30000, // 30 секунд
            message: "Спасибо за внимание! Если есть вопросы, пишите в личные сообщения."
        }
    ]
};

let currentChat = ""; // Текущий открытый чат
let chatData = JSON.parse(localStorage.getItem('chatData')) || {
    user1: [
        "Бот: Блииин, мы так классно погуляли. Отдельное спасибо за фоточки)",
        "Бот: <img src='./images/name 1/photo2.png' alt='Фото 2'>",
        "Вы: Мне тоже понраилось, повторим как нибудь)",
        "Бот: Обязательно)",
        "Привет! А я на новую работу устроилась)\nА ты всё говорил, что не получиться туда попасть 😛\n<img src='./images/name 1/photo1.png' alt='Фото'>"
    ],
    user2: [
        "Бот: Всё норм?",
        "Вы: Ага",
        "Бот: Ок.",
        "Бот: Здравствуйте! Хотел уточнить, всё ли у вас работает исправно?"
    ],
    user3: [
        "Бот: Здравствуйте! Давно Вас не было в нашей библиотеке. Я - Александра.",
        "Вы: Здравствуйте, Александра. Да, как-то времени не было...",
        "Бот: Очень жаль (\nПриходите, скоро будет много всего интересного!)",
        "Здравствуйте! Мы решили вам напомнить, что у нас появилось много новых книг и интересных мероприятий. Может, вас что-то заинтересует?",
    ],
    group: [
        "Бот: Всем привет! Напоминаем, что завтра в 10:00 состоится собрание.",
        "Бот: Не забудьте подготовить отчеты по текущим проектам.",
        "Бот: Спасибо за внимание! Если есть вопросы, пишите в личные сообщения."
    ],
    settings: []
};

let isSavingEnabled = true; // Сохранение истории включено по умолчанию
let isDarkTheme = localStorage.getItem('theme') === 'dark'; // Тема по умолчанию

// Применение темы
function applyTheme(isDark) {
    document.body.classList.toggle('dark-theme', isDark);
    document.body.classList.toggle('light-theme', !isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Переключатель сохранения истории
function toggleSaveHistory() {
    isSavingEnabled = !isSavingEnabled;
    if (!isSavingEnabled) {
        localStorage.removeItem('chatData');
    } else {
        saveChatData();
    }
    updateSettingsUI();
}

// Переключатель темы
function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    applyTheme(isDarkTheme);
    updateSettingsUI();
}

// Сохранение данных чата
function saveChatData() {
    if (isSavingEnabled) {
        localStorage.setItem('chatData', JSON.stringify(chatData));
    }
}

function openChat(user) {
    currentChat = user;
    const chatHeaderName = document.getElementById("chat-header-name");
    chatHeaderName.textContent = user === 'settings' ? 'Настройки' : user === 'group' ? 'Группа' : `Пользователь ${user.slice(-1)}`;

    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = ""; // Очистка чата перед загрузкой

    const chatInput = document.getElementById("chat-input");
    chatInput.innerHTML = ""; // Очистка кнопок ответа
    chatInput.style.display = user === 'settings' || user === 'group' ? 'none' : 'flex';

    const closeButton = document.getElementById("close-chat");
    closeButton.style.display = user === 'settings' || user.startsWith('user') || user === 'group' ? 'block' : 'none';

    if (user === 'settings') {
        chatMessages.innerHTML = `
            <div class="settings-content">
                <button onclick="toggleTheme()">Сменить тему</button>
                <button onclick="toggleSaveHistory()">${isSavingEnabled ? 'Отключить' : 'Включить'} сохранение</button>
            </div>
        `;
    } else if (user === 'group') {
        // Загрузка истории сообщений
        if (chatData[user] && chatData[user].length > 0) {
            chatData[user].forEach(message => {
                appendMessage(message, 'bot');
            });
        }

        // Запуск сценария группы
        if (!chatData.groupStarted) {
            startGroupScenario();
            chatData.groupStarted = true;
            saveChatData();
        }
    } else {
        // Загрузка истории сообщений
        if (chatData[user] && chatData[user].length > 0) {
            chatData[user].forEach(message => {
                const isUserMessage = message.startsWith("Вы:");
                appendMessage(message, isUserMessage ? 'user' : 'bot');
            });

            // Отображение кнопок для последнего сообщения
            const lastMessage = chatData[user][chatData[user].length - 1];
            const lastStep = chatScenarios[user].find(step => step.message === lastMessage.replace("Бот: ", ""));
            if (lastStep) {
                displayOptions(lastStep.responses);
            }
        } else {
            startScenario(user); // Начало сценария, если чат пуст
        }
    }
}

// Закрытие чата
function closeChat() {
    currentChat = "";
    const chatHeaderName = document.getElementById("chat-header-name");
    chatHeaderName.innerHTML = 'Bunny Chat <img src="./images/main images/icon.png" id="logo-img">';

    const chatMessages = document.getElementById("chat-messages");
    chatMessages.innerHTML = "";

    const chatInput = document.getElementById("chat-input");
    chatInput.innerHTML = "";
    chatInput.style.display = "none";

    const closeButton = document.getElementById("close-chat");
    closeButton.style.display = 'none';

    saveChatData();
}

// Отправка сообщения
function sendMessage(response) {
    if (!currentChat) return;

    const message = `Вы: ${response}`;
    chatData[currentChat].push(message);
    appendMessage(message, 'user');
    saveChatData();

    document.getElementById("chat-input").innerHTML = "";
    handleResponse(response);
}

// Обработка ответа
function handleResponse(response) {
    const scenario = chatScenarios[currentChat];
    const currentStep = scenario.find(step => step.condition === response);

    if (currentStep) {
        setTimeout(() => {
            const botMessage = `Бот: ${currentStep.message}`;
            chatData[currentChat].push(botMessage);
            appendMessage(botMessage, 'bot');
            displayOptions(currentStep.responses);
            saveChatData();
        }, 1000);
    }
}

// Добавление сообщения в чат
function appendMessage(message, sender) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.classList.add('message', sender);
    messageDiv.style.whiteSpace = 'pre-line';
    messageDiv.innerHTML = message; // Поддержка HTML (включая изображения)
    chatMessages.appendChild(messageDiv);

    // Добавляем обработчик клика для изображений
    const images = messageDiv.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('click', () => openFullscreenImage(img.src));
    });

    chatMessages.scrollTop = chatMessages.scrollHeight; // Автопрокрутка вниз
}

// Открытие изображения в полный экран
function openFullscreenImage(src) {
    const fullscreenDiv = document.createElement('div');
    fullscreenDiv.classList.add('fullscreen-image');
    fullscreenDiv.innerHTML = `<img src="${src}" alt="Fullscreen Image">`;
    document.body.appendChild(fullscreenDiv);

    // Закрытие полноэкранного режима при клике
    fullscreenDiv.addEventListener('click', () => {
        document.body.removeChild(fullscreenDiv);
    });
}

// Запуск сценария
function startScenario(user) {
    const scenario = chatScenarios[user];
    if (chatData[user].length === 0) {
        const firstStep = scenario[0];
        const botMessage = `Бот: ${firstStep.message}`;
        chatData[user].push(botMessage);
        appendMessage(botMessage, 'bot');
        displayOptions(firstStep.responses);
        saveChatData();
    }
}

// Запуск сценария группы
function startGroupScenario() {
    const scenario = chatScenarios.group;
    scenario.forEach(step => {
        if (step.delay) {
            setTimeout(() => {
                if (!chatData.group.includes(`Бот: ${step.message}`)) {
                    const botMessage = `Бот: ${step.message}`;
                    chatData.group.push(botMessage);
                    appendMessage(botMessage, 'bot');
                    saveChatData();
                }
            }, step.delay);
        }
    });
}

// Отображение кнопок ответа
function displayOptions(options) {
    const inputContainer = document.getElementById("chat-input");
    inputContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => sendMessage(option);
        inputContainer.appendChild(button);
    });
}

// Обновление UI настроек
function updateSettingsUI() {
    if (currentChat === 'settings') {
        document.getElementById("chat-messages").innerHTML = `
            <div class="settings-content">
                <button onclick="toggleTheme()">Сменить тему</button>
                <button onclick="toggleSaveHistory()">${isSavingEnabled ? 'Отключить' : 'Включить'} сохранение</button>
            </div>
        `;
    }
}

// Инициализация
window.onload = () => {
    const savedData = localStorage.getItem('chatData');
    if (savedData) {
        chatData = JSON.parse(savedData);
    } else {
        // Если данных в localStorage нет, используем начальную историю
        localStorage.setItem('chatData', JSON.stringify(chatData));
    }
    applyTheme(isDarkTheme);
    updateSettingsUI();
    document.getElementById("close-chat").style.display = 'none';
};