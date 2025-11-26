// ==UserScript==
// @name         YouTube 网速换算为 MB/s
// @namespace    http://tampermonkey.net/
// @version      2025-11-26
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 目标元素的选择器 (元素 1)
    const targetSelector = "#movie_player > div.html5-video-info-panel.ytp-sfn > div > div:nth-child(9) > span > span:nth-child(2)";
    let element2 = null; // 用于存储我们创建的元素 2，以便后续更新

    // 核心功能：获取值、换算、更新 DOM
    function updateRate() {
        const element1 = document.querySelector(targetSelector);

        // 1. 检查元素 1 是否存在 (在关闭面板时可能不存在)
        if (!element1) {
            // 如果元素 1 消失了，且元素 2 存在，则移除元素 2 并停止定时器。
            if (element2 && element2.parentNode) {
                element2.parentNode.removeChild(element2);
                element2 = null;
            }
            // 保持定时器运行，因为它可能再次出现 (例如，重新打开统计面板)。
            return;
        }

        const originalText = element1.textContent.trim();
        const match = originalText.match(/^(\d+)/);

        if (match && match[1]) {
            const kbpsValue = parseInt(match[1], 10);

            // 换算公式: Kbps / 8000 = MB/s
            const mbpsValue = kbpsValue / 8000;
            const formattedMbps = mbpsValue.toFixed(2); // 保留两位小数

            const newContent = ` (${formattedMbps} MB/s)`;

            // 2. 检查元素 2 是否已存在
            if (!element2) {
                // 如果是第一次运行，创建元素 2
                element2 = document.createElement('span');
                element2.style.color = '#fff'; // 可以添加一些样式来区分
                element2.style.marginLeft = '5px';

                // 插入到元素 1 后面
                element1.insertAdjacentElement('afterend', element2);
            }

            // 3. 更新元素 2 的内容
            element2.textContent = newContent;

        } else {
            // 如果未能提取数字，则清除 Element 2 的内容或移除它
            if (element2) {
                element2.textContent = ' (N/A)';
            }
        }
    }

    // 设置定时器
    // 将 timer 存储在变量中，如果你想在某个条件下停止它，可以使用 clearInterval(timer)
    const timer = setInterval(updateRate, 10000);
})();
