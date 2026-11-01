// ==========================================
// SABİT KİMLİK BİLGİLERİ (Giriş Kontrolü İçin)
// ==========================================
const VALID_EMAIL = "tahacinar@outlook.com.tr";
const VALID_PASSWORD = "a80556a9b22Fd";

// ==========================================
// SAYFA YÜKLENDİĞİNDE ÇALIŞACAK ANA KONTROL
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Mevcut sayfanın dosya adını URL'den al (Bulunamazsa varsayılan olarak 'loginpage.html' kabul et)
    const currentPage = window.location.pathname.split('/').pop() || 'loginpage.html';

    // 1. DURUM: EĞER KULLANICI ANA SAYFADA (HOMEPAGE) İSE
    if (currentPage === 'homepage.html') {
        // Oturum açılıp açılmadığını kontrol et
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            // Oturum açılmamışsa doğrudan giriş sayfasına yönlendir
            window.location.href = 'loginpage.html';
            return;
        }

        // SGLT-2 seçim durumuna göre ek alanları düzenle
        toggleSglt2Reason();
        
        // Form elemanlarına anlık hata temizleme dinleyicileri ekle (kullanıcı yazdıkça hata kırmızıları kalkar)
        const formInputs = document.querySelectorAll('#patientDataForm input, #patientDataForm select');
        formInputs.forEach(element => {
            element.addEventListener('input', () => clearElementError(element));
            element.addEventListener('change', () => clearElementError(element));
        });

    // 2. DURUM: EĞER KULLANICI GİRİŞ SAYFASINDA İSE
    } else if (currentPage === 'loginpage.html' || currentPage === '') {
        // "Beni Hatırla" ile kaydedilmiş e-posta varsa input alanına otomatik doldur
        const savedEmail = localStorage.getItem('savedEmail');
        const emailInput = document.getElementById('email');
        const rememberMeInput = document.getElementById('rememberMe');
        if (savedEmail && emailInput && rememberMeInput) {
            emailInput.value = savedEmail;
            rememberMeInput.checked = true;
        }
    }
});

// ==========================================
// VÜCUT KİTLE İNDEKSİ (BMI) HESAPLAMA FONKSİYONU
// ==========================================
function calculateBmi() {
    const heightCm = parseFloat(document.getElementById('patientHeight').value);
    const weightKg = parseFloat(document.getElementById('patientWeight').value);
    const bmiInput = document.getElementById('patientBmi');

    // Boy ve kilo geçerli değerlerse hesapla
    if (heightCm > 0 && weightKg > 0) {
        const heightM = heightCm / 100;
        const bmi = (weightKg / (heightM * heightM)).toFixed(1);
        bmiInput.value = bmi;
    } else {
        bmiInput.value = '';
    }
}

// ==========================================
// HATA TEMİZLEME VE GÖSTERME YARDIMCISI FONKSİYONLAR
// ==========================================

// Eleman üzerindeki hata kırmızı çerçevesini ve uyarı mesajını kaldırır
function clearElementError(element) {
    element.classList.remove('border-rose-500', 'focus:ring-rose-500');
    const parent = element.closest('div');
    if (parent) {
        const errorMsg = parent.querySelector('.field-error');
        if (errorMsg) errorMsg.classList.add('hidden');
    }
}

// Elemana kırmızı hata çerçevesi ekler ve ilgili uyarı mesajını görünür yapar
function showElementError(element) {
    element.classList.add('border-rose-500', 'focus:ring-rose-500');
    const parent = element.closest('div');
    if (parent) {
        const errorMsg = parent.querySelector('.field-error');
        if (errorMsg) errorMsg.classList.remove('hidden');
    }
}

// ==========================================
// KOŞULLU ALAN YÖNETİMLERİ (SGLT-2 İNHİBİTÖRÜ)
// ==========================================

// "SGLT-2 Kullanımı" 'Hayır' seçildiğinde neden alanını açar/kapatır
function toggleSglt2Reason() {
    const sglt2UseElem = document.getElementById('sglt2Use');
    if (!sglt2UseElem) return;

    const container = document.getElementById('sglt2ReasonContainer');
    const reasonSelect = document.getElementById('sglt2Reason');

    if (sglt2UseElem.value === 'Hayır') {
        container.classList.remove('hidden');
    } else {
        container.classList.add('hidden');
        clearElementError(reasonSelect);
        reasonSelect.value = '';
        toggleSglt2OtherInput();
    }
}

