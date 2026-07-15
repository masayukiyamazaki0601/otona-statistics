document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // ハンバーガーメニュー
    // ========================================
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobile-nav');
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('open');
        });
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('open');
            });
        });
    }

    // ========================================
    // リッチクイズ (紙吹雪＋スコア)
    // ========================================
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.addEventListener('click', function() {
            const parent = this.closest('.quiz-box');
            const feedback = parent.querySelector('.quiz-feedback');
            const isCorrect = this.dataset.correct === 'true';
            const options = parent.querySelectorAll('.quiz-option');
            const scoreBadge = parent.querySelector('.quiz-score');

            // 選択肢ロック＋正解表示
            options.forEach(o => {
                o.style.pointerEvents = 'none';
                if (o.dataset.correct === 'true') o.classList.add('correct');
            });

            // 正解/不正解エフェクト
            if (isCorrect) {
                this.classList.add('correct');
                parent.classList.remove('answered-wrong');
                parent.classList.add('answered');
                // 紙吹雪
                launchConfetti(parent);
                // スコア更新
                if (scoreBadge) {
                    let count = parseInt(scoreBadge.dataset.score || '0');
                    count++;
                    scoreBadge.dataset.score = count;
                    scoreBadge.textContent = '🏆 ' + count + '/' + document.querySelectorAll('.quiz-box').length;
                }
                // 絵文字を動的に変更
                feedback.querySelector('.feedback-emoji').textContent = '🎉';
            } else {
                this.classList.add('wrong');
                parent.classList.remove('answered');
                parent.classList.add('answered-wrong');
                feedback.querySelector('.feedback-emoji').textContent = '💡';
            }

            feedback.classList.add('show');
        });
    });

    // ========================================
    // 紙吹雪エフェクト
    // ========================================
    function launchConfetti(container) {
        const rect = container.getBoundingClientRect();
        const canvas = document.createElement('canvas');
        canvas.className = 'confetti-canvas';
        canvas.width = rect.width;
        canvas.height = rect.height;
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '0';
        canvas.style.borderRadius = '12px';
        container.style.position = 'relative';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const colors = ['#1A5F7A', '#4A8BA8', '#E05D5D', '#F5A623', '#2D8F5C', '#7AB5CC'];
        const particles = [];
        const count = 80;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: -20 - Math.random() * 60,
                w: Math.random() * 8 + 4,
                h: Math.random() * 6 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 1,
                rot: Math.random() * 360,
                rotSpeed: (Math.random() - 0.5) * 8,
                opacity: 1
            });
        }

        let frame = 0;
        function drawConfetti() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            frame++;
            let alive = false;
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.04;
                p.rot += p.rotSpeed;
                if (frame > 60) p.opacity -= 0.015;
                if (p.opacity <= 0) return;
                alive = true;
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot * Math.PI / 180);
                ctx.globalAlpha = Math.max(0, p.opacity);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();
            });
            if (alive && frame < 180) {
                requestAnimationFrame(drawConfetti);
            } else {
                canvas.remove();
            }
        }
        drawConfetti();
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ========================================
    // ヒーロー背景パーティクル (index.html)
    // ========================================
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        const ctx = heroCanvas.getContext('2d');
        let w, h;
        function resize() {
            const rect = heroCanvas.parentElement.getBoundingClientRect();
            w = heroCanvas.width = rect.width;
            h = heroCanvas.height = rect.height;
        }
        resize();
        window.addEventListener('resize', resize);

        const particles = [];
        const count = 80;
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w, y: Math.random() * h,
                r: Math.random() * 4 + 1,
                dx: (Math.random() - 0.5) * 0.3,
                dy: (Math.random() - 0.5) * 0.3,
                alpha: Math.random() * 0.3 + 0.05,
                color: ['#1A5F7A', '#4A8BA8', '#7AB5CC', '#E05D5D'][Math.floor(Math.random() * 4)]
            });
        }
        function drawHeroParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.dx; p.y += p.dy;
                if (p.x < 0 || p.x > w) p.dx *= -1;
                if (p.y < 0 || p.y > h) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
            });
            ctx.globalAlpha = 1;
            requestAnimationFrame(drawHeroParticles);
        }
        drawHeroParticles();
    }

    // ========================================
    // バックグラウンド パーティクル (Step 03背面)
    // ========================================
    const particleCanvas = document.getElementById('particle-bg');
    if (particleCanvas) {
        const ctx = particleCanvas.getContext('2d');
        const w = particleCanvas.width;
        const h = particleCanvas.height;
        const particles = [];
        const count = 60;

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * w,
                y: Math.random() * h,
                r: Math.random() * 3 + 1,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.4 + 0.1,
                color: ['#1A5F7A', '#4A8BA8', '#E05D5D', '#7AB5CC'][Math.floor(Math.random() * 4)]
            });
        }

        function drawParticles() {
            ctx.clearRect(0, 0, w, h);
            particles.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > w) p.dx *= -1;
                if (p.y < 0 || p.y > h) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.alpha;
                ctx.fill();
                ctx.globalAlpha = 1;
            });
            // 線でつなぐ
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 80) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = '#1A5F7A';
                        ctx.globalAlpha = 0.08 * (1 - dist / 80);
                        ctx.lineWidth = 1;
                        ctx.stroke();
                        ctx.globalAlpha = 1;
                    }
                }
            }
            requestAnimationFrame(drawParticles);
        }
        drawParticles();
    }

    // ========================================
    // インタラクティブ データ種別スライダー (3D版)
    // ========================================
    const dataTypeSlider = document.getElementById('data-type-slider');
    const dataTypeValue = document.getElementById('data-type-value');
    const dataTypeCanvas = document.getElementById('data-type-canvas');

    if (dataTypeSlider && dataTypeCanvas) {
        const ctx = dataTypeCanvas.getContext('2d');
        const w = dataTypeCanvas.width;
        const h = dataTypeCanvas.height;
        let animFrame = 0;
        let particles2 = [];

        const dataExamples = [
            { label: '質的データ（名義尺度）', items: ['男性/女性', '血液型', '都道府県', '職業'], color: '#1A5F7A', color2: '#4A8BA8' },
            { label: '質的データ（順序尺度）', items: ['満足度（1〜5）', '学歴', 'ランキング', '段階評価'], color: '#4A8BA8', color2: '#7AB5CC' },
            { label: '量的データ（間隔尺度）', items: ['気温（℃）', 'IQスコア', '西暦年', '偏差値'], color: '#E05D5D', color2: '#F08A8A' },
            { label: '量的データ（比例尺度）', items: ['身長（cm）', '収入（円）', '時間（秒）', '距離（km）'], color: '#134A60', color2: '#1A5F7A' }
        ];

        // パーティクル生成
        function initParticles(count) {
            particles2 = [];
            for (let i = 0; i < count; i++) {
                particles2.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: Math.random() * 4 + 2,
                    dx: (Math.random() - 0.5) * 1.2,
                    dy: (Math.random() - 0.5) * 1.2,
                    alpha: Math.random() * 0.5 + 0.2
                });
            }
        }
        initParticles(30);

        function drawDataType(index) {
            animFrame++;
            const data = dataExamples[index];
            
            // 背景グラデーション
            const grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/1.5);
            grad.addColorStop(0, '#FFFFFF');
            grad.addColorStop(0.7, '#F8F9FA');
            grad.addColorStop(1, '#E9ECEF');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // 左上の光る飾り
            const glowGrad = ctx.createRadialGradient(40, 30, 5, 40, 30, 80);
            glowGrad.addColorStop(0, data.color);
            glowGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = glowGrad;
            ctx.fillRect(0, 0, 120, 100);

            // パーティクル更新
            particles2.forEach(p => {
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > w) p.dx *= -1;
                if (p.y < 0 || p.y > h) p.dy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = data.color;
                ctx.globalAlpha = p.alpha * 0.3;
                ctx.fill();
                ctx.globalAlpha = 1;
            });

            // タイトル（光るテキスト効果）
            ctx.shadowColor = data.color;
            ctx.shadowBlur = 8;
            ctx.fillStyle = data.color;
            ctx.font = 'bold 20px "Shippori Mincho", serif';
            ctx.textAlign = 'center';
            ctx.fillText(data.label, w / 2, 38);
            ctx.shadowBlur = 0;

            // 下線（光る線）
            ctx.shadowColor = data.color;
            ctx.shadowBlur = 4;
            ctx.strokeStyle = data.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(60, 50);
            ctx.lineTo(w - 60, 50);
            ctx.stroke();
            ctx.shadowBlur = 0;

            // アイテム（3Dカード風）
            const startY = 72;
            const itemH = 48;
            data.items.forEach((item, i) => {
                const y = startY + i * itemH;
                const pulse = Math.sin(animFrame * 0.03 + i) * 2;

                // カード背景
                const cardGrad = ctx.createLinearGradient(40, y + pulse, w - 40, y + 36 + pulse);
                cardGrad.addColorStop(0, '#FFFFFF');
                cardGrad.addColorStop(1, data.color + '10');
                ctx.shadowColor = 'rgba(0,0,0,0.06)';
                ctx.shadowBlur = 6;
                ctx.shadowOffsetY = 2;
                ctx.fillStyle = cardGrad;
                ctx.beginPath();
                ctx.roundRect(40, y + pulse, w - 80, 36, 8);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.shadowOffsetY = 0;
                
                // 左の色バー
                ctx.fillStyle = data.color;
                ctx.beginPath();
                ctx.roundRect(40, y + pulse, 4, 36, 2);
                ctx.fill();

                // アイコンサークル（3D風）
                const circleGrad = ctx.createRadialGradient(70, y + 18 + pulse, 2, 70, y + 18 + pulse, 12);
                circleGrad.addColorStop(0, data.color2 || '#FFFFFF');
                circleGrad.addColorStop(1, data.color);
                ctx.shadowColor = data.color;
                ctx.shadowBlur = 6;
                ctx.fillStyle = circleGrad;
                ctx.beginPath();
                ctx.arc(70, y + 18 + pulse, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;

                // アイコンテキスト
                ctx.fillStyle = '#FFFFFF';
                ctx.font = 'bold 12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(i + 1, 70, y + 23 + pulse);

                // アイテムテキスト
                ctx.fillStyle = '#212529';
                ctx.font = '16px "Noto Sans JP", sans-serif';
                ctx.textAlign = 'left';
                ctx.fillText(item, 95, y + 23 + pulse);
            });

            // 説明（フッター）
            ctx.fillStyle = '#495057';
            ctx.font = '13px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✓ 計算（平均など）ができるか？', w / 2, 248);
            ctx.fillText('✓ ゼロに意味があるか？', w / 2, 268);
            ctx.fillStyle = data.color;
            ctx.font = 'bold 13px "Noto Sans JP", sans-serif';
            ctx.fillText('→ これらの問いで尺度を区別します', w / 2, 290);

            if (dataTypeSlider && document.getElementById('data-type-canvas')) {
                requestAnimationFrame(() => drawDataType(parseInt(dataTypeSlider.value)));
            }
        }

        // roundRect polyfill
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (r > w / 2) r = w / 2;
                if (r > h / 2) r = h / 2;
                this.moveTo(x + r, y);
                this.lineTo(x + w - r, y);
                this.quadraticCurveTo(x + w, y, x + w, y + r);
                this.lineTo(x + w, y + h - r);
                this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                this.lineTo(x + r, y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r);
                this.lineTo(x, y + r);
                this.quadraticCurveTo(x, y, x + r, y);
                return this;
            };
        }

        drawDataType(0);
        dataTypeSlider.addEventListener('input', () => {
            const val = parseInt(dataTypeSlider.value);
            dataTypeValue.textContent = dataExamples[val].label;
            initParticles(30);
            drawDataType(val);
        });
    }

    // ========================================
    // 記述統計 vs 推測統計 モード切替 (単元09)
    // ========================================
    const diSlider = document.getElementById('desc-infer-slider');
    const diValue = document.getElementById('desc-infer-value');
    const diCanvas = document.getElementById('desc-infer-canvas');

    if (diSlider && diCanvas) {
        const ctx = diCanvas.getContext('2d');
        const w = diCanvas.width;
        const h = diCanvas.height;

        function drawDescMode() {
            ctx.clearRect(0, 0, w, h);
            // グラデーション背景
            const bg = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/1.5);
            bg.addColorStop(0, '#FFFFFF');
            bg.addColorStop(1, '#E8F1F5');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            // 左上グロー
            const glow = ctx.createRadialGradient(30, 30, 5, 30, 30, 80);
            glow.addColorStop(0, '#1A5F7A');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, 120, 100);

            // タイトル
            ctx.fillStyle = '#1A5F7A';
            ctx.font = 'bold 20px "Shippori Mincho", serif';
            ctx.textAlign = 'center';
            ctx.fillText('📋 記述統計モード', w/2, 35);

            ctx.strokeStyle = '#1A5F7A';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(60, 48);
            ctx.lineTo(w-60, 48);
            ctx.stroke();

            // 4社の棒グラフ
            const bars = [
                { label: 'A社', val: 520, color: '#1A5F7A' },
                { label: 'B社', val: 620, color: '#4A8BA8' },
                { label: 'C社', val: 480, color: '#E05D5D' },
                { label: 'D社', val: 750, color: '#1A5F7A' }
            ];
            const maxVal = 800;
            const barW = 60;
            const gap = 25;
            const startX = (w - (bars.length * (barW + gap) - gap)) / 2;
            const baseY = 220;

            bars.forEach((b, i) => {
                const x = startX + i * (barW + gap);
                const bh = (b.val / maxVal) * 140;
                const y = baseY - bh;

                const grad = ctx.createLinearGradient(x, y, x, baseY);
                grad.addColorStop(0, b.color);
                grad.addColorStop(1, b.color + '88');
                ctx.shadowColor = 'rgba(0,0,0,0.08)';
                ctx.shadowBlur = 4;
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.roundRect(x, y, barW, bh, 4);
                ctx.fill();
                ctx.shadowBlur = 0;

                ctx.fillStyle = b.color;
                ctx.font = 'bold 13px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(b.val.toString(), x + barW/2, y - 6);

                ctx.fillStyle = '#495057';
                ctx.font = '12px "Noto Sans JP", sans-serif';
                ctx.fillText(b.label, x + barW/2, baseY + 18);
            });

            // 統計値表示
            ctx.fillStyle = '#1A5F7A';
            ctx.font = '14px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('平均 592万円 | 標準偏差 98万円 | n = 400', w/2, 270);
            ctx.fillStyle = '#495057';
            ctx.font = '12px "Noto Sans JP", sans-serif';
            ctx.fillText('✓ 事実をそのまま伝える —— 確率は登場しない', w/2, 290);
        }

        function drawInferMode() {
            ctx.clearRect(0, 0, w, h);
            const bg = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/1.5);
            bg.addColorStop(0, '#FFFFFF');
            bg.addColorStop(1, '#FDF2F2');
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, w, h);

            const glow = ctx.createRadialGradient(30, 30, 5, 30, 30, 80);
            glow.addColorStop(0, '#E05D5D');
            glow.addColorStop(1, 'transparent');
            ctx.fillStyle = glow;
            ctx.fillRect(0, 0, 120, 100);

            ctx.fillStyle = '#E05D5D';
            ctx.font = 'bold 20px "Shippori Mincho", serif';
            ctx.textAlign = 'center';
            ctx.fillText('🔬 推測統計モード', w/2, 35);

            ctx.strokeStyle = '#E05D5D';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(60, 48);
            ctx.lineTo(w-60, 48);
            ctx.stroke();

            // 母集団（大きな円）
            ctx.beginPath();
            ctx.arc(w/2 - 80, 155, 70, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(26,95,122,0.06)';
            ctx.fill();
            ctx.strokeStyle = '#1A5F7A';
            ctx.lineWidth = 2;
            ctx.setLineDash([6,4]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = '#1A5F7A';
            ctx.font = 'bold 14px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('👥 母集団', w/2 - 80, 140);
            ctx.fillStyle = '#495057';
            ctx.font = '11px "Noto Sans JP", sans-serif';
            ctx.fillText('全国数千万人', w/2 - 80, 160);
            ctx.fillStyle = '#E05D5D';
            ctx.font = '11px "Noto Sans JP", sans-serif';
            ctx.fillText('✗ 全員測定不可能', w/2 - 80, 185);

            // 矢印
            ctx.fillStyle = '#ADB5BD';
            ctx.font = '16px sans-serif';
            ctx.fillText('→ 無作為抽出 →', w/2 - 10, 155);

            // 標本（小さな円）
            ctx.beginPath();
            ctx.arc(w/2 + 100, 155, 50, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(224,93,93,0.06)';
            ctx.fill();
            ctx.strokeStyle = '#E05D5D';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#E05D5D';
            ctx.font = 'bold 14px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('📋 標本', w/2 + 100, 140);
            ctx.fillStyle = '#495057';
            ctx.font = '11px "Noto Sans JP", sans-serif';
            ctx.fillText('無作為500人', w/2 + 100, 160);
            ctx.fillStyle = '#1A5F7A';
            ctx.font = 'bold 13px "Noto Sans JP", sans-serif';
            ctx.fillText('平均172.3cm', w/2 + 100, 185);

            // 信頼区間の吹き出し
            ctx.fillStyle = 'rgba(26,95,122,0.10)';
            ctx.beginPath();
            ctx.roundRect(w/2 - 120, 220, 240, 28, 14);
            ctx.fill();
            ctx.strokeStyle = '#1A5F7A';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(w/2 - 120, 220, 240, 28, 14);
            ctx.stroke();
            ctx.fillStyle = '#1A5F7A';
            ctx.font = 'bold 12px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('95%信頼区間：169.8 〜 174.8cm', w/2, 239);

            ctx.fillStyle = '#495057';
            ctx.font = '12px "Noto Sans JP", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('✓ 「確からしさ」を定量化して伝える', w/2, 270);
            ctx.fillStyle = '#E05D5D';
            ctx.font = '11px "Noto Sans JP", sans-serif';
            ctx.fillText('⚠ 常に不確実性(標本誤差)が伴う', w/2, 288);
        }

        // roundRect polyfill（未定義の場合のみ）
        if (!CanvasRenderingContext2D.prototype.roundRect) {
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (r > w/2) r = w/2;
                if (r > h/2) r = h/2;
                this.moveTo(x + r, y);
                this.lineTo(x + w - r, y);
                this.quadraticCurveTo(x + w, y, x + w, y + r);
                this.lineTo(x + w, y + h - r);
                this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
                this.lineTo(x + r, y + h);
                this.quadraticCurveTo(x, y + h, x, y + h - r);
                this.lineTo(x, y + r);
                this.quadraticCurveTo(x, y, x + r, y);
                return this;
            };
        }

        drawDescMode();
        diSlider.addEventListener('input', () => {
            const val = parseInt(diSlider.value);
            diValue.textContent = val === 0 ? '📋 記述統計モード' : '🔬 推測統計モード';
            if (val === 0) drawDescMode();
            else drawInferMode();
        });
    }
});
