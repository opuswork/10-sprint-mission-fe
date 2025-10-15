// 에러 메시지 표시 함수
function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    
    input.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');
}

// 에러 메시지 숨기기 함수
function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    
    input.classList.remove('error');
    errorDiv.classList.remove('show');
    errorDiv.textContent = '';
}

// 로그인 버튼 활성화/비활성화 함수
function updateLoginButtonState() {
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('passwordInput').value;
    const loginButton = document.querySelector('button[type="submit"]');
    
    if (email && password) {
        loginButton.disabled = false;
        loginButton.style.opacity = '1';
        loginButton.style.cursor = 'pointer';
    } else {
        loginButton.disabled = true;
        loginButton.style.opacity = '0.5';
        loginButton.style.cursor = 'not-allowed';
    }
}

// 이메일 형식 검증 함수
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 폼 검증 함수
function validateForm() {
    let isValid = true;
    
    // 이메일 검증
    const email = document.getElementById('username').value.trim();
    if (!email) {
        showError('username', 'emailError', '이메일을 입력해주세요.');
        isValid = false;
    } else if (!validateEmail(email)) {
        showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
        isValid = false;
    } else {
        hideError('username', 'emailError');
    }

    // 비밀번호 검증
    const password = document.getElementById('passwordInput').value;
    if (!password) {
        showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
        isValid = false;
    } else {
        hideError('passwordInput', 'passwordError');
    }

    return isValid;
}

// 비밀번호 표시 함수 (누르고 있는 동안)
function showPassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    input.type = 'text';
    toggle.src = './images/eye-open.svg';
    toggle.alt = '비밀번호 숨김';
}

// 비밀번호 숨김 함수 (손을 뗄 때)
function hidePassword(inputId, toggleId) {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    
    input.type = 'password';
    toggle.src = './images/eye-closed.svg';
    toggle.alt = '비밀번호 표시';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('username');
    const passwordInput = document.getElementById('passwordInput');
    const passwordToggle = document.getElementById('passwordToggle');
    
    // 초기 버튼 상태 설정
    updateLoginButtonState();
    
    // 폼 제출 시 검증
    form.addEventListener('submit', function(e) {
        if (!validateForm()) {
            e.preventDefault();
        } else {
            // 검증 통과 시 items 페이지로 이동
            e.preventDefault();
            window.location.href = './items.html';
        }
    });
    
    // 이메일 입력 필드 이벤트
    emailInput.addEventListener('blur', function() {
        const email = this.value.trim();
        if (!email) {
            showError('username', 'emailError', '이메일을 입력해주세요.');
        } else if (!validateEmail(email)) {
            showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
        } else {
            hideError('username', 'emailError');
        }
        updateLoginButtonState();
    });
    
    emailInput.addEventListener('input', function() {
        hideError('username', 'emailError');
        updateLoginButtonState();
    });
    
    // 비밀번호 입력 필드 이벤트
    passwordInput.addEventListener('blur', function() {
        const password = this.value;
        if (!password) {
            showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
        } else {
            hideError('passwordInput', 'passwordError');
        }
        updateLoginButtonState();
    });
    
    passwordInput.addEventListener('input', function() {
        hideError('passwordInput', 'passwordError');
        updateLoginButtonState();
    });
    
    // 비밀번호 표시/숨김 토글 이벤트
    passwordToggle.addEventListener('mousedown', function() {
        showPassword('passwordInput', 'passwordToggle');
    });
    
    passwordToggle.addEventListener('mouseup', function() {
        hidePassword('passwordInput', 'passwordToggle');
    });
    
    passwordToggle.addEventListener('mouseleave', function() {
        hidePassword('passwordInput', 'passwordToggle');
    });
});
