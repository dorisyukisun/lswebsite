// upload.js

document.getElementById('imageInput').addEventListener('change', function(event) {
    const preview = document.getElementById('preview');
    preview.innerHTML = ''; // 清空之前的預覽
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.maxWidth = '300px';
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault(); // 阻止默認的表單提交行為

    const formData = new FormData();
    const imageFile = document.getElementById('imageInput').files[0];
    formData.append('image', imageFile);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Image uploaded successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
    });
});