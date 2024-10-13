document.getElementById('cardForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // 获取用户输入的文本
    const cardText = document.getElementById('cardText').value;

    // 创建卡片元素
    const cardElement = document.createElement('div');
    cardElement.className = 'card';
    cardElement.textContent = cardText;

    // 添加卡片到页面
    document.getElementById('cardContainer').appendChild(cardElement);

    // 随机位置放置卡片
    placeCardRandomly(cardElement);

    // 清空输入框
    document.getElementById('cardText').value = '';
});

function placeCardRandomly(cardElement) {
    const containerWidth = document.getElementById('cardContainer').offsetWidth;
    const containerHeight = document.getElementById('cardContainer').offsetHeight;

    const randomX = Math.random() * (containerWidth - cardElement.offsetWidth);
    const randomY = Math.random() * (containerHeight - cardElement.offsetHeight);

    cardElement.style.left = `${randomX}px`;
    cardElement.style.top = `${randomY}px`;
    cardElement.style.position = 'absolute';
}