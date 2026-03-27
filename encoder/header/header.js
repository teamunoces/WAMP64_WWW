document.addEventListener("DOMContentLoaded", function () {

    const profileContainer = document.querySelector(".profile-container");
    const dropdown = document.querySelector(".dropdown");
    const logoutBtn = document.querySelector(".logout-btn");
    let injectedStyles = null;
    let parentDropdown = null; // Store reference to parent dropdown

    if (!profileContainer || !dropdown) return;

    /* ================= INJECT CSS INTO PARENT PAGE ================= */
    async function injectHeaderCSS() {
        try {
            // Check if already injected
            if (document.getElementById('header-injected-styles')) return;
            
            const response = await fetch('header.css');
            let cssText = await response.text();
            
            // Modify CSS to work in parent page context
            cssText = cssText.replace(/position:\s*absolute;/g, 'position: fixed;');
            cssText += `
                /* Additional styles for iframe dropdown */
                .header-dropdown {
                    display: none;
                    position: fixed !important;
                    z-index: 10001 !important;
                    background: white;
                    min-width: 200px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    border-radius: 12px;
                    border: 1px solid #e0e0e0;
                    padding: 8px;
                }
                
                .header-dropdown.show {
                    display: block !important;
                }
                
                .header-dropdown::before {
                    content: '';
                    position: fixed;
                    width: 0;
                    height: 0;
                    border-left: 8px solid transparent;
                    border-right: 8px solid transparent;
                    border-bottom: 8px solid white;
                    z-index: 10002;
                    pointer-events: none;
                }
            `;
            
            // Inject into parent page
            if (window.top !== window.self && window.top.document) {
                injectedStyles = window.top.document.createElement('style');
                injectedStyles.id = 'header-injected-styles';
                injectedStyles.textContent = cssText;
                window.top.document.head.appendChild(injectedStyles);
            }
        } catch (error) {
            console.error('Failed to inject header CSS:', error);
        }
    }

    /* ================= UPDATE DROPDOWN POSITION ================= */
    function updateDropdownPosition(dropdownElement) {
        if (!dropdownElement || !dropdownElement.classList.contains('show')) return;
        
        // Get position of profile container relative to viewport
        const rect = profileContainer.getBoundingClientRect();
        const headerRect = document.querySelector('.main-header').getBoundingClientRect();
        
        // Apply fixed positioning
        dropdownElement.style.position = 'fixed';
        dropdownElement.style.top = (headerRect.bottom + 5) + 'px';
        dropdownElement.style.right = (window.innerWidth - rect.right) + 'px';
        dropdownElement.style.left = 'auto';
        dropdownElement.style.bottom = 'auto';
        
        // Update arrow position
        const arrowStyle = document.createElement('style');
        arrowStyle.textContent = `
            .header-dropdown::before {
                top: ${headerRect.bottom}px !important;
                right: ${window.innerWidth - rect.right + 20}px !important;
            }
        `;
        
        // Remove old arrow style and add new one
        const oldArrowStyle = window.top.document.querySelector('#dropdown-arrow-style');
        if (oldArrowStyle) oldArrowStyle.remove();
        arrowStyle.id = 'dropdown-arrow-style';
        window.top.document.head.appendChild(arrowStyle);
    }

    /* ================= CREATE DROPDOWN IN PARENT PAGE ================= */
    function createParentDropdown() {
        if (window.top === window.self) return null;
        
        try {
            // Check if dropdown already exists in parent
            let existingDropdown = window.top.document.querySelector('.header-dropdown');
            if (existingDropdown) return existingDropdown;
            
            // Clone the dropdown to parent
            const newDropdown = dropdown.cloneNode(true);
            newDropdown.classList.remove('show');
            newDropdown.className = 'header-dropdown'; // Change class name to avoid conflicts
            
            // Remove any duplicate content
            window.top.document.body.appendChild(newDropdown);
            
            // Update references for logout button in parent
            const parentLogoutBtn = newDropdown.querySelector('.logout-btn');
            if (parentLogoutBtn) {
                parentLogoutBtn.addEventListener('click', function() {
                    window.top.location.href = "/SYSTEM_VERSION_!/login/login.html";
                });
            }
            
            return newDropdown;
        } catch (e) {
            console.error('Cannot access parent:', e);
            return null;
        }
    }

    /* ================= HIDE ORIGINAL DROPDOWN ================= */
    function hideOriginalDropdown() {
        // Hide the original dropdown in iframe
        dropdown.style.display = 'none';
        dropdown.classList.remove('show');
    }

    /* ================= SHOW ORIGINAL DROPDOWN ================= */
    function showOriginalDropdown() {
        // Show the original dropdown in iframe (for non-iframe mode)
        dropdown.style.display = '';
    }

    /* ================= TOGGLE DROPDOWN ================= */
    async function toggleDropdown(e) {
        e.stopPropagation();
        
        // Check if we're in iframe
        if (window.top !== window.self) {
            // Inject CSS first if needed
            if (!injectedStyles) {
                await injectHeaderCSS();
            }
            
            // Create or get parent dropdown
            if (!parentDropdown) {
                parentDropdown = createParentDropdown();
            }
            
            if (parentDropdown) {
                // Hide original dropdown in iframe
                hideOriginalDropdown();
                
                // Toggle dropdown in parent
                if (parentDropdown.classList.contains('show')) {
                    parentDropdown.classList.remove('show');
                    // Remove close handler
                    if (window.closeHandler) {
                        window.top.document.removeEventListener('click', window.closeHandler);
                        window.top.document.removeEventListener('touchstart', window.closeHandler);
                        window.closeHandler = null;
                    }
                } else {
                    // Update position
                    const rect = profileContainer.getBoundingClientRect();
                    const headerRect = document.querySelector('.main-header').getBoundingClientRect();
                    
                    parentDropdown.style.position = 'fixed';
                    parentDropdown.style.top = (headerRect.bottom + 5) + 'px';
                    parentDropdown.style.right = (window.innerWidth - rect.right) + 'px';
                    parentDropdown.style.zIndex = '10001';
                    
                    parentDropdown.classList.add('show');
                    
                    // Add click handler to close when clicking outside
                    setTimeout(() => {
                        if (window.closeHandler) {
                            window.top.document.removeEventListener('click', window.closeHandler);
                            window.top.document.removeEventListener('touchstart', window.closeHandler);
                        }
                        
                        window.closeHandler = function(event) {
                            // Check if click is outside profile container and outside dropdown
                            if (!profileContainer.contains(event.target) && 
                                !parentDropdown.contains(event.target)) {
                                parentDropdown.classList.remove('show');
                                window.top.document.removeEventListener('click', window.closeHandler);
                                window.top.document.removeEventListener('touchstart', window.closeHandler);
                                window.closeHandler = null;
                            }
                        };
                        window.top.document.addEventListener('click', window.closeHandler);
                        window.top.document.addEventListener('touchstart', window.closeHandler);
                    }, 100);
                }
            }
        } else {
            // Not in iframe - normal behavior
            dropdown.classList.toggle("show");
            showOriginalDropdown();
            
            if (dropdown.classList.contains('show')) {
                updateDropdownPosition(dropdown);
            }
        }
    }

    /* ================= UPDATE POSITION ON SCROLL/RESIZE ================= */
    function handleScrollResize() {
        if (window.top !== window.self) {
            if (parentDropdown && parentDropdown.classList.contains('show')) {
                const rect = profileContainer.getBoundingClientRect();
                const headerRect = document.querySelector('.main-header').getBoundingClientRect();
                
                parentDropdown.style.top = (headerRect.bottom + 5) + 'px';
                parentDropdown.style.right = (window.innerWidth - rect.right) + 'px';
            }
        } else {
            if (dropdown.classList.contains('show')) {
                updateDropdownPosition(dropdown);
            }
        }
    }

    /* ================= EVENT LISTENERS ================= */
    profileContainer.addEventListener("click", toggleDropdown);
    
    // Update position on scroll and resize
    window.addEventListener('scroll', handleScrollResize);
    window.addEventListener('resize', handleScrollResize);
    
    // Also listen to parent window scroll/resize if in iframe
    if (window.top !== window.self) {
        window.top.addEventListener('scroll', handleScrollResize);
        window.top.addEventListener('resize', handleScrollResize);
    }

    /* ================= CLOSE WHEN CLICKING OUTSIDE (Non-iframe) ================= */
    document.addEventListener("click", function (e) {
        if (window.top === window.self) { // Only for non-iframe mode
            if (!profileContainer.contains(e.target)) {
                dropdown.classList.remove("show");
            }
        }
    });

    /* ================= LOGOUT ================= */
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (window.top !== window.self) {
                window.top.location.href = "/SYSTEM_VERSION_!/login/login.html";
            } else {
                window.location.href = "/SYSTEM_VERSION_!/login/login.html";
            }
        });
    }

});