// Менеджер для управления формами
class FormManager {
    constructor() {
        this.currentCharacter = null;
    }

    // Инициализация обработчиков формы
    initFormHandlers() {
        // Обработчики будут добавляться по мере развития
    }

    // Валидация формы
    validateForm(formData) {
        const errors = [];

        if (!formData.name?.trim()) {
            errors.push('Имя персонажа обязательно');
        }

        if (!formData.race) {
            errors.push('Необходимо выбрать расу');
        }

        if (!formData.class) {
            errors.push('Необходимо выбрать класс');
        }

        return errors;
    }

    // Сбор данных формы
    collectFormData() {
        const baseData = {
            name: document.getElementById('characterName').value,
            race: document.getElementById('characterRace').value,
            class: document.getElementById('characterClass').value,
            subclass: document.getElementById('characterSubclass').value,
            background: document.getElementById('characterBackground').value,
            alignment: document.getElementById('characterAlignment').value,
            gender: document.querySelector('input[name="characterGender"]:checked')?.value,
            experience: parseInt(document.getElementById('characterExperience').value) || 0,
            speed: parseInt(document.getElementById('characterSpeed').value) || 30
        };
        return {
            ...baseData,
            attributes: window.attributesManager ? window.attributesManager.getAttributesData() : {},
            inventory: window.inventoryManager ? window.inventoryManager.getInventoryData() : {},
            status: window.statusManager ? window.statusManager.getStatusData() : {},
            features: window.featuresManager ? window.featuresManager.getFeaturesData() : {}
        };
    }

    // Заполнение формы данными персонажа
    populateForm(characterData) {
        if (!characterData) return;

        document.getElementById('characterName').value = characterData.name || '';
        document.getElementById('characterRace').value = characterData.race || '';
        document.getElementById('characterClass').value = characterData.class || '';
        document.getElementById('characterSubclass').value = characterData.subclass || '';
        document.getElementById('characterBackground').value = characterData.background || '';
        document.getElementById('characterAlignment').value = characterData.alignment || '';
        document.getElementById('characterExperience').value = characterData.experience || 0;
        document.getElementById('characterSpeed').value = characterData.speed || 30;

        // Установка пола
        if (characterData.gender) {
            const genderRadio = document.querySelector(`input[name="characterGender"][value="${characterData.gender}"]`);
            if (genderRadio) genderRadio.checked = true;
        }

        // Обновление зависимых полей
        if (characterData.class) {
            app.handleClassChange(characterData.class);
        }
        if (characterData.race) {
            app.handleRaceChange(characterData.race);
        }
        if (characterData.experience) {
            app.updateLevel(characterData.experience);
        }
         // Заполняем характеристики
        if (characterData.attributes) {
            window.attributesManager.setAttributesData(characterData.attributes);
        }
        // Заполняем инвентарь
        if (characterData.inventory) {
            window.inventoryManager.setInventoryData(characterData.inventory);
        }
        // Заполняем состояния
        if (characterData.status) {
            window.statusManager.setStatusData(characterData.status);
        }
        // Заполняем особенности
        if (characterData.features) {
            window.featuresManager.setFeaturesData(characterData.features);
        }
        // Заполняем навыки
        if (characterData.skills) {
            window.attributesManager.setSkillsData(characterData.skills);
        }
        // Устанавливаем спасброски на основе класса
        if (characterData.class) {
            this.setClassSavingThrows(characterData.class);
        }
    }
    // Установка спасбросков по классу
    setClassSavingThrows(characterClass) {
        const savingThrows = DNDCalculators.getClassSavingThrows(characterClass);
        const attributes = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        
        // Сбрасываем все спасброски
        attributes.forEach(attr => {
            const checkbox = document.getElementById(`${attr}-save`);
            checkbox.checked = false;
            attributesManager.attributes[attr].save = false;
        });
        
        // Устанавливаем спасброски класса
        savingThrows.forEach(attr => {
            const checkbox = document.getElementById(`${attr}-save`);
            checkbox.checked = true;
            attributesManager.attributes[attr].save = true;
        });
        
        attributesManager.updateUI();
    }
}

// Инициализация менеджера форм
window.formManager = new FormManager();