// Neden olarak 'Diğer' seçildiğinde serbest metin giriş alanını açar/kapatır
function toggleSglt2OtherInput() {
    const reasonSelect = document.getElementById('sglt2Reason');
    const otherContainer = document.getElementById('sglt2OtherReasonContainer');
    const otherInput = document.getElementById('sglt2OtherReasonInput');

    if (!reasonSelect || !otherContainer) return;

    if (reasonSelect.value === 'Diğer') {
        otherContainer.classList.remove('hidden');
    } else {
        otherContainer.classList.add('hidden');
        if (otherInput) {
            otherInput.value = '';
            clearElementError(otherInput);
        }
    }
}

// ==========================================
// GİRİŞ (LOGIN) İŞLEM YÖNETİMİ
// ==========================================
function handleLogin(e) {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const rememberMeInput = document.getElementById('rememberMe');
    const messageBox = document.getElementById('messageBox');
    const submitBtn = document.getElementById('submitBtn');

    const enteredEmail = emailInput.value.trim();
    const enteredPassword = passwordInput.value;

    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');

    // Önceki hataları sıfırla
    emailError.classList.add('hidden');
    passwordError.classList.add('hidden');
    emailInput.classList.remove('border-rose-500', 'focus:ring-rose-500');
    passwordInput.classList.remove('border-rose-500', 'focus:ring-rose-500');
    messageBox.classList.add('hidden');

    let hasError = false;

    // E-posta boşluk kontrolü
    if (!enteredEmail) {
        document.getElementById('emailErrorText').textContent = 'E-posta alanı boş bırakılamaz!';
        emailError.classList.remove('hidden');
        emailInput.classList.add('border-rose-500', 'focus:ring-rose-500');
        hasError = true;
    }

    // Şifre boşluk kontrolü
    if (!enteredPassword) {
        document.getElementById('passwordErrorText').textContent = 'Şifre alanı boş bırakılamaz!';
        passwordError.classList.remove('hidden');
        passwordInput.classList.add('border-rose-500', 'focus:ring-rose-500');
        hasError = true;
    }

    if (hasError) return;

    // Kimlik bilgileri doğru mu kontrol et
    if (enteredEmail === VALID_EMAIL && enteredPassword === VALID_PASSWORD) {
        // Beni hatırla seçiliyse localStorage'a kaydet, değilse temizle
        if (rememberMeInput.checked) {
            localStorage.setItem('savedEmail', enteredEmail);
        } else {
            localStorage.removeItem('savedEmail');
        }

        // Oturum açıldı bayrağını sessionStorage'a yaz
        sessionStorage.setItem('isLoggedIn', 'true');
        showMessage('Giriş Başarılı! Yönlendiriliyorsunuz...', 'success');

        // Butonu kilitle
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75', 'cursor-not-allowed');

        // 2 saniye sonra ana sayfaya yönlendir
        setTimeout(() => {
            window.location.href = 'homepage.html';
        }, 2000);

    } else {
        showMessage('E-posta veya şifre hatalı. Lütfen tekrar deneyin.', 'error');
    }
}

// ==========================================
// HASTA TIBBİ VERİ FORMU GÖNDERİMİ VE DOĞRULAMA
// ==========================================
function handlePatientFormSubmit(e) {
    e.preventDefault();

    // Zorunlu alanların listesi
    const requiredFields = [
        'patientFullName', 'patientAge', 'patientGender', 'patientHeight',
        'patientWeight', 'diabetesDuration', 'trackingClinic', 'hba1c',
        'creatinine', 'egfr', 'uacr', 'ckdStage', 'heartFailure', 'ascvd',
        'antidiabetics', 'totalMeds', 'insulinUse', 'sglt2Use'
    ];

    // Eğer SGLT-2 kullanımı 'Hayır' ise neden alanını da zorunlu kıl
    if (document.getElementById('sglt2Use').value === 'Hayır') {
        requiredFields.push('sglt2Reason');
        const reasonSelect = document.getElementById('sglt2Reason');
        if (reasonSelect && reasonSelect.value === 'Diğer') {
            requiredFields.push('sglt2OtherReasonInput');
        }
    }

    let hasError = false;
    let firstErrorElement = null;

    // Tüm zorunlu alanları döngüye sokup boş mu kontrol et
    requiredFields.forEach(id => {
        const element = document.getElementById(id);
        if (!element || !element.value || element.value.trim() === '') {
            showElementError(element);
            hasError = true;
            if (!firstErrorElement) firstErrorElement = element;
        } else {
            clearElementError(element);
        }
    });

    const msgContainer = document.getElementById('patientFormMsg');

    // Hata varsa kullanıcıyı uyar ve ilk hata alanına odaklan/kaydır
    if (hasError) {
        msgContainer.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-2";
        msgContainer.innerHTML = `<i class="fa-solid fa-circle-exclamation text-rose-600 text-base"></i> <span>Lütfen kırmızı renk ile işaretlenen eksik bölümleri doldurunuz!</span>`;
        msgContainer.classList.remove('hidden');

        if (firstErrorElement) {
            firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorElement.focus();
        }
        return;
    }

    // Her şey tamamsa başarı mesajı göster
    msgContainer.className = "mb-6 p-4 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-2";
    msgContainer.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 text-base"></i> <span>Hasta tıbbi verileri başarıyla sisteme kaydedildi!</span>`;
    msgContainer.classList.remove('hidden');
    msgContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });

    setTimeout(() => {
        msgContainer.classList.add('hidden');
    }, 50000);
}

