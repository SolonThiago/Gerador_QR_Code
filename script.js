// Theme Toggle
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;

        // Check for saved theme preference or use system preference
        const savedTheme = localStorage.getItem('theme') || 
                          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the saved theme
        html.classList.add(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            
            // Update icon
            const moonIcon = themeToggle.querySelector('.fa-moon');
            const sunIcon = themeToggle.querySelector('.fa-sun');
            
            if (isDark) {
                moonIcon.classList.add('hidden');
                sunIcon.classList.remove('hidden');
            } else {
                moonIcon.classList.remove('hidden');
                sunIcon.classList.add('hidden');
            }
        });

        // Tab Switching
        const tabs = document.querySelectorAll('[role="tab"]');
        const tabPanels = document.querySelectorAll('[role="tabpanel"]');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Hide all tab panels
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    panel.setAttribute('aria-hidden', 'true');
                });
                
                // Deactivate all tabs
                tabs.forEach(t => {
                    t.setAttribute('aria-selected', 'false');
                    t.classList.remove('border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
                    t.classList.add('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                });
                
                // Activate the clicked tab
                tab.setAttribute('aria-selected', 'true');
                tab.classList.remove('border-transparent', 'text-gray-500', 'dark:text-gray-400');
                tab.classList.add('border-blue-500', 'text-blue-600', 'dark:text-blue-400', 'dark:border-blue-400');
                
                // Show the corresponding tab panel
                const panelId = tab.getAttribute('aria-controls');
                const panel = document.getElementById(panelId);
                panel.classList.add('active');
                panel.setAttribute('aria-hidden', 'false');
            });
        });

        // QR Code Generation
        const qrCodeCanvas = document.getElementById('qr-code-canvas');
        const qrCodePlaceholder = document.getElementById('qr-code-placeholder');
        const ctx = qrCodeCanvas.getContext('2d');
        
        // Input elements
        const qrColorInput = document.getElementById('qr-color');
        const bgColorInput = document.getElementById('bg-color');
        const qrSizeInput = document.getElementById('qr-size');
        
        // Tab-specific inputs
        const urlInput = document.getElementById('url-input');
        const wifiSsidInput = document.getElementById('wifi-ssid');
        const wifiPasswordInput = document.getElementById('wifi-password');
        const wifiSecurityInput = document.getElementById('wifi-security');
        const textInput = document.getElementById('text-input');
        const emailAddressInput = document.getElementById('email-address');
        const emailSubjectInput = document.getElementById('email-subject');
        const emailBodyInput = document.getElementById('email-body');
        const phoneNumberInput = document.getElementById('phone-number');
        const locationLatitudeInput = document.getElementById('location-latitude');
        const locationLongitudeInput = document.getElementById('location-longitude');
        const locationNameInput = document.getElementById('location-name');
        
        // Generate buttons
        const generateUrlBtn = document.getElementById('generate-url-btn');
        const generateWifiBtn = document.getElementById('generate-wifi-btn');
        const generateTextBtn = document.getElementById('generate-text-btn');
        const generateEmailBtn = document.getElementById('generate-email-btn');
        const generatePhoneBtn = document.getElementById('generate-phone-btn');
        const generateLocationBtn = document.getElementById('generate-location-btn');
        
        // Download buttons
        const downloadPngBtn = document.getElementById('download-png');
        const downloadJpgBtn = document.getElementById('download-jpg');
        const downloadSvgBtn = document.getElementById('download-svg');
        
        // Toast container
        const toastContainer = document.getElementById('toast-container');
        
        // Current QR code data
        let currentQrData = '';
        
        // Generate QR Code function
        function generateQRCode(data) {
            if (!data) {
                showToast('Por favor, preencha os campos necessários', 'error');
                return;
            }
            
            currentQrData = data;
            
            // Show loading state
            qrCodePlaceholder.innerHTML = '<lottie-player src="https://assets5.lottiefiles.com/packages/lf20_poqmycwy.json" background="transparent" speed="1" style="width: 150px; height: 150px;" loop autoplay></lottie-player>';
            qrCodeCanvas.classList.add('hidden');
            qrCodePlaceholder.classList.remove('hidden');
            
            // Small delay to allow animation to show
            setTimeout(() => {
                try {
                    const qr = qrcode(0, 'H');
                    qr.addData(data);
                    qr.make();
                    
                    const size = parseInt(qrSizeInput.value);
                    const fgColor = qrColorInput.value;
                    const bgColor = bgColorInput.value;
                    
                    // Set canvas size
                    qrCodeCanvas.width = size;
                    qrCodeCanvas.height = size;
                    
                    // Get QR code modules
                    const moduleCount = qr.getModuleCount();
                    const moduleSize = size / moduleCount;
                    
                    // Draw QR code
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, size, size);
                    
                    ctx.fillStyle = fgColor;
                    for (let row = 0; row < moduleCount; row++) {
                        for (let col = 0; col < moduleCount; col++) {
                            if (qr.isDark(row, col)) {
                                ctx.fillRect(
                                    col * moduleSize,
                                    row * moduleSize,
                                    moduleSize,
                                    moduleSize
                                );
                            }
                        }
                    }
                    
                    // Show the canvas
                    qrCodePlaceholder.classList.add('hidden');
                    qrCodeCanvas.classList.remove('hidden');
                    
                    showToast('QR Code gerado com sucesso!', 'success');
                } catch (error) {
                    console.error('Error generating QR code:', error);
                    showToast('Erro ao gerar QR Code', 'error');
                }
            }, 300);
        }
        
        // Generate URL QR Code
        generateUrlBtn.addEventListener('click', () => {
            const url = urlInput.value.trim();
            if (!url) {
                showToast('Por favor, insira uma URL válida', 'error');
                return;
            }
            
            // Add https:// if not present
            let formattedUrl = url;
            if (!/^https?:\/\//i.test(url)) {
                formattedUrl = 'https://' + url;
                urlInput.value = formattedUrl;
            }
            
            generateQRCode(formattedUrl);
        });
        
        // Generate Wi-Fi QR Code
        generateWifiBtn.addEventListener('click', () => {
            const ssid = wifiSsidInput.value.trim();
            const password = wifiPasswordInput.value.trim();
            const security = wifiSecurityInput.value;
            
            if (!ssid) {
                showToast('Por favor, insira o nome da rede Wi-Fi', 'error');
                return;
            }
            
            let wifiData;
            if (security === 'WPA') {
                wifiData = `WIFI:T:WPA;S:${ssid};P:${password};;`;
            } else if (security === 'WEP') {
                wifiData = `WIFI:T:WEP;S:${ssid};P:${password};;`;
            } else {
                wifiData = `WIFI:T:nopass;S:${ssid};;`;
            }
            
            generateQRCode(wifiData);
        });
        
        // Generate Text QR Code
        generateTextBtn.addEventListener('click', () => {
            const text = textInput.value.trim();
            if (!text) {
                showToast('Por favor, insira algum texto', 'error');
                return;
            }
            
            generateQRCode(text);
        });
        
        // Generate Email QR Code
        generateEmailBtn.addEventListener('click', () => {
            const email = emailAddressInput.value.trim();
            if (!email) {
                showToast('Por favor, insira um endereço de email', 'error');
                return;
            }
            
            const subject = emailSubjectInput.value.trim();
            const body = emailBodyInput.value.trim();
            
            let emailData = `mailto:${email}`;
            let params = [];
            
            if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
            if (body) params.push(`body=${encodeURIComponent(body)}`);
            
            if (params.length > 0) {
                emailData += `?${params.join('&')}`;
            }
            
            generateQRCode(emailData);
        });
        
        // Generate Phone QR Code
        generatePhoneBtn.addEventListener('click', () => {
            const phone = phoneNumberInput.value.trim();
            if (!phone) {
                showToast('Por favor, insira um número de telefone', 'error');
                return;
            }
            
            generateQRCode(`tel:${phone}`);
        });
        
        // Generate Location QR Code
        generateLocationBtn.addEventListener('click', () => {
            const latitude = locationLatitudeInput.value.trim();
            const longitude = locationLongitudeInput.value.trim();
            const name = locationNameInput.value.trim();
            
            if (!latitude || !longitude) {
                showToast('Por favor, insira latitude e longitude', 'error');
                return;
            }
            
            if (isNaN(latitude) || isNaN(longitude)) {
                showToast('Latitude e longitude devem ser números', 'error');
                return;
            }
            
            let locationData = `geo:${latitude},${longitude}`;
            if (name) {
                locationData += `?q=${encodeURIComponent(name)}`;
            }
            
            generateQRCode(locationData);
        });
        
        // Update QR Code when color or size changes
        [qrColorInput, bgColorInput, qrSizeInput].forEach(input => {
            input.addEventListener('input', () => {
                if (currentQrData) {
                    generateQRCode(currentQrData);
                }
            });
        });
        
        // Download functions
        function downloadImage(format) {
            if (!currentQrData) {
                showToast('Nenhum QR Code para baixar', 'error');
                return;
            }
            
            const size = parseInt(qrSizeInput.value);
            const fileName = `qrcode-${new Date().getTime()}.${format}`;
            
            if (format === 'svg') {
                // Generate SVG
                const qr = qrcode(0, 'H');
                qr.addData(currentQrData);
                qr.make();
                
                const moduleCount = qr.getModuleCount();
                const moduleSize = 10; // Fixed size for SVG modules
                const svgSize = moduleCount * moduleSize;
                
                let svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${svgSize}" height="${svgSize}" viewBox="0 0 ${svgSize} ${svgSize}">`;
                svg += `<rect width="100%" height="100%" fill="${bgColorInput.value}"/>`;
                
                for (let row = 0; row < moduleCount; row++) {
                    for (let col = 0; col < moduleCount; col++) {
                        if (qr.isDark(row, col)) {
                            svg += `<rect x="${col * moduleSize}" y="${row * moduleSize}" width="${moduleSize}" height="${moduleSize}" fill="${qrColorInput.value}"/>`;
                        }
                    }
                }
                
                svg += '</svg>';
                
                // Create download link
                const blob = new Blob([svg], {type: 'image/svg+xml'});
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            } else {
                // For PNG/JPG we can use the canvas
                const canvas = document.createElement('canvas');
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                // Draw white background (for JPG)
                if (format === 'jpg') {
                    ctx.fillStyle = bgColorInput.value;
                    ctx.fillRect(0, 0, size, size);
                }
                
                // Draw QR code from the main canvas
                ctx.drawImage(qrCodeCanvas, 0, 0, size, size);
                
                // Create download link
                const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
                const url = canvas.toDataURL(mimeType, 1.0);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            
            showToast(`QR Code baixado como ${format.toUpperCase()}`, 'success');
        }
        
        downloadPngBtn.addEventListener('click', () => downloadImage('png'));
        downloadJpgBtn.addEventListener('click', () => downloadImage('jpg'));
        downloadSvgBtn.addEventListener('click', () => downloadImage('svg'));
        
        // Toast notification function
        function showToast(message, type = 'info') {
            const toast = document.createElement('div');
            toast.className = `toast fade-in px-4 py-3 rounded-md shadow-md flex items-center ${getToastClasses(type)}`;
            toast.setAttribute('role', 'alert');
            
            const icon = document.createElement('i');
            icon.className = `mr-2 ${getToastIcon(type)}`;
            
            const text = document.createElement('span');
            text.textContent = message;
            
            toast.appendChild(icon);
            toast.appendChild(text);
            
            toastContainer.appendChild(toast);
            
            // Auto-remove after 5 seconds
            setTimeout(() => {
                toast.classList.add('toast-exit');
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 5000);
        }
        
        function getToastClasses(type) {
            const classes = {
                success: 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-100',
                error: 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-100',
                info: 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-100',
                warning: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-700 dark:text-yellow-100'
            };
            return classes[type] || classes.info;
        }
        
        function getToastIcon(type) {
            const icons = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                info: 'fas fa-info-circle',
                warning: 'fas fa-exclamation-triangle'
            };
            return icons[type] || icons.info;
        }
        
        // Initialize with URL tab active
        document.getElementById('url-tab-btn').click();
        
        // Accessibility: Keyboard navigation for tabs
        tabs.forEach((tab, index) => {
            tab.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                    const direction = e.key === 'ArrowRight' ? 1 : -1;
                    const nextIndex = (index + direction + tabs.length) % tabs.length;
                    tabs[nextIndex].focus();
                    tabs[nextIndex].click();
                } else if (e.key === 'Home') {
                    tabs[0].focus();
                    tabs[0].click();
                } else if (e.key === 'End') {
                    tabs[tabs.length - 1].focus();
                    tabs[tabs.length - 1].click();
                }
            });
        });