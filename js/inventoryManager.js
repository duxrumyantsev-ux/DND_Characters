// Менеджер инвентаря персонажа
class InventoryManager {
    constructor() {
        this.inventory = {
            armor: null,
            shield: null,
            weapons: {
                melee1: null,
                melee2: null,
                twoHanded: null,
                ranged: null
            },
            simpleInventory: [],
            wallet: {
                platinum: 0,
                gold: 0,
                electrum: 0,
                silver: 0,
                copper: 0
            }
        };
        
        this.armorData = [];
        this.weaponData = [];
        this.shieldData = [];
        
        this.init();
    }

    async init() {
        await this.loadItemData();
        this.bindEvents();
        this.updateUI();
    }

    async loadItemData() {
        // Временные данные брони (позже заменим на JSON)
        this.armorData = [
            { id: 'padded', name: 'Стеганая', type: 'light', ac: 11, stealthDisadvantage: true, cost: 500, weight: 8 },
            { id: 'leather', name: 'Кожанная', type: 'light', ac: 11, stealthDisadvantage: false, cost: 1000, weight: 10 },
            { id: 'studded-leather', name: 'Кожанная с шипами', type: 'light', ac: 12, stealthDisadvantage: false, cost: 4500, weight: 13 },
            { id: 'hide', name: 'Доспех из звериной шкуры', type: 'medium', ac: 12, stealthDisadvantage: false, cost: 1000, weight: 12 },
            { id: 'chain-shirt', name: 'Кольчужная рубаха', type: 'medium', ac: 13, stealthDisadvantage: false, cost: 5000, weight: 20 },
            { id: 'scale-mail', name: 'Чешуйчатый доспех', type: 'medium', ac: 14, stealthDisadvantage: true, cost: 5000, weight: 45 },
            { id: 'breastplate', name: 'Кираса', type: 'medium', ac: 14, stealthDisadvantage: false, cost: 40000, weight: 20 },
            { id: 'half-plate', name: 'Полулаты', type: 'medium', ac: 15, stealthDisadvantage: true, cost: 75000, weight: 40 },
            { id: 'ring-mail', name: 'Кольчуга', type: 'heavy', ac: 14, stealthDisadvantage: true, cost: 3000, weight: 40 },
            { id: 'chain-mail', name: 'Кольчужный доспех', type: 'heavy', ac: 16, stealthDisadvantage: true, cost: 7500, weight: 55 },
            { id: 'splint', name: 'Пластинчатый доспех', type: 'heavy', ac: 17, stealthDisadvantage: true, cost: 20000, weight: 60 },
            { id: 'plate', name: 'Латный доспех', type: 'heavy', ac: 18, stealthDisadvantage: true, cost: 150000, weight: 65 }
        ];

        // Временные данные щитов
        this.shieldData = [
            { id: 'shield', name: 'Щит', ac: 2, cost: 1000, weight: 6 }
        ];

        // Временные данные оружия
        this.weaponData = [
            // Простое оружие ближнего боя
            { id: 'club', name: 'Дубина', type: 'simple', category: 'melee', damage: '1d4', damageType: 'дробящий', properties: ['Легкое'], cost: 10, weight: 2 },
            { id: 'dagger', name: 'Кинжал', type: 'simple', category: 'melee', damage: '1d4', damageType: 'колющий', properties: ['Фехтовальное', 'Легкое', 'Метательное'], cost: 200, weight: 1 },
            { id: 'greatclub', name: 'Палица', type: 'simple', category: 'melee', damage: '1d8', damageType: 'дробящий', properties: ['Двуручное'], cost: 20, weight: 10 },
            { id: 'handaxe', name: 'Ручной топор', type: 'simple', category: 'melee', damage: '1d6', damageType: 'рубящий', properties: ['Легкое', 'Метательное'], cost: 500, weight: 2 },
            { id: 'javelin', name: 'Метательное копье', type: 'simple', category: 'melee', damage: '1d6', damageType: 'колющий', properties: ['Метательное'], cost: 50, weight: 2 },
            { id: 'light-hammer', name: 'Легкий молот', type: 'simple', category: 'melee', damage: '1d4', damageType: 'дробящий', properties: ['Легкое', 'Метательное'], cost: 200, weight: 2 },
            { id: 'mace', name: 'Булава', type: 'simple', category: 'melee', damage: '1d6', damageType: 'дробящий', properties: [], cost: 500, weight: 4 },
            { id: 'quarterstaff', name: 'Боевой посох', type: 'simple', category: 'melee', damage: '1d6', damageType: 'дробящий', properties: ['Универсальное'], cost: 20, weight: 4 },
            { id: 'sickle', name: 'Серп', type: 'simple', category: 'melee', damage: '1d4', damageType: 'рубящий', properties: ['Легкое'], cost: 100, weight: 2 },
            { id: 'spear', name: 'Копье', type: 'simple', category: 'melee', damage: '1d6', damageType: 'колющий', properties: ['Метательное', 'Универсальное'], cost: 100, weight: 3 },

            // Воинское оружие ближнего боя
            { id: 'battleaxe', name: 'Боевой топор', type: 'martial', category: 'melee', damage: '1d8', damageType: 'рубящий', properties: ['Универсальное'], cost: 1000, weight: 4 },
            { id: 'flail', name: 'Цеп', type: 'martial', category: 'melee', damage: '1d8', damageType: 'дробящий', properties: [], cost: 1000, weight: 2 },
            { id: 'glaive', name: 'Глефа', type: 'martial', category: 'melee', damage: '1d10', damageType: 'рубящий', properties: ['Тяжелое', 'Двуручное', 'Дальнобойное'], cost: 2000, weight: 6 },
            { id: 'greataxe', name: 'Секира', type: 'martial', category: 'melee', damage: '1d12', damageType: 'рубящий', properties: ['Тяжелое', 'Двуручное'], cost: 3000, weight: 7 },
            { id: 'greatsword', name: 'Двуручный меч', type: 'martial', category: 'melee', damage: '2d6', damageType: 'рубящий', properties: ['Тяжелое', 'Двуручное'], cost: 5000, weight: 6 },
            { id: 'halberd', name: 'Алебарда', type: 'martial', category: 'melee', damage: '1d10', damageType: 'рубящий', properties: ['Тяжелое', 'Двуручное', 'Дальнобойное'], cost: 2000, weight: 6 },
            { id: 'lance', name: 'Пика', type: 'martial', category: 'melee', damage: '1d12', damageType: 'колющий', properties: ['Дальнобойное', 'Особое'], cost: 1000, weight: 6 },
            { id: 'longsword', name: 'Длинный меч', type: 'martial', category: 'melee', damage: '1d8', damageType: 'рубящий', properties: ['Универсальное'], cost: 1500, weight: 3 },
            { id: 'maul', name: 'Молот', type: 'martial', category: 'melee', damage: '2d6', damageType: 'дробящий', properties: ['Тяжелое', 'Двуручное'], cost: 1000, weight: 10 },
            { id: 'morningstar', name: 'Моргенштерн', type: 'martial', category: 'melee', damage: '1d8', damageType: 'колющий', properties: [], cost: 1500, weight: 4 },
            { id: 'pike', name: 'Пика', type: 'martial', category: 'melee', damage: '1d10', damageType: 'колющий', properties: ['Тяжелое', 'Двуручное', 'Дальнобойное'], cost: 500, weight: 18 },
            { id: 'rapier', name: 'Рапира', type: 'martial', category: 'melee', damage: '1d8', damageType: 'колющий', properties: ['Фехтовальное'], cost: 2500, weight: 2 },
            { id: 'scimitar', name: 'Скимитар', type: 'martial', category: 'melee', damage: '1d6', damageType: 'рубящий', properties: ['Фехтовальное', 'Легкое'], cost: 2500, weight: 3 },
            { id: 'shortsword', name: 'Короткий меч', type: 'martial', category: 'melee', damage: '1d6', damageType: 'колющий', properties: ['Фехтовальное', 'Легкое'], cost: 1000, weight: 2 },
            { id: 'trident', name: 'Трезубец', type: 'martial', category: 'melee', damage: '1d6', damageType: 'колющий', properties: ['Метательное', 'Универсальное'], cost: 500, weight: 4 },
            { id: 'war-pick', name: 'Боевая кирка', type: 'martial', category: 'melee', damage: '1d8', damageType: 'колющий', properties: [], cost: 500, weight: 2 },
            { id: 'warhammer', name: 'Боевой молот', type: 'martial', category: 'melee', damage: '1d8', damageType: 'дробящий', properties: ['Универсальное'], cost: 1500, weight: 2 },
            { id: 'whip', name: 'Кнут', type: 'martial', category: 'melee', damage: '1d4', damageType: 'рубящий', properties: ['Фехтовальное', 'Дальнобойное'], cost: 200, weight: 3 },

            // Дальнобойное оружие
            { id: 'blowgun', name: 'Духовая трубка', type: 'martial', category: 'ranged', damage: '1', damageType: 'колющий', properties: ['Боеприпасы', 'Перезарядка'], cost: 1000, weight: 1 },
            { id: 'crossbow-hand', name: 'Арбалет-пистолет', type: 'martial', category: 'ranged', damage: '1d6', damageType: 'колющий', properties: ['Боеприпасы', 'Легкое', 'Перезарядка'], cost: 7500, weight: 3 },
            { id: 'crossbow-heavy', name: 'Тяжелый арбалет', type: 'martial', category: 'ranged', damage: '1d10', damageType: 'колющий', properties: ['Боеприпасы', 'Тяжелое', 'Двуручное', 'Перезарядка'], cost: 5000, weight: 18 },
            { id: 'crossbow-light', name: 'Легкий арбалет', type: 'simple', category: 'ranged', damage: '1d8', damageType: 'колющий', properties: ['Боеприпасы', 'Перезарядка', 'Двуручное'], cost: 2500, weight: 5 },
            { id: 'dart', name: 'Дротик', type: 'simple', category: 'ranged', damage: '1d4', damageType: 'колющий', properties: ['Фехтовальное', 'Метательное'], cost: 5, weight: 0.25 },
            { id: 'shortbow', name: 'Короткий лук', type: 'simple', category: 'ranged', damage: '1d6', damageType: 'колющий', properties: ['Боеприпасы', 'Двуручное'], cost: 2500, weight: 2 },
            { id: 'sling', name: 'Праща', type: 'simple', category: 'ranged', damage: '1d4', damageType: 'дробящий', properties: ['Боеприпасы'], cost: 10, weight: 0 },
            { id: 'longbow', name: 'Длинный лук', type: 'martial', category: 'ranged', damage: '1d8', damageType: 'колющий', properties: ['Боеприпасы', 'Тяжелое', 'Двуручное'], cost: 5000, weight: 2 }
        ];

        this.populateSelects();
    }

