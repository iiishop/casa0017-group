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
            start: 0.05,     // 更早开始显示,避免白屏
            middle: 0.35,    // 中间状态
            full: 0.65       // 完全显示
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
                <div class="insight-area"></div>
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
            const insightContainer = contentWrapper.querySelector('#insightContainer');
            const mapWrapper = contentWrapper.querySelector('#mapWrapper');
            const chartsWrapper = contentWrapper.querySelector('#chartsWrapper');
            const lineChart = chartsWrapper?.querySelector('.chart-container:nth-child(1)');
            const rankChart = chartsWrapper?.querySelector('.chart-container:nth-child(2)');

            const controlsArea = layoutContainer.querySelector('.controls-area');
            const insightArea = layoutContainer.querySelector('.insight-area');
            const mapArea = layoutContainer.querySelector('.map-area');
            const chartTop = layoutContainer.querySelector('.chart-top');
            const chartBottom = layoutContainer.querySelector('.chart-bottom');

            if (topControls && controlsArea) controlsArea.appendChild(topControls);
            if (insightContainer && insightArea) insightArea.appendChild(insightContainer);
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
            const insightContainer = layoutContainer.querySelector('#insightContainer');
            const mapWrapper = layoutContainer.querySelector('#mapWrapper');
            const lineChart = layoutContainer.querySelector('.chart-container:nth-child(1)');
            const rankChart = layoutContainer.querySelector('.chart-container:nth-child(2)');

            // 找到或创建原始容器
            let visualSection = contentWrapper.querySelector('#visualSection');
            if (!visualSection) {
                visualSection = document.createElement('div');
                visualSection.id = 'visualSection';
            }

            let chartsWrapper = visualSection.querySelector('#chartsWrapper');
            if (!chartsWrapper) {
                chartsWrapper = document.createElement('div');
                chartsWrapper.id = 'chartsWrapper';
            }

            // 重建 visualSection 内部结构
            // 清空 visualSection
            visualSection.innerHTML = '';

            // 按顺序添加: mapWrapper -> chartsWrapper
            if (mapWrapper) visualSection.appendChild(mapWrapper);
            if (chartsWrapper) visualSection.appendChild(chartsWrapper);

            // 将图表放回 chartsWrapper
            if (lineChart) chartsWrapper.appendChild(lineChart);
            if (rankChart) chartsWrapper.appendChild(rankChart);

            // 将内容按原始顺序放回 contentWrapper
            // 找到参考节点（fullscreen button后面，tooltip前面）
            const tooltip = contentWrapper.querySelector('.tooltip');

            // 插入 topControls
            if (topControls && tooltip) {
                contentWrapper.insertBefore(topControls, tooltip);
            }

            // 插入 visualSection (在 topControls 后面)
            if (visualSection && tooltip) {
                contentWrapper.insertBefore(visualSection, tooltip);
            }

            // 插入 insightContainer (在 visualSection 后面)
            if (insightContainer && tooltip) {
                contentWrapper.insertBefore(insightContainer, tooltip);
            }
        } else if (sectionId === 'find') {
            const suitabilityMap = layoutContainer.querySelector('.suitability-map');
            const suitabilityMetrics = layoutContainer.querySelector('.suitability-metrics');

            // 找到或创建原始容器
            let suitabilityContainer = contentWrapper.querySelector('.suitability-container');
            if (!suitabilityContainer) {
                suitabilityContainer = document.createElement('div');
                suitabilityContainer.className = 'suitability-container';
                // 插入到 fullscreen button 后面
                const fullscreenBtn = contentWrapper.querySelector('#findFullscreenBtn');
                if (fullscreenBtn && fullscreenBtn.nextSibling) {
                    contentWrapper.insertBefore(suitabilityContainer, fullscreenBtn.nextSibling);
                } else {
                    contentWrapper.appendChild(suitabilityContainer);
                }
            }

            // 清空并重建 suitability-container
            suitabilityContainer.innerHTML = '';
            if (suitabilityMap) suitabilityContainer.appendChild(suitabilityMap);
            if (suitabilityMetrics) suitabilityContainer.appendChild(suitabilityMetrics);
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
                // 先显示全屏容器
                breakoutContainer.style.display = 'block';

                // 延迟隐藏原内容,确保全屏容器先渲染
                setTimeout(() => {
                    contentWrapper.classList.add('has-breakout');
                }, 50); // 短暂延迟确保平滑过渡

                console.log(`${id} entered stage ${newStage}`);
            } else {
                // 先显示原内容
                contentWrapper.classList.remove('has-breakout');

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

                console.log(`${id} exited breakout`);
            }
        }
    }

    // 页面加载后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
