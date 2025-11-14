// Менеджер состояний и здоровья персонажа
class StatusManager {
    constructor() {
        this.status = {
            maxHealth: 10,
            currentHealth: 10,
            temporaryHealth: 0,
            hitDice: '1d6',
            armorClass: 10,
            initiative: 0,
            speed: 30,
            states: [],
            savingThrows: {
                strength: { value: 0, proficient: false },
                dexterity: { value: 0, proficient: false },
                constitution: { value: 0, proficient: false },
                intelligence: { value: 0, proficient: false },
                wisdom: { value: 0, proficient: false },
                charisma: { value: 0, proficient: false }
            }
        };

        this.statesData = [];
        
        this.init();
    }

    async init() {
        await this.loadStatesData();
        this.bindEvents();
        this.updateUI();
    }

    async loadStatesData() {
        // Данные состояний (баффы и дебаффы)
        this.statesData = [
            { 
                id: 'blessed', 
                name: 'Благословение', 
                type: 'buff', 
                description: '+1d4 к броскам атаки и спасброскам',
                effect: { savingThrowBonus: '1d4' }
            },
            { 
                id: 'cursed', 
                name: 'Проклятие', 
                type: 'debuff', 
                description: '-1d4 к броскам атаки и спасброскам',
                effect: { savingThrowPenalty: '1d4' }
            },
            { 
                id: 'hasted', 
                name: 'Ускорение', 
                type: 'buff', 
                description: 'Удвоенная скорость, +2 к КБ, преимущество на ловкость',
                effect: { speedMultiplier: 2, acBonus: 2 }
            },
            { 
                id: 'slowed', 
                name: 'Замедление', 
                type: 'debuff', 
                description: 'Скорость уменьшена вдвое, -2 к КБ, помеха на ловкость',
                effect: { speedMultiplier: 0.5, acPenalty: 2 }
            },
            { 
                id: 'invisible', 
                name: 'Невидимость', 
                type: 'buff', 
                description: 'Противники имеют помеху при атаке по вам',
                effect: { advantageOnAttacksAgainst: true }
            },
            { 
                id: 'poisoned', 
                name: 'Отравление', 
                type: 'debuff', 
                description: 'Помеха на броски атаки и проверки характеристик',
                effect: { disadvantageOnAbilityChecks: true, disadvantageOnAttackRolls: true }
            },
            { 
                id: 'frightened', 
                name: 'Испуг', 
                type: 'debuff', 
                description: 'Помеха на проверки характеристик и атаки, пока видите источник страха',
                effect: { disadvantageOnAbilityChecks: true, disadvantageOnAttackRolls: true }
            },
            { 
                id: 'rage', 
                name: 'Ярость', 
                type: 'buff', 
                description: 'Преимущество на телыосложение, сопротивление урону',
                effect: { advantageOnStrengthSaves: true, damageResistance: ['bludgeoning', 'piercing', 'slashing'] }
            },
            { 
                id: 'exhaustion-1', 
                name: 'Истощение 1', 
                type: 'debuff', 
                description: 'Помеха на проверки характеристик',
                effect: { disadvantageOnAbilityChecks: true }
            },
            { 
                id: 'exhaustion-2', 
                name: 'Истощение 2', 
                type: 'debuff', 
                description: 'Скорость уменьшена вдвое',
                effect: { speedMultiplier: 0.5 }
            },
            { 
                id: 'exhaustion-3', 
                name: 'Истощение 3', 
                type: 'debuff', 
                description: 'Помеха на броски атаки и спасброски',
                effect: { disadvantageOnAttackRolls: true, disadvantageOnSavingThrows: true }
            }
        ];

        this.populateStatesSelect();
    }

    populateStatesSelect() {
        const stateSelect = document.getElementById('stateSelect');
        if (!stateSelect) return;

        stateSelect.innerHTML = '<option value="">Выберите состояние...</option>';
        
        this.statesData.forEach(state => {
            const option = document.createElement('option');
            option.value = state.id;
            option.textContent = state.name;
            stateSelect.appendChild(option);
        });
    }