    populateSelects() {
        // Заполняем выпадающие списки брони
        const armorSelect = document.getElementById('armorSelect');
        this.armorData.forEach(armor => {
            const option = document.createElement('option');
            option.value = armor.id;
            option.textContent = armor.name;
            armorSelect.appendChild(option);
        });

        // Заполняем выпадающие списки щитов
        const shieldSelect = document.getElementById('shieldSelect');
        this.shieldData.forEach(shield => {
            const option = document.createElement('option');
            option.value = shield.id;
            option.textContent = shield.name;
            shieldSelect.appendChild(option);
        });

        // Заполняем выпадающие списки оружия
        const weaponSelects = [
            'meleeWeapon1', 'meleeWeapon2', 'twoHandedWeapon', 'rangedWeapon'
        ];

        weaponSelects.forEach(selectId => {
            const select = document.getElementById(selectId);
            
            // Фильтруем оружие по категории
            let filteredWeapons = [];
            if (selectId.includes('melee') || selectId.includes('twoHanded')) {
                filteredWeapons = this.weaponData.filter(weapon => 
                    weapon.category === 'melee' && 
                    (selectId.includes('twoHanded') ? weapon.properties.includes('Двуручное') : !weapon.properties.includes('Двуручное'))
                );
            } else if (selectId.includes('ranged')) {
                filteredWeapons = this.weaponData.filter(weapon => weapon.category === 'ranged');
            }

            filteredWeapons.forEach(weapon => {
                const option = document.createElement('option');
                option.value = weapon.id;
                option.textContent = weapon.name;
                select.appendChild(option);
            });
        });
    }

