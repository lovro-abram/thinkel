// === DATA ===
let currentQuotes = [];
let fallbackQuotes = {
    sl: [
        {"id": 1, "text": "Ne moreš spremeniti nekoga. Lahko jih poskušaš razumeti, jih opazuješ in poslušaš. Ko jih razumeš, jim lahko pomagaš, da se spremenijo.", "author": "Neznan avtor"},
        {"id": 2, "text": "Obstaja samo ena pot – sledi svojemu srcu.", "author": "Neznan avtor"},
        {"id": 3, "text": "Pozorno opazuj ljudi. Opazil boš, če nekaj skrivajo. Ne glede na to, ali hočejo ali ne, bo njihovo vedenje to razkrilo.", "author": "Neznan avtor"},
        {"id": 4, "text": "Ne nasprotuj brez razmišljanja idejam drugih. Poskušaj jih razumeti. Morda ti želijo pokazati nekaj, česar sam ne opažaš.", "author": "Neznan avtor"},
        {"id": 5, "text": "Če opaziš, da ljudje delajo čudne stvari, jih ne sprašuj, kako so to naredili, ker ti ne bodo povedali. Namesto tega jih natančno opazuj – razlog za njihov uspeh je razviden iz njihovih dejanj.", "author": "Neznan avtor"}
    ],
    en: [
        {"id": 1, "text": "You can't change someone. You can try to understand them, watch them, and listen to them. When you understand them, you can help them to change.", "author": "Anonymous"},
        {"id": 2, "text": "There is only one way - follow your heart.", "author": "Anonymous"},
        {"id": 3, "text": "Watch people carefully. You'll notice if someone is hiding something. Whether they want to or not, their behavior will give them away.", "author": "Anonymous"},
        {"id": 4, "text": "Don't mindlessly resist other people's ideas. Try to understand them. Maybe they want to show you something that you don't notice yourself.", "author": "Anonymous"},
        {"id": 5, "text": "If you notice people doing strange things, don't ask them how they did it because they won't tell you. Instead, observe them closely - the reason for their success is evident in their actions.", "author": "Anonymous"}
    ]
};

// === STATE ===
let currentQuote = {};
let itemToDelete = null;
let currentLang = 'en';
let currentSavedTab = 'fav';
let searchQuery = "";

// === LONG PRESS ===
let longPressTimer;
let isLongPress = false;
const LONG_PRESS_DURATION = 500;

