
import './style.css'

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'or', name: 'Odia' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
]

document.querySelector('#app').innerHTML = `
  <div class="app-shell">
    <header class="topbar">
      <a class="brand" href="#">
        <span class="brand-icon">文</span>
        <span>LinguaBridge<span class="brand-ai"> AI</span></span>
      </a>
      <span class="header-tag">LANGUAGE WITHOUT LIMITS</span>
    </header>

    <main>
      <section class="hero">
        <span class="eyebrow"><span class="live-dot"></span> YOUR WORLD, CONNECTED</span>
        <h1>Every language.<br><span>One connection.</span></h1>
        <p>Translate your thoughts and connect with the world.</p>
      </section>

      <section class="translator">
        <div class="language-bar">
          <label class="language-control">
            <span>FROM</span>
            <select id="source-language">
              ${languages.map(l => `<option value="${l.code}" ${l.code === 'en' ? 'selected' : ''}>${l.name}</option>`).join('')}
            </select>
          </label>

          <button id="swap-languages" class="swap-button" aria-label="Swap languages" title="Swap languages">⇄</button>

          <label class="language-control">
            <span>TO</span>
            <select id="target-language">
              ${languages.map(l => `<option value="${l.code}" ${l.code === 'hi' ? 'selected' : ''}>${l.name}</option>`).join('')}
            </select>
          </label>
        </div>

        <div class="text-panels">
          <div class="text-panel input-panel">
            <textarea id="source-text" maxlength="2000" placeholder="Type something you want to translate...">Hello! How are you?</textarea>
            <div class="panel-footer">
              <button id="mic-button" class="utility-button" title="Speak" aria-label="Speak">🎙 <span>Speak</span></button>
              <span id="char-count">21 / 2000</span>
            </div>
          </div>

          <div class="text-panel output-panel">
            <div id="output-text" class="output-text" aria-live="polite">Your translation will appear here.</div>
            <div class="panel-footer">
              <span id="result-status">READY TO TRANSLATE</span>
              <div class="result-actions">
                <button id="copy-button" class="utility-button" title="Copy translation" aria-label="Copy translation">▢</button>
                <button id="listen-button" class="utility-button" title="Listen to translation" aria-label="Listen to translation">🔊</button>
              </div>
            </div>
          </div>
        </div>

        <button id="translate-button" class="translate-button">
          <span>Translate now</span><span>→</span>
        </button>
        <p id="notice" class="notice" role="status">Demo mode: connect a translation API for real translations.</p>
      </section>

      <section class="feature-grid">
        <article class="feature-card">
          <span class="feature-icon">文</span>
          <h3>Multiple languages</h3>
          <p>Choose from a growing range of languages.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon">♫</span>
          <h3>Listen & speak</h3>
          <p>Use speech input and listen to spoken text.</p>
        </article>
        <article class="feature-card">
          <span class="feature-icon">↗</span>
          <h3>Connect globally</h3>
          <p>Make conversations across language barriers easier.</p>
        </article>
      </section>
    </main>

    <footer>LINGUABRIDGE AI · A STUDENT PROJECT</footer>
  </div>
`

const sourceLanguage = document.querySelector('#source-language')
const targetLanguage = document.querySelector('#target-language')
const sourceText = document.querySelector('#source-text')
const outputText = document.querySelector('#output-text')
const status = document.querySelector('#result-status')
const notice = document.querySelector('#notice')

const languageNames = Object.fromEntries(
  languages.map(language => [language.code, language.name])
)

// These are example phrases only, not a real translation engine.
const demoTranslations = {
  en: {
    hi: {
      'hello': 'नमस्ते',
      'hello! how are you?': 'नमस्ते! आप कैसे हैं?',
      'thank you': 'धन्यवाद',
      'good morning': 'सुप्रभात',
      'how are you?': 'आप कैसे हैं?',
      'goodbye': 'अलविदा',
      'i love you': 'मैं तुमसे प्यार करता/करती हूँ।',
    },
    or: {
      'hello': 'ନମସ୍କାର',
      'hello! how are you?': 'ନମସ୍କାର! ଆପଣ କେମିତି ଅଛନ୍ତି?',
      'thank you': 'ଧନ୍ୟବାଦ',
      'good morning': 'ସୁପ୍ରଭାତ',
      'how are you?': 'ଆପଣ କେମିତି ଅଛନ୍ତି?',
      'goodbye': 'ବିଦାୟ',
      'i love you': 'ମୁଁ ତୁମକୁ ଭଲ ପାଏ।',
    },
    es: {
      'hello': 'Hola',
      'hello! how are you?': '¡Hola! ¿Cómo estás?',
      'thank you': 'Gracias',
      'good morning': 'Buenos días',
      'how are you?': '¿Cómo estás?',
      'goodbye': 'Adiós',
      'i love you': 'Te quiero.',
    },
    fr: {
      'hello': 'Bonjour',
      'hello! how are you?': 'Bonjour ! Comment allez-vous ?',
      'thank you': 'Merci',
      'good morning': 'Bonjour',
      'how are you?': 'Comment allez-vous ?',
      'goodbye': 'Au revoir',
      'i love you': 'Je t’aime.',
    },
  },
}

