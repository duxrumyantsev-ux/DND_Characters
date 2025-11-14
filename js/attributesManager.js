// Менеджер характеристик персонажа
class AttributesManager {
    constructor() {
        this.availablePoints = 27;
        this.attributes = {
            strength: { score: 8, modifier: -1, save: false },
            dexterity: { score: 8, modifier: -1, save: false },
            constitution: { score: 8, modifier: -1, save: false },
            intelligence: { score: 8, modifier: -1, save: false },
            wisdom: { score: 8, modifier: -1, save: false },
            charisma: { score: 8, modifier: -1, save: false }
        };
        
        this.skills = {
            // Сила
            'athletics': { ability: 'strength', proficient: false, value: 0 },
            
            // Ловкость
            'acrobatics': { ability: 'dexterity', proficient: false, value: 0 },
            'sleight-of-hand': { ability: 'dexterity', proficient: false, value: 0 },
            'stealth': { ability: 'dexterity', proficient: false, value: 0 },
            
            // Интеллект
            'arcana': { ability: 'intelligence', proficient: false, value: 0 },
            'history': { ability: 'intelligence', proficient: false, value: 0 },
            'investigation': { ability: 'intelligence', proficient: false, value: 0 },
            'nature': { ability: 'intelligence', proficient: false, value: 0 },
            'religion': { ability: 'intelligence', proficient: false, value: 0 },
            
            // Мудрость
            'animal-handling': { ability: 'wisdom', proficient: false, value: 0 },
            'insight': { ability: 'wisdom', proficient: false, value: 0 },
            'medicine': { ability: 'wisdom', proficient: false, value: 0 },
            'perception': { ability: 'wisdom', proficient: false, value: 0 },
            'survival': { ability: 'wisdom', proficient: false, value: 0 },
            
            // Харизма
            'deception': { ability: 'charisma', proficient: false, value: 0 },
            'intimidation': { ability: 'charisma', proficient: false, value: 0 },
            'performance': { ability: 'charisma', proficient: false, value: 0 },
            'persuasion': { ability: 'charisma', proficient: false, value: 0 }
        };
        
        this.maxSkillProficiencies = 4;

        this.pointCosts = {
            8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        const attributes = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        attributes.forEach(attr => {
            const input = document.getElementById(`${attr}-score`);
            input.replaceWith(input.cloneNode(true));
            const newInput = document.getElementById(`${attr}-score`);
            
            newInput.addEventListener('input', (e) => this.handleAttributeInput(attr, parseInt(e.target.value) || 8));
            newInput.addEventListener('change', (e) => this.handleAttributeChange(attr, parseInt(e.target.value) || 8));
            
            // БЛОКИРУЕМ чекбоксы спасбросков и убираем обработчики
            const saveCheckbox = document.getElementById(`${attr}-save`);
            if (saveCheckbox) {
                saveCheckbox.disabled = true;
                saveCheckbox.title = "Спасбросок определяется классом персонажа";
                // Убираем все обработчики событий
                saveCheckbox.replaceWith(saveCheckbox.cloneNode(true));
            }
        });

        // Кнопка рандомизации
        const randomizeBtn = document.getElementById('randomizeAttributes');
        randomizeBtn.replaceWith(randomizeBtn.cloneNode(true));
        document.getElementById('randomizeAttributes').addEventListener('click', () => this.randomizeAttributes());

        // Обработчики навыков
        this.bindSkillEvents();
    }

    bindSkillEvents() {
        const skillIds = Object.keys(this.skills);
        
        skillIds.forEach(skillId => {
            const checkbox = document.getElementById(`skill-${skillId}`);
            if (checkbox) {
                checkbox.replaceWith(checkbox.cloneNode(true));
                const newCheckbox = document.getElementById(`skill-${skillId}`);
                
                newCheckbox.addEventListener('change', (e) => {
                    this.handleSkillChange(skillId, e.target.checked);
                });
            }
        });
    }

    handleSkillChange(skillId, isProficient) {
        const currentCount = this.getCurrentSkillProficiencies();
        
        if (isProficient && currentCount >= this.maxSkillProficiencies) {
            alert(`Вы можете выбрать только ${this.maxSkillProficiencies} навыков!`);
            const checkbox = document.getElementById(`skill-${skillId}`);
            checkbox.checked = false;
            return;
        }

        this.skills[skillId].proficient = isProficient;
        this.updateSkills();
        this.updateSkillCounter();
    }

    getCurrentSkillProficiencies() {
        return Object.values(this.skills).filter(skill => skill.proficient).length;
    }

    updateSkillCounter() {
        const currentElement = document.getElementById('currentSkills');
        const maxElement = document.getElementById('maxSkills');
        
        if (currentElement) {
            currentElement.textContent = this.getCurrentSkillProficiencies();
        }
        if (maxElement) {
            maxElement.textContent = this.maxSkillProficiencies;
        }
    }

    updateSkills() {
        const proficiencyBonus = DNDCalculators.getProficiencyBonus(this.getCharacterLevel());
        
        Object.keys(this.skills).forEach(skillId => {
            const skill = this.skills[skillId];
            const abilityModifier = this.attributes[skill.ability].modifier;
            skill.value = abilityModifier + (skill.proficient ? proficiencyBonus : 0);
            
            // Обновляем отображение
            const valueElement = document.getElementById(`skill-${skillId}-value`);
            if (valueElement) {
                valueElement.textContent = skill.value >= 0 ? `+${skill.value}` : skill.value;
            }
        });
    }

    getCharacterLevel() {
        const levelDisplay = document.getElementById('levelDisplay');
        return levelDisplay ? parseInt(levelDisplay.textContent) : 1;
    }

    handleAttributeInput(attribute, newScore) {
        // Валидация в реальном времени
        if (newScore < 8) newScore = 8;
        if (newScore > 15) newScore = 15;
        
        this.updateAttributePreview(attribute, newScore);
    }

    handleAttributeChange(attribute, newScore) {
        // Финальная валидация и применение изменений
        if (newScore < 8 || newScore > 15 || isNaN(newScore)) {
            this.resetAttributeInput(attribute);
            return;
        }

        const oldScore = this.attributes[attribute].score;
        const costChange = this.calculateCostChange(oldScore, newScore);

        if (costChange > this.availablePoints) {
            alert('Недостаточно очков для увеличения характеристики!');
            this.resetAttributeInput(attribute);
            return;
        }

        this.attributes[attribute].score = newScore;
        this.attributes[attribute].modifier = DNDCalculators.calculateAbilityModifier(newScore);
        this.availablePoints -= costChange;

        this.updateUI();

        // Особенно важно при изменении ловкости (влияет на КБ и инициативу)
        if (attribute === 'dexterity' && window.inventoryManager) {
            window.inventoryManager.updateArmorClass();
        }
    }

    handleSaveChange(attribute, hasSave) {
        this.attributes[attribute].save = hasSave;
        this.updateSaveProficiency(attribute);
    }

    calculateCostChange(oldScore, newScore) {
        return this.pointCosts[newScore] - this.pointCosts[oldScore];
    }

    updateAttributePreview(attribute, newScore) {
        const modifier = DNDCalculators.calculateAbilityModifier(newScore);
        
        // Временно обновляем отображение
        document.getElementById(`${attribute}-modifier`).textContent = 
            modifier >= 0 ? `+${modifier}` : modifier;
        document.getElementById(`${attribute}-check`).textContent = 
            modifier >= 0 ? `+${modifier}` : modifier;
    }

    resetAttributeInput(attribute) {
        const input = document.getElementById(`${attribute}-score`);
        input.value = this.attributes[attribute].score;
        this.updateAttributePreview(attribute, this.attributes[attribute].score);
    }

    updateSaveProficiency(attribute) {
        const checkbox = document.getElementById(`${attribute}-save`);
        const card = document.querySelector(`[data-attribute="${attribute}"]`);
        
        if (this.attributes[attribute].save) {
            card.classList.add('save-proficient');
        } else {
            card.classList.remove('save-proficient');
        }
    }

     randomizeAttributes() {
        if (!confirm('Зарандомить характеристики? Текущие значения будут потеряны.')) {
            return;
        }

        console.log('Начало рандомизации...'); // Для отладки

        const scores = this.generateRandomScores();
        const attributes = Object.keys(this.attributes);
        
        // Сбрасываем очки
        this.availablePoints = 27;
        let totalCost = 0;
        
        // Сначала вычисляем общую стоимость
        attributes.forEach((attribute, index) => {
            const score = scores[index];
            totalCost += this.pointCosts[score];
        });

        console.log('Общая стоимость случайных характеристик:', totalCost);

        // Если стоимость превышает доступные очки, корректируем
        if (totalCost > 27) {
            // Уменьшаем самые дорогие характеристики
            const sortedIndices = attributes
                .map((attr, idx) => ({ attr, idx, cost: this.pointCosts[scores[idx]] }))
                .sort((a, b) => b.cost - a.cost);

            let currentCost = totalCost;
            for (const { idx } of sortedIndices) {
                if (currentCost <= 27) break;
                while (scores[idx] > 8 && currentCost > 27) {
                    const oldCost = this.pointCosts[scores[idx]];
                    scores[idx]--;
                    const newCost = this.pointCosts[scores[idx]];
                    currentCost -= (oldCost - newCost);
                }
            }
        }

        // Применяем характеристики
        attributes.forEach((attribute, index) => {
            const newScore = scores[index];
            const cost = this.pointCosts[newScore];
            
            this.attributes[attribute].score = newScore;
            this.attributes[attribute].modifier = DNDCalculators.calculateAbilityModifier(newScore);
            this.availablePoints -= cost;
        });

        // Корректируем возможную погрешность из-за округления
        if (this.availablePoints < 0) {
            // Находим самую дорогую характеристику и уменьшаем ее
            const expensiveAttr = attributes.reduce((max, attr) => 
                this.attributes[attr].score > this.attributes[max].score ? attr : max
            );
            
            if (this.attributes[expensiveAttr].score > 8) {
                const oldScore = this.attributes[expensiveAttr].score;
                this.attributes[expensiveAttr].score--;
                this.attributes[expensiveAttr].modifier = DNDCalculators.calculateAbilityModifier(this.attributes[expensiveAttr].score);
                this.availablePoints += (this.pointCosts[oldScore] - this.pointCosts[this.attributes[expensiveAttr].score]);
            }
        }

        console.log('Рандомизация завершена. Оставшиеся очки:', this.availablePoints);
        this.updateUI();
    }

    generateRandomScores() {
        const scores = [];
        for (let i = 0; i < 6; i++) {
            // Метод 4d6 drop lowest
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            rolls.sort((a, b) => a - b);
            rolls.shift(); // Убираем наименьший
            const total = rolls.reduce((sum, roll) => sum + roll, 0);
            scores.push(Math.max(8, Math.min(15, total))); // Ограничиваем 8-15
        }
        return scores;
    }

    updateUI() {
        // Обновляем доступные очки
        document.getElementById('availablePoints').textContent = this.availablePoints;

        // Обновляем каждую характеристику
        Object.keys(this.attributes).forEach(attribute => {
            const attr = this.attributes[attribute];
            
            // Обновляем поле ввода
            const scoreInput = document.getElementById(`${attribute}-score`);
            scoreInput.value = attr.score;

            // Обновляем модификатор
            const modifierElement = document.getElementById(`${attribute}-modifier`);
            modifierElement.textContent = attr.modifier >= 0 ? `+${attr.modifier}` : attr.modifier;

            // Обновляем проверку характеристики
            const checkElement = document.getElementById(`${attribute}-check`);
            checkElement.textContent = attr.modifier >= 0 ? `+${attr.modifier}` : attr.modifier;

            // Обновляем чекбокс спасброска (только отображение)
            const saveCheckbox = document.getElementById(`${attribute}-save`);
            if (saveCheckbox) {
                saveCheckbox.checked = attr.save;
                saveCheckbox.disabled = true; // Гарантируем, что он заблокирован
            }

            // Обновляем визуальное состояние
            this.updateSaveProficiency(attribute);
        });

        // Обновляем навыки
        this.updateSkills();
        this.updateSkillCounter();

        // Обновляем инициативу
        this.updateInitiative();
        
        // Уведомляем другие системы об изменении
        if (window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
    }

    getSkillsData() {
        return this.skills;
    }

    setSkillsData(data) {
        if (data) {
            this.skills = { ...this.skills, ...data };
            this.updateSkills();
            this.updateSkillCounter();
        }
    }

    setSavingThrowsByClass(characterClass) {
        const savingThrows = DNDCalculators.getClassSavingThrows(characterClass);
        const attributes = Object.keys(this.attributes);
        
        // Сбрасываем все спасброски
        attributes.forEach(attr => {
            this.attributes[attr].save = false;
        });
        
        // Устанавливаем спасброски класса
        savingThrows.forEach(attr => {
            if (this.attributes[attr]) {
                this.attributes[attr].save = true;
            }
        });
        
        this.updateUI();
    }

    updateInitiative() {
        const dexterityModifier = this.attributes.dexterity.modifier;
        const initiativeElement = document.getElementById('initiative-value');
        initiativeElement.textContent = dexterityModifier >= 0 ? `+${dexterityModifier}` : dexterityModifier;
    }

    getAttributesData() {
        return {
            ...this.attributes,
            availablePoints: this.availablePoints,
            initiative: this.attributes.dexterity.modifier
        };
    }

    setAttributesData(data) {
        if (data) {
            this.attributes = { ...this.attributes, ...data };
            this.availablePoints = data.availablePoints || 27;
            this.updateUI();
        }
    }

    validateDistribution() {
        if (this.availablePoints < 0) {
            return {
                valid: false,
                message: 'Превышено количество доступных очков!'
            };
        }

        if (this.availablePoints > 0) {
            return {
                valid: false,
                message: `У вас осталось ${this.availablePoints} нераспределенных очков.`
            };
        }

        return { valid: true, message: '' };
    }

    autoDistributeRemainingPoints() {
        const attributes = Object.keys(this.attributes);
        
        while (this.availablePoints > 0) {
            let distributed = false;
            
            for (const attribute of attributes) {
                const currentScore = this.attributes[attribute].score;
                if (currentScore < 15) {
                    const newScore = currentScore + 1;
                    const cost = this.calculateCostChange(currentScore, newScore);
                    
                    if (cost <= this.availablePoints) {
                        this.attributes[attribute].score = newScore;
                        this.attributes[attribute].modifier = DNDCalculators.calculateAbilityModifier(newScore);
                        this.availablePoints -= cost;
                        distributed = true;
                        break;
                    }
                }
            }
            
            if (!distributed) break;
        }
        
        this.updateUI();
    }
}

// Инициализация менеджера характеристик
window.attributesManager = new AttributesManager();