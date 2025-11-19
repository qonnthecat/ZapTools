// SPA Navigation
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');

navBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById(target).classList.add('active');
  });
});

// Dark Mode Toggle
const themeBtn = document.getElementById('theme-toggle');
themeBtn.addEventListener('click', () => {
  if (document.documentElement.dataset.theme === 'dark') {
    document.documentElement.removeAttribute('data-theme');
    themeBtn.textContent = '🌙';
  } else {
    document.documentElement.dataset.theme = 'dark';
    themeBtn.textContent = '☀️';
  }
});

// Simple Calculator
const calcBtn = document.getElementById('calc-btn');
calcBtn.addEventListener('click', () => {
  const input = document.getElementById('calc-input').value;
  try {
    const result = eval(input);
    document.getElementById('calc-result').textContent = `Result: ${result}`;
  } catch {
    document.getElementById('calc-result').textContent = 'Invalid Expression';
  }
});

// Dummy File Converter
const convertBtn = document.getElementById('convert-btn');
convertBtn.addEventListener('click', () => {
  const fileInput = document.getElementById('file-input');
  if (!fileInput.files.length) return alert('Select a file first!');
  document.getElementById('convert-result').textContent = `Converted: ${fileInput.files[0].name} ✅`;
});