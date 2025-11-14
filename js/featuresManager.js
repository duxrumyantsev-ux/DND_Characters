// Менеджер особенностей персонажа
class FeaturesManager {
    constructor() {
        this.featuresData = {
            races: {},
            classes: {},
            subclasses: {}
        };
        
        this.currentLevel = 1;
        
        this.init();
    }

    async init() {
        console.log('Инициализация FeaturesManager...');
        await this.loadFeaturesData();
        this.bindEvents();
        this.updateUI();
        console.log('FeaturesManager инициализирован');
    }

    async loadFeaturesData() {
        // Данные особенностей рас
        this.featuresData.races = {
            'human': {
                name: 'Человек',
                abilityBonus: {
                    'strength': 1,
                    'dexterity': 1,
                    'constitution': 1,
                    'intelligence': 1,
                    'wisdom': 1,
                    'charisma': 1
                },
                features: [
                    {
                        name: 'Увеличение характеристик',
                        level: 1,
                        description: 'Все ваши значения характеристик увеличиваются на 1.',
                        type: 'race'
                    },
                    {
                        name: 'Универсальная подготовка',
                        level: 1,
                        description: 'Вы владеете одним дополнительным навыком на ваш выбор.',
                        type: 'race'
                    },
                    {
                        name: 'Скорость',
                        level: 1,
                        description: 'Ваша базовая скорость ходьбы равна 30 футам.',
                        type: 'race'
                    }
                ]
            },
            'elf': {
                name: 'Эльф',
                abilityBonus: {
                    'dexterity': 2
                },
                features: [
                    {
                        name: 'Увеличение характеристик',
                        level: 1,
                        description: 'Ваша Ловкость увеличивается на 2.',
                        type: 'race'
                    },
                    {
                        name: 'Тёмное зрение',
                        level: 1,
                        description: 'Вы можете видеть в темноте на расстоянии 60 футов.',
                        type: 'race'
                    },
                    {
                        name: 'Острота чувств',
                        level: 1,
                        description: 'Вы владеете навыком Восприятие.',
                        type: 'race'
                    },
                    {
                        name: 'Транс',
                        level: 1,
                        description: 'Вам нужно спать всего 4 часа в сутки.',
                        type: 'race'
                    },
                    {
                        name: 'Иммунитет к магии сна',
                        level: 1,
                        description: 'Вы не можете быть усыплены магией.',
                        type: 'race'
                    }
                ]
            },
            'dwarf': {
                name: 'Дварф',
                abilityBonus: {
                    'constitution': 2
                },
                features: [
                    {
                        name: 'Увеличение характеристик',
                        level: 1,
                        description: 'Ваше Телосложение увеличивается на 2.',
                        type: 'race'
                    },
                    {
                        name: 'Тёмное зрение',
                        level: 1,
                        description: 'Вы можете видеть в темноте на расстоянии 60 футов.',
                        type: 'race'
                    },
                    {
                        name: 'Дварфская стойкость',
                        level: 1,
                        description: 'Вы имеет преимущество на спасброски от яда.',
                        type: 'race'
                    },
                    {
                        name: 'Боевая тренировка',
                        level: 1,
                        description: 'Вы владеете боевым топором, ручным топором, лёгким и боевым молотом.',
                        type: 'race'
                    }
                ]
            },
            'halfling': {
                name: 'Халфлинг',
                abilityBonus: {
                    'dexterity': 2
                },
                features: [
                    {
                        name: 'Увеличение характеристик',
                        level: 1,
                        description: 'Ваша Ловкость увеличивается на 2.',
                        type: 'race'
                    },
                    {
                        name: 'Везучий',
                        level: 1,
                        description: 'Если при броске атаки, проверке характеристики или спасброске выпадает 1, можно перебросить кость.',
                        type: 'race'
                    },
                    {
                        name: 'Храбрый',
                        level: 1,
                        description: 'Вы имеет преимущество на спасброски от испуга.',
                        type: 'race'
                    },
                    {
                        name: 'Проворство халфлинга',
                        level: 1,
                        description: 'Вы можете передвигаться через пространство существ, чей размер больше вашего.',
                        type: 'race'
                    }
                ]
            }
        };

        // Данные особенностей классов
        this.featuresData.classes = {
            'fighter': {
                name: 'Воин',
                hitDice: 10,
                features: [
                    {
                        name: 'Боевой стиль',
                        level: 1,
                        description: 'Выберите один боевой стиль: Защита, Двуручное оружие, Дуэлянт, Стрельба.',
                        type: 'class'
                    },
                    {
                        name: 'Второе дыхание',
                        level: 1,
                        description: 'В боевой ситуации вы можете действием восстановить 1к10 + уровень воина хитов.',
                        type: 'class'
                    },
                    {
                        name: 'Дополнительная атака',
                        level: 5,
                        description: 'Если вы в свой ход совершаете действие Атака, вы можете совершить две атаки вместо одной.',
                        type: 'class'
                    },
                    {
                        name: 'Волевая черта',
                        level: 9,
                        description: 'Вы можете перебросить проваленный спасбросок.',
                        type: 'class'
                    }
                ]
            },
            'wizard': {
                name: 'Волшебник',
                hitDice: 6,
                features: [
                    {
                        name: 'Заговоры',
                        level: 1,
                        description: 'Вы знаете три заговора на ваш выбор из списка заклинаний волшебника.',
                        type: 'class'
                    },
                    {
                        name: 'Восстановление заклинаний',
                        level: 1,
                        description: 'Вы можете восстановить часть потраченных ячеек заклинаний во время короткого отдыха.',
                        type: 'class'
                    },
                    {
                        name: 'Увеличение характеристик',
                        level: 4,
                        description: 'Вы можете увеличить одну характеристику на 2 или две характеристики на 1.',
                        type: 'class'
                    },
                    {
                        name: 'Магический предмет',
                        level: 6,
                        description: 'Вы можете создать магический предмет, связанный с вашей школой магии.',
                        type: 'class'
                    }
                ]
            },
            'rogue': {
                name: 'Плут',
                hitDice: 8,
                features: [
                    {
                        name: 'Скрытая атака',
                        level: 1,
                        description: 'Если у вас есть преимущество при атаке, вы наносите дополнительный урон.',
                        type: 'class'
                    },
                    {
                        name: 'Хитрость',
                        level: 1,
                        description: 'Вы владеете навыком Скрытность и Воровство.',
                        type: 'class'
                    },
                    {
                        name: 'Уклонение',
                        level: 5,
                        description: 'Если вы видите атакующего, то при проваленном спасброске от области получаете только половину урона.',
                        type: 'class'
                    },
                    {
                        name: 'Надежный талант',
                        level: 11,
                        description: 'При проверке навыка, которым вы владеете, минимальный результат на к20 равен 10.',
                        type: 'class'
                    }
                ]
            },
            'cleric': {
                name: 'Жрец',
                hitDice: 8,
                features: [
                    {
                        name: 'Божественный домен',
                        level: 1,
                        description: 'Выберите божественный домен, который определяет ваши заклинания и особенности.',
                        type: 'class'
                    },
                    {
                        name: 'Изгоняющая скверна',
                        level: 1,
                        description: 'Вы можете действием изгнать нежить или исчадий.',
                        type: 'class'
                    },
                    {
                        name: 'Божественное вмешательство',
                        level: 10,
                        description: 'Вы можете призвать помощь вашего божества.',
                        type: 'class'
                    },
                    {
                        name: 'Уничтожение нежити',
                        level: 5,
                        description: 'При использовании Изгоняющей скверны вы можете уничтожить нежить низкого уровня.',
                        type: 'class'
                    }
                ]
            }
        };

        // Данные особенностей подклассов
        this.featuresData.subclasses = {
            'fighter': {
                'battle-master': {
                    name: 'Полевой воин',
                    features: [
                        {
                            name: 'Боевые приёмы',
                            level: 3,
                            description: 'Вы изучаете три боевых приёма на ваш выбор.',
                            type: 'subclass'
                        },
                        {
                            name: 'Превосходные кости',
                            level: 3,
                            description: 'У вас есть четыре кости превосходства к8.',
                            type: 'subclass'
                        },
                        {
                            name: 'Узнать противника',
                            level: 7,
                            description: 'Вы можете действием изучить противника и узнать его слабости.',
                            type: 'subclass'
                        }
                    ]
                },
                'eldritch-knight': {
                    name: 'Рыцарь-чародей',
                    features: [
                        {
                            name: 'Заклинательство',
                            level: 3,
                            description: 'Вы изучаете основы магии и можете творить заклинания.',
                            type: 'subclass'
                        },
                        {
                            name: 'Оружие-заговор',
                            level: 3,
                            description: 'Вы можете действием создать магическую связь с одним оружием.',
                            type: 'subclass'
                        },
                        {
                            name: 'Война магии',
                            level: 7,
                            description: 'После атаки в ближнем бою вы можете творить заговор действием.',
                            type: 'subclass'
                        }
                    ]
                }
            },
            'wizard': {
                'evocation': {
                    name: 'Школа воплощения',
                    features: [
                        {
                            name: 'Скульптура заклинаний',
                            level: 2,
                            description: 'Вы можете создавать безопасные зоны в области заклинаний.',
                            type: 'subclass'
                        },
                        {
                            name: 'Силовые заклинания',
                            level: 6,
                            description: 'Вы можете добавлять модификатор Интеллекта к урону от заклинаний.',
                            type: 'subclass'
                        },
                        {
                            name: 'Усиленное воплощение',
                            level: 10,
                            description: 'Вы можете заставить противника провалить спасбросок от вашего заклинания.',
                            type: 'subclass'
                        }
                    ]
                },
                'abjuration': {
                    name: 'Школа ограждения',
                    features: [
                        {
                            name: 'Магический доспех',
                            level: 2,
                            description: 'Вы создаёте магический барьер, поглощающий урон.',
                            type: 'subclass'
                        },
                        {
                            name: 'Проекция доспеха',
                            level: 6,
                            description: 'Вы можете проецировать свой магический доспех на союзников.',
                            type: 'subclass'
                        },
                        {
                            name: 'Улучшенное ограждение',
                            level: 10,
                            description: 'Вы получаете сопротивление урону от заклинаний.',
                            type: 'subclass'
                        }
                    ]
                }
            },
            'cleric': {
                'knowledge': {
                    name: 'Знание',
                    features: [
                        {
                            name: 'Благословение знаний',
                            level: 1,
                            description: 'Вы получаете владение двумя навыками из следующих: История, Религия, Магия или Природа.',
                            type: 'subclass'
                        },
                        {
                            name: 'Чтение мыслей',
                            level: 2,
                            description: 'Вы можете действием прикоснуться к существу и узнать его мысли.',
                            type: 'subclass'
                        },
                        {
                            name: 'Вдохновение знаний',
                            level: 6,
                            description: 'Вы можете вдохновлять союзников, давая им бонус к проверкам характеристик.',
                            type: 'subclass'
                        }
                    ]
                },
                'life': {
                    name: 'Жизнь',
                    features: [
                        {
                            name: 'Ученик жизни',
                            level: 1,
                            description: 'Ваши заклинания лечения восстанавливают дополнительные хиты.',
                            type: 'subclass'
                        },
                        {
                            name: 'Сохраняющая жизнь',
                            level: 2,
                            description: 'Вы можете перераспределять хиты между существами при лечении.',
                            type: 'subclass'
                        },
                        {
                            name: 'Благословенная целительница',
                            level: 6,
                            description: 'Заклинания лечения, которые вы накладываете на других, также лечат и вас.',
                            type: 'subclass'
                        }
                    ]
                },
                'light': {
                    name: 'Свет',
                    features: [
                        {
                            name: 'Защита света',
                            level: 1,
                            description: 'Вы можете создать ослепляющую вспышку света.',
                            type: 'subclass'
                        },
                        {
                            name: 'Сияние зари',
                            level: 2,
                            description: 'Вы призываете огненный дух, который атакует ваших врагов.',
                            type: 'subclass'
                        },
                        {
                            name: 'Улучшенная вспышка',
                            level: 6,
                            description: 'Враги получают помеху по атакам против вас, если находятся в вашем свете.',
                            type: 'subclass'
                        }
                    ]
                },
                'war': {
                    name: 'Война',
                    features: [
                        {
                            name: 'Воин священной войны',
                            level: 1,
                            description: 'Вы получаете владение боевым оружием.',
                            type: 'subclass'
                        },
                        {
                            name: 'Направляющий удар',
                            level: 2,
                            description: 'Вы можете дать союзнику бонус к броску атаки.',
                            type: 'subclass'
                        },
                        {
                            name: 'Божественный удар',
                            level: 6,
                            description: 'Ваши атаки оружием наносят дополнительный урон.',
                            type: 'subclass'
                        }
                    ]
                }
            }
        };
    }

