function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (errorDiv) {
        errorDiv.classList.remove('show');
        errorDiv.textContent = '';
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function updateLoginButtonState() {
    const emailEl = document.getElementById('username');
    const pwdEl = document.getElementById('passwordInput');
    const submitButton = document.querySelector('button[type="submit"]');
    if (!emailEl || !pwdEl || !submitButton) return;
    const email = emailEl.value.trim();
    const password = pwdEl.value;
    const enabled = Boolean(email && password);
    submitButton.disabled = !enabled;
    submitButton.style.opacity = enabled ? '1' : '0.5';
    submitButton.style.cursor = enabled ? 'pointer' : 'not-allowed';
}

// 로그인 폼에 적용할 유효성 검사
function validateLoginForm() {
    let isValid = true;
    const email = document.getElementById('username')?.value.trim() || '';
    const password = document.getElementById('passwordInput')?.value || '';
    if (!email) {
        showError('username', 'emailError', '이메일을 입력해주세요.');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideError('username', 'emailError');
    }

    if (!password) {
        showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
        isValid = false;
    } else {
        hideError('passwordInput', 'passwordError');
    }
    return isValid;
}

// 회원가입 폼에 적용할 유효성 검사
function validateSignupForm() {
    let isValid = true;
    const email = document.getElementById('username')?.value.trim() || '';
    const nickname = document.getElementById('nickname')?.value.trim() || '';
    const password = document.getElementById('passwordInput')?.value || '';
    const passwordConfirm = document.getElementById('passwordInput2')?.value || '';

    if (!email) {
        showError('username', 'emailError', '이메일을 입력해주세요.');
        isValid = false;
    } else if (!validateEmail(email)) { //로그인 페이지엔 이메일 유효성 검사를 제외시키려면 (!isLoginPage)를 조건문에 추가하면 됨.
        showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideError('username', 'emailError');
    }

    if (!nickname) {
        showError('nickname', 'nicknameError', '닉네임을 입력해주세요.');
        isValid = false;
    } else if (nickname.length < 2) {
        showError('nickname', 'nicknameError', '닉네임은 2자 이상이어야 합니다.');
        isValid = false;
    } else {
        hideError('nickname', 'nicknameError');
    }

    if (!password) {
        showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
        isValid = false;
    } else if (password.length < 15 || password.length > 20) {
        showError('passwordInput', 'passwordError', '비밀번호는 15자 이상 20자 이하여야 합니다.');
        isValid = false;
    } else {
        hideError('passwordInput', 'passwordError');
    }

    if (!passwordConfirm) {
        showError('passwordInput2', 'passwordConfirmError', '비밀번호 확인을 입력해주세요.');
        isValid = false;
    } else if (password !== passwordConfirm) {
        showError('passwordInput2', 'passwordConfirmError', '비밀번호가 일치하지 않습니다.');
        isValid = false;
    } else {
        hideError('passwordInput2', 'passwordConfirmError');
    }

    return isValid;
}

function showPassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (!input || !toggle) return;
    input.type = 'text';
    toggle.src = './images/eye-open.svg';
    toggle.alt = '비밀번호 숨김';
}

function hidePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (!input || !toggle) return;
    input.type = 'password';
    toggle.src = './images/eye-closed.svg';
    toggle.alt = '비밀번호 표시';
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    if (!form) return;
    const isLoginPage = window.location.pathname.includes('sign-in.html');

    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('passwordInput');
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordConfirmToggle = document.getElementById('passwordConfirmToggle');
    const nicknameInput = document.getElementById('nickname');
    const passwordConfirmInput = document.getElementById('passwordInput2');

    if (isLoginPage) {
        updateLoginButtonState();
    } else {
        const submitButton = document.querySelector('button[type="submit"]');
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
        }
    }

    //Login form submit
    form.addEventListener('submit', function(e) {
        const ok = isLoginPage ? validateLoginForm() : validateSignupForm();
        if (!ok) {
            e.preventDefault();
            return;
        }
        e.preventDefault();
        window.location.href = isLoginPage ? './items.html' : '/';
    });

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            const email = this.value.trim();
            if (!email) {
                showError('username', 'emailError', '이메일을 입력해주세요.');
            } else if (!validateEmail(email)) {
                showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
            } else {
                hideError('username', 'emailError');
            }
            if (isLoginPage) updateLoginButtonState();
        });
        emailInput.addEventListener('input', function() {
            hideError('username', 'emailError');
            if (isLoginPage) updateLoginButtonState();
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            const password = this.value;
            if (!password) {
                showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
            } else if (!isLoginPage && (password.length < 15 || password.length > 20)) {
                showError('passwordInput', 'passwordError', '비밀번호는 15자 이상 20자 이하여야 합니다.');
            } else {
                hideError('passwordInput', 'passwordError');
            }
            if (isLoginPage) updateLoginButtonState();
        });
        passwordInput.addEventListener('input', function() {
            hideError('passwordInput', 'passwordError');
            if (isLoginPage) updateLoginButtonState();
        });
    }

    // Sign-up 전용: 닉네임과 비밀번호 확인 실시간 검증
    if (!isLoginPage && nicknameInput) {
        nicknameInput.addEventListener('blur', function() {
            const nickname = this.value.trim();
            if (!nickname) {
                showError('nickname', 'nicknameError', '닉네임을 입력해주세요.');
            } else if (nickname.length < 2) {
                showError('nickname', 'nicknameError', '닉네임은 2자 이상이어야 합니다.');
            } else {
                hideError('nickname', 'nicknameError');
            }
        });
        nicknameInput.addEventListener('input', function() {
            hideError('nickname', 'nicknameError');
        });
    }

    if (!isLoginPage && passwordConfirmInput) {
        passwordConfirmInput.addEventListener('blur', function() {
            const password = document.getElementById('passwordInput')?.value || '';
            const confirm = this.value || '';
            if (!confirm) {
                showError('passwordInput2', 'passwordConfirmError', '비밀번호 확인을 입력해주세요.');
            } else if (password !== confirm) {
                showError('passwordInput2', 'passwordConfirmError', '비밀번호가 일치하지 않습니다.');
            } else {
                hideError('passwordInput2', 'passwordConfirmError');
            }
        });
        passwordConfirmInput.addEventListener('input', function() {
            hideError('passwordInput2', 'passwordConfirmError');
        });
    }

    if (passwordToggle) {
        passwordToggle.addEventListener('mousedown', function() {
            showPassword('passwordInput', 'passwordToggle');
        });
        passwordToggle.addEventListener('mouseup', function() {
            hidePassword('passwordInput', 'passwordToggle');
        });
        passwordToggle.addEventListener('mouseleave', function() {
            hidePassword('passwordInput', 'passwordToggle');
        });
    }

    if (passwordConfirmToggle) {
        passwordConfirmToggle.addEventListener('mousedown', function() {
            showPassword('passwordInput2', 'passwordConfirmToggle');
        });
        passwordConfirmToggle.addEventListener('mouseup', function() {
            hidePassword('passwordInput2', 'passwordConfirmToggle');
        });
        passwordConfirmToggle.addEventListener('mouseleave', function() {
            hidePassword('passwordInput2', 'passwordConfirmToggle');
        });
    }
});
