// Калькуляторы для расчетов по правилам D&D
class DNDCalculators {
    // Расчет модификатора характеристики
    static calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    // Расчет класса брони
    static calculateArmorClass(armor, shield, dexterityModifier) {
        let baseAC = 10;
        let maxDexBonus = Infinity;

        if (armor) {
            baseAC = armor.ac;
            
            // Ограничения по ловкости для разных типов брони
            switch (armor.type) {
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
        if (shield) {
            baseAC += shield.ac;
        }

        // Добавляем бонус ловкости с учетом ограничений
        return baseAC + Math.min(dexterityModifier, maxDexBonus);
    }

    // Расчет модификатора инициативы
    static calculateInitiative(dexterityModifier) {
        return dexterityModifier;
    }

    // Расчет здоровья
    static calculateMaxHealth(characterClass, constitutionModifier, level) {
        const hitDie = this.getClassHitDie(characterClass);
        
        // 1 уровень: максимум кости хитов + модификатор телосложения
        let maxHealth = hitDie + constitutionModifier;
        
        // Последующие уровни: среднее значение кости хитов (округление вверх) + модификатор телосложения
        for (let i = 2; i <= level; i++) {
            maxHealth += Math.ceil(hitDie / 2) + constitutionModifier;
        }
        
        return Math.max(1, maxHealth);
    }

    // Кость хитов по классу
    static getClassHitDie(characterClass) {
        const hitDice = {
            'barbarian': 12,
            'fighter': 10, 'paladin': 10, 'ranger': 10,
            'bard': 8, 'cleric': 8, 'druid': 8, 'monk': 8, 'rogue': 8, 'warlock': 8,
            'sorcerer': 6, 'wizard': 6
        };
        
        return hitDice[characterClass] || 8;
    }

    // Расчет навыков
    static calculateSkillModifier(baseAbilityModifier, proficiencyBonus, isProficient) {
        return baseAbilityModifier + (isProficient ? proficiencyBonus : 0);
    }

    // Бонус владения по уровню
    static getProficiencyBonus(level) {
        return Math.floor((level - 1) / 4) + 2;
    }

    // Расчет спасбросков
    static calculateSavingThrow(abilityModifier, proficiencyBonus, hasProficiency) {
        return abilityModifier + (hasProficiency ? proficiencyBonus : 0);
    }
    // Рандомная характеристика по правилам D&D (4d6, отбросить низший)
    static rollAbilityScore() {
        const rolls = [];
        for (let i = 0; i < 4; i++) {
            rolls.push(Math.floor(Math.random() * 6) + 1);
        }
        rolls.sort((a, b) => a - b);
        rolls.shift(); // Убираем самый низкий
        return rolls.reduce((sum, roll) => sum + roll, 0);
    }

    // Рандомный набор характеристик (6 значений)
    static rollAbilityScores() {
        const scores = [];
        for (let i = 0; i < 6; i++) {
            let score;
            do {
                score = this.rollAbilityScore();
            } while (score < 8); // Гарантируем минимум 8
            scores.push(score);
        }
        return scores;
    }

    // Расчет стоимости характеристики для системы "покупки" очков
    static getAbilityScoreCost(score) {
        const costTable = {
            8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9
        };
        return costTable[score] || Infinity;
    }

    // Расчет спасброска
    static calculateSavingThrow(abilityModifier, proficiencyBonus, isProficient) {
        return abilityModifier + (isProficient ? proficiencyBonus : 0);
    }

    // Получение спасбросков по классу
    static getClassSavingThrows(characterClass) {
        const savingThrows = {
            'barbarian': ['strength', 'constitution'],
            'bard': ['dexterity', 'charisma'],
            'cleric': ['wisdom', 'charisma'],
            'druid': ['intelligence', 'wisdom'],
            'fighter': ['strength', 'constitution'],
            'monk': ['strength', 'dexterity'],
            'paladin': ['wisdom', 'charisma'],
            'ranger': ['strength', 'dexterity'],
            'rogue': ['dexterity', 'intelligence'],
            'sorcerer': ['constitution', 'charisma'],
            'warlock': ['wisdom', 'charisma'],
            'wizard': ['intelligence', 'wisdom']
        };
        
        return savingThrows[characterClass] || [];
    }
}