    bindEvents() {
        // Навигация по уровням
        this.setupLevelNavigation();
    }

    setupLevelNavigation() {
        // Будет вызываться при обновлении UI
    }

    updateUI() {
        console.log('Обновление UI особенностей...');
        this.updateRaceFeatures();
        this.updateClassFeatures();
        this.updateSubclassFeatures();
        this.updateAllFeaturesByLevel();
        this.updateLevelNavigation();
    }

    updateRaceFeatures() {
        const raceFeaturesElement = document.getElementById('raceFeatures');
        if (!raceFeaturesElement) return;

        const raceSelect = document.getElementById('characterRace');
        const raceId = raceSelect ? raceSelect.value : '';

        console.log('Обновление особенностей расы:', raceId);

        if (!raceId || !this.featuresData.races[raceId]) {
            raceFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>Выберите расу, чтобы увидеть её особенности</p>
                </div>
            `;
            return;
        }

        const race = this.featuresData.races[raceId];
        const features = race.features;

        if (features.length === 0) {
            raceFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>У этой расы нет особенностей</p>
                </div>
            `;
            return;
        }

        raceFeaturesElement.innerHTML = features.map(feature => `
            <div class="feature-card race-feature feature-fade-in">
                <div class="feature-header">
                    <div class="feature-name">${feature.name}</div>
                    <div class="feature-level">Ур. ${feature.level}</div>
                </div>
                <div class="feature-description">${feature.description}</div>
                <div class="feature-source">Раса: ${race.name}</div>
            </div>
        `).join('');
    }

