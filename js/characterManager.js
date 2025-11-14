// Менеджер для работы с персонажами
class CharacterManager {
    static STORAGE_KEY = 'dnd-characters';

    static saveCharacter(characterData) {
        try {
            const characters = this.getCharacters();
            const existingIndex = characters.findIndex(char => char.id === characterData.id);
            
            if (existingIndex >= 0) {
                // Обновление существующего персонажа
                characters[existingIndex] = {
                    ...characters[existingIndex],
                    ...characterData,
                    updated: new Date().toISOString()
                };
            } else {
                // Добавление нового персонажа
                characters.push(characterData);
            }
            
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
            console.log('Персонаж сохранен:', characterData.name);
            return true;
        } catch (error) {
            console.error('Ошибка при сохранении персонажа:', error);
            return false;
        }
    }

    static getCharacters() {
        try {
            const characters = localStorage.getItem(this.STORAGE_KEY);
            return characters ? JSON.parse(characters) : [];
        } catch (error) {
            console.error('Ошибка при загрузке персонажей:', error);
            return [];
        }
    }

    static getCharacter(characterId) {
        const characters = this.getCharacters();
        return characters.find(char => char.id === characterId);
    }

    static deleteCharacter(characterId) {
        try {
            const characters = this.getCharacters();
            const filteredCharacters = characters.filter(char => char.id !== characterId);
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filteredCharacters));
            return true;
        } catch (error) {
            console.error('Ошибка при удалении персонажа:', error);
            return false;
        }
    }

    static exportCharacters() {
        const characters = this.getCharacters();
        const dataStr = JSON.stringify(characters, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `dnd-characters-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    static importCharacters(jsonData) {
        try {
            const characters = JSON.parse(jsonData);
            if (Array.isArray(characters)) {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(characters));
                return true;
            }
            return false;
        } catch (error) {
            console.error('Ошибка при импорте персонажей:', error);
            return false;
        }
    }
}