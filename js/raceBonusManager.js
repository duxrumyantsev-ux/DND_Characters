// Менеджер расовых бонусов
class RaceBonusManager {
    constructor() {
        this.appliedBonuses = {};
    }

    // Применяем расовые бонусы к характеристикам
    applyRaceBonuses(attributes, raceId) {
        const raceData = window.featuresManager?.featuresData.races[raceId];
        if (!raceData || !raceData.abilityBonus) return attributes;

        const updatedAttributes = JSON.parse(JSON.stringify(attributes));
        this.appliedBonuses = {};

        // Применяем фиксированные бонусы
        Object.keys(raceData.abilityBonus).forEach(ability => {
            if (ability !== 'choice' && updatedAttributes[ability]) {
                const bonus = raceData.abilityBonus[ability];
                updatedAttributes[ability].score += bonus;
                updatedAttributes[ability].modifier = DNDCalculators.calculateAbilityModifier(updatedAttributes[ability].score);
                this.appliedBonuses[ability] = bonus;
            }
        });

        // Обрабатываем выборные бонусы (для полуэльфов и подобных)
        if (raceData.abilityBonus.choice) {
            // Здесь можно добавить логику для выбора характеристик
            // Пока просто применяем к первым двум характеристикам
            const abilities = Object.keys(updatedAttributes).filter(attr => 
                !this.appliedBonuses[attr] && attr !== 'choice'
            ).slice(0, raceData.abilityBonus.choice);

            abilities.forEach(ability => {
                updatedAttributes[ability].score += 1;
                updatedAttributes[ability].modifier = DNDCalculators.calculateAbilityModifier(updatedAttributes[ability].score);
                this.appliedBonuses[ability] = 1;
            });
        }

        return updatedAttributes;
    }

    // Убираем расовые бонусы для редактирования
    removeRaceBonuses(attributes, raceId) {
        const raceData = window.featuresManager?.featuresData.races[raceId];
        if (!raceData || !raceData.abilityBonus) return attributes;

        const cleanAttributes = JSON.parse(JSON.stringify(attributes));

        Object.keys(this.appliedBonuses).forEach(ability => {
            if (cleanAttributes[ability]) {
                cleanAttributes[ability].score -= this.appliedBonuses[ability];
                cleanAttributes[ability].modifier = DNDCalculators.calculateAbilityModifier(cleanAttributes[ability].score);
            }
        });

        return cleanAttributes;
    }

    // Получаем описание бонусов для отображения
    getBonusDescription(raceId) {
        const raceData = window.featuresManager?.featuresData.races[raceId];
        if (!raceData || !raceData.abilityBonus) return '';

        const bonuses = [];
        
        Object.keys(raceData.abilityBonus).forEach(ability => {
            if (ability !== 'choice') {
                const bonus = raceData.abilityBonus[ability];
                const abilityName = this.getAbilityName(ability);
                bonuses.push(`${abilityName} +${bonus}`);
            }
        });

        if (raceData.abilityBonus.choice) {
            bonuses.push(`+${raceData.abilityBonus.choice} к другим характеристикам`);
        }

        return bonuses.join(', ');
    }

    getAbilityName(ability) {
        const names = {
            'strength': 'Сила',
            'dexterity': 'Ловкость', 
            'constitution': 'Телосложение',
            'intelligence': 'Интеллект',
            'wisdom': 'Мудрость',
            'charisma': 'Харизма'
        };
        return names[ability] || ability;
    }
}

window.raceBonusManager = new RaceBonusManager();