    updateClassFeatures() {
        const classFeaturesElement = document.getElementById('classFeatures');
        if (!classFeaturesElement) return;

        const classSelect = document.getElementById('characterClass');
        const classId = classSelect ? classSelect.value : '';

        console.log('Обновление особенностей класса:', classId);

        if (!classId || !this.featuresData.classes[classId]) {
            classFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>Выберите класс, чтобы увидеть его особенности</p>
                </div>
            `;
            return;
        }

        const characterClass = this.featuresData.classes[classId];
        const currentLevel = this.getCharacterLevel();
        
        // Фильтруем особенности по текущему уровню
        const availableFeatures = characterClass.features.filter(
            feature => feature.level <= currentLevel
        );

        if (availableFeatures.length === 0) {
            classFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>На текущем уровне у этого класса нет особенностей</p>
                </div>
            `;
            return;
        }

        classFeaturesElement.innerHTML = availableFeatures.map(feature => `
            <div class="feature-card class-feature feature-fade-in">
                <div class="feature-header">
                    <div class="feature-name">${feature.name}</div>
                    <div class="feature-level">Ур. ${feature.level}</div>
                </div>
                <div class="feature-description">${feature.description}</div>
                <div class="feature-source">Класс: ${characterClass.name}</div>
            </div>
        `).join('');
    }