// Formu tamamen sıfırlar
function resetPatientForm() {
    const form = document.getElementById('patientDataForm');
    form.reset();
    const formInputs = form.querySelectorAll('input, select');
    formInputs.forEach(element => clearElementError(element));
    toggleSglt2Reason();
    document.getElementById('patientFormMsg').classList.add('hidden');
}

// Şifre maskesini (gizle/göster) değiştirir
function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password');
    const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordToggleIcon.classList.remove('fa-eye');
        passwordToggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        passwordToggleIcon.classList.remove('fa-eye-slash');
        passwordToggleIcon.classList.add('fa-eye');
    }
}

// Genel bildirim mesajı kutusunu günceller (başarı / hata)
function showMessage(text, type) {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = text;
    messageBox.className = 'mb-6 p-4 rounded-xl text-sm font-medium transition-all duration-300 ';
    
    if (type === 'success') {
        messageBox.classList.add('bg-emerald-50', 'text-emerald-700', 'border', 'border-emerald-200');
    } else {
        messageBox.classList.add('bg-rose-50', 'text-rose-700', 'border', 'border-rose-200');
    }
    messageBox.classList.remove('hidden');
}

// ==========================================
// ŞİFREMİ UNUTTUM ALANI YÖNETİMİ
// ==========================================

// Pencere açar ve mevcut e-postayı kutuya aktarır
function openForgotPasswordModal() {
    const resetEmailInput = document.getElementById('resetEmail');
    const emailInput = document.getElementById('email');
    
    if (resetEmailInput && emailInput) {
        resetEmailInput.value = emailInput.value || '';
    }

    const resetEmailError = document.getElementById('resetEmailError');
    if (resetEmailError) resetEmailError.classList.add('hidden');
    if (resetEmailInput) resetEmailInput.classList.remove('border-rose-500', 'focus:ring-rose-500');

    document.getElementById('resetMessage').classList.add('hidden');
    document.getElementById('forgotPasswordModal').classList.remove('hidden');
}

// Şifremi Unuttum Alanını kapatır
function closeForgotPasswordModal() {
    document.getElementById('forgotPasswordModal').classList.add('hidden');
}

// Şifre sıfırlama formunu doğrular ve simüle eder
function handleResetPassword(e) {
    e.preventDefault();
    
    const resetEmailInput = document.getElementById('resetEmail');
    const resetEmailError = document.getElementById('resetEmailError');
    const resetEmailErrorText = document.getElementById('resetEmailErrorText');
    const resetMessage = document.getElementById('resetMessage');
    const email = resetEmailInput.value.trim();

    // Önceki hata ve mesajları temizle
    resetEmailError.classList.add('hidden');
    resetEmailInput.classList.remove('border-rose-500', 'focus:ring-rose-500');
    resetMessage.classList.add('hidden');

    // 1. Kontrol: Boş bırakıldı mı?
    if (!email) {
        resetEmailErrorText.textContent = 'E-posta alanı boş bırakılamaz!';
        resetEmailError.classList.remove('hidden');
        resetEmailInput.classList.add('border-rose-500', 'focus:ring-rose-500');
        resetEmailInput.focus();
        return;
    }

    // 2. Kontrol: Geçerli bir e-posta formatında mı? (RegEx Kontrolü)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        resetEmailErrorText.textContent = 'Lütfen geçerli bir e-posta adresi giriniz!';
        resetEmailError.classList.remove('hidden');
        resetEmailInput.classList.add('border-rose-500', 'focus:ring-rose-500');
        resetEmailInput.focus();
        return;
    }

    // Her şey uygunsa başarı mesajını göster
    resetMessage.textContent = `${email} adresine sıfırlama bağlantısı gönderildi.`;
    resetMessage.className = "p-3 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200";
    resetMessage.classList.remove('hidden');

    setTimeout(() => {
        closeForgotPasswordModal();
    }, 2000);
}

// ==========================================
// ÇIKIŞ YAP (LOGOUT) İŞLEMİ
// ==========================================
function handleLogout() {
    sessionStorage.removeItem('isLoggedIn');
    window.location.href = 'loginpage.html';
}