// === TRANSLATIONS ===
const translations = {
    sl: {
        nav_today: "Domov", nav_saved: "Shranjeno", nav_settings: "Nastavitve",
        favorites: "Priljubljene", notes: "Zapiski",
        no_fav: "Ni shranjenih citatov.", no_notes: "Ni zapisanih misli.",
        settings: "Nastavitve", theme: "Tema", font_size: "Velikost pisave", language: "Jezik",
        dark: "Temna", light: "Svetla", small: "Majhna", medium: "Srednja", large: "Velika",
        backup: "Varnostna kopija", download_backup: "Prenesi backup", restore: "Obnovi iz backupa",
        today: "Danes", quote_on_day: "Citat na dan",
        my_thoughts: "Moje misli", save_close: "Shrani in zapri",
        delete_confirm_title: "Izbriši citat?", delete_confirm_text: "Ali ste prepričani, da želite ta citat trajno odstraniti iz vaših priljubljenih?",
        delete_note_title: "Izbriši zapisek?", delete_note_text: "Ali ste prepričani, da želite ta zapisek izbrisati?",
        cancel: "Prekliči", delete_yes: "Da, izbriši",
        share_quote: "Deli citat",
        share_download: "Prenesi sliko", share_copy_text: "Kopiraj citat",
        share_hint_download: "slika 9:16", share_hint_text: "besedilo + povezava",
        share_note: "Slika je v formatu 9:16 — primerna za Instagram Story ali wallpaper. Na telefonu gumb Deli takoj odpre sistemsko okno za deljenje s sliko in citatom.",
        copied: "Kopirano", added_fav: "Dodano med priljubljene", removed_fav: "Odstranjeno", removed_note: "Zapisek izbrisan.",
        toast_backup_success: "Backup uspešno prenesen.", toast_restore_success: "Podatki uspešno obnovljeni.",
        wallpaper_editor: "Urejevalnik ozadij", open_wallpaper: "Odpri urejevalnik",
        pwa_install_title: "Prenesi aplikacijo", pwa_install_desc: "Uporabljajte Thinkel kjerkoli, tudi brez povezave.", pwa_install_btn: "Namesti",
        empty_fav_title: "Ni še priljubljenih", no_results_sub: "Za iskani pojem ni zadetkov. Poskusite drugačno iskalno besedo.",
        empty_notes_title: "Ni še zapisanih misli",
        empty_cta: "Poglej današnji citat",
        image_creating: "Ustvarjam sliko...", image_saved: "Slika shranjena (9:16)", image_failed: "Slike ni bilo mogoče ustvariti.",
        quote_data_error: "Datoteke s citati ni bilo mogoče prebrati – prikazani so samo osnovni citati. Preverite JSON datoteko."
    },
    en: {
        nav_today: "Home", nav_saved: "Saved", nav_settings: "Settings",
        favorites: "Favorites", notes: "Notes",
        no_fav: "No saved quotes.", no_notes: "No thoughts written.",
        settings: "Settings", theme: "Theme", font_size: "Font Size", language: "Language",
        dark: "Dark", light: "Light", small: "Small", medium: "Medium", large: "Large",
        backup: "Backup Data", download_backup: "Download Backup", restore: "Restore Backup",
        today: "Today", quote_on_day: "Quote on this day",
        my_thoughts: "My Thoughts", save_close: "Save & Close",
        delete_confirm_title: "Remove Favorite?", delete_confirm_text: "Are you sure you want to remove this quote from your favorites?",
        delete_note_title: "Delete Note?", delete_note_text: "Are you sure you want to delete this thought?",
        cancel: "Cancel", delete_yes: "Yes, Delete",
        share_quote: "Share Quote",
        share_download: "Download image", share_copy_text: "Copy quote",
        share_hint_download: "9:16 image", share_hint_text: "text + link",
        share_note: "The image is 9:16 — perfect for an Instagram story or wallpaper. On phones, the Share button opens the system share sheet right away, with the image and the quote.",
        copied: "Copied", added_fav: "Added to favorites", removed_fav: "Removed from favorites", removed_note: "Note deleted.",
        toast_backup_success: "Backup downloaded successfully.", toast_restore_success: "Data restored successfully.",
        wallpaper_editor: "Wallpaper Editor", open_wallpaper: "Open Editor",
        pwa_install_title: "Download App", pwa_install_desc: "Use Thinkel anywhere, even offline.", pwa_install_btn: "Install",
        empty_fav_title: "Nothing saved yet", no_results_sub: "No matches for your search. Try a different term.",
        empty_notes_title: "No thoughts yet",
        empty_cta: "See today's quote",
        image_creating: "Creating image...", image_saved: "Image saved (9:16)", image_failed: "Could not create the image.",
        quote_data_error: "Quote file could not be read – showing built-in quotes only. Please check the JSON file."
    }
};

// Load quotes from JSON files
async function loadQuotes() {
    // Declared outside try so the catch block can reference fileName in its error message
    const lang = localStorage.getItem('lang') || 'en';
    currentLang = lang;
    const fileName = lang === 'sl' ? 'data/sl.citati.json' : 'data/en.citati.json';
    try {
        // cache: 'no-cache' => browser always revalidates with the server,
        // so JSON edits on Neocities appear after a simple reload (no hard-refresh needed)
        const response = await fetch(fileName, { cache: 'no-cache' });
        if (!response.ok) {
            throw new Error(`Could not load ${fileName}`);
        }
        
        const data = await response.json();
        currentQuotes = data.citati || data.quotes || [];

        // Basic migration if needed (ensuring all have 'text' and 'author');
        // preserves enrichment fields: category, tags, source, source_type, year
        currentQuotes = currentQuotes.map(q => {
            return {
                id: q.id,
                text: q.text || q.besedilo || "",
                author: q.author || (currentLang === 'sl' ? "Neznan avtor" : "Anonymous"),
                category: q.category || null,
                tags: Array.isArray(q.tags) ? q.tags : [],
                source: q.source || null,
                source_type: q.source_type || null,
                year: q.year || null
            };
        });

        return currentQuotes;
    } catch (error) {
        console.error(`Could not load ${fileName}. If the error is a SyntaxError, the JSON file itself is invalid ` +
            `(usually a missing comma or an unescaped " inside a value). The app is now showing built-in fallback quotes:`, error);
        // Fallback to hardcoded quotes
        currentQuotes = fallbackQuotes[currentLang] || fallbackQuotes.en;
        showToast(t('quote_data_error'));
        return currentQuotes;
    }
}

// === LONG PRESS HANDLERS ===
function handleTouchStart(e, id, type) {
    if (e.currentTarget.classList.contains('editing-mode')) return;
    isLongPress = false;
    
    longPressTimer = setTimeout(() => {
        isLongPress = true;
        showActionMenu(e.currentTarget, id, type);
    }, LONG_PRESS_DURATION);
}

