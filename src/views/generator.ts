export function getGeneratorHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anime Counter - Serverless Profile View Counter</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  
  <style>
    /* CSS Variables for Premium Dark Developer Theme */
    :root {
      --bg-main: #080C14;
      --bg-card: #0F1622;
      --bg-input: #070B12;
      --border-color: #1F293D;
      --accent-color: #38BDF8;
      --accent-hover: #0EA5E9;
      --text-header: #F8FAFC;
      --text-main: #E2E8F0;
      --text-muted: #94A3B8;
      --code-color: #38BDF8;
    }
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    
    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      min-height: 100vh;
      line-height: 1.5;
      padding: 48px 24px;
    }
    
    .container {
      max-width: 1100px;
      margin: 0 auto;
    }
    
    /* Header Section */
    header {
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--border-color);
    }
    
    header h1 {
      font-size: 2.4rem;
      font-weight: 700;
      color: var(--text-header);
      margin-bottom: 8px;
      letter-spacing: -0.02em;
    }
    
    header p {
      color: var(--text-muted);
      font-size: 1.05rem;
    }
    
    /* Main Dashboard Grid */
    .grid {
      display: grid;
      grid-template-columns: 1.3fr 1fr;
      gap: 28px;
      align-items: start;
      margin-bottom: 48px;
    }
    
    /* Responsive grid collapse */
    @media (max-width: 900px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
    
    /* CRITICAL FIX: Prevent grid columns from stretching due to long content */
    .grid-column {
      min-width: 0;
      width: 100%;
    }
    
    /* Card Component */
    .card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 28px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    
    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-header);
      margin-bottom: 24px;
      padding-bottom: 12px;
      border-bottom: 1px solid var(--border-color);
    }
    
    /* Form Layout & Inputs */
    .form-group {
      margin-bottom: 18px;
    }
    
    .form-group label {
      display: block;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }
    
    .input-control {
      width: 100%;
      height: 42px;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0 14px;
      color: var(--text-main);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    
    .input-control:focus {
      border-color: var(--accent-color);
      box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.15);
    }
    
    select.input-control {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
      background-position: right 12px center;
      background-repeat: no-repeat;
      background-size: 18px;
      padding-right: 36px;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    
    /* Segmented Grid Theme Selector */
    .theme-picker {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(105px, 1fr));
      gap: 8px;
    }
    
    .theme-option {
      cursor: pointer;
      border: 1px solid var(--border-color);
      background: var(--bg-input);
      border-radius: 6px;
      padding: 10px 6px;
      text-align: center;
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-muted);
      user-select: none;
      transition: all 0.15s ease;
    }
    
    .theme-option:hover {
      border-color: var(--text-muted);
      color: var(--text-main);
    }
    
    .theme-option.active {
      border-color: var(--accent-color);
      color: var(--accent-color);
      background: rgba(56, 189, 248, 0.06);
    }
    
    /* Slider Custom Styling */
    .slider-container {
      display: flex;
      align-items: center;
      gap: 12px;
      height: 42px;
    }
    
    .slider-input {
      flex: 1;
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      outline: none;
      accent-color: var(--accent-color);
      cursor: pointer;
    }
    
    .slider-value {
      min-width: 32px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-header);
      text-align: right;
    }
    
    /* Custom Checkbox Group */
    .checkbox-group {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      user-select: none;
      margin-top: 6px;
    }
    
    .checkbox-group input {
      width: 17px;
      height: 17px;
      accent-color: var(--accent-color);
      cursor: pointer;
    }
    
    .checkbox-group span {
      font-size: 0.9rem;
      color: var(--text-main);
    }
    
    /* Preview Container */
    .preview-box {
      background: #070B12;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      height: 150px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 24px;
      position: relative;
    }
    
    .preview-box::before {
      content: 'LIVE PREVIEW';
      position: absolute;
      top: 10px;
      left: 12px;
      font-size: 0.7rem;
      font-weight: 600;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }
    
    .preview-box img {
      max-height: 80px;
      max-width: 85%;
      object-fit: contain;
    }
    
    /* Embed Code Fields */
    .code-title {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 6px;
      letter-spacing: 0.05em;
    }
    
    .code-wrapper {
      position: relative;
      margin-bottom: 16px;
      width: 100%;
    }
    
    .code-container {
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 12px 75px 12px 12px;
      width: 100%;
      min-height: 44px;
      display: flex;
      align-items: center;
      overflow: hidden; /* Hide outer container overflow to contain text */
    }
    
    .code-text {
      font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
      font-size: 0.85rem;
      color: var(--code-color);
      overflow-x: auto; /* Enable scrollbar only on the text block */
      white-space: nowrap;
      width: 100%;
      padding-bottom: 2px;
    }
    
    /* Styled Scrollbar for code blocks */
    .code-text::-webkit-scrollbar {
      height: 4px;
    }
    .code-text::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 2px;
    }
    
    .btn-copy {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      height: 28px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0 12px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .btn-copy:hover {
      border-color: var(--text-muted);
      background: var(--border-color);
    }
    
    /* Toggle Sections animations */
    .conditional-section {
      display: none;
      animation: fadeIn 0.2s ease forwards;
    }
    
    .conditional-section.show {
      display: block;
    }
    
    /* Gallery Section */
    .showcase {
      margin-top: 36px;
    }
    
    .showcase h2 {
      font-size: 1.3rem;
      font-weight: 600;
      color: var(--text-header);
      margin-bottom: 20px;
    }
    
    .showcase-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
      gap: 16px;
    }
    
    .showcase-item {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 16px;
      text-align: center;
      transition: border-color 0.2s ease;
    }
    
    .showcase-item:hover {
      border-color: var(--text-muted);
    }
    
    .showcase-name {
      font-weight: 500;
      font-size: 0.85rem;
      margin-bottom: 12px;
      text-transform: capitalize;
      color: var(--text-header);
    }
    
    .showcase-preview {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 60px;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 6px;
      padding: 6px;
    }
    
    .showcase-preview img {
      max-height: 100%;
      max-width: 100%;
      object-fit: contain;
    }
    
    /* Footer */
    footer {
      text-align: center;
      margin-top: 64px;
      color: var(--text-muted);
      font-size: 0.8rem;
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
    }
    
    footer a {
      color: var(--accent-color);
      text-decoration: none;
    }
    
    footer a:hover {
      text-decoration: underline;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
</head>
<body>

  <div class="container">
    <header>
      <h1>Anime Counter</h1>
      <p>A minimalist, secure and ultra-stable serverless view counter badge.</p>
    </header>
    
    <div class="grid">
      <!-- Left Column: Configuration Form -->
      <div class="grid-column">
        <div class="card">
          <h2 class="card-title">Configuration</h2>
          
          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" id="username" class="input-control" value="luluwux" placeholder="Enter username...">
          </div>
          
          <div class="form-group">
            <label>Theme</label>
            <div class="theme-picker" id="themeSelector">
              <div class="theme-option active" data-theme="flat">Flat</div>
              <div class="theme-option" data-theme="naruto">Naruto</div>
              <div class="theme-option" data-theme="onepiece">One Piece</div>
              <div class="theme-option" data-theme="bleach">Bleach</div>
              <div class="theme-option" data-theme="dragonball">Dragonball</div>
              <div class="theme-option" data-theme="aot">AOT</div>
              <div class="theme-option" data-theme="adventuretime">Adventure Time</div>
              <div class="theme-option" data-theme="gumball">Gumball</div>
              <div class="theme-option" data-theme="l">Death Note (L)</div>
              <div class="theme-option" data-theme="monster">Monster</div>
            </div>
          </div>
          
          <!-- Shared parameters row -->
          <div class="form-row">
            <div class="form-group">
              <label for="scale">Scale</label>
              <div class="slider-container">
                <input type="range" id="scale" min="0.5" max="2.0" step="0.1" value="1.0" class="slider-input">
                <span class="slider-value" id="scaleVal">1.0x</span>
              </div>
            </div>
            <div class="form-group">
              <label for="num">Static Number (Optional)</label>
              <input type="number" id="num" class="input-control" placeholder="0 (Auto-increment)" min="0">
            </div>
          </div>
          
          <div class="form-group">
            <label class="checkbox-group" for="pixelated">
              <input type="checkbox" id="pixelated" checked>
              <span>Enable Pixelated Mode (Crisp retro rendering)</span>
            </label>
          </div>
          
          <!-- Flat Theme Specific Options -->
          <div id="flatSettings" class="conditional-section show">
            <div class="form-group">
              <label for="icon">Emoji Icon</label>
              <input type="text" id="icon" class="input-control" value="🔥" placeholder="e.g. 🚀, 🔥, ❤️ or leave empty">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="color">Text Color Hex</label>
                <input type="text" id="color" class="input-control" value="c9d1d9" placeholder="c9d1d9">
              </div>
              <div class="form-group">
                <label for="bg">BG Color Hex</label>
                <input type="text" id="bg" class="input-control" value="21262d" placeholder="21262d">
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="stroke">Stroke Color Hex</label>
                <input type="text" id="stroke" class="input-control" value="30363d" placeholder="30363d">
              </div>
              <div class="form-group">
                <label for="animation">Animation</label>
                <select id="animation" class="input-control">
                  <option value="none">None</option>
                  <option value="pulse" selected>Pulse</option>
                  <option value="fade">Fade</option>
                  <option value="slide">Slide</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Image Theme Specific Options -->
          <div id="imageSettings" class="conditional-section">
            <div class="form-group">
              <label for="length">Padding Length</label>
              <div class="slider-container">
                <input type="range" id="length" min="1" max="16" value="7" class="slider-input">
                <span class="slider-value" id="lengthVal">7 digits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Right Column: Preview & Embed Codes -->
      <div class="grid-column">
        <div class="card">
          <h2 class="card-title">Live Preview</h2>
          
          <div class="preview-box">
            <img id="previewImg" src="/@luluwux?theme=flat&animation=pulse&icon=%F0%9F%94%A5&pixelated=1&render=true" alt="Counter Preview">
          </div>
          
          <h2 class="card-title" style="border: none; margin-bottom: 12px; padding-bottom: 0;">Embed Codes</h2>
          
          <div class="code-title">Markdown (GitHub Profile)</div>
          <div class="code-wrapper">
            <div class="code-container">
              <span class="code-text" id="mdCode">![Visitor Counter](...)</span>
            </div>
            <button class="btn-copy" onclick="copyText('mdCode')">Copy</button>
          </div>
          
          <div class="code-title">HTML (Websites)</div>
          <div class="code-wrapper">
            <div class="code-container">
              <span class="code-text" id="htmlCode">&lt;img src="..." alt="Counter" /&gt;</span>
            </div>
            <button class="btn-copy" onclick="copyText('htmlCode')">Copy</button>
          </div>
          
          <div class="code-title">Direct URL</div>
          <div class="code-wrapper">
            <div class="code-container">
              <span class="code-text" id="urlCode">https://...</span>
            </div>
            <button class="btn-copy" onclick="copyText('urlCode')">Copy</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Showcase Gallery Section -->
    <div class="showcase">
      <h2>Image Themes Gallery</h2>
      <div class="showcase-grid" id="showcaseGrid">
        <!-- Showcase items will be dynamically generated -->
      </div>
    </div>
    
    <footer>
      <p>Created by <a href="https://github.com/luluwux" target="_blank">luluwux</a> &amp; luppux. Hosted on Cloudflare Workers.</p>
    </footer>
  </div>

  <script>
    const themeSelector = document.getElementById('themeSelector');
    const flatSettings = document.getElementById('flatSettings');
    const imageSettings = document.getElementById('imageSettings');
    
    // Sliders & inputs
    const lengthInput = document.getElementById('length');
    const lengthVal = document.getElementById('lengthVal');
    const scaleInput = document.getElementById('scale');
    const scaleVal = document.getElementById('scaleVal');
    const numInput = document.getElementById('num');
    const pixelatedInput = document.getElementById('pixelated');
    const previewImg = document.getElementById('previewImg');
    
    const usernameInput = document.getElementById('username');
    const iconInput = document.getElementById('icon');
    const colorInput = document.getElementById('color');
    const bgInput = document.getElementById('bg');
    const strokeInput = document.getElementById('stroke');
    const animationInput = document.getElementById('animation');
    
    let activeTheme = 'flat';
    let debounceTimer;

    // Theme selector click handler
    themeSelector.addEventListener('click', (e) => {
      const option = e.target.closest('.theme-option');
      if (!option) return;
      
      document.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      activeTheme = option.dataset.theme;
      
      if (activeTheme === 'flat') {
        flatSettings.classList.add('show');
        imageSettings.classList.remove('show');
      } else {
        flatSettings.classList.remove('show');
        imageSettings.classList.add('show');
      }
      
      updatePreview();
    });

    // Event listeners
    [usernameInput, iconInput, colorInput, bgInput, strokeInput, numInput].forEach(input => {
      input.addEventListener('input', () => debounceUpdate());
    });
    
    animationInput.addEventListener('change', () => updatePreview());
    pixelatedInput.addEventListener('change', () => updatePreview());
    
    scaleInput.addEventListener('input', (e) => {
      scaleVal.innerText = parseFloat(e.target.value).toFixed(1) + 'x';
      debounceUpdate();
    });
    
    lengthInput.addEventListener('input', (e) => {
      lengthVal.innerText = e.target.value + ' digits';
      debounceUpdate();
    });

    function debounceUpdate() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updatePreview, 250);
    }

    function updatePreview() {
      const username = usernameInput.value.replace(/[^a-zA-Z0-9-_]/g, '') || 'luluwux';
      const baseUrl = window.location.origin + '/@' + username;
      
      let params = new URLSearchParams();
      
      if (scaleInput.value !== '1.0') {
        params.append('scale', scaleInput.value);
      }
      if (numInput.value !== '') {
        params.append('num', numInput.value);
      }
      if (!pixelatedInput.checked) {
        params.append('pixelated', '0');
      }
      
      if (activeTheme === 'flat') {
        params.append('theme', 'flat');
        if (iconInput.value) params.append('icon', iconInput.value);
        if (colorInput.value) params.append('color', colorInput.value);
        if (bgInput.value) params.append('bg', bgInput.value);
        if (strokeInput.value) params.append('stroke', strokeInput.value);
        if (animationInput.value !== 'none') params.append('animation', animationInput.value);
      } else {
        params.append('theme', activeTheme);
        params.append('length', lengthInput.value);
      }

      // Preview should not increment the counter, add render=true
      let previewParams = new URLSearchParams(params);
      previewParams.append('render', 'true');
      
      const queryStr = params.toString() ? '?' + params.toString() : '';
      const previewQueryStr = previewParams.toString() ? '?' + previewParams.toString() : '';
      
      const targetUrl = baseUrl + queryStr;
      const previewUrl = baseUrl + previewQueryStr;

      // Update Preview Image
      previewImg.src = previewUrl;

      // Update code blocks safely without shifting layout
      document.getElementById('mdCode').innerText = \`![Visitor Counter](\\ \${targetUrl} \\)\`.replace(/\\\\/g, '');
      document.getElementById('htmlCode').innerText = \`<img src="\${targetUrl}" alt="Counter" />\`;
      document.getElementById('urlCode').innerText = targetUrl;
    }

    function copyText(elementId) {
      const text = document.getElementById(elementId).innerText;
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector(\`#\${elementId}\`).closest('.code-wrapper').querySelector('.btn-copy');
        const originalText = btn.innerText;
        btn.innerText = 'Copied!';
        btn.style.background = '#2ea44f';
        btn.style.borderColor = '#2ea44f';
        btn.style.color = '#ffffff';
        
        setTimeout(() => {
          btn.innerText = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.color = '';
        }, 1500);
      });
    }

    function generateGallery() {
      const showcaseGrid = document.getElementById('showcaseGrid');
      const themes = [
        { name: 'naruto', title: 'Naruto' },
        { name: 'onepiece', title: 'One Piece' },
        { name: 'bleach', title: 'Bleach' },
        { name: 'dragonball', title: 'Dragonball' },
        { name: 'aot', title: 'AOT' },
        { name: 'adventuretime', title: 'Adventure Time' },
        { name: 'gumball', title: 'Gumball' },
        { name: 'l', title: 'Death Note (L)' },
        { name: 'monster', title: 'Monster' }
      ];

      showcaseGrid.innerHTML = themes.map(t => {
        const previewUrl = window.location.origin + '/@demo-' + t.name + '?theme=' + t.name + '&length=5&pixelated=1&render=true';
        return \`
          <div class="showcase-item">
            <div class="showcase-name">\${t.title}</div>
            <div class="showcase-preview">
              <img src="\${previewUrl}" alt="\${t.title} preview" loading="lazy">
            </div>
          </div>
        \`;
      }).join('');
    }

    updatePreview();
    window.addEventListener('load', generateGallery);
  </script>
</body>
</html>`;
}