    updateSubclassFeatures() {
        const subclassFeaturesElement = document.getElementById('subclassFeatures');
        if (!subclassFeaturesElement) return;

        const classSelect = document.getElementById('characterClass');
        const subclassSelect = document.getElementById('characterSubclass');
        
        const classId = classSelect ? classSelect.value : '';
        const subclassId = subclassSelect ? subclassSelect.value : '';

        console.log('Обновление особенностей подкласса:', classId, subclassId);

        if (!classId || !subclassId || !this.featuresData.subclasses[classId] || !this.featuresData.subclasses[classId][subclassId]) {
            subclassFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>Выберите подкласс, чтобы увидеть его особенности</p>
                </div>
            `;
            return;
        }

        const subclass = this.featuresData.subclasses[classId][subclassId];
        const currentLevel = this.getCharacterLevel();
        
        // Фильтруем особенности по текущему уровню
        const availableFeatures = subclass.features.filter(
            feature => feature.level <= currentLevel
        );

        if (availableFeatures.length === 0) {
            subclassFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-info-circle"></i>
                    <p>На текущем уровне у этого подкласса нет особенностей</p>
                </div>
            `;
            return;
        }

        subclassFeaturesElement.innerHTML = availableFeatures.map(feature => `
            <div class="feature-card subclass-feature feature-fade-in">
                <div class="feature-header">
                    <div class="feature-name">${feature.name}</div>
                    <div class="feature-level">Ур. ${feature.level}</div>
                </div>
                <div class="feature-description">${feature.description}</div>
                <div class="feature-source">Подкласс: ${subclass.name}</div>
            </div>
        `).join('');
    }

