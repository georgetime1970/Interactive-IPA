# Copilot Instructions for Interactive-IPA

## Project Overview

**Interactive-IPA** is a minimalist, ad-free IPA (International Phonetic Alphabet) and KK phonetic transcription learning tool for English pronunciation.

- **Core Purpose**: Interactive sound reference with example words and visual feedback
- **Technology Stack**: Vanilla JavaScript (ES6 modules), plain HTML/CSS, no build tools
- **Deployment Model**: Progressive Web App (PWA) with offline support via Service Worker
- **Target Users**: English learners seeking pronunciation guidance

## Architecture

### Three-Page Structure

- **`index.html`**: IPA phonetics (vowels/consonants grouped by articulation)
- **`alphabet.html`**: English alphabet pronunciation with IPA/KK notation
- **`about.html`**: Project information and usage guide

### Data Flow Pattern

1. HTML pages fetch JSON data files (`data/ipa.json`, `data/alphabet.json`)
2. JavaScript dynamically renders DOM from data structure
3. Click events trigger audio playback from `media/` directory (`.mp3` for IPA, `.aac` for alphabet)
4. State management via module-level variables (e.g., `latest_mp3`, `latest_item_el`)

### Key Data Structures

**IPA Data** (`data/ipa.json`):

```json
{
  "元音": {
    "前元音": [
      { "ipa": "i:", "word": "bean", "src": "sound_i", "like": "E——" }
    ]
  },
  "辅音": { ... }
}
```

**Alphabet Data** (`data/alphabet.json`):

```json
{
  "A": { "src": "A", "ipa": "/eɪ/", "kk": "/æ/", "more": [["/æ/", "/ei/"]] }
}
```

### Component Architecture

- **Common Components** (`components/`): Navbar + Footer loaded via `loadComponent()` in `common.js`
- **Responsive Design**: Desktop/mobile-specific stylesheets + media queries
  - `common768.css`, `media768.css`, `alphabet768.css`, `about768.css` for screens ≤768px
  - `hover.css` for devices supporting hover (desktop)

## Development Patterns

### Audio Playback Pattern

1. **Single Global Audio Instance**: `latest_mp3` prevents overlapping sounds
2. **Event Cleanup**: `cleanupAudioListener()` prevents memory leaks from multiple `ended` listeners
3. **Visual Feedback**: `.playing` and `.active` classes trigger CSS animations
4. **Custom Rendering**: `--like-text` CSS variable displays phonetic hints

Example from `index.js`:

```javascript
latest_mp3.src = `./media/${id}.mp3`
cleanupAudioListener()
latest_mp3.play()
playEl.classList.add('playing')
latest_mp3.addEventListener('ended', handleAudioEnded)
```

### Responsive Navigation Pattern

Mobile nav controlled by state class toggle:

- `.menu-btn.active` toggles `.downBar.active` visibility
- Title auto-set from page `<title>` tag (e.g., "IPA 表 - ..." → "IPA 表")
- Desktop nav active color updates based on current page title match

### DOM Rendering Pattern

All content is generated dynamically:

```javascript
// Never modify static HTML - always use nested Object.keys() loops
Object.keys(ipa).forEach((category) => {
  Object.keys(ipa[category]).forEach((subcategory) => {
    ipa[category][subcategory].forEach((item) => {
      // Create and append elements
    })
  })
})
```

## Technical Constraints

1. **No Build Tools**: Raw ES6 modules only - no bundlers, transpilers, or preprocessors
2. **Audio File Formats**:
   - IPA sounds: `.mp3` files stored as `media/sound_*.mp3`
   - Alphabet: `.aac` files stored as `media/zhou/A.aac`, etc.
3. **Service Worker**: Minimal (`sw.js`) - only required for PWA manifest; doesn't cache strategically
4. **Module Scope**: Shared state (audio, DOM refs) stored as module-level variables

## Common Tasks & Workflows

### Adding New Phonetic Data

1. Add entry to `data/ipa.json` (or `alphabet.json`)
2. Record audio as `.mp3` and save to `media/sound_*.mp3` (match `src` field)
3. Tests: Navigate to page, click item, verify audio plays with correct visual state

### Styling Updates

- Always include both desktop and `768px` media query versions
- Hover effects isolated in `hover.css` (only loaded on hover-capable devices)
- CSS Grid for item layout: `grid-template-columns` repeats for responsive wrapping

### Navigation/Component Changes

- Edit `components/navbar.html` or `components/footer.html`
- **Critical**: Ensure `<a>` href matches one of the three main pages (`/`, `/alphabet.html`, `/about.html`)
- Test both desktop and mobile menu toggle

## Debugging Notes

- **Audio Won't Play**: Check `src` attribute paths (case-sensitive), verify audio format matches file extension
- **Memory Leaks**: All `Audio.ended` listeners must be cleaned via `cleanupAudioListener()`
- **Mobile Layout Breaks**: Check media query breakpoint (768px) and ensure `media768.css` applies
- **Component Not Loading**: Verify `loadComponent()` awaited in `DOMContentLoaded` event
