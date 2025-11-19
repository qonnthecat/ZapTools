// js/services/password-generator.js
export class PasswordGenerator {
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

        // Generate initial password
        this.generatePassword();
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

    updatePasswordStrength(password) {
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');
        
        if (!strengthBar || !strengthText) return;

        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        
        // Update UI
        strengthBar.className = 'strength-bar';
        
        if (strength <= 2) {
            strengthBar.classList.add('strength-weak');
            strengthText.textContent = 'Lemah';
        } else if (strength === 3) {
            strengthBar.classList.add('strength-medium');
            strengthText.textContent = 'Sedang';
        } else if (strength === 4) {
            strengthBar.classList.add('strength-strong');
            strengthText.textContent = 'Kuat';
        } else {
            strengthBar.classList.add('strength-very-strong');
            strengthText.textContent = 'Sangat Kuat';
        }
    }

    copyPassword() {
        const passwordOutput = document.getElementById('password-output');
        if (passwordOutput && passwordOutput.value) {
            passwordOutput.select();
            document.execCommand('copy');
            alert('Kata sandi telah disalin ke clipboard!');
        }
    }
}