    updateAllFeaturesByLevel() {
        const allFeaturesElement = document.getElementById('allFeaturesByLevel');
        if (!allFeaturesElement) return;

        const raceSelect = document.getElementById('characterRace');
        const classSelect = document.getElementById('characterClass');
        const subclassSelect = document.getElementById('characterSubclass');
        
        const raceId = raceSelect ? raceSelect.value : '';
        const classId = classSelect ? classSelect.value : '';
        const subclassId = subclassSelect ? subclassSelect.value : '';

        if (!raceId && !classId) {
            allFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-card-checklist"></i>
                    <p>Выберите расу и класс, чтобы увидеть все особенности</p>
                </div>
            `;
            return;
        }

        // Собираем все особенности
        const allFeatures = [];

        // Особенности расы
        if (raceId && this.featuresData.races[raceId]) {
            const raceFeatures = this.featuresData.races[raceId].features.map(feature => ({
                ...feature,
                source: 'race',
                sourceName: this.featuresData.races[raceId].name
            }));
            allFeatures.push(...raceFeatures);
        }

        // Особенности класса
        if (classId && this.featuresData.classes[classId]) {
            const classFeatures = this.featuresData.classes[classId].features.map(feature => ({
                ...feature,
                source: 'class',
                sourceName: this.featuresData.classes[classId].name
            }));
            allFeatures.push(...classFeatures);
        }

        // Особенности подкласса
        if (classId && subclassId && this.featuresData.subclasses[classId] && this.featuresData.subclasses[classId][subclassId]) {
            const subclassFeatures = this.featuresData.subclasses[classId][subclassId].features.map(feature => ({
                ...feature,
                source: 'subclass',
                sourceName: this.featuresData.subclasses[classId][subclassId].name
            }));
            allFeatures.push(...subclassFeatures);
        }

        if (allFeatures.length === 0) {
            allFeaturesElement.innerHTML = `
                <div class="empty-features">
                    <i class="bi bi-card-checklist"></i>
                    <p>Нет доступных особенностей</p>
                </div>
            `;
            return;
        }

        // Сортируем особенности по уровню
        allFeatures.sort((a, b) => a.level - b.level);

        allFeaturesElement.innerHTML = allFeatures.map(feature => `
            <div class="feature-card ${feature.source}-feature feature-fade-in">
                <div class="feature-header">
                    <div class="feature-name">
                        ${feature.name}
                        <span class="feature-type-badge ${feature.source}">
                            ${feature.source === 'race' ? 'Раса' : feature.source === 'class' ? 'Класс' : 'Подкласс'}
                        </span>
                    </div>
                    <div class="feature-level">Ур. ${feature.level}</div>
                </div>
                <div class="feature-description">${feature.description}</div>
                <div class="feature-source">${feature.sourceName}</div>
            </div>
        `).join('');
    }

    updateLevelNavigation() {
        const levelButtonsContainer = document.querySelector('.level-buttons');
        if (!levelButtonsContainer) return;

        const currentLevel = this.getCharacterLevel();
        
        levelButtonsContainer.innerHTML = '';
        for (let level = 1; level <= 20; level++) {
            const button = document.createElement('button');
            button.className = `level-btn ${level === this.currentLevel ? 'active' : ''}`;
            button.textContent = level;
            button.title = `Перейти к уровню ${level}`;
            
            button.addEventListener('click', () => {
                this.currentLevel = level;
                this.updateLevelNavigation();
                this.scrollToLevel(level);
            });
            
            // Делаем кнопки недоступными для уровней выше текущего
            if (level > currentLevel) {
                button.disabled = true;
                button.style.opacity = '0.5';
                button.title = `Уровень ${level} ещё недоступен`;
            }
            
            levelButtonsContainer.appendChild(button);
        }
    }

    scrollToLevel(level) {
        const allFeaturesElement = document.getElementById('allFeaturesByLevel');
        if (!allFeaturesElement) return;

        const levelElement = allFeaturesElement.querySelector(`.level-section:nth-child(${level})`);
        if (levelElement) {
            levelElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Добавляем подсветку
            levelElement.style.background = 'rgba(184, 134, 11, 0.1)';
            levelElement.style.borderRadius = '8px';
            levelElement.style.padding = '1rem';
            levelElement.style.margin = '0 -1rem';
            
            setTimeout(() => {
                levelElement.style.background = '';
                levelElement.style.padding = '';
                levelElement.style.margin = '';
            }, 2000);
        }
    }

    getCharacterLevel() {
        const levelDisplay = document.getElementById('levelDisplay');
        return levelDisplay ? parseInt(levelDisplay.textContent) : 1;
    }

    refreshFeatures() {
        console.log('Обновление особенностей...');
        this.updateUI();
    }

    getFeaturesData() {
        return {
            currentLevel: this.currentLevel
        };
    }

    setFeaturesData(data) {
        if (data) {
            this.currentLevel = data.currentLevel || 1;
            this.updateUI();
        }
    }
}

// Инициализация менеджера особенностей
window.featuresManager = new FeaturesManager();