function handleTouchEnd(e, id, type) {
    clearTimeout(longPressTimer);
    
    if (!isLongPress && type === 'note') {
        document.querySelectorAll('.long-press-active').forEach(el => el.classList.remove('long-press-active'));
        const target = e.currentTarget; 
        if (!target.classList.contains('editing-mode')) {
            openNotesModalForEdit(id);
        }
    }
}

function handleTouchMove() {
    clearTimeout(longPressTimer);
}

function showActionMenu(itemElement, id, type) {
    itemElement.classList.add('long-press-active');
    
    const actionRow = document.createElement('div');
    actionRow.className = 'action-row';
    
    if (type === 'fav') {
        actionRow.innerHTML = `
            <button class="btn btn-danger" style="padding: 8px 16px; font-size: 0.8rem;" onclick="confirmDeleteDirect('fav', ${id}, this)">
                ${t('delete_yes')}
            </button>
        `;
    } else {
        actionRow.innerHTML = `
            <button class="btn btn-secondary" style="padding: 8px 16px; font-size: 0.8rem;" onclick="editNoteDirect(${id}, this)">
                ${t('my_thoughts')}
            </button>
            <button class="btn btn-danger" style="padding: 8px 16px; font-size: 0.8rem;" onclick="confirmDeleteDirect('note', ${id}, this)">
                ${t('delete_yes')}
            </button>
        `;
    }
    
    itemElement.appendChild(actionRow);
    itemElement.classList.add('editing-mode');
}

function confirmDeleteDirect(type, id, btnElement) {
    const actionRow = btnElement.parentElement;
    const itemElement = actionRow.parentElement;
    
    itemElement.classList.remove('long-press-active', 'editing-mode');
    actionRow.remove();

    if (type === 'fav') {
        toggleFavorite(id);
    } else if (type === 'note') {
        localStorage.removeItem(`note_${id}`);
        showToast(t('removed_note'));
        renderSaved();
    }
}

function editNoteDirect(id, btnElement) {
    const actionRow = btnElement.parentElement;
    const itemElement = actionRow.parentElement;
    
    itemElement.classList.remove('long-press-active', 'editing-mode');
    actionRow.remove();
    
    openNotesModalForEdit(id);
}

// === SETTINGS ===
function loadSettings() {
    const font = localStorage.getItem('fontSize') || 'medium';
    const lang = localStorage.getItem('lang') || 'en';
    applyFontSize(font);
    applyLanguage(lang);
}

function updateControlUI(controlId, activeValue) {
    const container = document.getElementById(controlId);
    if (!container) return;
    
    const options = container.querySelectorAll('.segment-opt');
    const pill = container.querySelector('.segment-pill');
    const activeOpt = container.querySelector(`.segment-opt[data-value="${activeValue}"]`);

    if (activeOpt && pill) {
        pill.style.width = `${activeOpt.offsetWidth}px`;
        pill.style.transform = `translateX(${activeOpt.offsetLeft}px)`;

        options.forEach(opt => {
            const isActive = opt.getAttribute('data-value') === activeValue;
            opt.style.color = isActive ? 'var(--ink)' : 'var(--ink-soft)';
        });
    }
}

function changeFontSize(val) {
    localStorage.setItem('fontSize', val);
    applyFontSize(val);
    updateControlUI('font-control', val);
}

function applyFontSize(val) {
    const root = document.documentElement;
    document.body.classList.remove('font-small', 'font-medium', 'font-large');
    
    if (val === 'small') {
        root.style.setProperty('--base-font-size', '14px');
        root.style.setProperty('--quote-font-size', '1.4rem');
    } else if (val === 'large') {
        root.style.setProperty('--base-font-size', '18px');
        root.style.setProperty('--quote-font-size', '1.8rem');
    } else {
        root.style.setProperty('--base-font-size', '16px');
        root.style.setProperty('--quote-font-size', '1.6rem');
    }
}

async function changeLanguage(val) {
    localStorage.setItem('lang', val);
    await applyLanguage(val);
    updateControlUI('lang-control', val);
}

async function applyLanguage(val) {
    currentLang = val;
    await loadQuotes();
    updateTexts();
    if (typeof loadDailyQuote === 'function') loadDailyQuote();
    if (typeof renderSaved === 'function') renderSaved();
}

function updateTexts() {
    const t = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
    });
    
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.placeholder = currentLang === 'sl' ? "Iskanje..." : "Search...";
    }
    
    // Bilingual tab title, refined to the active language
    const page = document.body.getAttribute('data-page');
    const titles = {
        home:    { sl: 'Thinkel – Dnevna inspiracija', en: 'Thinkel – Daily Inspiration' },
        saved:   { sl: 'Shranjeno – Thinkel',          en: 'Saved – Thinkel' },
        settings:{ sl: 'Nastavitve – Thinkel',         en: 'Settings – Thinkel' }
    };
    if (page && titles[page]) {
        document.title = titles[page][currentLang] || titles[page].sl;
    }
}

