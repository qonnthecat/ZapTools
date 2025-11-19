// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle
    const themeSwitcher = document.getElementById('theme-switcher');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme or prefer-color-scheme
    const savedTheme = localStorage.getItem('theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
    }
    
    themeSwitcher.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        if (currentTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    });
    
    // Navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Image Converter
    const imageDropArea = document.getElementById('image-drop-area');
    const imageInput = document.getElementById('image-input');
    const imageFormat = document.getElementById('image-format');
    const convertImageBtn = document.getElementById('convert-image');
    const imageResult = document.getElementById('image-result');
    
    // Drag and drop functionality
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        imageDropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
        imageDropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        imageDropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        imageDropArea.classList.add('active');
    }
    
    function unhighlight() {
        imageDropArea.classList.remove('active');
    }
    
    imageDropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }
    
    imageDropArea.addEventListener('click', () => {
        imageInput.click();
    });
    
    imageInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    function handleFiles(files) {
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const fileName = file.name.split('.')[0];
                imageDropArea.querySelector('.file-msg').textContent = `File: ${file.name}`;
                
                convertImageBtn.onclick = function() {
                    // In a real app, you would convert the image here
                    // For demo purposes, we'll just show a message
                    imageResult.innerHTML = `
                        <p>File "${fileName}" berhasil dikonversi ke format ${imageFormat.value.toUpperCase()}!</p>
                        <p>Download: <a href="#" class="download-link">${fileName}.${imageFormat.value}</a></p>
                    `;
                };
            } else {
                alert('Silakan pilih file gambar yang valid.');
            }
        }
    }
    
    // Text Converter
    const textInput = document.getElementById('text-input');
    const textFormat = document.getElementById('text-format');
    const convertTextBtn = document.getElementById('convert-text');
    const textResult = document.getElementById('text-result');
    
    convertTextBtn.addEventListener('click', function() {
        const text = textInput.value;
        if (text.trim() === '') {
            alert('Silakan masukkan teks terlebih dahulu.');
            return;
        }
        
        let convertedText;
        switch(textFormat.value) {
            case 'uppercase':
                convertedText = text.toUpperCase();
                break;
            case 'lowercase':
                convertedText = text.toLowerCase();
                break;
            case 'titlecase':
                convertedText = text.replace(/\w\S*/g, function(txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                break;
            default:
                convertedText = text;
        }
        
        textResult.innerHTML = `<p>${convertedText}</p>`;
    });
    
    // Calculator
    const calcDisplay = document.getElementById('calc-display');
    const calcButtons = document.querySelectorAll('.calc-btn');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    
    let currentInput = '0';
    let previousInput = '';
    let operation = null;
    let resetScreen = false;
    
    // Load history from localStorage
    let calculationHistory = JSON.parse(localStorage.getItem('calcHistory')) || [];
    updateHistoryDisplay();
    
    calcButtons.forEach(button => {
        button.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const value = this.getAttribute('data-value');
            
            if (action) {
                handleAction(action);
            } else if (value) {
                handleInput(value);
            }
            
            updateDisplay();
        });
    });
    
    function handleInput(value) {
        if (currentInput === '0' || resetScreen) {
            currentInput = value;
            resetScreen = false;
        } else {
            currentInput += value;
        }
    }
    
    function handleAction(action) {
        switch(action) {
            case 'clear':
                currentInput = '0';
                previousInput = '';
                operation = null;
                break;
            case 'backspace':
                if (currentInput.length > 1) {
                    currentInput = currentInput.slice(0, -1);
                } else {
                    currentInput = '0';
                }
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                if (previousInput && operation && !resetScreen) {
                    calculate();
                }
                operation = action;
                previousInput = currentInput;
                resetScreen = true;
                break;
            case 'calculate':
                if (previousInput && operation) {
                    calculate();
                    operation = null;
                    previousInput = '';
                }
                break;
        }
    }
    
    function calculate() {
        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch(operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('Tidak bisa membagi dengan nol!');
                    return;
                }
                result = prev / current;
                break;
            default:
                return;
        }
        
        // Add to history
        const calculation = `${previousInput} ${getOperationSymbol(operation)} ${currentInput} = ${result}`;
        calculationHistory.unshift(calculation);
        if (calculationHistory.length > 10) {
            calculationHistory.pop();
        }
        localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
        
        currentInput = result.toString();
        resetScreen = true;
    }
    
    function getOperationSymbol(op) {
        switch(op) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            default: return '';
        }
    }
    
    function updateDisplay() {
        calcDisplay.value = currentInput;
    }
    
    function updateHistoryDisplay() {
        historyList.innerHTML = '';
        calculationHistory.forEach(calc => {
            const li = document.createElement('li');
            li.textContent = calc;
            historyList.appendChild(li);
        });
    }
    
    clearHistoryBtn.addEventListener('click', function() {
        calculationHistory = [];
        localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
        updateHistoryDisplay();
    });
    
    // Color Picker
    const colorPicker = document.getElementById('color-picker');
    const hexValue = document.getElementById('hex-value');
    const rgbValue = document.getElementById('rgb-value');
    
    colorPicker.addEventListener('input', function() {
        const hex = this.value;
        hexValue.textContent = hex;
        
        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        
        rgbValue.textContent = `rgb(${r}, ${g}, ${b})`;
    });
    
    // Password Generator
    const passwordOutput = document.getElementById('password-output');
    const copyPasswordBtn = document.getElementById('copy-password');
    const passwordLength = document.getElementById('password-length');
    const includeUppercase = document.getElementById('include-uppercase');
    const includeNumbers = document.getElementById('include-numbers');
    const includeSymbols = document.getElementById('include-symbols');
    const generatePasswordBtn = document.getElementById('generate-password');
    
    generatePasswordBtn.addEventListener('click', function() {
        const length = parseInt(passwordLength.value);
        const hasUpper = includeUppercase.checked;
        const hasNumbers = includeNumbers.checked;
        const hasSymbols = includeSymbols.checked;
        
        passwordOutput.value = generatePassword(length, hasUpper, hasNumbers, hasSymbols);
    });
    
    copyPasswordBtn.addEventListener('click', function() {
        if (passwordOutput.value) {
            passwordOutput.select();
            document.execCommand('copy');
            alert('Kata sandi telah disalin ke clipboard!');
        }
    });
    
    function generatePassword(length, hasUpper, hasNumbers, hasSymbols) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let chars = lowercase;
        if (hasUpper) chars += uppercase;
        if (hasNumbers) chars += numbers;
        if (hasSymbols) chars += symbols;
        
        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        
        return password;
    }
    
    // Initialize with a password
    generatePasswordBtn.click();
});