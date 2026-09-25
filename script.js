const photoInput = document.querySelector('#photo-upload');
const photo = document.querySelector('#profile-photo');
const status = document.querySelector('#photo-status');
const storageKey = 'glaisa-cv-profile-photo';
try {
  const savedPhoto = localStorage.getItem(storageKey);
  if (savedPhoto && /^data:image\/(jpeg|png|webp);base64,/.test(savedPhoto)) {
    photo.src = savedPhoto;
    photo.alt = 'Profile photo of Glaisa Mae Curato';
  }
} catch { /* Photo selection still works when browser storage is unavailable. */ }
photoInput.addEventListener('change', () => {
  const file = photoInput.files[0];
  if (!file) return;
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    status.textContent = 'Please choose a JPG, PNG, or WebP photo.';
    photoInput.value = '';
    return;
  }
  if (file.size > 10 * 1024 * 1024) {
    status.textContent = 'Please choose a photo smaller than 10 MB.';
    photoInput.value = '';
    return;
  }
  const reader = new FileReader();
  reader.onerror = () => { status.textContent = 'This photo could not be read. Please try another image.'; };
  reader.onload = () => {
    const candidate = new Image();
    candidate.onerror = () => { status.textContent = 'This photo could not be opened. Please try another image.'; };
    candidate.onload = () => {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 1000 / Math.max(candidate.width, candidate.height));
      canvas.width = Math.max(1, Math.round(candidate.width * scale));
      canvas.height = Math.max(1, Math.round(candidate.height * scale));
      canvas.getContext('2d').drawImage(candidate, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/webp', 0.88);
      photo.src = imageData;
      photo.alt = 'Profile photo of Glaisa Mae Curato';
      try {
        localStorage.setItem(storageKey, imageData);
        status.textContent = 'Photo saved in this browser.';
      } catch {
        status.textContent = 'Photo updated for this visit. Browser storage is unavailable.';
      }
    };
    candidate.src = reader.result;
  };
  reader.readAsDataURL(file);
  photoInput.value = '';
});
