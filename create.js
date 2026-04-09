// create.js

(function init() {
    // Prevent script errors if not on create page
    if(!document.getElementById("template-selector")) return;

    const { jsPDF } = window.jspdf;

    const selector = document.getElementById("template-selector");
    const previewWrapper = document.getElementById("preview-wrapper");
    const btnDownload = document.getElementById("btn-download-pdf");

    // Slider Controls
    const btnPrev = document.getElementById("slider-prev");
    const btnNext = document.getElementById("slider-next");
    let currentSlideIndex = 0;

    // Controls panels
    const controlsCalendar = document.getElementById("controls-calendar");

    // Inputs for Calendar
    const calLang = document.getElementById("calendar-lang-input");
    const calYear = document.getElementById("calendar-year-input");
    const calImage = document.getElementById("calendar-image-input");

    // Tuning state
    const zoomInput = document.getElementById("img-zoom");
    const panXInput = document.getElementById("img-pan-x");
    const panYInput = document.getElementById("img-pan-y");
    const labelZoom = document.getElementById("label-zoom");
    const labelPanX = document.getElementById("label-pan-x");
    const labelPanY = document.getElementById("label-pan-y");
    const btnResetImg = document.getElementById("btn-reset-image");

    // Branding state
    const modeInput = document.getElementById("calendar-mode-input");
    const orgDetailsBox = document.getElementById("org-details-box");
    const nameInput = document.getElementById("org-name-input");
    const logoInput = document.getElementById("org-logo-input");

    let calendarMode = 'personal';
    let orgName = '';
    let orgLogoUrl = '';

    // Initialize date to current Nepali month/year
    const currentNepaliDate = new NepaliDate();
    // Restricted to 2083
    calYear.innerHTML = `<option value="2083" selected style="background: var(--bg-charcoal);">2083</option>`;

    // Helper functions for state
    let monthImages = {};
    let currentStyle = 'classic';
    let userFont  = "'Inter', sans-serif";
    let userAccent = '#e8a430';
    let userTitleColor = '#111111';
    let userBgColor = '#ffffff';

    const nepaliNumerals = ['\u0966', '\u0967', '\u0968', '\u0969', '\u096a', '\u096b', '\u096c', '\u096d', '\u096e', '\u096f'];
    function toNepaliNum(num) {
        return num.toString().split('').map(digit => nepaliNumerals[digit] || digit).join('');
    }

    const initialHolidays = {
        "0-1": "New Year", "0-18": "Labour Day", "1-12": "Buddha Jayanti", "1-15": "Republic Day",
        "4-3": "Janai Purnima", "4-4": "Gai Jatra", "4-16": "Janmashtami", "4-29": "Teej",
        "5-3": "Constitution Day", "5-17": "Ghatasthapana", "5-23": "Fulpati", "5-24": "Maha Ashtami", "5-25": "Maha Navami", "5-26": "Vijaya Dashami", "5-30": "Kojagrat",
        "6-12": "Tihar", "6-13": "Tihar", "6-14": "Laxmi Puja", "6-15": "Tihar", "6-16": "Bhai Tika", "6-20": "Chhath Puja",
        "7-15": "Udahauli", "8-10": "Christmas", "9-1": "Maghe Sankranti", "9-16": "Martyrs' Day",
        "10-10": "Shivaratri", "10-23": "Holi (Hill)", "10-24": "Holi (Terai)", "11-6": "Ghode Jatra"
    };

    let customEvents = {};
    for (const [key, name] of Object.entries(initialHolidays)) {
        customEvents[key] = { type: 'holiday', name: name };
    }

    const bsMonthNames = ["BAISAKH", "JESTHA", "ASHADH", "SHRAWAN", "BHADRA", "ASHWIN", "KARTIK", "MANGSIR", "POUSH", "MAGH", "FALGUN", "CHAITRA"];

    function buildTemplate(type, style) {
        const ac = userAccent;
        const tc = userTitleColor;
        const bg = userBgColor;
        const fn = userFont;

        const brandingHtml = calendarMode === 'organization' ? `
            <div style="display:flex;align-items:center;gap:12px;position:absolute;top:20px;right:25px;z-index:30;background:rgba(255,255,255,0.95);padding:10px 15px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.12);max-width:280px;">
                ${orgLogoUrl ? `<img src="${orgLogoUrl}" style="height:45px;width:auto;max-width:100px;object-fit:contain;">` : ''}
                <div style="display:flex;flex-direction:column;justify-content:center;">
                    <span style="font-size:1.05rem;color:#111;font-weight:800;line-height:1.1;letter-spacing:-0.01em;">${orgName || 'Your Organization'}</span>
                </div>
            </div>
        ` : '';

        const brandingHtmlTopCenter = calendarMode === 'organization' ? `
            <div style="display:flex;align-items:center;gap:12px;position:absolute;top:25px;left:50%;transform:translateX(-50%);z-index:30;background:rgba(255,255,255,0.95);padding:8px 18px;border-radius:12px;box-shadow:0 8px 25px rgba(0,0,0,0.12);max-width:320px;white-space:nowrap;">
                ${orgLogoUrl ? `<img src="${orgLogoUrl}" style="height:40px;width:auto;max-width:80px;object-fit:contain;">` : ''}
                <div style="display:flex;flex-direction:column;justify-content:center;">
                    <span style="font-size:1.05rem;color:#111;font-weight:800;line-height:1.1;letter-spacing:-0.05em;">${orgName || 'Your Organization'}</span>
                </div>
            </div>
        ` : '';

        const brandingTableHtml = calendarMode === 'organization' ? `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;padding:5px;border-bottom:1.5px solid ${ac}33;">
                ${orgLogoUrl ? `<img src="${orgLogoUrl}" style="height:30px;width:auto;max-width:70px;object-fit:contain;">` : ''}
                <span style="font-size:0.85rem;color:#111;font-weight:700;letter-spacing:-0.01em;">${orgName || 'Your Organization'}</span>
            </div>
        ` : '';

        const brandingBoldSidebarHtml = calendarMode === 'organization' ? `
            <div style="display:flex;flex-direction:column;align-items:center;margin-bottom:25px;width:100%;text-align:center;">
                ${orgLogoUrl ? `<img src="${orgLogoUrl}" style="height:60px;width:auto;max-width:80%;object-fit:contain;margin-bottom:10px;filter:drop-shadow(0 4px 8px rgba(0,0,0,0.1));">` : ''}
                <span style="font-size:0.85rem;color:#ffffff;font-weight:800;line-height:1.2;text-transform:uppercase;letter-spacing:0.05em;max-width:100%;word-wrap:break-word;">${orgName || 'Your Organization'}</span>
            </div>
        ` : '';

        const tuning = getImageTuning(currentSlideIndex);
        const imgStyle = `width:100%;height:100%;background-image:url(${monthImages[currentSlideIndex]?.url || 'view.jpg'});background-size:cover;background-position:${tuning.x}% ${tuning.y}%;transform:scale(${tuning.zoom});transition:transform 0.1s, background-position 0.1s;background-repeat:no-repeat;`;

        if (type === 'wall-calendar') {
            if (style === 'minimal') {
                return `<div id="render-target" style="width:600px;height:800px;background:${bg};display:flex;flex-direction:column;font-family:${fn};position:relative;">${brandingHtmlTopCenter}<div style="padding:110px 45px 20px;text-align:center;"><p id="tpl-cal-year" style="color:${ac};font-size:0.8rem;font-weight:700;margin:0 0 6px;letter-spacing:0.2em;text-transform:uppercase;">2083</p><h1 id="tpl-cal-title" style="color:${tc};font-size:3.8rem;margin:0;font-weight:800;text-transform:uppercase;line-height:1;">MONTH</h1><div style="width:50px;height:4px;background:${ac};margin:14px auto 0;border-radius:2px;"></div></div><div style="flex:1;padding:10px 45px 30px;display:flex;flex-direction:column;"><div id="tpl-wall-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:8px;border-bottom:2px solid ${ac};padding-bottom:5px;font-size:0.9rem;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:5px;flex:1;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:10px;margin-top:10px;gap:10px;"></div></div></div>`;
            }
            if (style === 'dark') {
                return `<div id="render-target" style="width:600px;height:800px;background:#111827;display:flex;flex-direction:column;font-family:${fn};position:relative;">${brandingHtml}<div style="padding:40px 40px 20px;"><p style="color:${ac};font-size:0.75rem;font-weight:700;margin:0 0 4px;letter-spacing:0.2em;text-transform:uppercase;">2083 BS</p><h1 id="tpl-cal-title" style="color:#ffffff;font-size:3.5rem;margin:0;font-weight:800;text-transform:uppercase;line-height:1;">MONTH</h1><p id="tpl-cal-year" style="color:#6b7280;font-size:0.9rem;margin:6px 0 0;font-weight:400;">2083</p><div style="width:100%;height:1px;background:${ac};margin-top:15px;opacity:0.4;"></div></div><div style="flex:1;padding:10px 40px 30px;display:flex;flex-direction:column;"><div id="tpl-wall-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:8px;padding-bottom:5px;font-size:0.85rem;color:#9ca3af;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:5px;flex:1;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #374151;padding-top:10px;margin-top:10px;gap:10px;"></div></div></div>`;
            }
            if (style === 'bold') {
                return `<div id="render-target" style="width:600px;height:800px;background:${bg};display:flex;flex-direction:column;font-family:${fn};position:relative;">${brandingHtml}<div style="background:${ac};padding:35px 40px;"><p id="tpl-cal-year" style="color:rgba(255,255,255,0.75);font-size:0.85rem;font-weight:600;margin:0 0 4px;letter-spacing:0.15em;text-transform:uppercase;">2083</p><h1 id="tpl-cal-title" style="color:#ffffff;font-size:4.2rem;margin:0;font-weight:900;text-transform:uppercase;line-height:1;">MONTH</h1></div><div style="flex:1;padding:25px 40px 30px;display:flex;flex-direction:column;"><div id="tpl-wall-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:8px;border-bottom:3px solid ${ac};padding-bottom:5px;font-size:0.9rem;font-weight:700;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:5px;flex:1;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:10px;margin-top:10px;gap:10px;"></div></div></div>`;
            }
            // classic
            return `<div id="render-target" style="width:600px;height:800px;background:${bg};display:flex;flex-direction:column;font-family:${fn};position:relative;">${brandingHtml}<div style="width:100%;height:450px;background:#e0e0e0;position:relative;overflow:hidden;"><div id="tpl-cal-photo" style="${imgStyle}"></div><div style="position:absolute;bottom:0;left:0;width:100%;height:150px;background:linear-gradient(to top,rgba(0,0,0,0.8),transparent);pointer-events:none;"></div><div style="position:absolute;bottom:20px;left:30px;"><h1 id="tpl-cal-title" style="color:#ffffff;font-size:3rem;margin:0;font-weight:800;text-transform:uppercase;">MONTH</h1><p id="tpl-cal-year" style="color:${ac};font-size:1.5rem;margin:0;font-weight:500;">2083</p></div></div><div style="flex:1;padding:30px;display:flex;flex-direction:column;"><div id="tpl-wall-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:8px;border-bottom:2px solid ${ac};padding-bottom:5px;font-size:0.9rem;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:5px;flex:1;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #ddd;padding-top:10px;margin-top:10px;gap:10px;"></div></div></div>`;
        }

        if (type === 'table-calendar') {
            if (style === 'minimal') {
                return `<div id="render-target" style="width:600px;height:400px;background:${bg};display:flex;flex-direction:column;font-family:${fn};border:1px solid #eee;">${brandingTableHtml}<div style="padding:12px 20px;border-bottom:3px solid ${ac};display:flex;align-items:baseline;gap:12px;"><h1 id="tpl-cal-title" style="color:${tc};font-size:2.2rem;margin:0;font-weight:800;text-transform:uppercase;line-height:1;">MONTH</h1><p id="tpl-cal-year" style="color:${ac};font-size:0.85rem;margin:0;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;">2083</p></div><div style="flex:1;padding:12px 20px;display:flex;flex-direction:column;overflow:hidden;"><div id="tpl-table-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:4px;font-size:0.72rem;flex-shrink:0;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:2px;flex:1;min-height:0;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #e0e0e0;padding-top:3px;margin-top:3px;gap:3px;flex-shrink:0;overflow:hidden;"></div></div></div>`;
            }
            if (style === 'dark') {
                return `<div id="render-target" style="width:600px;height:400px;background:#111827;display:flex;flex-direction:column;font-family:${fn};">${brandingTableHtml}<div style="padding:14px 20px;border-bottom:1px solid #374151;display:flex;align-items:baseline;gap:12px;"><h1 id="tpl-cal-title" style="color:#ffffff;font-size:2.2rem;margin:0;font-weight:800;text-transform:uppercase;line-height:1;">MONTH</h1><p id="tpl-cal-year" style="color:${ac};font-size:0.85rem;margin:0;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">2083</p></div><div style="flex:1;padding:12px 20px;display:flex;flex-direction:column;overflow:hidden;"><div id="tpl-table-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:4px;font-size:0.72rem;flex-shrink:0;color:#6b7280;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:2px;flex:1;min-height:0;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #374151;padding-top:3px;margin-top:3px;gap:3px;flex-shrink:0;overflow:hidden;"></div></div></div>`;
            }
            if (style === 'bold') {
                return `<div id="render-target" style="width:600px;height:400px;background:${bg};display:flex;font-family:${fn};">${brandingBoldSidebarHtml ? '' : brandingTableHtml}<div style="width:25%;background:${ac};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:15px;">${brandingBoldSidebarHtml}<h1 id="tpl-cal-title" style="color:#ffffff;font-size:1.6rem;margin:0;font-weight:900;text-transform:uppercase;writing-mode:vertical-rl;text-orientation:mixed;letter-spacing:0.1em;">MONTH</h1><p id="tpl-cal-year" style="color:rgba(255,255,255,0.7);font-size:0.65rem;margin:12px 0 0;font-weight:600;writing-mode:vertical-rl;letter-spacing:0.08em;">2083</p></div><div style="flex:1;padding:14px 18px;display:flex;flex-direction:column;overflow:hidden;"><div id="tpl-table-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:4px;font-size:0.72rem;flex-shrink:0;font-weight:700;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:2px;flex:1;min-height:0;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #e0e0e0;padding-top:3px;margin-top:3px;gap:3px;flex-shrink:0;overflow:hidden;"></div></div></div>`;
            }
            // classic
            return `<div id="render-target" style="width:600px;height:400px;background:${bg};display:flex;font-family:${fn};border:1px solid #ddd;"><div style="width:40%;height:100%;position:relative;overflow:hidden;"><div id="tpl-cal-photo" style="${imgStyle}"></div><div style="position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.2);pointer-events:none;"></div></div><div style="width:60%;padding:10px 15px;display:flex;flex-direction:column;background:#f9f9f9;overflow:hidden;">${brandingTableHtml}<div style="margin-bottom:6px;padding-bottom:6px;display:flex;flex-direction:column;align-items:center;position:relative;flex-shrink:0;"><h1 id="tpl-cal-title" style="color:#111;font-size:1.7rem;margin:0;font-weight:800;text-transform:uppercase;line-height:1;letter-spacing:0.05em;">MONTH</h1><p id="tpl-cal-year" style="color:${ac};font-size:0.65rem;margin:3px 0 0;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">2083</p><div style="position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:35px;height:2px;background:${ac};border-radius:2px;"></div></div><div id="tpl-table-cal-header" style="display:grid;grid-template-columns:repeat(7,1fr);text-align:center;margin-bottom:4px;font-size:0.65rem;flex-shrink:0;"><!-- header injected --></div><div id="tpl-cal-grid" style="display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(6,1fr);gap:1px;flex:1;min-height:0;"><!-- Dates injected here --></div><div id="tpl-cal-lists-container" style="display:flex;justify-content:space-between;border-top:1px solid #e0e0e0;padding-top:2px;margin-top:2px;gap:2px;flex-shrink:0;overflow:hidden;"></div></div></div>`;
        }
    }

    function updateStyleButtons(type) {
        const styleBtns = document.getElementById('style-btns');
        if (!styleBtns) return;
        const styles = [['classic','Classic'],['minimal','Minimal'],['dark','Dark'],['bold','Bold']];
        styleBtns.innerHTML = styles.map(([val, label]) =>
            `<button data-style="${val}" style="padding:0.3rem 0.8rem;font-size:0.72rem;border-radius:20px;cursor:pointer;background:${val===currentStyle?'var(--accent-amber)':'transparent'};color:${val===currentStyle?'#000':'var(--text-muted)'};border:1px solid ${val===currentStyle?'var(--accent-amber)':'var(--border-subtle)'};font-family:var(--font-body);transition:all 0.2s;">${label}</button>`
        ).join('');
        styleBtns.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                currentStyle = btn.getAttribute('data-style');
                updateStyleButtons(type);
                renderTemplate();
            });
        });
    }

    function generateCalendarGrid(year, monthIndex, lang) {
        const firstDay = new NepaliDate(year, monthIndex, 1).getDay();
        
        let daysInMonth = 32;
        for(let d=28; d<=32; d++) {
            try {
                let testDate = new NepaliDate(year, monthIndex, d);
                if(testDate.getMonth() !== monthIndex) {
                    daysInMonth = d - 1;
                    break;
                }
            } catch(e) {
                daysInMonth = d - 1;
                break;
            }
        }
        
        let gridHtml = '';
        for (let i = 0; i < firstDay; i++) {
            gridHtml += '<div style="padding: 10px; text-align: center; color: #ccc;"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isSaturday = new NepaliDate(year, monthIndex, day).getDay() === 6;
            const engDate = new NepaliDate(year, monthIndex, day).getEnglishDate();
            
            const evt = customEvents[`${monthIndex}-${day}`];
            const isHoliday = evt && evt.type === 'holiday';
            const isEvent = evt && evt.type === 'event';
            const eventName = evt ? evt.name : '';
            
            let color = (currentStyle === 'dark') ? '#ffffff' : '#111';
            let eventColor = (currentStyle === 'dark') ? '#ffffff' : '#111';
            
            if (isSaturday || isHoliday) color = '#ff3b30';
            
            if (isHoliday) eventColor = '#ff3b30';
            else if (isEvent) eventColor = '#007aff';

            let mainContent = '';
            let subContent = '';
            let holidayContent = evt ? `<div style="position: absolute; bottom: 8px; left: 0; width: 100%; font-size: 0.34rem; font-weight: 800; color: ${eventColor}; text-transform: uppercase; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px;">${eventName}</div>` : '';
            
            if (lang === 'nepali') {
                mainContent = toNepaliNum(day);
            } else if (lang === 'english') {
                mainContent = day;
            } else { // both
                mainContent = toNepaliNum(day);
                subContent = `<span style="position: absolute; bottom: 4px; right: 6px; font-size: 0.6rem; color: #888;">${engDate}</span>`;
            }

            gridHtml += `<div class="date-cell" data-day="${day}" style="padding: 10px; text-align: center; color: ${color}; position: relative; background: rgba(0,0,0,0.02); border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-direction: column; cursor: pointer;">
                <span style="font-size: 1.25rem; font-weight: 700; margin-top: ${isHoliday ? '-10px' : '0'}; pointer-events: none;">${mainContent}</span>
                ${holidayContent}
                ${subContent}
            </div>`;
        }
        // Pad to ensure 42 cells (6 weeks) for consistent alignment
        let cellCount = firstDay + daysInMonth;
        for (let i = cellCount; i < 42; i++) {
            gridHtml += '<div style="padding: 10px; text-align: center; color: #ccc;"></div>';
        }
        
        return gridHtml;
    }

    function generateTableCalendarGrid(year, monthIndex, lang) {
        const firstDay = new NepaliDate(year, monthIndex, 1).getDay();
        
        let daysInMonth = 32;
        for(let d=28; d<=32; d++) {
            try {
                let testDate = new NepaliDate(year, monthIndex, d);
                if(testDate.getMonth() !== monthIndex) {
                    daysInMonth = d - 1;
                    break;
                }
            } catch(e) {
                daysInMonth = d - 1;
                break;
            }
        }
        
        let gridHtml = '';
        for (let i = 0; i < firstDay; i++) {
            gridHtml += '<div style="padding: 5px; text-align: center; color: #ccc;"></div>';
        }
        
        for (let day = 1; day <= daysInMonth; day++) {
            const isSaturday = new NepaliDate(year, monthIndex, day).getDay() === 6;
            const engDate = new NepaliDate(year, monthIndex, day).getEnglishDate();

            const evt = customEvents[`${monthIndex}-${day}`];
            const isHoliday = evt && evt.type === 'holiday';
            const isEvent = evt && evt.type === 'event';
            const eventName = evt ? evt.name : '';
            
            let color = (currentStyle === 'dark') ? '#ffffff' : '#333';
            let eventColor = (currentStyle === 'dark') ? '#ffffff' : '#333';
            
            if (isSaturday || isHoliday) color = '#ff3b30';
            
            if (isHoliday) eventColor = '#ff3b30';
            else if (isEvent) eventColor = '#007aff';

            let mainContent = '';
            let subContent = '';
            let holidayContent = evt ? `<div style="position: absolute; bottom: 4px; left: 0; width: 100%; font-size: 0.28rem; font-weight: 800; color: ${eventColor}; text-transform: uppercase; line-height: 1.1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding: 0 4px;">${eventName}</div>` : '';

            if (lang === 'nepali') {
                mainContent = toNepaliNum(day);
            } else if (lang === 'english') {
                mainContent = day;
            } else { // both
                mainContent = toNepaliNum(day);
                subContent = `<span style="position: absolute; bottom: 2px; right: 2px; font-size: 0.45rem; color: #888;">${engDate}</span>`;
            }

            gridHtml += `<div class="date-cell" data-day="${day}" style="padding: 2px; text-align: center; color: ${color}; position: relative; display: flex; align-items: center; justify-content: center; flex-direction: column; cursor: pointer;">
                <span style="font-size: 0.9rem; font-weight: 600; margin-top: ${isHoliday ? '-3px' : '0'}; pointer-events: none;">${mainContent}</span>
                ${holidayContent}
                ${subContent}
            </div>`;
        }
        // Pad to ensure 42 cells (6 weeks) for consistent alignment
        let cellCount = firstDay + daysInMonth;
        for (let i = cellCount; i < 42; i++) {
            gridHtml += '<div style="padding: 2px; text-align: center; color: #ccc;"></div>';
        }

        return gridHtml;
    }

    function renderTemplate() {
        const type = selector.value;
        previewWrapper.innerHTML = buildTemplate(type, currentStyle);

        // Slider UI visibilities
        btnPrev.style.display = "block";
        btnNext.style.display = "block";
        controlsCalendar.style.display = "flex";

        const y = parseInt(calYear.value);
        const m = currentSlideIndex;
        const lang = calLang.value;
            
        let titleYear = y;
        if(lang === 'nepali' || lang === 'both') {
            titleYear = toNepaliNum(y);
        }
        
        const engYearString = `${y - 57} / ${y - 56}`;
        document.getElementById("tpl-cal-title").textContent = bsMonthNames[m];
        document.getElementById("tpl-cal-year").textContent = `${titleYear} BS (${engYearString})`;

        const gridContainer = document.getElementById("tpl-cal-grid");
        const headerColor = (currentStyle === 'dark') ? '#9ca3af' : '#444';
        const satColor = (currentStyle === 'dark') ? '#ef4444' : '#ff3b30';
        
        const headerHtml = `
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'आइत' : 'SUN'}</div>
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'सोम' : 'MON'}</div>
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'मंगल' : 'TUE'}</div>
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'बुध' : 'WED'}</div>
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'बिही' : 'THU'}</div>
        <div style="font-weight: 700; color: ${headerColor};">${lang === 'nepali' || lang === 'both' ? 'शुक्र' : 'FRI'}</div>
        <div style="font-weight: 700; color: ${satColor};">${lang === 'nepali' || lang === 'both' ? 'शनि' : 'SAT'}</div>
        `;
        
        if (type === "wall-calendar") {
            const wallHeader = document.getElementById("tpl-wall-cal-header");
            if (wallHeader) wallHeader.innerHTML = headerHtml;
            gridContainer.innerHTML = generateCalendarGrid(y, m, lang);
        } else {
            const tableHeader = document.getElementById("tpl-table-cal-header");
            if (tableHeader) tableHeader.innerHTML = headerHtml;
            gridContainer.innerHTML = generateTableCalendarGrid(y, m, lang);
        }

        const listsContainer = document.getElementById("tpl-cal-lists-container");
        if (listsContainer) {
            let holidaysHtml = '';
            let eventsHtml = '';
            for (let d = 1; d <= 32; d++) {
                const evt = customEvents[`${m}-${d}`];
                if (evt) {
                    const dayStr = lang === 'nepali' || lang === 'both' ? toNepaliNum(d) : d;
                    if (evt.type === 'holiday') {
                        holidaysHtml += `<div style="margin-bottom: 2px;"><strong>${dayStr}</strong> - ${evt.name}</div>`;
                    } else {
                        eventsHtml += `<div style="margin-bottom: 2px;"><strong>${dayStr}</strong> - ${evt.name}</div>`;
                    }
                }
            }
            listsContainer.innerHTML = `<div style="width: 48%; font-size: 0.55rem; color: #ff3b30; line-height: 1.2;">` +
                (holidaysHtml ? `<strong style="font-size: 0.65rem; display: block; margin-bottom: 3px; border-bottom: 1px solid #ff3b30; padding-bottom: 2px;">Public Holidays</strong>` + holidaysHtml : '') +
                `</div><div style="width: 48%; font-size: 0.55rem; color: #007aff; line-height: 1.2;">` +
                (eventsHtml ? `<strong style="font-size: 0.65rem; display: block; margin-bottom: 3px; border-bottom: 1px solid #007aff; padding-bottom: 2px;">Upcoming Events</strong>` + eventsHtml : '') + 
                `</div>`;
        }

        // Sync tuning sliders
        const tuning = getImageTuning(m);
        if (zoomInput) {
            zoomInput.value = tuning.zoom;
            labelZoom.textContent = tuning.zoom.toFixed(1) + 'x';
        }
        if (panXInput) {
            panXInput.value = tuning.x;
            labelPanX.textContent = tuning.x + '%';
        }
        if (panYInput) {
            panYInput.value = tuning.y;
            labelPanY.textContent = tuning.y + '%';
        }
    }

    function getImageTuning(m) {
        const item = monthImages[m];
        if (!item) return { zoom: 1, x: 50, y: 50 };
        return {
            zoom: item.zoom || 1,
            x: item.x !== undefined ? item.x : 50,
            y: item.y !== undefined ? item.y : 50
        };
    }

    function updateTuning(key, val) {
        const m = currentSlideIndex;
        if (!monthImages[m]) {
            monthImages[m] = { url: 'view.jpg' };
        }
        monthImages[m][key] = val;
        
        // Live update the image without full re-render for performance
        const img = document.getElementById("tpl-cal-photo");
        if (img) {
            const tuning = getImageTuning(m);
            img.style.backgroundPosition = `${tuning.x}% ${tuning.y}%`;
            img.style.transform = `scale(${tuning.zoom})`;
        }

        // Update labels
        if (key === 'zoom') labelZoom.textContent = parseFloat(val).toFixed(1) + 'x';
        if (key === 'x') labelPanX.textContent = val + '%';
        if (key === 'y') labelPanY.textContent = val + '%';
    }

    if (zoomInput) zoomInput.addEventListener('input', (e) => updateTuning('zoom', parseFloat(e.target.value)));
    if (panXInput) panXInput.addEventListener('input', (e) => updateTuning('x', parseInt(e.target.value)));
    if (panYInput) panYInput.addEventListener('input', (e) => updateTuning('y', parseInt(e.target.value)));
    if (btnResetImg) btnResetImg.addEventListener('click', () => {
        updateTuning('zoom', 1);
        updateTuning('x', 50);
        updateTuning('y', 50);
        if (zoomInput) zoomInput.value = 1;
        if (panXInput) panXInput.value = 50;
        if (panYInput) panYInput.value = 50;
    });

    selector.addEventListener("change", () => {
        currentStyle = 'classic';
        currentSlideIndex = 0;
        updateStyleButtons(selector.value);
        renderTemplate();
    });

    btnPrev.addEventListener("click", () => {
        currentSlideIndex = (currentSlideIndex === 0) ? 11 : currentSlideIndex - 1;
        renderTemplate();
    });
    btnNext.addEventListener("click", () => {
        currentSlideIndex = (currentSlideIndex === 11) ? 0 : currentSlideIndex + 1;
        renderTemplate();
    });

    calLang.addEventListener("change", renderTemplate);
    calYear.addEventListener("change", renderTemplate);

    const userFontEl = document.getElementById('user-font-input');
    const userAccentEl = document.getElementById('user-accent-color');
    const userTitleEl = document.getElementById('user-title-color');
    const userBgEl = document.getElementById('user-bg-color');
    if (userFontEl) userFontEl.addEventListener('change', () => { userFont = userFontEl.value; renderTemplate(); });
    if (userAccentEl) userAccentEl.addEventListener('input', () => { userAccent = userAccentEl.value; renderTemplate(); });
    if (userTitleEl) userTitleEl.addEventListener('input', () => { userTitleColor = userTitleEl.value; renderTemplate(); });
    if (userBgEl) userBgEl.addEventListener('input', () => { userBgColor = userBgEl.value; renderTemplate(); });

    // Branding listeners
    if (modeInput) modeInput.addEventListener('change', () => {
        calendarMode = modeInput.value;
        orgDetailsBox.style.display = (calendarMode === 'organization') ? 'flex' : 'none';
        renderTemplate();
    });
    if (nameInput) nameInput.addEventListener('input', () => {
        orgName = nameInput.value;
        renderTemplate();
    });
    if (logoInput) logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            orgLogoUrl = URL.createObjectURL(file);
            renderTemplate();
        }
    });

    calImage.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (file) {
            const currentTuning = getImageTuning(currentSlideIndex);
            monthImages[currentSlideIndex] = {
                url: URL.createObjectURL(file),
                zoom: currentTuning.zoom,
                x: currentTuning.x,
                y: currentTuning.y
            };
            renderTemplate();
        }
    });

    function getPdfConfig(typeLayout) {
        if (typeLayout === "wall-calendar") {
            return { obj: new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' }), w: 210, h: 297 };
        } else {
            return { obj: new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' }), w: 210, h: 148 };
        }
    }

    btnDownload.addEventListener("click", async () => {
        try {
            const type = selector.value;
            const originalText = btnDownload.innerHTML;
            btnDownload.disabled = true;

            const config = getPdfConfig(type);
            const pdf = config.obj;
            
            btnPrev.style.display = "none";
            btnNext.style.display = "none";

            for (let i = 0; i < 12; i++) {
                btnDownload.textContent = `Generating Page ${i + 1}/12...`;
                currentSlideIndex = i;
                renderTemplate();
                
                // Allow more time for high-res images to settle
                await new Promise(r => setTimeout(r, 500));
                
                const target = document.getElementById("render-target");
                const canvas = await html2canvas(target, {
                    scale: 2, 
                    useCORS: true,
                    backgroundColor: null,
                    allowTaint: true
                });
                
                const imgData = canvas.toDataURL('image/jpeg', 0.95);
                if (i > 0) pdf.addPage();
                pdf.addImage(imgData, 'JPEG', 0, 0, config.w, config. h);
            }
            
            currentSlideIndex = 0;
            renderTemplate();
            
            pdf.save(`Hemulen-${type}.pdf`);
            
            btnDownload.innerHTML = originalText;
            btnDownload.disabled = false;
        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF.");
            btnDownload.innerHTML = '<i class="fas fa-file-pdf" style="margin-right: 8px;"></i> Download PDF';
            btnDownload.disabled = false;
        }
    });

    // Modal Interaction
    const modalOverlay = document.getElementById('event-modal-overlay');
    const modalDayLabel = document.getElementById('modal-day-label');
    const modalEventName = document.getElementById('modal-event-name');
    const modalEventType = document.getElementById('modal-event-type');
    const modalBtnSave = document.getElementById('modal-btn-save');
    const modalBtnDelete = document.getElementById('modal-btn-delete');
    const modalBtnClose = document.getElementById('modal-btn-close');
    let activeModalDay = null;

    if (modalOverlay) {
        previewWrapper.addEventListener('click', (e) => {
            const cell = e.target.closest('.date-cell');
            if(cell && !btnDownload.disabled) {
                const day = parseInt(cell.getAttribute('data-day'));
                if(isNaN(day)) return;
                
                activeModalDay = day;
                const existing = customEvents[`${currentSlideIndex}-${day}`];
                
                modalDayLabel.textContent = cell.innerText.split('\n')[0].trim();
                modalEventName.value = existing ? existing.name : '';
                modalEventType.value = existing ? existing.type : 'event';
                
                modalOverlay.style.display = 'flex';
            }
        });

        modalBtnClose.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });

        modalBtnSave.addEventListener('click', () => {
            if(!activeModalDay) return;
            const name = modalEventName.value.trim();
            if(name) {
                customEvents[`${currentSlideIndex}-${activeModalDay}`] = {
                    type: modalEventType.value,
                    name: name
                };
            } else {
                delete customEvents[`${currentSlideIndex}-${activeModalDay}`];
            }
            modalOverlay.style.display = 'none';
            renderTemplate();
        });

        modalBtnDelete.addEventListener('click', () => {
            if(!activeModalDay) return;
            delete customEvents[`${currentSlideIndex}-${activeModalDay}`];
            modalOverlay.style.display = 'none';
            renderTemplate();
        });
    }

    updateStyleButtons(selector.value);
    renderTemplate();
})();
