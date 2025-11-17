// Helper functions for showing/hiding errors
export function showError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    if (input) input.classList.add('error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
    }
}

export function hideError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(errorId);
    if (input) input.classList.remove('error');
    if (errorDiv) {
        errorDiv.classList.remove('show');
        errorDiv.textContent = '';
    }
}

// Create Modal dialog show
export function showModal(message) {
    const modal = document.getElementById('errorModal');
    const modalMessage = document.getElementById('modalMessage');
    if (modalMessage) modalMessage.textContent = message;
    if (modal) modal.classList.add('show');
}

// Remove Modal dialog show
export function hideModal() {
    const modal = document.getElementById('errorModal');
    if (modal) modal.classList.remove('show');
}

// Validation function for product registration form
export function validateProductRegisterForm() {
    let isValid = true;
    const productNameVar = document.getElementById('itemName')?.value.trim() || '';
    const productPriceVar = document.getElementById('itemPrice')?.value.trim() || '';
    const productIntroVar = document.getElementById('itemIntro')?.value.trim() || '';
    const productItemTagVar = document.getElementById('itemTag')?.value.trim() || '';
    
    if (!productNameVar) {
        showError('itemName', 'productNameVarError', '상품명을 입력해주세요.');
        isValid = false;
    } else {
        hideError('itemName', 'productNameVarError');
    }

    if (!productIntroVar) {
        showError('itemIntro', 'productIntroError', '상품 상세 정보를 입력해주세요.');
        isValid = false;
    } else {
        hideError('itemIntro', 'productIntroError');
    }

    if (!productPriceVar) {
        showError('itemPrice', 'productPriceError', '상품가격을 입력해주세요.');
        isValid = false;
    } else {
        hideError('itemPrice', 'productPriceError');
    }

    if (!productItemTagVar) {
        showError('itemTag', 'productTagError', '태그를 입력해주세요.');
        isValid = false;
    } else {
        hideError('itemTag', 'productTagError');
    }

    return isValid;
}
