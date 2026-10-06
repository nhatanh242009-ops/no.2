document.addEventListener('DOMContentLoaded', () => {

    // === HIỆU ỨNG NAVBAR & PARALLAX ===
    const navbar = document.getElementById('navbar');
    const hero = document.getElementById('hero');
    window.addEventListener('scroll', () => {
        const scrollPos = window.scrollY;

        // Đổi nền navbar khi cuộn
        if (scrollPos > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.borderBottom = '1px solid #1a1a1a';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)';
            navbar.style.borderBottom = 'none';
        }

        // Hiệu ứng parallax cho banner
        hero.style.backgroundPositionY = `${scrollPos * 0.4}px`;
    });

    // === ÂM THANH ===
    const hoverSound = document.getElementById('hover-sound');
    const clickSound = document.getElementById('click-sound');

    // Giảm âm lượng mặc định
    if (hoverSound) hoverSound.volume = 0.2;
    if (clickSound) clickSound.volume = 0.4;

    const interactiveElements = document.querySelectorAll('button, a, .feature-card, .pixel-frame');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (hoverSound) {
                hoverSound.currentTime = 0;
                hoverSound.play().catch(e => console.log('Audio play prevented by browser', e));
            }
        });

        el.addEventListener('click', () => {
            if (clickSound) {
                clickSound.currentTime = 0;
                clickSound.play().catch(e => console.log('Audio play prevented by browser', e));
            }
        });
    });

    // === HIỆU ỨNG GLITCH NÚT CHƠI ===
    const playBtn = document.getElementById('play-btn');
    setInterval(() => {
        if (Math.random() > 0.8) {
            playBtn.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                playBtn.style.transform = 'translate(0, 0)';
            }, 50);
        }
    }, 2000);

    // === POPUP THÔNG BÁO DEMO ===
    const demoPopup = document.getElementById('demo-popup');
    const closeDemoBtn = document.querySelector('.close-demo-btn');

    if (playBtn && demoPopup) {
        playBtn.addEventListener('click', (e) => {
            e.preventDefault();
            demoPopup.classList.add('show');
        });

        if (closeDemoBtn) {
            closeDemoBtn.addEventListener('click', () => {
                demoPopup.classList.remove('show');
            });
        }

        demoPopup.addEventListener('click', (e) => {
            if (e.target === demoPopup) {
                demoPopup.classList.remove('show');
            }
        });
    }

    // === POPUP BÍ MẬT ===
    const secretText = document.querySelector('.hidden-secret');
    const secretPopup = document.getElementById('secret-popup');
    const closeBtn = document.querySelector('#secret-popup .close-btn');

    if (secretText && secretPopup) {
        // Mở popup khi double click vào dòng chữ ẩn
        secretText.addEventListener('dblclick', () => {
            secretPopup.classList.add('show');
            // Phát âm thanh rùng rợn
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        });

        // Đóng popup khi nhấn nút X
        closeBtn.addEventListener('click', () => {
            secretPopup.classList.remove('show');
        });

        // Đóng popup khi click ra ngoài (vùng overlay)
        secretPopup.addEventListener('click', (e) => {
            if (e.target === secretPopup) {
                secretPopup.classList.remove('show');
            }
        });
    }

    // === HIỆN GỢI Ý ẨN ===
    const explorerHint = document.querySelector('.explorer-hint');
    if (explorerHint) {
        explorerHint.addEventListener('dblclick', () => {
            explorerHint.classList.toggle('revealed');
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        });
    }

    // === HIỆU ỨNG ĐÈN LỒNG ===
    const lanternOverlay = document.getElementById('lantern-overlay');
    if (lanternOverlay) {
        // Theo dõi chuột để di chuyển vùng sáng
        window.addEventListener('mousemove', (e) => {
            lanternOverlay.style.setProperty('--lantern-x', `${e.clientX}px`);
            lanternOverlay.style.setProperty('--lantern-y', `${e.clientY}px`);
        });

        // Vị trí mặc định ở giữa màn hình
        lanternOverlay.style.setProperty('--lantern-x', '50%');
        lanternOverlay.style.setProperty('--lantern-y', '50%');

        // Hiệu ứng nhấp nháy ngẫu nhiên (mô phỏng đèn dầu cũ)
        setInterval(() => {
            if (Math.random() > 0.9) { // 10% xác suất mỗi 1.2 giây
                // Nhấp nháy nhanh 2 lần
                lanternOverlay.style.opacity = '0.35';
                setTimeout(() => {
                    lanternOverlay.style.opacity = '1';

                    if (Math.random() > 0.4) {
                        setTimeout(() => {
                            lanternOverlay.style.opacity = '0.5';
                            setTimeout(() => {
                                lanternOverlay.style.opacity = '1';
                            }, 40);
                        }, 50);
                    }
                }, 80);
            }
        }, 1200);
    }

    // === HỆ THỐNG THU THẬP VẬT TẾ ===
    let collectedItems;
    try {
        collectedItems = JSON.parse(localStorage.getItem('collectedItems')) || [];
        // Chuyển đổi giá trị cũ 'doll' → 'censer' để tương thích ngược
        const dollIndex = collectedItems.indexOf('doll');
        if (dollIndex !== -1) {
            collectedItems[dollIndex] = 'censer';
            localStorage.setItem('collectedItems', JSON.stringify(collectedItems));
        }
    } catch (e) {
        collectedItems = [];
    }

    const ritualItems = document.querySelectorAll('.ritual-item');
    const inventorySlots = document.querySelectorAll('.inventory-slot');
    const inventoryPanel = document.getElementById('inventory-panel');
    const corruptPopup = document.getElementById('ritual-corrupt-popup');
    const restartLoopBtn = document.getElementById('restart-loop-btn');
    const ritualSound = document.getElementById('ritual-sound');

    // Giảm âm lượng âm thanh nghi lễ
    if (ritualSound) {
        ritualSound.volume = 0.6;
    }

    function updateInventoryUI() {
        inventorySlots.forEach(slot => {
            const slotId = slot.getAttribute('data-slot');
            slot.classList.toggle('collected', collectedItems.includes(slotId));
        });

        if (inventoryPanel) {
            inventoryPanel.classList.toggle('ritual-ready', collectedItems.length === 4);
        }
    }

    function hideCollectedItemsFromPage() {
        ritualItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            item.classList.toggle('collected-hidden', collectedItems.includes(itemId));
        });
    }

    function triggerRitualEnding() {
        document.body.classList.add('shake-effect');
        document.body.classList.add('corrupt-active');

        if (ritualSound) {
            ritualSound.currentTime = 0;
            ritualSound.play().catch(e => console.log('Audio play prevented', e));
        }

        // Cuộn lên đầu trang để người chơi thấy popup
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Dừng rung lắc trước khi hiện popup (transform trên body phá vỡ position:fixed)
        setTimeout(() => {
            document.body.classList.remove('shake-effect');

            if (corruptPopup) {
                corruptPopup.classList.add('show');

                // Hiện từng dòng chữ một
                const lines = corruptPopup.querySelectorAll('.corrupt-line');
                lines.forEach(line => {
                    const delay = parseInt(line.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        line.classList.add('revealed');
                    }, delay);
                });

                // Hiện đếm ngược, sau đó hiện nút restart
                const countdown = corruptPopup.querySelector('.ritual-countdown');
                const restartBtn = corruptPopup.querySelector('#restart-loop-btn');
                const countdownNumber = corruptPopup.querySelector('.countdown-number');

                const countdownDelay = 5200;
                setTimeout(() => {
                    if (countdown) countdown.classList.add('revealed');

                    // Đếm ngược từ 5 về 0
                    if (countdownNumber) {
                        let count = 5;
                        const countInterval = setInterval(() => {
                            count--;
                            countdownNumber.textContent = count;
                            if (count <= 0) {
                                clearInterval(countInterval);
                                // Ẩn đếm ngược, hiện nút bắt đầu lại
                                if (countdown) countdown.classList.add('finished');
                                if (restartBtn) restartBtn.classList.add('revealed');
                            }
                        }, 1000);
                    }
                }, countdownDelay);
            }
        }, 800);
    }

    function showNotification(itemName) {
        // Hiệu ứng loé máu
        const bloodOverlay = document.getElementById('blood-overlay');
        if (bloodOverlay) {
            bloodOverlay.classList.remove('flash');
            void bloodOverlay.offsetWidth; // Ép reflow để chạy lại animation
            bloodOverlay.classList.add('flash');
        }

        // Xoá thông báo cũ nếu có
        const oldNotif = document.querySelector('.ritual-notification');
        if (oldNotif) {
            oldNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'ritual-notification pixel-frame';
        notification.innerText = `Vật tế lễ [${itemName}] đã được dâng lên...`;
        document.body.appendChild(notification);

        // Trượt xuống và hiện ra
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Mờ dần và xoá
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 400);
        }, 2500);
    }

    function collectItem(itemId, element) {
        if (!collectedItems.includes(itemId)) {
            collectedItems.push(itemId);
            localStorage.setItem('collectedItems', JSON.stringify(collectedItems));

            // Phát âm thanh nhặt vật phẩm
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));

            // Ẩn vật phẩm đã thu thập
            if (element) {
                element.classList.add('collected-hidden');
            }

            const ITEM_NAMES = {
                talisman: 'cuộn văn tế',
                oil: 'Thuỷ ngâm',
                key: 'chìa khoá phòng tế',
                censer: 'bình chứa???'
            };
            const itemName = element ? element.getAttribute('title') : (ITEM_NAMES[itemId] || itemId);
            showNotification(itemName);

            updateInventoryUI();

            if (collectedItems.length === 4) {
                setTimeout(() => {
                    triggerRitualEnding();
                }, 1200); // Delay nhỏ sau khi nhặt vật phẩm cuối
            }
        }
    }

    // Gán sự kiện click cho các vật phẩm
    ritualItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Ngăn sự kiện lan tới explorer-hint
            const itemId = item.getAttribute('data-id');
            collectItem(itemId, item);
        });
    });

    // === XỬ LÝ NÚT BẮT ĐẦU LẠI ===
    if (restartLoopBtn) {
        restartLoopBtn.addEventListener('click', () => {
            localStorage.removeItem('collectedItems');
            document.body.classList.remove('shake-effect');
            document.body.classList.remove('corrupt-active');
            if (corruptPopup) {
                corruptPopup.classList.remove('show');
            }
            // Tải lại trang
            window.location.reload();
        });
    }

    // === KHỞI TẠO TRẠNG THÁI BAN ĐẦU ===
    updateInventoryUI();
    hideCollectedItemsFromPage();

    // Nếu đã thu thập đủ 4 vật → kích hoạt kết cục khi tải trang
    if (collectedItems.length === 4) {
        setTimeout(() => {
            triggerRitualEnding();
        }, 1000);
    }

    // === NHẠC NỀN TỰ ĐỘNG ===
    const bgm = document.getElementById('bgm');
    if (bgm) {
        document.addEventListener('click', () => {
            bgm.play().catch(e => console.log('BGM play prevented', e));
        }, { once: true });
    }
});
