document.addEventListener('DOMContentLoaded', () => {

    // 1. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.borderBottom = '1px solid #1a1a1a';
        } else {
            navbar.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent)';
            navbar.style.borderBottom = 'none';
        }
    });

    // 2. Audio Effects
    const hoverSound = document.getElementById('hover-sound');
    const clickSound = document.getElementById('click-sound');

    // Lower volumes
    hoverSound.volume = 0.2;
    clickSound.volume = 0.4;

    const interactiveElements = document.querySelectorAll('button, a, .feature-card, .pixel-frame');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            // Play hover sound, reset time if already playing
            hoverSound.currentTime = 0;
            hoverSound.play().catch(e => console.log('Audio play prevented by browser', e));
        });

        el.addEventListener('click', () => {
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log('Audio play prevented by browser', e));
        });
    });

    // 3. Parallax Effect for Hero
    const hero = document.getElementById('hero');
    window.addEventListener('scroll', () => {
        let scrollPos = window.scrollY;
        // Move the background slightly based on scroll
        hero.style.backgroundPositionY = `${scrollPos * 0.4}px`;
    });

    // 4. Glitch Button Effect (Random mild glitching)
    const playBtn = document.getElementById('play-btn');
    setInterval(() => {
        if (Math.random() > 0.8) {
            playBtn.style.transform = `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`;
            setTimeout(() => {
                playBtn.style.transform = 'translate(0, 0)';
            }, 50);
        }
    }, 2000);

    // Dynamic Image Loading (To be replaced with actual generated images later)
    // Here we can set paths manually if needed.

    // --- DEMO POPUP LOGIC ---
    const playBtnDemo = document.getElementById('play-btn');
    const demoPopup = document.getElementById('demo-popup');
    const closeDemoBtn = document.querySelector('.close-demo-btn');

    if (playBtnDemo && demoPopup) {
        playBtnDemo.addEventListener('click', (e) => {
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

    // --- SECRET POPUP LOGIC ---
    const secretText = document.querySelector('.hidden-secret');
    const secretPopup = document.getElementById('secret-popup');
    const closeBtn = document.querySelector('.close-btn');

    if (secretText && secretPopup) {
        // Mở popup khi double click vào dòng chữ ẩn
        secretText.addEventListener('dblclick', () => {
            secretPopup.classList.add('show');
            // Play a creepy sound if needed
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

    // --- REVEAL EXPLORER HINT LOGIC ---
    const explorerHint = document.querySelector('.explorer-hint');
    if (explorerHint) {
        explorerHint.addEventListener('dblclick', () => {
            explorerHint.classList.toggle('revealed');
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));
        });
    }

    // --- LANTERN EFFECT LOGIC ---
    const lanternOverlay = document.getElementById('lantern-overlay');
    if (lanternOverlay) {
        // Track mouse move and update custom CSS variables
        window.addEventListener('mousemove', (e) => {
            lanternOverlay.style.setProperty('--lantern-x', `${e.clientX}px`);
            lanternOverlay.style.setProperty('--lantern-y', `${e.clientY}px`);
        });

        // Initialize lantern position to center of screen before mouse moves
        lanternOverlay.style.setProperty('--lantern-x', '50%');
        lanternOverlay.style.setProperty('--lantern-y', '50%');

        // Flicker effect (randomly dim the lantern to simulate an old, failing lamp)
        setInterval(() => {
            if (Math.random() > 0.9) { // 10% chance every 1.2s
                // Fast double flicker
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

    // --- RITUAL MINI-GAME LOGIC ---
    try {
        collectedItems = JSON.parse(localStorage.getItem('collectedItems')) || [];
        // Map old 'doll' value to 'censer' for backward-compatibility
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

    // Lower volume for ritual sound
    if (ritualSound) {
        ritualSound.volume = 0.6;
    }

    function updateInventoryUI() {
        inventorySlots.forEach(slot => {
            const slotId = slot.getAttribute('data-slot');
            if (collectedItems.includes(slotId)) {
                slot.classList.add('collected');
            } else {
                slot.classList.remove('collected');
            }
        });

        if (collectedItems.length === 4) {
            if (inventoryPanel) {
                inventoryPanel.classList.add('ritual-ready');
            }
        } else {
            if (inventoryPanel) {
                inventoryPanel.classList.remove('ritual-ready');
            }
        }
    }

    function hideCollectedItemsFromPage() {
        ritualItems.forEach(item => {
            const itemId = item.getAttribute('data-id');
            if (collectedItems.includes(itemId)) {
                item.classList.add('collected-hidden');
            } else {
                item.classList.remove('collected-hidden');
            }
        });
    }

    function triggerRitualEnding() {
        document.body.classList.add('shake-effect');
        document.body.classList.add('corrupt-active');

        if (ritualSound) {
            ritualSound.currentTime = 0;
            ritualSound.play().catch(e => console.log('Audio play prevented', e));
        }

        setTimeout(() => {
            if (corruptPopup) {
                corruptPopup.classList.add('show');
            }
        }, 1500);
    }

    function showNotification(itemName) {
        // Trigger blood flash effect
        const bloodOverlay = document.getElementById('blood-overlay');
        if (bloodOverlay) {
            bloodOverlay.classList.remove('flash');
            void bloodOverlay.offsetWidth; // Force reflow to restart animation
            bloodOverlay.classList.add('flash');
        }

        // Remove existing notification if any
        const oldNotif = document.querySelector('.ritual-notification');
        if (oldNotif) {
            oldNotif.remove();
        }

        const notification = document.createElement('div');
        notification.className = 'ritual-notification pixel-frame';
        notification.innerText = `Vật tế lễ [${itemName}] đã được dâng lên...`;
        document.body.appendChild(notification);

        // Slide down and fade in
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Fade out and remove
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

            // Play pick up sound (using clickSound)
            clickSound.currentTime = 0;
            clickSound.play().catch(e => console.log(e));

            // Visual feedback on element
            if (element) {
                element.classList.add('collected-hidden');
            }

            const itemName = element ? element.getAttribute('title') : (itemId === 'talisman' ? 'Bùa Hộ Mệnh' : (itemId === 'oil' ? 'Bình Dầu Thắp' : (itemId === 'key' ? 'Chiếc Chìa Khóa Gỉ' : 'Lư Hương Cổ')));
            showNotification(itemName);

            updateInventoryUI();

            if (collectedItems.length === 4) {
                setTimeout(() => {
                    triggerRitualEnding();
                }, 1200); // Small delay after picking up the last item
            }
        }
    }

    // Bind click events to items
    ritualItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent double click event from propagating to hint
            const itemId = item.getAttribute('data-id');
            collectItem(itemId, item);
        });
    });

    // Restart Loop action
    if (restartLoopBtn) {
        restartLoopBtn.addEventListener('click', () => {
            localStorage.removeItem('collectedItems');
            document.body.classList.remove('shake-effect');
            document.body.classList.remove('corrupt-active');
            if (corruptPopup) {
                corruptPopup.classList.remove('show');
            }
            // Reload page to start fresh
            window.location.reload();
        });
    }

    // Initialize state on load
    updateInventoryUI();
    hideCollectedItemsFromPage();

    // If already collected all, trigger ending on load after a brief delay
    if (collectedItems.length === 4) {
        setTimeout(() => {
            triggerRitualEnding();
        }, 1000);
    }
});
