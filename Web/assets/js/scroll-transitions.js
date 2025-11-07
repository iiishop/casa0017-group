/**
 * Scroll-driven Section Transitions - True Full-screen Breakout
 * 真正突破section限制的全屏滚动效果
 * 使用position:fixed完全脱离原始布局
 */

(function () {
    'use strict';

    // 配置
    const CONFIG = {
        sections: ['compare', 'find'],
        debug: true,
        scrollHeightMultiplier: 2.5,
        // 多阶段过渡阈值
        stages: {
            start: 0.1,      // 开始显示全屏容器
            middle: 0.4,     // 中间状态
            full: 0.7        // 完全显示
        }
    };

    //状态
    const state = {
        sections: [],
        breakoutContainers: new Map()
    };

    /**
     * 初始化
     */
    function init() {
        console.log('Initializing true fullscreen breakout...');

        CONFIG.sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (!section) {
                console.warn(`Section #${sectionId} not found`);
                return;
            }

            setupSection(section, sectionId);
        });

        setupScrollListener();

        if (CONFIG.debug) {
            createDebugPanel();
        }

        console.log('Fullscreen breakout initialized');
    }

    /**
     * 设置section
     */
    function setupSection(section, sectionId) {
        // 设置section高度
        section.classList.add('transition-section');
        section.style.minHeight = `${CONFIG.scrollHeightMultiplier * 100}vh`;

        // 创建sticky wrapper
        const stickyWrapper = document.createElement('div');
        stickyWrapper.className = 'section-sticky-wrapper';

        // 创建content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'section-content';

        // 移动所有子元素到content wrapper
        while (section.firstChild) {
            contentWrapper.appendChild(section.firstChild);
        }

        // 组装
        stickyWrapper.appendChild(contentWrapper);
        section.appendChild(stickyWrapper);

        // 创建全屏突破容器(空的,稍后移动内容进去)
        const breakoutContainer = createBreakoutContainer(sectionId);
        document.body.appendChild(breakoutContainer);

        // 记录
        state.sections.push({
            id: sectionId,
            element: section,
            stickyWrapper,
            contentWrapper,
            breakoutContainer,
            scrollProgress: 0,
            currentStage: 0,
            contentMoved: false // 标记内容是否已移动到全屏容器
        });

        state.breakoutContainers.set(sectionId, breakoutContainer);
    }

    /**
     * 创建全屏突破容器(空的)
     */
    function createBreakoutContainer(sectionId) {
        const container = document.createElement('div');
        container.className = 'fullscreen-breakout stage-0';
        container.id = `${sectionId}-fullscreen`;
        container.style.display = 'none';

        // 创建布局容器
        const layoutContainer = document.createElement('div');
        if (sectionId === 'compare') {
            layoutContainer.className = 'compare-fullscreen-layout';
            layoutContainer.innerHTML = `
                <div class="controls-area"></div>
                <div class="map-area"></div>
                <div class="chart-top"></div>
                <div class="chart-bottom"></div>
            `;
        } else if (sectionId === 'find') {
            layoutContainer.className = 'find-fullscreen-layout';
            layoutContainer.innerHTML = `
                <div class="map-area"></div>
                <div class="metrics-area"></div>
            `;
        }

        container.appendChild(layoutContainer);
        return container;
    }

    /**
     * 将内容移动到全屏布局
     */
    function moveContentToBreakout(sectionId, contentWrapper, breakoutContainer) {
        const layoutContainer = breakoutContainer.firstChild;

        if (sectionId === 'compare') {
            const topControls = contentWrapper.querySelector('#topControls');
            const mapWrapper = contentWrapper.querySelector('#mapWrapper');
            const chartsWrapper = contentWrapper.querySelector('#chartsWrapper');
            const lineChart = chartsWrapper?.querySelector('.chart-container:nth-child(1)');
            const rankChart = chartsWrapper?.querySelector('.chart-container:nth-child(2)');

            const controlsArea = layoutContainer.querySelector('.controls-area');
            const mapArea = layoutContainer.querySelector('.map-area');
            const chartTop = layoutContainer.querySelector('.chart-top');
            const chartBottom = layoutContainer.querySelector('.chart-bottom');

            if (topControls && controlsArea) controlsArea.appendChild(topControls);
            if (mapWrapper && mapArea) mapArea.appendChild(mapWrapper);
            if (lineChart && chartTop) chartTop.appendChild(lineChart);
            if (rankChart && chartBottom) chartBottom.appendChild(rankChart);
        } else if (sectionId === 'find') {
            const suitabilityMap = contentWrapper.querySelector('.suitability-map');
            const suitabilityMetrics = contentWrapper.querySelector('.suitability-metrics');

            const mapArea = layoutContainer.querySelector('.map-area');
            const metricsArea = layoutContainer.querySelector('.metrics-area');

            if (suitabilityMap && mapArea) mapArea.appendChild(suitabilityMap);
            if (suitabilityMetrics && metricsArea) metricsArea.appendChild(suitabilityMetrics);
        }
    }

    /**
     * 将内容移回原位置
     */
    function moveContentBack(sectionId, contentWrapper, breakoutContainer) {
        const layoutContainer = breakoutContainer.firstChild;

        if (sectionId === 'compare') {
            const topControls = layoutContainer.querySelector('#topControls');
            const mapWrapper = layoutContainer.querySelector('#mapWrapper');
            const lineChart = layoutContainer.querySelector('.chart-container:nth-child(1)');
            const rankChart = layoutContainer.querySelector('.chart-container:nth-child(2)');

            // 找到原始位置
            const visualSection = contentWrapper.querySelector('.visual-section');
            const chartsWrapper = contentWrapper.querySelector('#chartsWrapper') || document.createElement('div');
            if (!contentWrapper.querySelector('#chartsWrapper')) {
                chartsWrapper.id = 'chartsWrapper';
                chartsWrapper.className = 'charts-wrapper';
                visualSection?.appendChild(chartsWrapper);
            }

            // 移回控制栏到visualSection最前面
            if (topControls && visualSection) visualSection.insertBefore(topControls, visualSection.firstChild);
            if (mapWrapper && visualSection) visualSection.insertBefore(mapWrapper, chartsWrapper);
            if (lineChart && chartsWrapper) chartsWrapper.appendChild(lineChart);
            if (rankChart && chartsWrapper) chartsWrapper.appendChild(rankChart);
        } else if (sectionId === 'find') {
            const suitabilityMap = layoutContainer.querySelector('.suitability-map');
            const suitabilityMetrics = layoutContainer.querySelector('.suitability-metrics');

            const suitabilityContent = contentWrapper.querySelector('.suitability-content');

            if (suitabilityMap && suitabilityContent) suitabilityContent.appendChild(suitabilityMap);
            if (suitabilityMetrics && suitabilityContent) suitabilityContent.appendChild(suitabilityMetrics);
        }
    }

    /**
     * 设置滚动监听
     */
    function setupScrollListener() {
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    updateSections();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        updateSections();
    }

    /**
     * 更新sections
     */
    function updateSections() {
        const windowHeight = window.innerHeight;
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;

        state.sections.forEach(sectionData => {
            const { element, breakoutContainer } = sectionData;
            const rect = element.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = element.offsetHeight;

            let progress = 0;

            if (rect.top <= 0) {
                const scrolledDistance = scrollY - sectionTop;
                const totalScrollDistance = sectionHeight - windowHeight;
                progress = Math.min(1, Math.max(0, scrolledDistance / totalScrollDistance));
            }

            sectionData.scrollProgress = progress;

            // 应用突破效果
            applyBreakout(sectionData, progress);
        });

        updateDebug();
    }

    /**
     * 应用突破效果
     */
    function applyBreakout(sectionData, progress) {
        const { id, contentWrapper, breakoutContainer, currentStage, contentMoved } = sectionData;
        const { start, middle, full } = CONFIG.stages;

        let newStage = 0;

        // 修改逻辑: 在0.1-0.9之间显示全屏,0.9之后退出
        if (progress >= 0.9) {
            // 接近100%时退出全屏
            newStage = 0;
        } else if (progress >= full) {
            newStage = 2;
        } else if (progress >= middle) {
            newStage = 2; // 也进入完全显示
        } else if (progress >= start) {
            newStage = 1;
        } else {
            newStage = 0;
        }

        // 状态变化时才更新
        if (newStage !== currentStage) {
            sectionData.currentStage = newStage;

            // 移除所有stage类
            breakoutContainer.classList.remove('stage-0', 'stage-1', 'stage-2');
            breakoutContainer.classList.add(`stage-${newStage}`);

            if (newStage > 0) {
                // 第一次进入全屏时,移动内容
                if (!sectionData.contentMoved) {
                    moveContentToBreakout(id, contentWrapper, breakoutContainer);
                    sectionData.contentMoved = true;
                    console.log(`${id} content moved to breakout`);
                }

                // 移除退出动画类
                breakoutContainer.classList.remove('exiting');
                // 显示全屏容器
                breakoutContainer.style.display = 'block';
                // 隐藏原内容
                contentWrapper.classList.add('has-breakout');
                console.log(`${id} entered stage ${newStage}`);
            } else {
                // 添加退出动画
                breakoutContainer.classList.add('exiting');

                // 退出全屏时,移回内容
                if (sectionData.contentMoved) {
                    moveContentBack(id, contentWrapper, breakoutContainer);
                    sectionData.contentMoved = false;
                    console.log(`${id} content moved back`);
                }

                // 隐藏全屏容器
                setTimeout(() => {
                    breakoutContainer.style.display = 'none';
                    breakoutContainer.classList.remove('exiting');
                }, 400); // 等待退出动画完成
                // 显示原内容
                contentWrapper.classList.remove('has-breakout');
                console.log(`${id} exited breakout`);
            }
        }
    }    /**
     * 创建调试面板
     */
    function createDebugPanel() {
        const panel = document.createElement('div');
        panel.className = 'scroll-debug active';

        let html = '<div class="debug-item" style="border-bottom: 2px solid #fff; padding-bottom: 8px; margin-bottom: 8px;"><strong>Breakout Debug</strong></div>';

        CONFIG.sections.forEach(sectionId => {
            html += `
                <div class="debug-item">
                    <span class="debug-label">${sectionId}:</span>
                    <span class="debug-value" id="debug-${sectionId}-progress">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="debug-${sectionId}-bar" style="width: 0%"></div>
                </div>
                <div class="debug-item">
                    <span class="debug-label">Stage:</span>
                    <span class="debug-value" id="debug-${sectionId}-stage">0</span>
                </div>
            `;
        });

        html += `
            <div class="debug-item" style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                <span class="debug-label">Scroll:</span>
                <span class="debug-value" id="debug-scrolly">0</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Enter:</span>
                <span class="debug-value">${(CONFIG.stages.start * 100).toFixed(0)}% → ${(CONFIG.stages.full * 100).toFixed(0)}%</span>
            </div>
            <div class="debug-item">
                <span class="debug-label">Exit:</span>
                <span class="debug-value" style="color: #f90;">90%</span>
            </div>
        `;

        panel.innerHTML = html;
        document.body.appendChild(panel);
    }

    /**
     * 更新调试信息
     */
    function updateDebug() {
        if (!CONFIG.debug) return;

        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        const scrollYSpan = document.getElementById('debug-scrolly');
        if (scrollYSpan) {
            scrollYSpan.textContent = Math.round(scrollY) + 'px';
        }

        state.sections.forEach(sectionData => {
            const { id, scrollProgress, currentStage } = sectionData;
            const progressSpan = document.getElementById(`debug-${id}-progress`);
            const progressBar = document.getElementById(`debug-${id}-bar`);
            const stageSpan = document.getElementById(`debug-${id}-stage`);

            if (progressSpan) {
                progressSpan.textContent = (scrollProgress * 100).toFixed(1) + '%';
            }
            if (progressBar) {
                progressBar.style.width = (scrollProgress * 100) + '%';
            }
            if (stageSpan) {
                stageSpan.textContent = currentStage;
                stageSpan.style.color = currentStage > 0 ? '#0ff' : '#0f0';
            }
        });
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
