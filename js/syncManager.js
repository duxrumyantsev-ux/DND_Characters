// syncManager.js - менеджер синхронизации между всеми системами
class SyncManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupGlobalEventListeners();
    }

    setupGlobalEventListeners() {
        // Слушаем изменения, которые влияют на несколько систем
        document.addEventListener('characterDataChanged', (e) => {
            this.handleCharacterDataChange(e.detail);
        });

        // Создаем кастомные события для синхронизации
        this.createSyncEvents();
    }

    createSyncEvents() {
        // Событие при изменении характеристик
        if (window.attributesManager) {
            const originalUpdateUI = window.attributesManager.updateUI.bind(window.attributesManager);
            window.attributesManager.updateUI = function() {
                originalUpdateUI();
                document.dispatchEvent(new CustomEvent('attributesUpdated', {
                    detail: { attributes: window.attributesManager.getAttributesData() }
                }));
            };
        }

        // Событие при изменении инвентаря
        if (window.inventoryManager) {
            const originalUpdateUI = window.inventoryManager.updateUI.bind(window.inventoryManager);
            window.inventoryManager.updateUI = function() {
                originalUpdateUI();
                document.dispatchEvent(new CustomEvent('inventoryUpdated', {
                    detail: { inventory: window.inventoryManager.getInventoryData() }
                }));
            };
        }
    }

    handleCharacterDataChange(change) {
        console.log('Обнаружено изменение данных персонажа:', change);

        // Обновляем статус при изменении характеристик
        if (change.type === 'attributes' && window.statusManager) {
            window.statusManager.refreshAllStats();
        }

        // Обновляем статус при изменении инвентаря
        if (change.type === 'inventory' && window.statusManager) {
            window.statusManager.updateDerivedStats();
        }
    }
}

// Инициализация менеджера синхронизации
window.syncManager = new SyncManager();