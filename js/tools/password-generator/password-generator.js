// js/tools/password-generator/password-generator.js
import translationService from '../../../services/translation-service.js';

export class PasswordGenerator {
    constructor() {
        this.currentLanguage = translationService.getCurrentLanguage();
        
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail;
        });
    }

    async init() {
        console.log('Initializing Password Generator...');

        const generatePasswordBtn = document.getElementById('generate-password');
        const copyPasswordBtn = document.getElementById('copy-password');

        if (generatePasswordBtn) {
            generatePasswordBtn.addEventListener('click', () => this.generatePassword());
        }

        if (copyPasswordBtn) {
            copyPasswordBtn.addEventListener('click', () => this.copyPassword());
        }

        this.setupRealTimeUpdates();
        this.generatePassword();

        console.log('Password Generator initialized successfully');
    }

    setupRealTimeUpdates() {
        const inputs = [
            'password-length',
            'include-uppercase', 
            'include-numbers',
            'include-symbols'
        ];

        inputs.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.generatePassword());
                element.addEventListener('input', () => this.generatePassword());
            }
        });
    }

    generatePassword() {
        const passwordOutput = document.getElementById('password-output');
        const passwordLength = document.getElementById('password-length');
        const includeUppercase = document.getElementById('include-uppercase');
        const includeNumbers = document.getElementById('include-numbers');
        const includeSymbols = document.getElementById('include-symbols');

        const length = parseInt(passwordLength?.value) || 12;
        const hasUpper = includeUppercase?.checked || false;
        const hasNumbers = includeNumbers?.checked || false;
        const hasSymbols = includeSymbols?.checked || false;
        
        if (length < 6 || length > 32) {
            this.showAlert('Password length must be between 6 and 32 characters.');
            return;
        }

        if (!hasUpper && !hasNumbers && !hasSymbols) {
            this.showAlert('Please select at least one character type.');
            return;
        }
        
        const password = this.createPassword(length, hasUpper, hasNumbers, hasSymbols);
        
        if (passwordOutput) {
            passwordOutput.value = password;
        }
        
        this.updatePasswordStrength(password);
    }

    createPassword(length, hasUpper, hasNumbers, hasSymbols) {
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        let chars = lowercase;
        let requiredChars = [];
        
        if (hasUpper) {
            chars += uppercase;
            requiredChars.push(uppercase[Math.floor(Math.random() * uppercase.length)]);
        }
        if (hasNumbers) {
            chars += numbers;
            requiredChars.push(numbers[Math.floor(Math.random() * numbers.length)]);
        }
        if (hasSymbols) {
            chars += symbols;
            requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
        }
        
        let password = '';
        
        // Add required characters first
        for (let char of requiredChars) {
            password += char;
        }
        
        // Fill the rest
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        
        // Shuffle
        return this.shuffleString(password);
    }

    shuffleString(string) {
        const array = string.split('');
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array.join('');
    }

    updatePasswordStrength(password) {
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthBar || !strengthText) return;

        const strength = this.calculatePasswordStrength(password);
        
        strengthBar.className = 'strength-bar';
        strengthBar.classList.add(`strength-${strength.level}`);
        
        const widthMap = {
            'weak': '25%',
            'medium': '50%', 
            'strong': '75%',
            'veryStrong': '100%'
        };
        strengthBar.style.width = widthMap[strength.level] || '25%';
        
        strengthText.textContent = this.getStrengthDisplayText(strength.level);
    }

    calculatePasswordStrength(password) {
        if (!password) return { level: 'weak', score: 0 };
        
        let score = 0;
        
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        if (score <= 2) return { level: 'weak', score };
        if (score <= 3) return { level: 'medium', score };
        if (score <= 4) return { level: 'strong', score };
        return { level: 'veryStrong', score };
    }

    getStrengthDisplayText(level) {
        const textMap = {
            'weak': translationService.get('passwordGenerator.weak', 'Weak'),
            'medium': translationService.get('passwordGenerator.medium', 'Medium'),
            'strong': translationService.get('passwordGenerator.strong', 'Strong'),
            'veryStrong': translationService.get('passwordGenerator.veryStrong', 'Very Strong')
        };
        return textMap[level] || level;
    }

    async copyPassword() {
        const passwordOutput = document.getElementById('password-output');
        if (passwordOutput && passwordOutput.value) {
            try {
                await navigator.clipboard.writeText(passwordOutput.value);
                this.showCopySuccess();
            } catch (err) {
                console.error('Failed to copy password: ', err);
                this.showAlert('Failed to copy password.');
            }
        }
    }

    showCopySuccess() {
        const copyPasswordBtn = document.getElementById('copy-password');
        if (copyPasswordBtn) {
            const originalHTML = copyPasswordBtn.innerHTML;
            copyPasswordBtn.innerHTML = '✅ Copied!';
            copyPasswordBtn.disabled = true;
            
            setTimeout(() => {
                copyPasswordBtn.innerHTML = originalHTML;
                copyPasswordBtn.disabled = false;
            }, 2000);
        }
    }

    showAlert(message) {
        console.warn('Password Generator Alert:', message);
    }
}

export default PasswordGenerator;