document.addEventListener('DOMContentLoaded', () => {
  // Open modal
  document.querySelectorAll('button[data-modal]').forEach(button => {
    button.addEventListener('click', event => {
      const modalId = event.target.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'block';
    });
  });

  // Close modal
  document.querySelectorAll('.close').forEach(span => {
    span.addEventListener('click', event => {
      const modalId = event.target.getAttribute('data-modal');
      document.getElementById(modalId).style.display = 'none';
    });
  });

  // Close modal when clicking outside of modal content
  window.addEventListener('click', event => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });
});