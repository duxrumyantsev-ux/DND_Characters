// Основной файл инициализации приложения
class DNDApp {

    constructor() {
        this.currentTab = 'mainTab';
        this.init();
    }

    init() {
        console.log('Проверка загрузки ресурсов...');
        
        // Проверяем загрузку изображений
        const bgImage = new Image();
        bgImage.onload = () => console.log('Фоновое изображение загружено');
        bgImage.onerror = () => console.log('Ошибка загрузки фонового изображения');
        bgImage.src = 'assets/images/parchment-texture.jpg';
        
        const charImage = new Image();
        charImage.onload = () => console.log('Изображение персонажа по умолчанию загружено');
        charImage.onerror = () => console.log('Ошибка загрузки изображения персонажа по умолчанию');
        charImage.src = 'assets/images/default-character.png';
        
        // Сначала инициализируем базовые менеджеры
        window.attributesManager = new AttributesManager();
        window.inventoryManager = new InventoryManager();
        window.featuresManager = new FeaturesManager();
        window.raceBonusManager = new RaceBonusManager();
        window.statusManager = new StatusManager();
        window.syncManager = new SyncManager();

        this.bindEvents();
        this.loadInitialData();
        this.updateUI();
  
    }

    bindEvents() {
        // Навигация по вкладкам
        document.getElementById('mainTabBtn').addEventListener('click', () => this.switchTab('mainTab'));
        document.getElementById('createCharacterBtn').addEventListener('click', () => this.switchTab('createCharacterTab'));
        document.getElementById('myCharactersBtn').addEventListener('click', () => this.switchTab('myCharactersTab'));
        
        // Кнопки на главной странице
        document.getElementById('startCreatingBtn').addEventListener('click', () => this.switchTab('createCharacterTab'));
        document.getElementById('createFirstCharacterBtn').addEventListener('click', () => this.switchTab('createCharacterTab'));
        
        // Управление формой создания
        document.getElementById('cancelCreateBtn').addEventListener('click', () => this.switchTab('mainTab'));
        document.getElementById('saveCharacterBtn').addEventListener('click', () => this.saveCharacter());
        
        // Динамические изменения формы
        document.getElementById('characterClass').addEventListener('change', (e) => this.handleClassChange(e.target.value));
        document.getElementById('characterRace').addEventListener('change', (e) => this.handleRaceChange(e.target.value));
        document.getElementById('characterExperience').addEventListener('input', (e) => this.updateLevel(e.target.value));

        // Загрузка фото
        document.getElementById('uploadPhotoBtn').addEventListener('click', () => {
            document.getElementById('photoUpload').click();
        });

        // Обработчик изменения подкласса
        document.getElementById('characterSubclass').addEventListener('change', (e) => {
            this.handleSubclassChange(e.target.value);
        });
        
        document.getElementById('photoUpload').addEventListener('change', (e) => this.handlePhotoUpload(e));
    }

    handleSubclassChange(subclassId) {
        console.log('Изменен подкласс:', subclassId);
        
        // Обновить особенности
        if (window.featuresManager) {
            window.featuresManager.refreshFeatures();
        }
    }

