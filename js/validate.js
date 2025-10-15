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

    // 모든 에러 메시지 초기화
    function clearAllErrors() {
        hideError('username', 'emailError');
        hideError('nickname', 'nicknameError');
        hideError('passwordInput', 'passwordError');
        hideError('passwordInput2', 'passwordConfirmError');
    }

    // 폼 검증 함수
    function validateForm() {
        let isValid = true;
        clearAllErrors();

        // 이메일 검증
        const email = document.getElementById('username').value.trim();
        if (!email) {
            showError('username', 'emailError', '이메일을 입력해주세요.');
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showError('username', 'emailError', '올바른 이메일 형식을 입력해주세요.');
            isValid = false;
        }

        // 닉네임 검증
        const nickname = document.getElementById('nickname').value.trim();
        if (!nickname) {
            showError('nickname', 'nicknameError', '닉네임을 입력해주세요.');
            isValid = false;
        } else if (nickname.length < 2) {
            showError('nickname', 'nicknameError', '닉네임은 2자 이상이어야 합니다.');
            isValid = false;
        }

        // 비밀번호 검증
        const password = document.getElementById('passwordInput').value;
        if (!password) {
            showError('passwordInput', 'passwordError', '비밀번호를 입력해주세요.');
            isValid = false;
        } else {
            // 비밀번호 길이 검증
            if (password.length < 8 || password.length > 20) {
                showError('passwordInput', 'passwordError', '비밀번호는 8자 이상 20자 이하이어야 합니다.');
                isValid = false;
            } else {
                // 비밀번호 조합 검증 (숫자+영문대문자+소문자+특수문자)
                const hasNumber = /\d/.test(password);
                const hasUpperCase = /[A-Z]/.test(password);
                const hasLowerCase = /[a-z]/.test(password);
                const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

                let errorMessage = '';
                if (!hasNumber) errorMessage += '숫자, ';
                if (!hasUpperCase) errorMessage += '영문 대문자, ';
                if (!hasLowerCase) errorMessage += '영문 소문자, ';
                if (!hasSpecialChar) errorMessage += '특수문자, ';

                if (errorMessage) {
                    errorMessage = errorMessage.slice(0, -2) + '가 포함되어야 합니다.';
                    showError('passwordInput', 'passwordError', errorMessage);
                    isValid = false;
                }
            }
        }

        // 비밀번호 확인 검증
        const passwordConfirm = document.getElementById('passwordInput2').value;
        if (!passwordConfirm) {
            showError('passwordInput2', 'passwordConfirmError', '비밀번호 확인을 입력해주세요.');
            isValid = false;
        } else if (password !== passwordConfirm) {
            showError('passwordInput2', 'passwordConfirmError', '비밀번호가 일치하지 않습니다.');
            isValid = false;
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



    // 폼 제출 시 검증 실행
    document.addEventListener('DOMContentLoaded', function() {
        const form = document.querySelector('form');
        const isLoginPage = window.location.pathname.includes('sign-in.html');
        
        form.addEventListener('submit', function(e) {
            let isValid = false;
            
            if (isLoginPage) {
                isValid = validateLoginForm();
            } else {
                isValid = validateForm();
            }
            
            if (!isValid) {
                e.preventDefault(); // 폼 제출 방지
            } else {
                // 검증 통과 시 items 페이지로 이동
                e.preventDefault();
                window.location.href = '/';
            }
        });

        // 비밀번호 표시/숨김 이벤트 추가 (누르고 있는 동안만 표시)
        const passwordToggle = document.getElementById('passwordToggle');
        const passwordConfirmToggle = document.getElementById('passwordConfirmToggle');
        
        // 첫 번째 비밀번호 필드
        passwordToggle.addEventListener('mousedown', function() {
            showPassword('passwordInput', 'passwordToggle');
        });
        
        passwordToggle.addEventListener('mouseup', function() {
            hidePassword('passwordInput', 'passwordToggle');
        });
        
        passwordToggle.addEventListener('mouseleave', function() {
            hidePassword('passwordInput', 'passwordToggle');
        });
        
        // 비밀번호 확인 필드
        passwordConfirmToggle.addEventListener('mousedown', function() {
            showPassword('passwordInput2', 'passwordConfirmToggle');
        });
        
        passwordConfirmToggle.addEventListener('mouseup', function() {
            hidePassword('passwordInput2', 'passwordConfirmToggle');
        });
        
        passwordConfirmToggle.addEventListener('mouseleave', function() {
            hidePassword('passwordInput2', 'passwordConfirmToggle');
        });

        // 페이지별 입력 필드 설정
        let inputs = [];
        if (isLoginPage) {
            inputs = ['username', 'passwordInput'];
        } else {
            inputs = ['username', 'nickname', 'passwordInput', 'passwordInput2'];
        }

        // 입력 필드에서 포커스가 벗어날 때 실시간 검증
        inputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (!input) return; // 요소가 없으면 건너뛰기
            
            input.addEventListener('blur', function() {
                // 해당 필드만 검증
                const value = this.value.trim();
                const errorId = inputId === 'username' ? 'emailError' : 
                               inputId === 'nickname' ? 'nicknameError' :
                               inputId === 'passwordInput' ? 'passwordError' : 'passwordConfirmError';

                if (!value) {
                    if (inputId === 'username') {
                        showError(inputId, errorId, '이메일을 입력해주세요.');
                    } else if (inputId === 'nickname') {
                        showError(inputId, errorId, '닉네임을 입력해주세요.');
                    } else if (inputId === 'passwordInput') {
                        showError(inputId, errorId, '비밀번호를 입력해주세요.');
                    } else if (inputId === 'passwordInput2') {
                        showError(inputId, errorId, '비밀번호 확인을 입력해주세요.');
                    }
                } else {
                    hideError(inputId, errorId);
                }
                
                // 로그인 페이지인 경우 버튼 상태 업데이트
                if (isLoginPage) {
                    updateLoginButtonState();
                }
            });

            // 입력 중일 때 에러 상태 제거 및 버튼 상태 업데이트
            input.addEventListener('input', function() {
                const errorId = inputId === 'username' ? 'emailError' : 
                               inputId === 'nickname' ? 'nicknameError' :
                               inputId === 'passwordInput' ? 'passwordError' : 'passwordConfirmError';
                hideError(inputId, errorId);
                
                // 로그인 페이지인 경우 버튼 상태 업데이트
                if (isLoginPage) {
                    updateLoginButtonState();
                }
            });
        });

        // 로그인 페이지인 경우 초기 버튼 상태 설정
        if (isLoginPage) {
            updateLoginButtonState();
        }
    });