function t(key) {
    return translations[currentLang][key] || key;
}

// === ATTRIBUTION HELPERS ===
// Builds the display line for a quote's origin:
//  - real author or paraphrase ("po X" / "after X") -> shown as author
//  - anonymous quote with a known source -> "iz filma X (2005)" / "from X (2005)"
//  - otherwise -> Neznan avtor / Anonymous
function isAnonymousAuthor(q) {
    return !q || !q.author || q.author === 'Anonymous' || q.author === 'Neznan avtor';
}

function getAttribution(q, withDash) {
    if (!q) return '';
    const prefix = withDash ? '- ' : '';
    if (!isAnonymousAuthor(q)) return prefix + q.author;
    if (q.source) {
        if (currentLang === 'sl') {
            const word = q.source_type === 'serija' ? 'iz serije'
                       : (q.source_type === 'knjiga' ? 'iz knjige' : 'iz filma');
            return prefix + word + ' ' + q.source + (q.year ? ` (${q.year})` : '');
        }
        return prefix + 'from ' + q.source + (q.year ? ` (${q.year})` : '');
    }
    return prefix + (currentLang === 'sl' ? 'Neznan avtor' : 'Anonymous');
}

// Small print under the author: original work title, shown when the quote is
// attributed to a person ("po X") AND we know the source work.
function getSourceNote(q) {
    if (!q || !q.source || isAnonymousAuthor(q)) return '';
    return q.source + (q.year ? `, ${q.year}` : '');
}

// Word-wrap helper for canvas text
function wrapCanvasText(ctx, text, maxW) {
    const words = text.split(' ');
    let line = '';
    const lines = [];
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > maxW && n > 0) {
            lines.push(line.trim());
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line.trim());
    return lines;
}

