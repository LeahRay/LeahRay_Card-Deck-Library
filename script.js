const container = document.querySelector('.card-container');
let isGalleryView = false; // 标记是否处于 Gallery 视图

// 切换页面视图的函数
function switchPage(page) {
    const cards = document.querySelectorAll('.card');

    if (page === 'gallery') {
        // 切换到 Gallery 视图
        container.classList.add('gallery-view');
        isGalleryView = true;

        // 取消卡片的随机位置和尺寸
        cards.forEach(card => {
            card.style.position = 'relative'; // 取消 absolute 定位
            card.style.left = 'auto';
            card.style.top = 'auto';
            card.style.width = 'auto';
            card.style.height = 'auto';
        });
    } else {
        // 切换回初始界面
        container.classList.remove('gallery-view');
        isGalleryView = false;

        // 重新随机化卡片的位置和大小
        randomizeCards();
    }
}

// 随机化卡片位置和大小的函数
function randomizeCards() {
    if (isGalleryView) return; // 如果处于 Gallery 视图，不应用随机布局

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // 随机尺寸和位置
        const width = Math.floor(Math.random() * 100) + 150; // 随机宽度在 150-250px 之间
        const height = Math.floor(Math.random() * 100) + 200; // 随机高度在 200-300px 之间
        const x = Math.floor(Math.random() * (containerWidth - width));
        const y = Math.floor(Math.random() * (containerHeight - height));

        // 应用尺寸和位置样式
        card.style.width = `${width}px`;
        card.style.height = `${height}px`;
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.style.position = 'absolute'; // 确保卡片为绝对定位
    });
}

// 页面加载时初始化随机布局
window.addEventListener('load', randomizeCards);

// 点击标题回到初始界面
document.querySelector('.title').addEventListener('click', () => {
    switchPage('index'); // 切换回初始界面
});
