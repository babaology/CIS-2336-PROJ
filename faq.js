
document.addEventListener('DOMContentLoaded', function() {

    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function(item) {
        const btn = item.querySelector('.faq-question');
        const icon = item.querySelector('.faq-icon');

        btn.addEventListener('click', function() {
            const isOpen = item.classList.contains('open');

            faqItems.forEach(function(other) {
                other.classList.remove('open');
                other.querySelector('.faq-icon').textContent = '+';
            });

            if (!isOpen) {
                item.classList.add('open');
                icon.textContent = '×';
            }
        });
    });

});