    calculateArmorClass() {
        if (!window.attributesManager) return 10;

        const dexterityModifier = window.attributesManager.attributes.dexterity.modifier;
        
        // Используем функцию из calculators.js
        return DNDCalculators.calculateArmorClass(
            this.inventory.armor, 
            this.inventory.shield, 
            dexterityModifier
        );
    }

    bindEvents() {
        // Броня
        document.getElementById('armorSelect').addEventListener('change', (e) => 
            this.handleArmorChange(e.target.value));
        document.getElementById('shieldSelect').addEventListener('change', (e) => 
            this.handleShieldChange(e.target.value));

        // Оружие
        document.getElementById('meleeWeapon1').addEventListener('change', (e) => 
            this.handleWeaponChange('melee1', e.target.value));
        document.getElementById('meleeWeapon2').addEventListener('change', (e) => 
            this.handleWeaponChange('melee2', e.target.value));
        document.getElementById('twoHandedWeapon').addEventListener('change', (e) => 
            this.handleWeaponChange('twoHanded', e.target.value));
        document.getElementById('rangedWeapon').addEventListener('change', (e) => 
            this.handleWeaponChange('ranged', e.target.value));

        // Простой инвентарь
        document.getElementById('addInventoryItem').addEventListener('click', () => 
            this.addInventoryItem());
        document.getElementById('clearInventory').addEventListener('click', () => 
            this.clearInventory());

        // Кошелек
        const currencyInputs = ['platinum', 'gold', 'electrum', 'silver', 'copper'];
        currencyInputs.forEach(currency => {
            document.getElementById(currency).addEventListener('input', (e) => 
                this.handleCurrencyChange(currency, parseInt(e.target.value) || 0));
        });
    }