function showNotice(message) {
  notice.textContent = message
}

async function translateText() {
  const text = sourceText.value.trim()
  const from = sourceLanguage.value
  const to = targetLanguage.value

  if (!text) {
    outputText.textContent = 'Please enter some text first.'
    status.textContent = 'INPUT REQUIRED'
    showNotice('Type a sentence in the box to get started.')
    return
  }

  if (from === to) {
    outputText.textContent = text
    status.textContent = 'SAME LANGUAGE'
    showNotice('Both languages are the same.')
    return
  }

  status.textContent = 'TRANSLATING...'
  outputText.textContent = 'Translating your text...'
  showNotice('Connecting to your local translation engine...')

  const button = document.querySelector('#translate-button')
  button.disabled = true

  try {
    const response = await fetch('http://localhost:3001/api/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text,
        source: from,
        target: to
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Translation failed.')
    }

    outputText.textContent = data.translatedText
    status.textContent = 'TRANSLATION COMPLETE'
    showNotice('Translation completed successfully.')
  } catch (error) {
    console.error('Translation error:', error)
    outputText.textContent = 'Translation failed. Please try again.'
    status.textContent = 'TRANSLATION ERROR'
    showNotice(
      error.message || 'Check that both local servers are running.'
    )
  } finally {
    button.disabled = false
  }
}

document.querySelector('#translate-button').addEventListener('click', translateText)

document.querySelector('#swap-languages').addEventListener('click', () => {
  const oldSource = sourceLanguage.value
  sourceLanguage.value = targetLanguage.value
  targetLanguage.value = oldSource

  const oldText = sourceText.value
  sourceText.value = outputText.textContent
  outputText.textContent = oldText || 'Your translation will appear here.'

  updateCharacterCount()
  status.textContent = 'LANGUAGES SWAPPED'
  showNotice('Languages swapped. Check the text before translating again.')
})

function updateCharacterCount() {
  document.querySelector('#char-count').textContent =
    `${sourceText.value.length} / 2000`
}

sourceText.addEventListener('input', updateCharacterCount)
updateCharacterCount()

document.querySelector('#copy-button').addEventListener('click', async () => {
  const text = outputText.textContent

  if (!text || text.startsWith('Your translation will appear')) {
    showNotice('Translate some text first.')
    return
  }

  try {
    await navigator.clipboard.writeText(text)
    showNotice('Translation copied to clipboard.')
  } catch {
    showNotice('Clipboard access is unavailable. Select the text and copy it manually.')
  }
})

document.querySelector('#listen-button').addEventListener('click', () => {
  const text = outputText.textContent

  if (!text || text.startsWith('Your translation will appear')) {
    showNotice('Translate some text first.')
    return
  }

  if (!('speechSynthesis' in window)) {
    showNotice('Speech playback is not supported in this browser.')
    return
  }

  const speech = new SpeechSynthesisUtterance(text)
  const speechLocales = {
    en: 'en-US',
    hi: 'hi-IN',
    or: 'or-IN',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP',
  }

  speech.lang = speechLocales[targetLanguage.value]
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(speech)
})

document.querySelector('#mic-button').addEventListener('click', () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition

  if (!SpeechRecognition) {
    showNotice('Speech recognition is unavailable in this browser. Try a supported version of Chrome.')
    return
  }

  const recognition = new SpeechRecognition()
  recognition.lang = ({
    en: 'en-US',
    hi: 'hi-IN',
    or: 'or-IN',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ja: 'ja-JP',
  })[sourceLanguage.value]

  recognition.onstart = () => showNotice('Listening… Speak now.')
  recognition.onresult = event => {
    sourceText.value = event.results[0][0].transcript
    updateCharacterCount()
    showNotice('Speech converted to text. Click Translate now.')
  }
  recognition.onerror = () => showNotice('Could not recognize speech. Check microphone permission and try again.')
  recognition.start()
})
async function loadAvailableLanguages() {
  try {
    const response = await fetch('http://localhost:3001/api/languages')

    if (!response.ok) {
      throw new Error('Could not load languages')
    }

    const availableLanguages = await response.json()

    if (!Array.isArray(availableLanguages) || availableLanguages.length === 0) {
      throw new Error('No languages were returned')
    }

    const previousSource = sourceLanguage.value
    const previousTarget = targetLanguage.value

    languages.length = 0
    languages.push(
      ...availableLanguages.map(language => ({
        code: language.code,
        name: language.name
      }))
    )

    function updateDropdown(dropdown, selectedCode) {
      dropdown.innerHTML = languages
        .map(language =>
          `<option value="${language.code}">${language.name}</option>`
        )
        .join('')

      if (languages.some(language => language.code === selectedCode)) {
        dropdown.value = selectedCode
      }
    }

    updateDropdown(sourceLanguage, previousSource)
    updateDropdown(targetLanguage, previousTarget)

    showNotice(`Loaded ${languages.length} available languages.`)
  } catch (error) {
    console.error('Could not load languages:', error)
    showNotice('Could not load the language list. Check that both servers are running.')
  }
}

loadAvailableLanguages()