    bindEvents() {
        console.log('Привязка обработчиков состояний...');
        
        // Здоровье
        const currentHealthInput = document.getElementById('currentHealth');
        if (currentHealthInput) {
            // Удаляем старые обработчики и добавляем новые
            currentHealthInput.replaceWith(currentHealthInput.cloneNode(true));
            const newInput = document.getElementById('currentHealth');
            
            newInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) || 0;
                this.handleHealthChange(value);
            });
        }

        const temporaryHealthInput = document.getElementById('temporaryHealth');
        if (temporaryHealthInput) {
            temporaryHealthInput.replaceWith(temporaryHealthInput.cloneNode(true));
            const newInput = document.getElementById('temporaryHealth');
            
            newInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value) || 0;
                this.handleTemporaryHealthChange(value);
            });
        }

        // Отдых - УБИРАЕМ дублирование обработчиков
        const shortRestBtn = document.getElementById('shortRestBtn');
        if (shortRestBtn) {
            shortRestBtn.replaceWith(shortRestBtn.cloneNode(true));
            const newBtn = document.getElementById('shortRestBtn');
            
            newBtn.addEventListener('click', () => this.handleShortRest());
        }

        const longRestBtn = document.getElementById('longRestBtn');
        if (longRestBtn) {
            longRestBtn.replaceWith(longRestBtn.cloneNode(true));
            const newBtn = document.getElementById('longRestBtn');
            
            newBtn.addEventListener('click', () => this.handleLongRest());
        }

        // Состояния
        const addStateBtn = document.getElementById('addStateBtn');
        if (addStateBtn) {
            addStateBtn.replaceWith(addStateBtn.cloneNode(true));
            const newBtn = document.getElementById('addStateBtn');
            
            newBtn.addEventListener('click', () => this.addState());
        }
    }

    handleHealthChange(newHealth) {
        const maxHealth = this.calculateMaxHealth();
        
        if (newHealth < 0) newHealth = 0;
        if (newHealth > maxHealth) newHealth = maxHealth;
        
        this.status.currentHealth = newHealth;
        this.updateHealthVisualization();
        
        // Анимация изменения здоровья
        const healthBar = document.getElementById('healthBar');
        if (healthBar) {
            healthBar.classList.add('health-change');
            setTimeout(() => healthBar.classList.remove('health-change'), 500);
        }
    }

    handleTemporaryHealthChange(newTempHealth) {
        this.status.temporaryHealth = newTempHealth;
        this.updateHealthVisualization();
    }

    handleShortRest() {
        if (!confirm('Совершить короткий отдых? Вы восстановите часть здоровья, потратив кости хитов.')) {
            return;
        }

        // Восстановление здоровья через кости хитов
        const hitDiceValue = this.getHitDiceValue();
        const constitutionModifier = window.attributesManager ? 
            window.attributesManager.attributes.constitution.modifier : 0;
        
        const healAmount = Math.floor(hitDiceValue / 2) + 1 + constitutionModifier;
        const newHealth = Math.min(this.status.currentHealth + healAmount, this.status.maxHealth);
        
        this.status.currentHealth = newHealth;
        this.updateHealthVisualization();
        
        // Показываем сообщение о восстановлении - ТОЛЬКО ОДИН РАЗ
        this.showMessage(`Вы восстановили ${healAmount} здоровья`, 'success');
    }

    handleLongRest() {
        if (!confirm('Совершить длительный отдых? Вы восстановите всё здоровье, хиты и способности.')) {
            return;
        }

        // Полное восстановление
        this.status.currentHealth = this.status.maxHealth;
        this.status.temporaryHealth = 0;
        
        // Сбрасываем некоторые состояния (кроме истощения)
        this.status.states = this.status.states.filter(state => 
            state.id.startsWith('exhaustion')
        );
        
        this.updateHealthVisualization();
        this.updateStatesList();
        
        // Показываем сообщение - ТОЛЬКО ОДИН РАЗ
        this.showMessage('Вы полностью восстановились после длительного отдыха', 'success');
    }

    getHitDiceValue() {
        // Парсим значение кости хитов (например, "1d6" -> 6)
        const match = this.status.hitDice.match(/d(\d+)/);
        return match ? parseInt(match[1]) : 6;
    }

    addState() {
        const stateSelect = document.getElementById('stateSelect');
        const selectedStateId = stateSelect.value;
        
        if (!selectedStateId) {
            this.showMessage('Выберите состояние для добавления', 'warning');
            return;
        }

        const stateData = this.statesData.find(state => state.id === selectedStateId);
        if (!stateData) return;

        // Проверяем, не добавлено ли уже это состояние
        if (this.status.states.some(state => state.id === selectedStateId)) {
            this.showMessage('Это состояние уже активно', 'warning');
            return;
        }

        // Добавляем состояние
        this.status.states.push({
            id: stateData.id,
            name: stateData.name,
            type: stateData.type,
            description: stateData.description,
            effect: stateData.effect
        });

        // Сбрасываем выбор
        stateSelect.value = '';

        this.updateStatesList();
        this.applyStateEffects();
        this.showMessage(`Состояние "${stateData.name}" добавлено`, 'success');
    }

    removeState(stateId) {
        this.status.states = this.status.states.filter(state => state.id !== stateId);
        this.updateStatesList();
        this.applyStateEffects();
        this.showMessage('Состояние удалено', 'info');
    }

    updateStatesList() {
        const statesList = document.getElementById('statesList');
        if (!statesList) return;

        if (this.status.states.length === 0) {
            statesList.innerHTML = `
                <div class="empty-states">
                    <i class="bi bi-check2-circle"></i>
                    <p>Нет активных состояний</p>
                </div>
            `;
            return;
        }

        statesList.innerHTML = this.status.states.map(state => `
            <div class="state-item ${state.type}">
                <div class="state-info">
                    <div class="state-name">${state.name}</div>
                    <div class="state-description">${state.description}</div>
                </div>
                <div class="state-actions">
                    <button class="btn-state-action btn-remove-state" data-state-id="${state.id}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики удаления
        statesList.querySelectorAll('.btn-remove-state').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const stateId = e.currentTarget.getAttribute('data-state-id');
                this.removeState(stateId);
            });
        });
    }

    applyStateEffects() {
        // Сбрасываем все эффекты
        this.resetStateEffects();

        // Применяем активные состояния
        this.status.states.forEach(state => {
            this.applySingleStateEffect(state);
        });

        // Обновляем UI
        this.updateDerivedStats();
    }

    resetStateEffects() {
        // Сбрасываем модификаторы к исходным значениям
        // В реальной реализации здесь нужно сбросить все временные модификаторы
    }

    applySingleStateEffect(state) {
        // Применяем эффекты конкретного состояния
        // В реальной реализации здесь нужно применять различные модификаторы
        console.log(`Applying effect for state: ${state.name}`, state.effect);
    }

    updateHealthVisualization() {
        const maxHealth = this.calculateMaxHealth();
        const currentHealth = this.status.currentHealth;
        const tempHealth = this.status.temporaryHealth;
        
        // Ограничиваем текущее здоровье максимальным
        if (currentHealth > maxHealth) {
            this.status.currentHealth = maxHealth;
        }
        
        const totalHealth = this.status.currentHealth + tempHealth;
        
        // Обновляем текстовое отображение
        const healthText = document.getElementById('healthText');
        if (healthText) {
            healthText.textContent = `${this.status.currentHealth}/${maxHealth}`;
            if (tempHealth > 0) {
                healthText.textContent += ` (+${tempHealth})`;
            }
        }
        
        // Обновляем полоску здоровья
        const healthFill = document.getElementById('healthFill');
        if (healthFill) {
            const percentage = (this.status.currentHealth / maxHealth) * 100;
            healthFill.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
            
            // Меняем цвет в зависимости от уровня здоровья
            if (percentage > 50) {
                healthFill.style.background = 'linear-gradient(90deg, var(--dnd-success) 0%, #4CAF50 100%)';
            } else if (percentage > 25) {
                healthFill.style.background = 'linear-gradient(90deg, var(--dnd-warning) 0%, #FF9800 100%)';
            } else {
                healthFill.style.background = 'linear-gradient(90deg, var(--dnd-danger) 0%, #F44336 100%)';
            }
        }
        
        // Обновляем поля ввода
        const currentHealthInput = document.getElementById('currentHealth');
        if (currentHealthInput) {
            currentHealthInput.value = this.status.currentHealth;
            currentHealthInput.max = maxHealth; // Устанавливаем максимальное значение
        }
        
        const maxHealthInput = document.getElementById('maxHealth');
        if (maxHealthInput) {
            maxHealthInput.value = maxHealth;
        }
        
        const tempHealthInput = document.getElementById('temporaryHealth');
        if (tempHealthInput) {
            tempHealthInput.value = tempHealth;
        }
    }

    refreshAllStats() {
        this.updateMaxHealth();
        this.updateHitDice();
        this.updateDerivedStats();
        this.updateHealthVisualization();
    }

    updateDerivedStats() {
        // Класс брони - используем единую функцию расчета
        let armorClass = 10;
        if (window.inventoryManager && window.attributesManager) {
            armorClass = window.inventoryManager.calculateArmorClass();
        } else if (window.attributesManager) {
            // Базовый расчет КБ без брони
            const dexterityModifier = window.attributesManager.attributes.dexterity.modifier;
            armorClass = 10 + dexterityModifier;
        }
        
        const armorClassElement = document.getElementById('statusArmorClass');
        if (armorClassElement) {
            armorClassElement.textContent = armorClass;
        }

        // Инициатива - рассчитываем от ловкости
        const dexterityModifier = window.attributesManager ? 
            window.attributesManager.attributes.dexterity.modifier : 0;
        
        const initiativeElement = document.getElementById('statusInitiative');
        if (initiativeElement) {
            initiativeElement.textContent = dexterityModifier >= 0 ? `+${dexterityModifier}` : dexterityModifier;
        }

        // Скорость - берем из расы и применяем модификаторы
        this.updateSpeed();

        // Обновляем спасброски
        this.updateSavingThrows();
    }

    updateSpeed() {
        // Базовая скорость из расы
        const raceSelect = document.getElementById('characterRace');
        const raceId = raceSelect ? raceSelect.value : '';
        let speed = 30; // значение по умолчанию

        // Получаем базовую скорость из расы
        if (raceId) {
            const raceSpeeds = {
                'human': 30,
                'elf': 30,
                'dwarf': 25,
                'halfling': 25,
                'gnome': 25,
                'half-elf': 30,
                'half-orc': 30,
                'tiefling': 30
            };
            speed = raceSpeeds[raceId] || 30;
        }

        // Применяем модификаторы от состояний
        this.status.states.forEach(state => {
            if (state.effect && state.effect.speedMultiplier) {
                speed = Math.floor(speed * state.effect.speedMultiplier);
            }
            if (state.effect && state.effect.speedBonus) {
                speed += state.effect.speedBonus;
            }
            if (state.effect && state.effect.speedPenalty) {
                speed = Math.max(0, speed - state.effect.speedPenalty);
            }
        });

        this.status.speed = speed;
        const speedElement = document.getElementById('statusSpeed');
        if (speedElement) {
            speedElement.textContent = speed;
        }
    }

    updateSavingThrows() {
        if (!window.attributesManager) return;

        const attributes = window.attributesManager.attributes;
        const level = this.getCharacterLevel();
        const proficiencyBonus = DNDCalculators.getProficiencyBonus(level);
        
        Object.keys(attributes).forEach(attribute => {
            const modifier = attributes[attribute].modifier;
            const isProficient = attributes[attribute].save;
            const saveValue = isProficient ? modifier + proficiencyBonus : modifier;
            
            // Обновляем значение спасброска
            const saveElement = document.getElementById(`${attribute}Save`);
            if (saveElement) {
                saveElement.textContent = saveValue >= 0 ? `+${saveValue}` : saveValue;
            }
            
            // Обновляем иконку владения
            const saveIcon = document.getElementById(`${attribute}SaveIcon`);
            if (saveIcon) {
                saveIcon.style.display = isProficient ? 'block' : 'none';
            }
            
            // Обновляем стиль карточки
            const saveCard = document.querySelector(`[data-save="${attribute}"]`);
            if (saveCard) {
                saveCard.classList.toggle('proficient', isProficient);
            }
        });
    }

    getCharacterLevel() {
        // Получаем уровень персонажа из основной формы
        const levelDisplay = document.getElementById('levelDisplay');
        return levelDisplay ? parseInt(levelDisplay.textContent) : 1;
    }

    updateUI() {
        this.updateHealthVisualization();
        this.updateDerivedStats();
        this.updateStatesList();
    }

    calculateMaxHealth() {
        if (!window.attributesManager) return 10;

        const level = this.getCharacterLevel();
        const constitutionModifier = window.attributesManager.attributes.constitution.modifier;
        const characterClass = document.getElementById('characterClass')?.value;
        
        if (!characterClass) return 10;

        const hitDie = DNDCalculators.getClassHitDie(characterClass);
        
        // Расчет максимального здоровья по правилам D&D
        let maxHealth = hitDie + constitutionModifier;
        
        for (let i = 2; i <= level; i++) {
            maxHealth += Math.floor(hitDie / 2) + 1 + constitutionModifier;
        }
        
        return Math.max(1, maxHealth);
    }

    updateHitDice() {
        const characterClass = document.getElementById('characterClass')?.value;
        const level = this.getCharacterLevel();
        
        if (!characterClass) return;

        const hitDie = DNDCalculators.getClassHitDie(characterClass);
        this.status.hitDice = `${level}d${hitDie}`;
        
        const hitDiceInput = document.getElementById('hitDice');
        if (hitDiceInput) {
            hitDiceInput.value = this.status.hitDice;
        }
    }

    updateMaxHealth() {
        const newMaxHealth = this.calculateMaxHealth();
        this.status.maxHealth = newMaxHealth;
        
        // Корректируем текущее здоровье, если оно превышает новый максимум
        if (this.status.currentHealth > newMaxHealth) {
            this.status.currentHealth = newMaxHealth;
        }
        
        this.updateHealthVisualization();
    }

    showMessage(message, type = 'info') {
        // Создаем временное сообщение
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show`;
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Добавляем сообщение в начало контейнера
        const container = document.querySelector('.status-container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            
            // Автоматически удаляем сообщение через 5 секунд
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 5000);
        }
    }

    getStatusData() {
        return this.status;
    }

    setStatusData(data) {
        if (data) {
            this.status = { ...this.status, ...data };
            this.updateUI();
            
            // Восстанавливаем значения полей
            const currentHealthInput = document.getElementById('currentHealth');
            if (currentHealthInput) currentHealthInput.value = this.status.currentHealth;
            
            const maxHealthInput = document.getElementById('maxHealth');
            if (maxHealthInput) maxHealthInput.value = this.status.maxHealth;
            
            const tempHealthInput = document.getElementById('temporaryHealth');
            if (tempHealthInput) tempHealthInput.value = this.status.temporaryHealth;
            
            const hitDiceInput = document.getElementById('hitDice');
            if (hitDiceInput) hitDiceInput.value = this.status.hitDice;
        }
    }

    // Метод для применения урона
    takeDamage(amount) {
        if (this.status.temporaryHealth > 0) {
            const tempDamage = Math.min(amount, this.status.temporaryHealth);
            this.status.temporaryHealth -= tempDamage;
            amount -= tempDamage;
        }
        
        if (amount > 0) {
            this.status.currentHealth = Math.max(0, this.status.currentHealth - amount);
            
            // Анимация получения урона
            const healthBar = document.getElementById('healthBar');
            if (healthBar) {
                healthBar.classList.add('damage-taken');
                setTimeout(() => healthBar.classList.remove('damage-taken'), 500);
            }
        }
        
        this.updateHealthVisualization();
        
        if (this.status.currentHealth === 0) {
            this.showMessage('Персонаж повержен!', 'danger');
        }
    }

    // Метод для лечения
    heal(amount) {
        this.status.currentHealth = Math.min(this.status.maxHealth, this.status.currentHealth + amount);
        this.updateHealthVisualization();
        
        // Анимация лечения
        const healthBar = document.getElementById('healthBar');
        if (healthBar) {
            healthBar.classList.add('health-change');
            setTimeout(() => healthBar.classList.remove('health-change'), 500);
        }
    }
}

// Инициализация менеджера состояний
window.statusManager = new StatusManager();