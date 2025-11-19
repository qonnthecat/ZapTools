// js/services/password-generator.js
import translationService from './translation-service.js';
import { HistoryManager } from './history-manager.js';

export class PasswordGenerator {
    constructor() {
        this.currentLanguage = translationService.getCurrentLanguage();
        
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail;
        });
    }

    init() {
        const generatePasswordBtn = document.getElementById('generate-password');
        const copyPasswordBtn = document.getElementById('copy-password');

        console.log('Initializing Password Generator...');

        if (generatePasswordBtn) {
            generatePasswordBtn.addEventListener('click', () => this.generatePassword());
        }

        if (copyPasswordBtn) {
            copyPasswordBtn.addEventListener('click', () => this.copyPassword());
        }

        // Add event listeners for real-time strength update
        this.setupRealTimeUpdates();

        // Generate initial password
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
                element.addEventListener('change', () => {
                    this.generatePassword();
                });
                element.addEventListener('input', () => {
                    this.generatePassword();
                });
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
        
        // Validate parameters
        if (length < 6 || length > 32) {
            this.showAlert('Password length must be between 6 and 32 characters.');
            return;
        }

        if (!hasUpper && !hasNumbers && !hasSymbols) {
            this.showAlert('Please select at least one character type (uppercase, numbers, or symbols).');
            return;
        }
        
        const password = this.createPassword(length, hasUpper, hasNumbers, hasSymbols);
        
        if (passwordOutput) {
            passwordOutput.value = password;
        }
        
        this.updatePasswordStrength(password);
        
        // Record in history
        HistoryManager.recordConversion('password', {
            length: length,
            hasUpper: hasUpper,
            hasNumbers: hasNumbers,
            hasSymbols: hasSymbols,
            strength: this.calculatePasswordStrength(password)
        });
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
        
        // Add required characters first to ensure diversity
        for (let char of requiredChars) {
            password += char;
        }
        
        // Fill the rest with random characters
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        
        // Shuffle the password to mix required characters
        password = this.shuffleString(password);
        
        return password;
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
        
        // Update strength bar
        strengthBar.className = 'strength-bar';
        strengthBar.classList.add(`strength-${strength.level}`);
        
        // Update strength text
        strengthText.textContent = translationService.getPasswordGenerator(strength.level) || strength.level;
        strengthText.className = `strength-text strength-${strength.level}`;
    }

    calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (password.length >= 16) score++;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        // Determine strength level
        if (score <= 2) {
            return { level: 'weak', score: score };
        } else if (score === 3) {
            return { level: 'medium', score: score };
        } else if (score === 4) {
            return { level: 'strong', score: score };
        } else {
            return { level: 'veryStrong', score: score };
        }
    }

    copyPassword() {
        const passwordOutput = document.getElementById('password-output');
        if (passwordOutput && passwordOutput.value) {
            passwordOutput.select();
            passwordOutput.setSelectionRange(0, 99999); // For mobile devices
            
            navigator.clipboard.writeText(passwordOutput.value).then(() => {
                this.showCopySuccess();
            }).catch(err => {
                console.error('Failed to copy password: ', err);
                // Fallback for older browsers
                try {
                    document.execCommand('copy');
                    this.showCopySuccess();
                } catch (fallbackErr) {
                    this.showAlert('Failed to copy password. Please select and copy manually.');
                }
            });
        }
    }

    showCopySuccess() {
        const copyPasswordBtn = document.getElementById('copy-password');
        if (copyPasswordBtn) {
            const originalHTML = copyPasswordBtn.innerHTML;
            copyPasswordBtn.innerHTML = '✅';
            copyPasswordBtn.disabled = true;
            
            setTimeout(() => {
                copyPasswordBtn.innerHTML = originalHTML;
                copyPasswordBtn.disabled = false;
            }, 2000);
        }
        
        this.showAlert(translationService.getAlert('passwordCopied'));
        
        // Record copy action in history
        HistoryManager.recordConversion('password', {
            operation: 'copy',
            input: 'Password copied to clipboard',
            output: 'Clipboard'
        });
    }

    showAlert(message) {
        // Could be enhanced with toast notifications
        alert(message);
    }
}