    handleArmorChange(armorId) {
        const armor = this.armorData.find(a => a.id === armorId) || null;
        this.inventory.armor = armor;
        this.updateArmorInfo(armor);
        this.updateArmorClass();

        // УВЕДОМЛЯЕМ statusManager об изменении КБ
        if (window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
    }

    handleShieldChange(shieldId) {
        const shield = this.shieldData.find(s => s.id === shieldId) || null;
        this.inventory.shield = shield;
        this.updateShieldInfo(shield);
        this.updateArmorClass();

        // УВЕДОМЛЯЕМ statusManager об изменении КБ
        if (window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
    }

    handleWeaponChange(slot, weaponId) {
        const weapon = this.weaponData.find(w => w.id === weaponId) || null;
        this.inventory.weapons[slot] = weapon;
        this.updateWeaponInfo(slot, weapon);
    }

    handleCurrencyChange(currency, value) {
        this.inventory.wallet[currency] = value;
        this.updateTotalGoldValue();
    }

    updateArmorInfo(armor) {
        const infoElement = document.getElementById('armorInfo');
        
        if (!armor) {
            infoElement.style.display = 'none';
            return;
        }

        infoElement.innerHTML = `
            <h6>${armor.name}</h6>
            <div class="item-property">
                <span class="property-name">Класс брони:</span>
                <span class="property-value">${armor.ac}</span>
            </div>
            <div class="item-property">
                <span class="property-name">Тип:</span>
                <span class="property-value">${this.getArmorTypeName(armor.type)}</span>
            </div>
            <div class="item-property">
                <span class="property-name">Помеха к скрытности:</span>
                <span class="property-value">${armor.stealthDisadvantage ? 'Да' : 'Нет'}</span>
            </div>
            <div class="item-property">
                <span class="property-name">Стоимость:</span>
                <span class="property-value">${armor.cost} ЗМ</span>
            </div>
            <div class="item-property">
                <span class="property-name">Вес:</span>
                <span class="property-value">${armor.weight} фунтов</span>
            </div>
        `;
        infoElement.style.display = 'block';
    }

    updateShieldInfo(shield) {
        const infoElement = document.getElementById('shieldInfo');
        
        if (!shield) {
            infoElement.style.display = 'none';
            return;
        }

        infoElement.innerHTML = `
            <h6>${shield.name}</h6>
            <div class="item-property">
                <span class="property-name">Бонус к КБ:</span>
                <span class="property-value">+${shield.ac}</span>
            </div>
            <div class="item-property">
                <span class="property-name">Стоимость:</span>
                <span class="property-value">${shield.cost} ЗМ</span>
            </div>
            <div class="item-property">
                <span class="property-name">Вес:</span>
                <span class="property-value">${shield.weight} фунтов</span>
            </div>
        `;
        infoElement.style.display = 'block';
    }

    updateWeaponInfo(slot, weapon) {
        const slotMap = {
            'melee1': 'meleeWeapon1',
            'melee2': 'meleeWeapon2', 
            'twoHanded': 'twoHandedWeapon',
            'ranged': 'rangedWeapon'
        };
        
        const selectId = slotMap[slot];
        const infoElement = document.getElementById(`${selectId}Info`);
        
        if (!weapon) {
            if (infoElement) infoElement.style.display = 'none';
            return;
        }

        infoElement.innerHTML = `
            <h6>${weapon.name}</h6>
            <div class="item-property">
                <span class="property-name">Урон:</span>
                <span class="property-value">
                    <span class="weapon-damage">${weapon.damage}</span>
                    <span class="damage-type">${weapon.damageType}</span>
                </span>
            </div>
            <div class="item-property">
                <span class="property-name">Тип:</span>
                <span class="property-value">${this.getWeaponTypeName(weapon.type)}</span>
            </div>
            <div class="item-property">
                <span class="property-name">Стоимость:</span>
                <span class="property-value">${weapon.cost} ЗМ</span>
            </div>
            <div class="item-property">
                <span class="property-name">Вес:</span>
                <span class="property-value">${weapon.weight} фунтов</span>
            </div>
            ${weapon.properties.length > 0 ? `
                <div class="item-property">
                    <span class="property-name">Свойства:</span>
                    <span class="property-value">
                        <div class="weapon-properties">
                            ${weapon.properties.map(prop => `<span class="weapon-property">${prop}</span>`).join('')}
                        </div>
                    </span>
                </div>
            ` : ''}
        `;
        infoElement.style.display = 'block';
    }

    getArmorTypeName(type) {
        const types = {
            'light': 'Лёгкая',
            'medium': 'Средняя',
            'heavy': 'Тяжёлая'
        };
        return types[type] || type;
    }

    getWeaponTypeName(type) {
        const types = {
            'simple': 'Простое',
            'martial': 'Воинское'
        };
        return types[type] || type;
    }

    updateArmorClass() {
        const dexterityModifier = window.attributesManager ? 
            window.attributesManager.attributes.dexterity.modifier : 0;
        
        let baseAC = 10;
        let maxDexBonus = Infinity;

        // Расчет КБ от брони
        if (this.inventory.armor) {
            baseAC = this.inventory.armor.ac;
            
            // Ограничения по ловкости для разных типов брони
            switch (this.inventory.armor.type) {
                case 'light':
                    // Полный бонус ловкости
                    break;
                case 'medium':
                    maxDexBonus = 2;
                    break;
                case 'heavy':
                    maxDexBonus = 0;
                    break;
            }
        }

        // Добавляем бонус щита
        if (this.inventory.shield) {
            baseAC += this.inventory.shield.ac;
        }

        // Добавляем бонус ловкости с учетом ограничений
        const finalAC = baseAC + Math.min(dexterityModifier, maxDexBonus);
        
        document.getElementById('armorClassValue').textContent = finalAC;

        // Обновляем КБ в разделе состояний через statusManager
        if (window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
    }

    addInventoryItem() {
        const inventoryList = document.getElementById('simpleInventoryList');
        
        // Убираем сообщение о пустом инвентаре
        const emptyMessage = inventoryList.querySelector('.empty-inventory');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const itemId = Date.now();
        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="inventory-item-content">
                <input type="text" class="inventory-item-input" placeholder="Введите название предмета" 
                       data-item-id="${itemId}">
            </div>
            <div class="inventory-item-actions">
                <button class="btn-inventory-action btn-remove-item" data-item-id="${itemId}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        inventoryList.appendChild(itemElement);

        // Добавляем обработчик удаления
        const removeBtn = itemElement.querySelector('.btn-remove-item');
        removeBtn.addEventListener('click', () => this.removeInventoryItem(itemId));

        // Добавляем обработчик изменения
        const input = itemElement.querySelector('.inventory-item-input');
        input.addEventListener('input', (e) => this.updateInventoryItem(itemId, e.target.value));

        // Сохраняем в данные
        this.inventory.simpleInventory.push({
            id: itemId,
            name: '',
            quantity: 1
        });
    }

    removeInventoryItem(itemId) {
        const itemElement = document.querySelector(`[data-item-id="${itemId}"]`).closest('.inventory-item');
        itemElement.remove();

        // Удаляем из данных
        this.inventory.simpleInventory = this.inventory.simpleInventory.filter(item => item.id !== itemId);

        // Показываем сообщение о пустом инвентаре, если нужно
        this.checkEmptyInventory();
    }

    updateInventoryItem(itemId, name) {
        const item = this.inventory.simpleInventory.find(item => item.id === itemId);
        if (item) {
            item.name = name;
        }
    }

    clearInventory() {
        if (this.inventory.simpleInventory.length === 0) return;
        
        if (confirm('Вы уверены, что хотите очистить весь инвентарь?')) {
            const inventoryList = document.getElementById('simpleInventoryList');
            inventoryList.innerHTML = `
                <div class="empty-inventory">
                    <i class="bi bi-inbox"></i>
                    <p>Инвентарь пуст</p>
                </div>
            `;
            this.inventory.simpleInventory = [];
        }
    }

    checkEmptyInventory() {
        const inventoryList = document.getElementById('simpleInventoryList');
        const items = inventoryList.querySelectorAll('.inventory-item');
        
        if (items.length === 0) {
            inventoryList.innerHTML = `
                <div class="empty-inventory">
                    <i class="bi bi-inbox"></i>
                    <p>Инвентарь пуст</p>
                </div>
            `;
        }
    }

    updateTotalGoldValue() {
        const wallet = this.inventory.wallet;
        const totalGold = 
            (wallet.platinum * 10) + 
            (wallet.gold * 1) + 
            (wallet.electrum * 0.5) + 
            (wallet.silver * 0.1) + 
            (wallet.copper * 0.01);
        
        document.getElementById('totalGoldValue').textContent = 
            `${totalGold.toFixed(2)} ЗМ`;
    }

    updateUI() {
        this.updateArmorClass();
        this.updateTotalGoldValue();
        
        // Обновляем информацию о выбранных предметах
        if (this.inventory.armor) {
            this.updateArmorInfo(this.inventory.armor);
        }
        if (this.inventory.shield) {
            this.updateShieldInfo(this.inventory.shield);
        }
        
        Object.keys(this.inventory.weapons).forEach(slot => {
            if (this.inventory.weapons[slot]) {
                this.updateWeaponInfo(slot, this.inventory.weapons[slot]);
            }
        });
    }

    getInventoryData() {
        return this.inventory;
    }

    setInventoryData(data) {
        if (data) {
            this.inventory = { ...this.inventory, ...data };
            this.updateUI();
            
            // Восстанавливаем выбранные значения в селектах
            if (data.armor) {
                document.getElementById('armorSelect').value = data.armor.id;
            }
            if (data.shield) {
                document.getElementById('shieldSelect').value = data.shield.id;
            }
            
            Object.keys(data.weapons).forEach(slot => {
                if (data.weapons[slot]) {
                    document.getElementById(`${slot}Weapon`).value = data.weapons[slot].id;
                }
            });
            
            // Восстанавливаем валюту
            Object.keys(data.wallet).forEach(currency => {
                document.getElementById(currency).value = data.wallet[currency];
            });
            
            // Восстанавливаем простой инвентарь
            if (data.simpleInventory && data.simpleInventory.length > 0) {
                this.inventory.simpleInventory = [];
                const inventoryList = document.getElementById('simpleInventoryList');
                inventoryList.innerHTML = '';
                
                data.simpleInventory.forEach(item => {
                    this.addInventoryItemFromData(item);
                });
            }
        }
    }

    addInventoryItemFromData(itemData) {
        const inventoryList = document.getElementById('simpleInventoryList');
        
        // Убираем сообщение о пустом инвентаре
        const emptyMessage = inventoryList.querySelector('.empty-inventory');
        if (emptyMessage) {
            emptyMessage.remove();
        }

        const itemElement = document.createElement('div');
        itemElement.className = 'inventory-item';
        itemElement.innerHTML = `
            <div class="inventory-item-content">
                <input type="text" class="inventory-item-input" value="${itemData.name}" 
                       data-item-id="${itemData.id}">
            </div>
            <div class="inventory-item-actions">
                <button class="btn-inventory-action btn-remove-item" data-item-id="${itemData.id}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;

        inventoryList.appendChild(itemElement);

        // Добавляем обработчики
        const removeBtn = itemElement.querySelector('.btn-remove-item');
        removeBtn.addEventListener('click', () => this.removeInventoryItem(itemData.id));

        const input = itemElement.querySelector('.inventory-item-input');
        input.addEventListener('input', (e) => this.updateInventoryItem(itemData.id, e.target.value));

        // Сохраняем в данные
        this.inventory.simpleInventory.push(itemData);
    }
}

// Инициализация менеджера инвентаря
window.inventoryManager = new InventoryManager();