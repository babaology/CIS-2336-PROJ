var faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(function(item) {
  var btn = item.querySelector('.faq-question');
  var icon = item.querySelector('.faq-icon');

  btn.addEventListener('click', function() {
    var isOpen = item.classList.contains('open');

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
