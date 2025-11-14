// Менеджер заметок персонажа
class NotesManager {
    constructor() {
        this.notes = {
            categories: {
                'appearance': { name: 'Внешность', notes: [] },
                'personality': { name: 'Личность', notes: [] },
                'background': { name: 'Предыстория', notes: [] },
                'relationships': { name: 'Отношения', notes: [] },
                'organizations': { name: 'Организации', notes: [] },
                'quests': { name: 'Квесты', notes: [] },
                'locations': { name: 'Места', notes: [] },
                'other': { name: 'Разное', notes: [] }
            },
            quickNotes: {
                'weaknesses': '',
                'strengths': '',
                'goals': ''
            }
        };
        
        this.currentCategory = 'appearance';
        this.currentNoteId = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        // Переключение категорий
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.getAttribute('data-category');
                this.switchCategory(category);
            });
        });

        // Сохранение заметки
        document.getElementById('saveNote').addEventListener('click', () => {
            this.saveNote();
        });

        // Очистка заметки
        document.getElementById('clearNote').addEventListener('click', () => {
            this.clearCurrentNote();
        });

        // Быстрые заметки
        document.querySelectorAll('.quick-note').forEach(textarea => {
            textarea.addEventListener('input', (e) => {
                const type = e.target.getAttribute('data-type');
                this.saveQuickNote(type, e.target.value);
            });
        });

        // Кнопка добавления категории
        document.getElementById('addCustomCategory').addEventListener('click', () => {
            this.showAddCategoryModal();
        });

        // Простые обработчики форматирования
        this.setupFormatting();
    }

    setupFormatting() {
        document.querySelectorAll('.format-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const format = e.currentTarget.getAttribute('data-format');
                this.applyFormat(format);
            });
        });
    }

    applyFormat(format) {
        const editor = document.getElementById('noteEditor');
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);
        
        let formattedText = '';

        switch (format) {
            case 'bold':
                formattedText = `**${selectedText}**`;
                break;
            case 'italic':
                formattedText = `*${selectedText}*`;
                break;
            case 'underline':
                formattedText = `__${selectedText}__`;
                break;
            case 'list-ul':
                formattedText = this.formatAsList(selectedText, false);
                break;
            case 'list-ol':
                formattedText = this.formatAsList(selectedText, true);
                break;
        }

        if (formattedText) {
            const newValue = editor.value.substring(0, start) + formattedText + editor.value.substring(end);
            editor.value = newValue;
            
            // Восстанавливаем позицию курсора
            editor.focus();
            editor.setSelectionRange(start + formattedText.length, start + formattedText.length);
        }
    }

    formatAsList(text, numbered = false) {
        const lines = text.split('\n').filter(line => line.trim());
        return lines.map((line, index) => {
            return numbered ? `${index + 1}. ${line}` : `- ${line}`;
        }).join('\n');
    }

    switchCategory(category) {
        // Обновляем активную кнопку
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Обновляем заголовок
        document.getElementById('currentCategoryTitle').textContent = this.notes.categories[category].name;

        this.currentCategory = category;
        this.currentNoteId = null;
        
        this.updateNotesList();
        this.clearEditor();
    }

    saveNote() {
        const content = document.getElementById('noteEditor').value.trim();
        if (!content) {
            this.showMessage('Заметка не может быть пустой', 'warning');
            return;
        }

        const now = new Date();
        const noteData = {
            id: this.currentNoteId || Date.now(),
            content: content,
            created: this.currentNoteId ? this.getCurrentNote().created : now.toISOString(),
            updated: now.toISOString(),
            preview: this.generatePreview(content)
        };

        if (this.currentNoteId) {
            // Обновляем существующую заметку
            const noteIndex = this.notes.categories[this.currentCategory].notes.findIndex(note => note.id === this.currentNoteId);
            if (noteIndex !== -1) {
                this.notes.categories[this.currentCategory].notes[noteIndex] = noteData;
            }
        } else {
            // Добавляем новую заметку
            this.notes.categories[this.currentCategory].notes.unshift(noteData);
        }

        this.updateNotesList();
        this.clearEditor();
        this.showMessage('Заметка сохранена', 'success');
    }

    getCurrentNote() {
        return this.notes.categories[this.currentCategory].notes.find(note => note.id === this.currentNoteId);
    }

    clearCurrentNote() {
        if (!document.getElementById('noteEditor').value.trim()) {
            return;
        }

        if (confirm('Очистить текущую заметку? Несохраненные изменения будут потеряны.')) {
            this.clearEditor();
        }
    }

    clearEditor() {
        document.getElementById('noteEditor').value = '';
        this.currentNoteId = null;
    }

    editNote(noteId) {
        const note = this.notes.categories[this.currentCategory].notes.find(n => n.id === noteId);
        if (note) {
            document.getElementById('noteEditor').value = note.content;
            this.currentNoteId = noteId;
            
            // Прокручиваем к редактору
            document.getElementById('noteEditor').scrollIntoView({ behavior: 'smooth' });
            document.getElementById('noteEditor').focus();
            
            this.showMessage('Редактирование заметки', 'info');
        }
    }

    deleteNote(noteId) {
        if (confirm('Удалить эту заметку?')) {
            this.notes.categories[this.currentCategory].notes = this.notes.categories[this.currentCategory].notes.filter(note => note.id !== noteId);
            this.updateNotesList();
            
            if (this.currentNoteId === noteId) {
                this.clearEditor();
            }
            
            this.showMessage('Заметка удалена', 'info');
        }
    }

    saveQuickNote(type, content) {
        this.notes.quickNotes[type] = content;
    }

    generatePreview(content) {
        // Создаем краткий превью (первые 100 символов)
        const plainText = content.replace(/\*\*|\*|__/g, ''); // Убираем форматирование
        return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText;
    }

    updateNotesList() {
        const notesList = document.getElementById('notesList');
        const categoryNotes = this.notes.categories[this.currentCategory].notes;

        if (categoryNotes.length === 0) {
            notesList.innerHTML = `
                <div class="empty-notes">
                    <i class="bi bi-journal-text"></i>
                    <p>Нет сохраненных заметок в этой категории</p>
                </div>
            `;
            return;
        }

        notesList.innerHTML = categoryNotes.map(note => `
            <div class="note-item note-fade-in ${this.currentNoteId === note.id ? 'note-saved' : ''}">
                <div class="note-item-header">
                    <div class="note-item-title">
                        ${this.formatDate(note.updated)}
                    </div>
                    <div class="note-item-date">
                        ${this.formatTime(note.updated)}
                    </div>
                </div>
                <div class="note-item-content">
                    ${this.renderFormattedText(note.preview)}
                </div>
                <div class="note-item-actions">
                    <button class="note-action-btn btn-edit-note" onclick="notesManager.editNote(${note.id})">
                        <i class="bi bi-pencil"></i> Редактировать
                    </button>
                    <button class="note-action-btn btn-delete-note" onclick="notesManager.deleteNote(${note.id})">
                        <i class="bi bi-trash"></i> Удалить
                    </button>
                </div>
            </div>
        `).join('');
    }

    renderFormattedText(text) {
        // Простой рендеринг форматированного текста
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/__(.*?)__/g, '<u>$1</u>')
            .replace(/\n/g, '<br>');
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showAddCategoryModal() {
        // Создаем простое модальное окно для новой категории
        const categoryName = prompt('Введите название новой категории:');
        if (categoryName && categoryName.trim()) {
            const categoryId = this.generateCategoryId(categoryName);
            this.notes.categories[categoryId] = {
                name: categoryName.trim(),
                notes: []
            };
            
            this.addCategoryToUI(categoryId, categoryName.trim());
            this.showMessage(`Категория "${categoryName}" добавлена`, 'success');
        }
    }

    generateCategoryId(name) {
        return name.toLowerCase().replace(/[^a-z0-9а-яё]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    }

    addCategoryToUI(categoryId, categoryName) {
        const categoryList = document.querySelector('.category-list');
        const newButton = document.createElement('button');
        newButton.className = 'category-btn';
        newButton.setAttribute('data-category', categoryId);
        newButton.innerHTML = `<i class="bi bi-folder"></i> ${categoryName}`;
        
        newButton.addEventListener('click', (e) => {
            const category = e.currentTarget.getAttribute('data-category');
            this.switchCategory(category);
        });
        
        categoryList.appendChild(newButton);
    }

    updateUI() {
        this.updateNotesList();
        this.loadQuickNotes();
    }

    loadQuickNotes() {
        // Загружаем быстрые заметки в соответствующие поля
        Object.keys(this.notes.quickNotes).forEach(type => {
            const textarea = document.querySelector(`.quick-note[data-type="${type}"]`);
            if (textarea) {
                textarea.value = this.notes.quickNotes[type];
            }
        });
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
        const container = document.querySelector('.notes-container');
        if (container) {
            container.insertBefore(messageDiv, container.firstChild);
            
            // Автоматически удаляем сообщение через 3 секунды
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.remove();
                }
            }, 3000);
        }
    }

    getNotesData() {
        return this.notes;
    }

    setNotesData(data) {
        if (data) {
            this.notes = { ...this.notes, ...data };
            this.updateUI();
            
            // Восстанавливаем выбранную категорию
            if (data.currentCategory) {
                this.switchCategory(data.currentCategory);
            }
        }
    }
}

// Инициализация менеджера заметок
window.notesManager = new NotesManager();