    // Новый метод для обработки загрузки фото
    handlePhotoUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Проверка типа файла
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            alert('Пожалуйста, выберите файл изображения (JPEG, PNG, GIF или WebP)');
            return;
        }

        // Проверка размера файла (максимум 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Размер файла не должен превышать 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('characterPhoto').src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    switchTab(tabName) {
        // Скрыть все вкладки
        document.querySelectorAll('.content-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Показать выбранную вкладку
        document.getElementById(tabName).classList.add('active');
        this.currentTab = tabName;
        
        // Обновить активные кнопки навигации
        document.querySelectorAll('.dnd-nav .btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (tabName === 'mainTab') {
            document.getElementById('mainTabBtn').classList.add('active');
        } else if (tabName === 'createCharacterTab') {
            document.getElementById('createCharacterBtn').classList.add('active');
        } else if (tabName === 'myCharactersTab') {
            document.getElementById('myCharactersBtn').classList.add('active');
            this.loadCharactersList();
        }
    }

    loadInitialData() {
        // Загрузка базовых данных (расы, классы и т.д.)
        this.loadRaces();
        this.loadClasses();
        this.loadBackgrounds();
    }

    async loadRaces() {
        // Временные данные рас (позже заменим на JSON)
        const races = [
            { id: 'human', name: 'Человек', speed: 30 },
            { id: 'elf', name: 'Эльф', speed: 30 },
            { id: 'dwarf', name: 'Дварф', speed: 25 },
            { id: 'halfling', name: 'Халфлинг', speed: 25 },
            { id: 'gnome', name: 'Гном', speed: 25 },
            { id: 'half-elf', name: 'Полуэльф', speed: 30 },
            { id: 'half-orc', name: 'Полуорк', speed: 30 },
            { id: 'tiefling', name: 'Тифлинг', speed: 30 }
        ];

        const raceSelect = document.getElementById('characterRace');
        races.forEach(race => {
            const option = document.createElement('option');
            option.value = race.id;
            option.textContent = race.name;
            raceSelect.appendChild(option);
        });
    }

    async loadClasses() {
        // Временные данные классов
        const classes = [
            { id: 'barbarian', name: 'Варвар', hasSpells: false },
            { id: 'bard', name: 'Бард', hasSpells: true },
            { id: 'cleric', name: 'Жрец', hasSpells: true },
            { id: 'druid', name: 'Друид', hasSpells: true },
            { id: 'fighter', name: 'Воин', hasSpells: false },
            { id: 'monk', name: 'Монах', hasSpells: false },
            { id: 'paladin', name: 'Паладин', hasSpells: true },
            { id: 'ranger', name: 'Следопыт', hasSpells: true },
            { id: 'rogue', name: 'Плут', hasSpells: false },
            { id: 'sorcerer', name: 'Чародей', hasSpells: true },
            { id: 'warlock', name: 'Колдун', hasSpells: true },
            { id: 'wizard', name: 'Волшебник', hasSpells: true }
        ];

        const classSelect = document.getElementById('characterClass');
        classes.forEach(cls => {
            const option = document.createElement('option');
            option.value = cls.id;
            option.textContent = cls.name;
            classSelect.appendChild(option);
        });
    }

    async loadBackgrounds() {
        // Временные данные предысторий
        const backgrounds = [
            'Аколит', 'Благородный', 'Гильдейский ремесленник', 'Горожанин',
            'Жрец', 'Искатель приключений', 'Мудрец', 'Моряк', 'Чужеземец',
            'Преступник', 'Прислужник', 'Отшельник', 'Народный герой', 'Погонщик',
            'Солдат', 'Шарлатан', 'Беспризорник', 'Артист'
        ];

        const backgroundSelect = document.getElementById('characterBackground');
        backgrounds.forEach(bg => {
            const option = document.createElement('option');
            option.value = bg.toLowerCase().replace(' ', '-');
            option.textContent = bg;
            backgroundSelect.appendChild(option);
        });
    }

    handleClassChange(classId) {
        const subclassSection = document.getElementById('subclassSection');
        const spellsTabItem = document.getElementById('spellsTabItem');
        
        // Показать/скрыть подклассы
        if (['wizard', 'cleric', 'fighter', 'rogue'].includes(classId)) {
            subclassSection.style.display = 'block';
            this.loadSubclasses(classId);
        } else {
            subclassSection.style.display = 'none';
        }
        
        // Показать/скрыть вкладку заклинаний
        const hasSpells = ['bard', 'cleric', 'druid', 'paladin', 'ranger', 'sorcerer', 'warlock', 'wizard'].includes(classId);
        spellsTabItem.style.display = hasSpells ? 'block' : 'none';

        // Установить спасброски класса
        if (window.attributesManager) {
            window.attributesManager.setSavingThrowsByClass(classId);
        }
        
        // Обновить кость хитов и максимальное здоровье
        if (window.statusManager) {
            window.statusManager.updateHitDice();
            window.statusManager.updateMaxHealth();
            window.statusManager.updateDerivedStats();
        }
        
        // Обновить особенности
        if (window.featuresManager) {
            window.featuresManager.refreshFeatures();
        }
    }

    loadSubclasses(classId) {
        const subclassSelect = document.getElementById('characterSubclass');
        subclassSelect.innerHTML = '<option value="">Выберите подкласс</option>';
        
        // Временные данные подклассов
        const subclasses = {
            wizard: ['Школа воплощения', 'Школа ограждения', 'Школа вызова', 'Школа гадания', 
                    'Школа одурманивания', 'Школа иллюзии', 'Школа некромантии', 'Школа преобразования'],
            cleric: ['Знание', 'Жизнь', 'Свет', 'Природа', 'Буря', 'Обман', 'Война'],
            fighter: ['Полевой воин', 'Рыцарь-чародей', 'Следопыт', 'Мастер боевых искусств'],
            rogue: ['Вор', 'Убийца', 'Мистический ловкач']
        };
        
        if (subclasses[classId]) {
            subclasses[classId].forEach(subclass => {
                const option = document.createElement('option');
                option.value = subclass.toLowerCase().replace(/ /g, '-');
                option.textContent = subclass;
                subclassSelect.appendChild(option);
            });
        }
    }

    handleRaceChange(raceId) {
        // Обновить скорость на основе расы
        const speedMap = {
            'human': 30, 'elf': 30, 'dwarf': 25, 'halfling': 25,
            'gnome': 25, 'half-elf': 30, 'half-orc': 30, 'tiefling': 30
        };
        
        document.getElementById('characterSpeed').value = speedMap[raceId] || 30;
        
        // Обновить скорость в статусе
        if (window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
        // Обновить особенности
        if (window.featuresManager) {
            window.featuresManager.refreshFeatures();
        }
    }

    updateLevel(experience) {
        const exp = parseInt(experience) || 0;
        const level = this.calculateLevel(exp);
        
        document.getElementById('levelDisplay').textContent = level;
        
        // Обновляем шкалу опыта
        const expNeeded = this.getExpForLevel(level + 1);
        const expCurrentLevel = this.getExpForLevel(level);
        const progress = expNeeded ? ((exp - expCurrentLevel) / (expNeeded - expCurrentLevel)) * 100 : 100;
        
        const expProgress = document.querySelector('.exp-progress');
        const expText = document.querySelector('.exp-text');
        
        expProgress.style.width = `${Math.min(progress, 100)}%`;
        expText.textContent = `${exp.toLocaleString()}/${expNeeded.toLocaleString()} XP`;
        
        // Обновляем максимальное здоровье при изменении уровня
        if (window.statusManager) {
            window.statusManager.updateMaxHealth();
            window.statusManager.updateHitDice();
            window.statusManager.updateDerivedStats();
        }
        // Обновляем особенности
        if (window.featuresManager) {
            window.featuresManager.refreshFeatures();
        }
    }

    calculateLevel(exp) {
        const levels = [
            0,      // Уровень 1
            300,    // Уровень 2
            900,    // Уровень 3
            2700,   // Уровень 4
            6500,   // Уровень 5
            14000,  // Уровень 6
            23000,  // Уровень 7
            34000,  // Уровень 8
            48000,  // Уровень 9
            64000,  // Уровень 10
            85000,  // Уровень 11
            100000, // Уровень 12
            120000, // Уровень 13
            140000, // Уровень 14
            165000, // Уровень 15
            195000, // Уровень 16
            225000, // Уровень 17
            265000, // Уровень 18
            305000, // Уровень 19
            355000  // Уровень 20
        ];
        
        for (let level = 1; level <= 20; level++) {
            if (exp < levels[level]) return level;
        }
        return 20;
    }

    getExpForLevel(level) {
        const levels = [
            0,      // Уровень 1
            300,    // Уровень 2
            900,    // Уровень 3
            2700,   // Уровень 4
            6500,   // Уровень 5
            14000,  // Уровень 6
            23000,  // Уровень 7
            34000,  // Уровень 8
            48000,  // Уровень 9
            64000,  // Уровень 10
            85000,  // Уровень 11
            100000, // Уровень 12
            120000, // Уровень 13
            140000, // Уровень 14
            165000, // Уровень 15
            195000, // Уровень 16
            225000, // Уровень 17
            265000, // Уровень 18
            305000, // Уровень 19
            355000  // Уровень 20
        ];
        
        return levels[level - 1] || 0;
    }

    saveCharacter() {
        // Базовая валидация
        const name = document.getElementById('characterName').value;
        const race = document.getElementById('characterRace').value;
        const characterClass = document.getElementById('characterClass').value;
        const skillsData = attributesManager.getSkillsData();

        if (!name || !race || !characterClass) {
            alert('Пожалуйста, заполните обязательные поля: Имя, Раса и Класс');
            return;
        }

        // Валидация распределения очков характеристик
        const attributesValidation = attributesManager.validateDistribution();
        if (!attributesValidation.valid) {
            const distribute = confirm(`${attributesValidation.message} Хотите автоматически распределить оставшиеся очки?`);
            if (distribute) {
                attributesManager.autoDistributeRemainingPoints();
            } else {
                return;
            }
        }

        // Применяем расовые бонусы перед сохранением
        const baseAttributes = attributesManager.getAttributesData();
        const finalAttributes = raceBonusManager.applyRaceBonuses(baseAttributes, race);

        // Сбор данных персонажа
        const characterData = {
            id: Date.now(),
            name: name,
            race: race,
            class: characterClass,
            subclass: document.getElementById('characterSubclass').value,
            background: document.getElementById('characterBackground').value,
            alignment: document.getElementById('characterAlignment').value,
            gender: document.querySelector('input[name="characterGender"]:checked')?.value,
            level: parseInt(document.getElementById('levelDisplay').textContent),
            experience: parseInt(document.getElementById('characterExperience').value),
            speed: parseInt(document.getElementById('characterSpeed').value),
            attributes: finalAttributes, // Сохраняем с бонусами
            skills: skillsData,
            inventory: inventoryManager.getInventoryData(),
            status: statusManager.getStatusData(),
            features: featuresManager.getFeaturesData(),
            created: new Date().toISOString(),
            updated: new Date().toISOString()
        };
        
        // Сохранение через CharacterManager
        CharacterManager.saveCharacter(characterData);
        
        // Переход к списку персонажей
        this.switchTab('myCharactersTab');
        
        // Очистка формы
        this.resetForm();
    }

    resetForm() {
        document.getElementById('characterName').value = '';
        document.getElementById('characterRace').selectedIndex = 0;
        document.getElementById('characterClass').selectedIndex = 0;
        document.getElementById('characterSubclass').selectedIndex = 0;
        document.getElementById('characterBackground').selectedIndex = 0;
        document.getElementById('characterAlignment').selectedIndex = 0;
        document.getElementById('characterExperience').value = '0';
        document.getElementById('subclassSection').style.display = 'none';
        document.getElementById('spellsTabItem').style.display = 'none';
        this.updateLevel(0);

        // Сброс характеристик
        window.attributesManager = new AttributesManager();
        // Сброс инвентаря
        window.inventoryManager = new InventoryManager();
        // Сброс состояний
        window.statusManager = new StatusManager();
        // Сброс особенностей
        window.featuresManager = new FeaturesManager();

    }

    loadCharactersList() {
        const characters = CharacterManager.getCharacters();
        const charactersList = document.getElementById('charactersList');
        
        if (characters.length === 0) {
            charactersList.innerHTML = `
                <div class="col-12">
                    <div class="dnd-empty-state">
                        <i class="bi bi-person-x"></i>
                        <h4>Персонажей пока нет</h4>
                        <p>Создайте вашего первого персонажа, чтобы начать приключение!</p>
                        <button class="btn btn-dnd-primary" id="createFirstCharacterBtn">
                            Создать первого персонажа
                        </button>
                    </div>
                </div>
            `;
            document.getElementById('createFirstCharacterBtn').addEventListener('click', () => this.switchTab('createCharacterTab'));
            return;
        }
        
        charactersList.innerHTML = characters.map(character => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="dnd-character-card">
                    <div class="character-card-header">
                        <h5>${character.name}</h5>
                        <span class="character-level">Ур. ${character.level}</span>
                    </div>
                    <div class="character-card-body">
                        <p><strong>Раса:</strong> ${this.getRaceName(character.race)}</p>
                        <p><strong>Класс:</strong> ${this.getClassName(character.class)}</p>
                        <p><strong>Предыстория:</strong> ${character.background ? this.getBackgroundName(character.background) : 'Не указана'}</p>
                    </div>
                    <div class="character-card-actions">
                        <button class="btn btn-dnd-secondary btn-sm" onclick="app.viewCharacter(${character.id})">
                            <i class="bi bi-eye"></i> Просмотр
                        </button>
                        <button class="btn btn-dnd-primary btn-sm" onclick="app.editCharacter(${character.id})">
                            <i class="bi bi-pencil"></i> Редактировать
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    getRaceName(raceId) {
        const races = {
            'human': 'Человек', 'elf': 'Эльф', 'dwarf': 'Дварф', 
            'halfling': 'Халфлинг', 'gnome': 'Гном', 'half-elf': 'Полуэльф',
            'half-orc': 'Полуорк', 'tiefling': 'Тифлинг'
        };
        return races[raceId] || raceId;
    }

    getClassName(classId) {
        const classes = {
            'barbarian': 'Варвар', 'bard': 'Бард', 'cleric': 'Жрец',
            'druid': 'Друид', 'fighter': 'Воин', 'monk': 'Монах',
            'paladin': 'Паладин', 'ranger': 'Следопыт', 'rogue': 'Плут',
            'sorcerer': 'Чародей', 'warlock': 'Колдун', 'wizard': 'Волшебник'
        };
        return classes[classId] || classId;
    }

    getBackgroundName(backgroundId) {
        // Простая функция для отображения названий предысторий
        return backgroundId.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    viewCharacter(characterId) {
        // Позже реализуем просмотр персонажа
        alert(`Просмотр персонажа ${characterId} - будет реализовано позже`);
    }

    editCharacter(characterId) {
        const character = CharacterManager.getCharacter(characterId);
        if (!character) return;

        // Убираем расовые бонусы для редактирования
        const cleanAttributes = raceBonusManager.removeRaceBonuses(character.attributes, character.race);
        character.attributes = cleanAttributes;

        // Заполняем форму данными персонажа
        formManager.populateForm(character);
        
        // Переходим к созданию персонажа
        this.switchTab('createCharacterTab');
        
        // Показываем уведомление о расовых бонусах
        const bonusDescription = raceBonusManager.getBonusDescription(character.race);
        if (bonusDescription) {
            this.showMessage(`Расовые бонусы (${bonusDescription}) будут применены при сохранении`, 'info');
        }
    }

    updateUI() {
        // Дополнительные обновления UI
        this.updateLevel(0);
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    window.app = new DNDApp();
});