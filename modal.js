// Open modal
document.querySelectorAll('.open-modal').forEach(button => {
  button.addEventListener('click', (event) => {
    const modalId = event.currentTarget.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.classList.remove('hidden');
  });
});

// Close modal on clicking close button
document.querySelectorAll('.close-modal').forEach(button => {
  button.addEventListener('click', (event) => {
    const modalId = event.currentTarget.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    modal.classList.add('hidden');
  });
});

// Close modal when clicking outside the modal content
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.classList.add('hidden');
    }
  });
});