// === BACKUP ===
function exportBackup() {
    const favIds = JSON.parse(localStorage.getItem('favorites') || '[]');
    const favObjs = favIds.map(id => currentQuotes.find(q => q.id === id)).filter(q => q);
    const notes = [];
    currentQuotes.forEach(q => {
        const noteText = localStorage.getItem(`note_${q.id}`);
        if (noteText) notes.push({ quote: q, note: noteText });
    });
    const backupData = {
        version: 1,
        date: new Date().toISOString(),
        app: "Thinkel",
        favorites: favObjs,
        notes: notes
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkel_backup_${new Date().toISOString().split('T')[0]}.thinkel`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(t('toast_backup_success'));
}

function importBackup(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.favorites && Array.isArray(data.favorites)) {
                localStorage.setItem('favorites', JSON.stringify(data.favorites.map(q => q.id)));
            }
            if (data.notes && Array.isArray(data.notes)) {
                data.notes.forEach(item => {
                    if (item.quote && item.note) localStorage.setItem(`note_${item.quote.id}`, item.note);
                });
            }
            if (typeof loadDailyQuote === 'function') loadDailyQuote();
            if (typeof updateFavButtonState === 'function') updateFavButtonState();
            if (typeof renderSaved === 'function') renderSaved();
            showToast(t('toast_restore_success'));
        } catch (err) {
            alert("Neveljavna datoteka backupa.");
        }
    };
    reader.readAsText(file);
    input.value = '';
}

// === DATE HANDLING ===
function loadDate() {
    const now = new Date();
    updateDateDisplay(now);
}

function updateDateDisplay(dateObj) {
    const dateEl = document.getElementById('current-date');
    if (!dateEl) return;
    
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = dateObj.toLocaleDateString(currentLang === 'sl' ? 'sl-SI' : 'en-US', options);
    const formattedStr = dateStr.charAt(0).toLowerCase() + dateStr.slice(1);
    dateEl.textContent = formattedStr;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateObj);
    checkDate.setHours(0, 0, 0, 0);
    const label = document.getElementById('date-label');
    if (label) {
        if (checkDate.getTime() === today.getTime()) label.textContent = t('today');
        else label.textContent = t('quote_on_day');
    }
}

async function handleDateChange(dateString) {
    if (!dateString) return;
    
    const chosenDate = new Date(dateString);
    updateDateDisplay(chosenDate);
    
    // Make sure quotes are loaded
    if (currentQuotes.length === 0) {
        await loadQuotes();
    }
    
    // Stable daily quote selection: use year, month and day to create a seed
    const year = chosenDate.getFullYear();
    const month = chosenDate.getMonth();
    const day = chosenDate.getDate();

    // Simple hash function for date
    const seed = (year * 10000) + (month * 100) + day;
    const index = seed % currentQuotes.length;
    currentQuote = currentQuotes[index];
    
    const quoteTextEl = document.getElementById('daily-quote-text');
    const quoteAuthorEl = document.getElementById('daily-quote-author');
    if (quoteTextEl) quoteTextEl.textContent = `"${currentQuote.text}"`;
    if (quoteAuthorEl) quoteAuthorEl.textContent = getAttribution(currentQuote, true);
    
    const quoteSourceEl = document.getElementById('daily-quote-source');
    if (quoteSourceEl) {
        const note = getSourceNote(currentQuote);
        quoteSourceEl.textContent = note;
        quoteSourceEl.style.display = note ? 'block' : 'none';
    }
    
    if (typeof updateFavButtonState === 'function') updateFavButtonState();
}

async function loadDailyQuote() {
    await loadQuotes();
    const today = new Date();
    handleDateChange(today.toISOString().split('T')[0]);
}

// === FAVORITES ===
function toggleFavorite(id) {
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const index = favorites.indexOf(id);
    const btn = document.getElementById('btn-fav-daily');
    const icon = btn ? btn.querySelector('.material-icons-round') : null;
    
    if (index === -1) { 
        favorites.push(id); 
        showToast(t('added_fav'));
        if (icon) {
            icon.classList.add('anim-pop');
            setTimeout(() => icon.classList.remove('anim-pop'), 300);
        }
    } else { 
        favorites.splice(index, 1); 
        showToast(t('removed_fav')); 
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    if (typeof updateFavButtonState === 'function') updateFavButtonState();
    if (typeof renderSaved === 'function') renderSaved();
}

function updateFavButtonState() {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    const btn = document.getElementById('btn-fav-daily');
    if (!btn) return;
    
    const icon = btn.querySelector('.material-icons-round');
    if (favorites.includes(currentQuote.id)) {
        btn.classList.add('active');
        icon.textContent = 'favorite';
    } else {
        btn.classList.remove('active');
        icon.textContent = 'favorite_border';
    }
}

// === SHARE (v10) ===
// Phone/tablet: the share button opens the SYSTEM share sheet directly
// — the 9:16 image and the quote (author + link) travel together; the
// user only picks the app (Instagram story = one tap more).
// Desktop: the share button opens a modal with 2 options (download the
// image / copy the quote). The modal stays open until closed with ×.
function openShareModal() {
    if (!currentQuote || !currentQuote.text) return;
    const modal = document.getElementById('share-modal');
    const textSpan = document.getElementById('share-quote-text');
    const authorSpan = document.getElementById('share-quote-author');
    if (textSpan) textSpan.textContent = `"${currentQuote.text}"`;
    if (authorSpan) authorSpan.textContent = getAttribution(currentQuote, true);
    if (modal) modal.classList.add('open');
}

function closeShareModal() {
    const modal = document.getElementById('share-modal');
    if (modal) modal.classList.remove('open');
}

function buildShareText() {
    return `"${currentQuote.text}" ${getAttribution(currentQuote, true)}`.trim();
}

// Touch-primary device (phone/tablet)? Desktop pointers report
// hover:hover + pointer:fine, phones/tablets the opposite.
function isTouchPrimary() {
    return !!(window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches);
}

// Share button entry point.
async function onShareClick() {
    if (!currentQuote || !currentQuote.text) return;
    if (isTouchPrimary()) {
        await shareCurrentQuote();
        return;
    }
    openShareModal();
}

// Phone: straight to the system share sheet — image + quote + link.
async function shareCurrentQuote() {
    const url = window.location.origin + window.location.pathname;
    const text = `${buildShareText()}\n\n${url}`;
    showToast(t('image_creating'));
    const file = await createQuoteImageFile();
    if (!file) { showToast(t('image_failed')); return; }
    if (navigator.canShare && navigator.share && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({ files: [file], text });
            return;
        } catch (err) {
            if (err && err.name === 'AbortError') return; // user closed the sheet
            console.error('navigator.share failed:', err);
        }
    }
    // Old device without image sharing: offer the desktop-style modal
    // (download the image / copy the quote) as a fallback.
    openShareModal();
}

// Desktop modal actions. The modal deliberately STAYS OPEN so the user
// can use both options; it closes only via the × button.
async function shareDesktopAction(action) {
    const url = window.location.origin + window.location.pathname;

    if (action === 'download') {
        showToast(t('image_creating'));
        const file = await createQuoteImageFile();
        if (!file) { showToast(t('image_failed')); return; }
        downloadQuoteImage(file);
        showToast(t('image_saved'));
        return;
    }

    if (action === 'copy') {
        const fullText = `${buildShareText()}\n\n${url}`;
        try {
            await navigator.clipboard.writeText(fullText);
            showToast(t('copied'));
        } catch (err) {
            // Clipboard API can be denied (permission/focus) — legacy fallback
            try {
                const ta = document.createElement('textarea');
                ta.value = fullText;
                ta.style.position = 'fixed';
                ta.style.opacity = '0';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                ta.remove();
                showToast(t('copied'));
            } catch (err2) {
                console.error('clipboard failed:', err, err2);
                showToast(t('image_failed'));
            }
        }
    }
}

// === QUOTE AS IMAGE (9:16, ready for Instagram Story) ===
// Draws the neo-brutal 9:16 card on a canvas and returns it as a PNG
// File — used by the share modal. Returns null on failure.
async function createQuoteImageFile() {
    if (!currentQuote || !currentQuote.text) return null;
    try {
        if (document.fonts && document.fonts.ready) {
            try { await document.fonts.ready; } catch (e) { /* ignore */ }
        }
        const W = 1080, H = 1920;
        const c = document.createElement('canvas');
        c.width = W; c.height = H;
        const x = c.getContext('2d');

        // Rounded-rect helper (path, then fill/stroke by caller)
        const rr = (cx, cy, cw, ch, r) => {
            x.beginPath();
            x.moveTo(cx + r, cy);
            x.arcTo(cx + cw, cy, cx + cw, cy + ch, r);
            x.arcTo(cx + cw, cy + ch, cx, cy + ch, r);
            x.arcTo(cx, cy + ch, cx, cy, r);
            x.arcTo(cx, cy, cx + cw, cy, r);
            x.closePath();
        };

        // Neo-brutal card: flat sage canvas, hard ink frame + offset shadow
        const INK = '#12291A', CARD = '#FFFFFF', PAPER = '#F1F6EC';
        const GREEN = '#1CA85E', GOLD = '#A96A10';
        x.fillStyle = PAPER;
        x.fillRect(0, 0, W, H);

        const m = 96;                    // outer margin
        const cw = W - m * 2;            // card width
        const ct = 220;                  // card top
        const cb = H - 300;              // card bottom
        const ch = cb - ct;

        // hard offset shadow
        x.fillStyle = INK;
        rr(m + 26, ct + 26, cw, ch, 44);
        x.fill();

        // card face + border
        x.fillStyle = CARD;
        rr(m, ct, cw, ch, 44);
        x.fill();
        x.lineWidth = 12;
        x.strokeStyle = INK;
        rr(m, ct, cw, ch, 44);
        x.stroke();

        // Decorative oversized quotation mark (green, inside the card)
        x.fillStyle = 'rgba(28, 168, 94, 0.9)';
        x.textAlign = 'left';
        x.textBaseline = 'alphabetic';
        x.font = '700 300px "Playfair Display", serif';
        x.fillText('\u201C', m + 60, ct + 240);

        // Quote text (auto-shrinks to fit)
        let fs = 72;
        const maxW = cw - 140;
        const textTop = ct + 320;
        const textBottom = cb - 240;
        let lines;
        for (;;) {
            x.font = `400 ${fs}px "Playfair Display", serif`;
            lines = wrapCanvasText(x, currentQuote.text, maxW);
            if (lines.length * fs * 1.42 <= textBottom - textTop || fs <= 34) break;
            fs -= 4;
        }
        const lh = fs * 1.42;
        const centerY = (textTop + Math.min(textBottom, textTop + lines.length * lh)) / 2;
        const startY = centerY - (lines.length * lh) / 2 + lh / 2;
        x.fillStyle = INK;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        lines.forEach((ln, i) => x.fillText(ln, W / 2, startY + i * lh));

        // Attribution
        x.fillStyle = GOLD;
        x.font = 'italic 42px "Space Grotesk", sans-serif';
        x.textAlign = 'right';
        x.fillText(getAttribution(currentQuote, true), W - m - 90, cb - 110);

        // Branding footer: black pill with cream text
        const brand = currentLang === 'sl' ? 'THINKEL \u00B7 dnevna inspiracija' : 'THINKEL \u00B7 daily inspiration';
        x.font = '700 30px "Space Grotesk", sans-serif';
        const tw = x.measureText(brand).width;
        const pw = tw + 90, ph = 78, px = (W - pw) / 2, py = H - 220;
        x.fillStyle = INK;
        rr(px, py, pw, ph, ph / 2);
        x.fill();
        x.fillStyle = PAPER;
        x.textAlign = 'center';
        x.textBaseline = 'middle';
        x.fillText(brand, W / 2, py + ph / 2 + 2);

        const blob = await new Promise(res => c.toBlob(res, 'image/png'));
        if (!blob) throw new Error('toBlob failed');
        return new File([blob], 'thinkel-citat.png', { type: 'image/png' });
    } catch (err) {
        console.error('createQuoteImageFile failed:', err);
        return null;
    }
}

// Desktop fallback: download the PNG to the device
function downloadQuoteImage(file) {
    const url2 = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url2;
    a.download = 'thinkel-citat-9x16.png';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url2), 2000);
}

// === SAVED PAGE ===
function switchSavedTab(tab) {
    currentSavedTab = tab;
    const favTab = document.getElementById('tab-fav');
    const notesTab = document.getElementById('tab-notes');
    const favContainer = document.getElementById('saved-favorites-container');
    const notesContainer = document.getElementById('saved-notes-container');
    
    if (favTab) favTab.classList.toggle('active', tab === 'fav');
    if (notesTab) notesTab.classList.toggle('active', tab === 'notes');
    if (favContainer) favContainer.style.display = tab === 'fav' ? 'block' : 'none';
    if (notesContainer) notesContainer.style.display = tab === 'notes' ? 'block' : 'none';
    
    renderSaved();
}

function handleSearch(val) {
    searchQuery = val.toLowerCase();
    renderSaved();
}

async function renderSaved() {
    if (currentSavedTab === 'fav') await renderFavorites();
    else await renderNotes();
}

async function renderFavorites() {
    const listEl = document.getElementById('favorites-list');
    const emptyEl = document.getElementById('no-favorites');
    if (!listEl || !emptyEl) return;
    
    // Make sure quotes are loaded
    if (currentQuotes.length === 0) {
        await loadQuotes();
    }
    
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    listEl.innerHTML = '';
    
    const filteredFavs = favorites.map(id => currentQuotes.find(q => q.id === id))
                                 .filter(q => q && (q.text.toLowerCase().includes(searchQuery) || 
                                                   (q.author && q.author.toLowerCase().includes(searchQuery))));

    if (filteredFavs.length === 0) {
        emptyEl.style.display = 'block';
        const titleEl = emptyEl.querySelector('.empty-title');
        const subEl = emptyEl.querySelector('p');
        const ctaEl = emptyEl.querySelector('.btn');
        if (searchQuery && favorites.length > 0) {
            if (titleEl) titleEl.textContent = currentLang === 'sl' ? "Ni zadetkov" : "No results";
            if (subEl) subEl.textContent = t('no_results_sub');
            if (ctaEl) ctaEl.style.display = 'none';
        } else {
            if (titleEl) titleEl.textContent = t('empty_fav_title');
            if (subEl) subEl.textContent = t('no_fav');
            if (ctaEl) ctaEl.style.display = '';
        }
        return;
    }
    emptyEl.style.display = 'none';

    filteredFavs.forEach(quote => {
        const item = document.createElement('div');
        item.className = 'fav-item';
        
        item.onmousedown = (e) => handleTouchStart(e, quote.id, 'fav');
        item.onmouseup = (e) => handleTouchEnd(e, quote.id, 'fav');
        item.onmouseleave = () => clearTimeout(longPressTimer);
        item.ontouchstart = (e) => handleTouchStart(e, quote.id, 'fav');
        item.ontouchend = (e) => handleTouchEnd(e, quote.id, 'fav');
        item.ontouchmove = handleTouchMove;

        item.innerHTML = `
            <div class="fav-content">
                <div class="fav-quote">"${quote.text}"</div>
                <div class="fav-author">${getAttribution(quote, true)}</div>
            </div>
        `;
        listEl.appendChild(item);
    });
}

async function renderNotes() {
    const listEl = document.getElementById('notes-list');
    const emptyEl = document.getElementById('no-notes');
    if (!listEl || !emptyEl) return;
    
    // Make sure quotes are loaded
    if (currentQuotes.length === 0) {
        await loadQuotes();
    }
    
    listEl.innerHTML = '';
    
    const allNotes = [];
    currentQuotes.forEach(quote => {
        const note = localStorage.getItem(`note_${quote.id}`);
        if (note && note.trim().length > 0) {
            if (note.toLowerCase().includes(searchQuery) || 
                quote.text.toLowerCase().includes(searchQuery) ||
                (quote.author && quote.author.toLowerCase().includes(searchQuery))) {
                allNotes.push({ quote, note });
            }
        }
    });

    if (allNotes.length === 0) {
        emptyEl.style.display = 'block';
        const titleEl = emptyEl.querySelector('.empty-title');
        const subEl = emptyEl.querySelector('p');
        const ctaEl = emptyEl.querySelector('.btn');
        if (searchQuery) {
            if (titleEl) titleEl.textContent = currentLang === 'sl' ? "Ni zadetkov" : "No results";
            if (subEl) subEl.textContent = t('no_results_sub');
            if (ctaEl) ctaEl.style.display = 'none';
        } else {
            if (titleEl) titleEl.textContent = t('empty_notes_title');
            if (subEl) subEl.textContent = t('no_notes');
            if (ctaEl) ctaEl.style.display = '';
        }
    } else {
        emptyEl.style.display = 'none';
    }

    allNotes.forEach(({ quote, note }) => {
        const item = document.createElement('div');
        item.className = 'note-item';
        
        item.onmousedown = (e) => handleTouchStart(e, quote.id, 'note');
        item.onmouseup = (e) => handleTouchEnd(e, quote.id, 'note');
        item.onmouseleave = () => clearTimeout(longPressTimer);
        item.ontouchstart = (e) => handleTouchStart(e, quote.id, 'note');
        item.ontouchend = (e) => handleTouchEnd(e, quote.id, 'note');
        item.ontouchmove = handleTouchMove;

        item.innerHTML = `
            <div class="note-content">
                <span class="note-quote-ref">"${quote.text}"</span>
                <div class="note-author">${getAttribution(quote, true)}</div>
                <div class="note-body">${escapeHtml(note)}</div>
            </div>
        `;
        listEl.appendChild(item);
    });
}

// === MODALS ===
function openNotesModalForEdit(quoteId) {
    const quote = currentQuotes.find(q => q.id === quoteId);
    if (!quote) return;
    currentQuote = quote;
    
    const modal = document.getElementById('notes-modal');
    const textArea = document.getElementById('modal-note-input');
    const savedNote = localStorage.getItem(`note_${quoteId}`);
    textArea.value = savedNote || "";
    
    updateModalQuoteRef(quote);
    
    modal.classList.add('open');
    setTimeout(() => textArea.focus(), 100);
}

function openNotesModal() {
    const modal = document.getElementById('notes-modal');
    const textArea = document.getElementById('modal-note-input');
    const savedNote = localStorage.getItem(`note_${currentQuote.id}`);
    textArea.value = savedNote || "";
    
    updateModalQuoteRef(currentQuote);
    
    modal.classList.add('open');
    setTimeout(() => textArea.focus(), 100);
}

function updateModalQuoteRef(quote) {
    const refDiv = document.getElementById('modal-quote-ref');
    const textSpan = document.getElementById('modal-quote-text');
    const authorSpan = document.getElementById('modal-quote-author');
    
    if (refDiv) refDiv.style.display = 'flex';
    if (textSpan) textSpan.textContent = `"${quote.text}"`;
    if (authorSpan) authorSpan.textContent = getAttribution(quote, true);
}

function closeNotesModal() {
    const modal = document.getElementById('notes-modal');
    if (modal) modal.classList.remove('open');
    if (typeof renderSaved === 'function') renderSaved();
}

function saveNoteFromModal() {
    const textArea = document.getElementById('modal-note-input');
    const text = textArea.value;
    localStorage.setItem(`note_${currentQuote.id}`, text);
}

function showDeleteModal(type, id) {
    itemToDelete = { type, id };
    const modalTitle = document.getElementById('delete-modal-title');
    const modalText = document.getElementById('delete-modal-text');
    if (type === 'fav') {
        if (modalTitle) modalTitle.textContent = t('delete_confirm_title');
        if (modalText) modalText.textContent = t('delete_confirm_text');
    } else {
        if (modalTitle) modalTitle.textContent = t('delete_note_title');
        if (modalText) modalText.textContent = t('delete_note_text');
    }
    const modal = document.getElementById('delete-modal');
    if (modal) modal.classList.add('open');
}

function closeDeleteModal(event, force = false) {
    if (force || (event && event.target.id === 'delete-modal')) {
        const modal = document.getElementById('delete-modal');
        if (modal) modal.classList.remove('open');
        itemToDelete = null;
    }
}

function confirmDelete() {
    if (!itemToDelete) return;
    if (itemToDelete.type === 'fav') {
        toggleFavorite(itemToDelete.id);
    } else if (itemToDelete.type === 'note') {
        localStorage.removeItem(`note_${itemToDelete.id}`);
        showToast(t('removed_note'));
        if (typeof renderSaved === 'function') renderSaved();
    }
    closeDeleteModal(null, true);
}

// === UTILITIES ===
function showToast(msg) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toastMessage) toastMessage.textContent = msg;
    if (toast) {
        toast.classList.add('show');
        setTimeout(() => { toast.classList.remove('show'); }, 3000);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker registered', reg))
            .catch(err => console.error('Service Worker registration failed', err));
    });
}

// PWA Installation handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('install-pwa-btn');
    if (installBtn) installBtn.style.display = 'flex';
});

async function installPWA() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
        const installBtn = document.getElementById('install-pwa-btn');
        if (installBtn) installBtn.style.display = 'none';
    }
    deferredPrompt = null;
}

window.addEventListener('appinstalled', () => {
    const installBtn = document.getElementById('install-pwa-btn');
    if (installBtn) installBtn.style.display = 'none';
    deferredPrompt = null;
});