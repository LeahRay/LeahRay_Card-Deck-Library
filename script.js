const container = document.querySelector('.card-container');
let isGalleryView = false; // 标记是否处于 Gallery 视图
let highestZIndex = 1; // 用于 bringToFront 功能的 z-index

function switchPage(page) {
    const cards = Array.from(document.querySelectorAll('.card'));
    const container = document.querySelector('.card-container');
    const controls = document.querySelector('.gallery-controls');

    if (page === 'gallery') {
        container.classList.add('gallery-view');
        isGalleryView = true;
        controls.style.display = 'flex'; // 显示按钮控件

        // 随机排列卡片
        const shuffledCards = cards.sort(() => Math.random() - 0.5);
        container.innerHTML = '';
        shuffledCards.forEach(card => container.appendChild(card));

        // 禁用拖拽并移除缩放手柄
        shuffledCards.forEach(card => {
            card.style.position = 'relative';
            card.style.left = 'auto';
            card.style.top = 'auto';
            card.style.width = 'auto';
            card.style.height = 'auto';

            removeDraggable(card);

            const resizeHandle = card.querySelector('.resize-handle');
            if (resizeHandle) {
                resizeHandle.style.display = 'none';
            }

            card.addEventListener('dblclick', enlargeCard);
        });
    } else {
        container.classList.remove('gallery-view');
        isGalleryView = false;
        controls.style.display = 'none'; // 隐藏按钮控件

        randomizeCards();

        cards.forEach(card => {
            const resizeHandle = card.querySelector('.resize-handle');
            if (resizeHandle) {
                resizeHandle.style.display = 'block';
            }

            card.removeEventListener('dblclick', enlargeCard);

            makeDraggable(card);
            card.style.display = 'block'; // 确保在非 Gallery View 显示所有卡片
        });
    }
}
function filterCards(zone) {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        if (zone === 'all') {
            card.style.display = 'block'; // 显示所有卡片
        } else if (card.classList.contains(zone)) {
            card.style.display = 'block'; // 显示指定 zone 的卡片
        } else {
            card.style.display = 'none'; // 隐藏其他卡片
        }
    });
}

// 随机化卡片位置和大小的函数
function randomizeCards() {
    if (isGalleryView) return; // 如果处于 Gallery 视图，不应用随机布局

    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        // 随机尺寸和位置
        const width = Math.floor(Math.random() * 100) + 60;
        const height = Math.floor(Math.random() * 100) +60;
        const x = Math.floor(Math.random() * (containerWidth - width));
        const y = Math.floor(Math.random() * (containerHeight - height));

        // 应用尺寸和位置样式
        card.style.width = `${width}px`;
        card.style.height = `${height}px`;
        card.style.left = `${x}px`;
        card.style.top = `${y}px`;
        card.style.position = 'absolute';
        card.style.zIndex = 1; // 初始 z-index

        // 使卡片可拖拽
        makeDraggable(card);
    });
}

function makeDraggable(card) {
    let isDragging = false;
    let offsetX, offsetY;

    function handleMouseDown(e) {
        if (e.target.classList.contains('resize-handle')) return;

        isDragging = true;
        highestZIndex++;
        card.style.zIndex = highestZIndex;

        offsetX = e.clientX - card.getBoundingClientRect().left;
        offsetY = e.clientY - card.getBoundingClientRect().top;

        card.style.cursor = 'grabbing';
    }

    function handleMouseMove(e) {
        if (isDragging) {
            card.style.left = `${e.clientX - offsetX}px`;
            card.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function handleMouseUp() {
        if (isDragging) {
            isDragging = false;
            card.style.cursor = 'grab';
        }
    }

    // 添加拖拽事件监听器
    card.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 存储移除拖拽事件的函数
    card.removeDragEvents = function () {
        card.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };
}
function removeDraggable(card) {
    if (card.removeDragEvents) {
        card.removeDragEvents();
    }
}

// 页面加载时初始化随机布局
window.addEventListener('load', randomizeCards);

// 点击标题回到初始界面
document.querySelector('.title').addEventListener('click', () => {
    switchPage('index'); // 切换回初始界面
});

function enlargeCard(event) {
    const card = event.currentTarget;

    // 创建一个全屏遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = 9999;

    // 克隆当前卡片并放大
    const enlargedCard = card.cloneNode(true);
    enlargedCard.style.maxWidth = '90vw'; // 设置最大宽度
    enlargedCard.style.maxHeight = '90vh'; // 设置最大高度
    enlargedCard.style.width = 'auto'; // 自动宽度，根据内容调整
    enlargedCard.style.height = 'auto'; // 自动高度，根据内容调整
    enlargedCard.style.position = 'relative';
    enlargedCard.style.zIndex = 10000;
    enlargedCard.style.cursor = 'auto';
    enlargedCard.style.overflow = 'auto'; // 添加滚动条，防止内容溢出

    // 关闭按钮
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.padding = '5px 10px';
    closeButton.style.backgroundColor = '#fff';
    closeButton.style.border = 'none';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // 将放大卡片和关闭按钮添加到遮罩层
    overlay.appendChild(enlargedCard);
    overlay.appendChild(closeButton);

    // 将遮罩层添加到页面
    document.body.appendChild(overlay);
}

function makeResizable(card) {
    const resizeHandle = card.querySelector('.resize-handle');
    let isResizing = false;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        document.body.style.cursor = 'se-resize'; // 修改光标

        // 记录初始位置和卡片大小
        const initialWidth = card.offsetWidth;
        const initialHeight = card.offsetHeight;
        const initialX = e.clientX;
        const initialY = e.clientY;

        function resize(e) {
            if (isResizing) {
                // 计算新的宽度和高度
                const newWidth = initialWidth + (e.clientX - initialX);
                const newHeight = initialHeight + (e.clientY - initialY);

                // 更新卡片大小
                card.style.width = `${newWidth}px`;
                card.style.height = `${newHeight}px`;
            }
        }

        function stopResize() {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = 'default'; // 恢复光标
                document.removeEventListener('mousemove', resize);
                document.removeEventListener('mouseup', stopResize);
            }
        }

        // 监听鼠标移动和松开事件
        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResize);
    });
}

// 应用到每张卡片
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    makeDraggable(card);
    makeResizable(card);
});