document.addEventListener('DOMContentLoaded', () => {
    const formatMoney = (value) =>
        new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0
        }).format(value);

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        const input = modal.querySelector('input, textarea, select');
        if (input) input.focus();
    };

    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.add('hidden');
        document.body.classList.remove('modal-open');
    };

    document.querySelectorAll('[data-open-credit]').forEach((button) => {
        button.addEventListener('click', () => openModal(document.getElementById('creditModal')));
    });

    document.querySelectorAll('[data-open-chat]').forEach((button) => {
        button.addEventListener('click', () => openModal(document.getElementById('chatModal')));
    });

    document.querySelectorAll('[data-close-modal]').forEach((button) => {
        button.addEventListener('click', () => closeModal(button.closest('.modal-overlay')));
    });

    document.querySelectorAll('.modal-overlay').forEach((overlay) => {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                closeModal(overlay);
            }
        });
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal-overlay:not(.hidden)').forEach((modal) => closeModal(modal));
        }
    });

    const creditForm = document.getElementById('creditForm');
    const creditResult = document.getElementById('creditResult');

    if (creditForm && creditResult) {
        creditForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const amount = Number(creditForm.creditAmount.value || 0);
            const initialPayment = Number(creditForm.initialPayment.value || 0);
            const years = Number(creditForm.creditTerm.value || 1);
            const principal = Math.max(amount - initialPayment, 0);

            if (principal <= 0) {
                creditResult.innerHTML = '<strong>Проверьте сумму и первоначальный взнос.</strong>';
                return;
            }

            const monthlyRate = 0.18 / 12;
            const months = years * 12;
            const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
            const totalPayment = monthlyPayment * months;

            creditResult.innerHTML = `
                <strong>Кредит рассчитан</strong><br>
                Сумма кредита: ${formatMoney(principal)}<br>
                Срок: ${years} год(а)<br>
                Ежемесячный платёж: ${formatMoney(monthlyPayment)}<br>
                Общая сумма выплат: ${formatMoney(totalPayment)}
            `;
        });
    }

    const chatForm = document.getElementById('chatForm');
    const chatLog = document.getElementById('chatLog');
    const chatInput = document.getElementById('chatInput');

    if (chatForm && chatLog && chatInput) {
        const addMessage = (message, sender) => {
            const bubble = document.createElement('div');
            bubble.className = `chat-bubble ${sender}`;
            bubble.textContent = message;
            chatLog.appendChild(bubble);
            chatLog.scrollTop = chatLog.scrollHeight;
        };

        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const message = chatInput.value.trim();
            if (!message) return;

            addMessage(message, 'user');
            chatInput.value = '';

            setTimeout(() => {
                addMessage('Автодиллер скоро с вами свяжется', 'assistant');
            }, 600);
        });
    }
});
