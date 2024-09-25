// management.js

// 處理連結的新增
document.getElementById('linkForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const linkText = document.getElementById('linkText').value;
    const linkURL = document.getElementById('linkURL').value;

    addLinkItem(linkText, linkURL);
    
    // 清空輸入框
    document.getElementById('linkText').value = '';
    document.getElementById('linkURL').value = '';
});

function addLinkItem(text, url) {
    const linkList = document.getElementById('linkList');
    const div = document.createElement('div');
    div.className = 'link-item';
    div.innerHTML = `<a href="${url}" target="_blank">${text}</a>`;
    linkList.appendChild(div);
}

// 處理圖片的上傳
document.getElementById('imageForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData();
    const imageFile = document.getElementById('image').files[0];
    const imageTitle = document.getElementById('imageTitle').value;
    formData.append('image', imageFile);
    formData.append('title', imageTitle);

    fetch('/uploadImage', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        addImageItem(data.imagePath, imageTitle);
        
        // 清空輸入框
        document.getElementById('image').value = '';
        document.getElementById('imageTitle').value = '';
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function addImageItem(imagePath, title) {
    const imageList = document.getElementById('imageList');
    const div = document.createElement('div');
    div.className = 'image-item';
    div.innerHTML = `<img src="${imagePath}" alt="${title}"><span>${title}</span>`;
    imageList.appendChild(div);
}
