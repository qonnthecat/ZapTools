// js/services/password-generator.js
import translationService from './translation-service.js';
import historyManager from './history-manager.js';

export class PasswordGenerator {
    constructor() {
        this.currentLanguage = translationService.getCurrentLanguage();
        this.isRecordingHistory = false;
        
        window.addEventListener('languageChanged', (e) => {
            this.currentLanguage = e.detail;
        });
    }

    async init() {
        const generatePasswordBtn = document.getElementById('generate-password');
        const copyPasswordBtn = document.getElementById('copy-password');

        console.log('Initializing Password Generator...');

        // Initialize history manager first
        try {
            await historyManager.init();
            console.log('History Manager initialized for Password Generator');
        } catch (error) {
            console.warn('History Manager initialization failed:', error);
        }

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

    async generatePassword() {
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
        
        // Record in history dengan error handling yang lebih baik
        await this.recordPasswordGeneration({
            length: length,
            hasUpper: hasUpper,
            hasNumbers: hasNumbers,
            hasSymbols: hasSymbols,
            strength: this.calculatePasswordStrength(password).level,
            passwordPreview: this.maskPassword(password) // Jangan simpan password asli!
        });
    }

    /**
     * Method khusus untuk recording password generation dengan safety measures
     */
    async recordPasswordGeneration(data) {
        if (this.isRecordingHistory) {
            console.log('History recording already in progress, skipping...');
            return;
        }

        this.isRecordingHistory = true;

        try {
            const historyData = {
                type: 'password',
                timestamp: Date.now(),
                length: data.length,
                hasUpper: data.hasUpper,
                hasNumbers: data.hasNumbers,
                hasSymbols: data.hasSymbols,
                strength: data.strength,
                passwordPreview: data.passwordPreview,
                // Jangan sertakan password asli untuk keamanan
                input: `Generated ${data.length} character password`,
                output: `Password with ${this.getPasswordFeatures(data)}`
            };

            console.log('Recording password generation to history:', historyData);

            const success = await historyManager.addConversionToHistory(historyData);
            
            if (success) {
                console.log('Password generation recorded successfully');
            } else {
                console.warn('Failed to record password generation in history');
                // Jangan tampilkan error ke user untuk avoid annoyance
            }
        } catch (error) {
            console.error('Error recording password generation:', error);
            // Jangan tampilkan error ke user
        } finally {
            this.isRecordingHistory = false;
        }
    }

    /**
     * Method untuk recording copy action
     */
    async recordCopyAction() {
        try {
            const historyData = {
                type: 'password',
                operation: 'copy',
                timestamp: Date.now(),
                input: 'Password copied to clipboard',
                output: 'Clipboard'
            };

            console.log('Recording copy action to history:', historyData);

            const success = await historyManager.addConversionToHistory(historyData);
            
            if (!success) {
                console.warn('Failed to record copy action in history');
            }
        } catch (error) {
            console.error('Error recording copy action:', error);
        }
    }

    /**
     * Helper method untuk mendapatkan deskripsi fitur password
     */
    getPasswordFeatures(data) {
        const features = [];
        if (data.hasUpper) features.push('uppercase');
        if (data.hasNumbers) features.push('numbers');
        if (data.hasSymbols) features.push('symbols');
        
        if (features.length === 0) {
            return 'lowercase only';
        }
        
        return features.join(', ');
    }

    /**
     * Mask password untuk keamanan (hanya tampilkan sebagian)
     */
    maskPassword(password) {
        if (!password || password.length < 3) return '***';
        return password.substring(0, 2) + '***' + password.substring(password.length - 1);
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
        
        // Update width based on strength
        const widthMap = {
            'weak': '25%',
            'medium': '50%', 
            'strong': '75%',
            'veryStrong': '100%'
        };
        strengthBar.style.width = widthMap[strength.level] || '25%';
        
        // Update strength text
        strengthText.textContent = this.getStrengthDisplayText(strength.level);
        strengthText.className = `strength-text strength-${strength.level}`;
    }

    getStrengthDisplayText(level) {
        const textMap = {
            'weak': translationService.get('password.weak', 'Weak'),
            'medium': translationService.get('password.medium', 'Medium'),
            'strong': translationService.get('password.strong', 'Strong'),
            'veryStrong': translationService.get('password.veryStrong', 'Very Strong')
        };
        return textMap[level] || level;
    }

    calculatePasswordStrength(password) {
        if (!password) return { level: 'weak', score: 0 };
        
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
        } else if (score <= 3) {
            return { level: 'medium', score: score };
        } else if (score <= 4) {
            return { level: 'strong', score: score };
        } else {
            return { level: 'veryStrong', score: score };
        }
    }

    async copyPassword() {
        const passwordOutput = document.getElementById('password-output');
        if (passwordOutput && passwordOutput.value) {
            try {
                passwordOutput.select();
                passwordOutput.setSelectionRange(0, 99999); // For mobile devices
                
                await navigator.clipboard.writeText(passwordOutput.value);
                this.showCopySuccess();
                
                // Record copy action
                await this.recordCopyAction();
                
            } catch (err) {
                console.error('Failed to copy password: ', err);
                
                // Fallback for older browsers
                try {
                    document.execCommand('copy');
                    this.showCopySuccess();
                    await this.recordCopyAction();
                } catch (fallbackErr) {
                    console.error('Fallback copy also failed: ', fallbackErr);
                    this.showAlert('Failed to copy password. Please select and copy manually.');
                }
            }
        } else {
            this.showAlert('No password to copy. Please generate a password first.');
        }
    }

    showCopySuccess() {
        const copyPasswordBtn = document.getElementById('copy-password');
        if (copyPasswordBtn) {
            const originalText = copyPasswordBtn.textContent;
            const originalHTML = copyPasswordBtn.innerHTML;
            
            copyPasswordBtn.innerHTML = '✅ ' + translationService.get('password.copied', 'Copied!');
            copyPasswordBtn.disabled = true;
            
            setTimeout(() => {
                copyPasswordBtn.innerHTML = originalHTML;
                copyPasswordBtn.textContent = originalText;
                copyPasswordBtn.disabled = false;
            }, 2000);
        }
        
        // Show subtle notification instead of alert
        this.showToast(translationService.get('password.copied', 'Password copied to clipboard!'));
    }

    showAlert(message) {
        // Use console instead of alert for better UX
        console.warn('Password Generator Alert:', message);
        
        // Optional: Show toast instead of alert
        this.showToast(message, 'warning');
    }

    showToast(message, type = 'success') {
        // Simple toast notification implementation
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#f44336'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10000;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 3000);
    }

    /**
     * Cleanup method untuk menghindari memory leaks
     */
    destroy() {
        // Remove event listeners jika diperlukan
        this.isRecordingHistory = false;
    }
}

// Export singleton instance
export const passwordGenerator = new PasswordGenerator();
export default passwordGenerator;