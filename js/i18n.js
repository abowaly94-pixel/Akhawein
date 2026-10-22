/**
 * Akhawein Charity - Bilingual Localization Engine (Arabic ⇄ English)
 * ------------------------------------------------------------------
 * - Adds a language switch button to the header / mobile drawer.
 * - Translates the rendered page in place using the Arabic → English
 *   dictionary in js/i18n-data.js (no page reload needed).
 * - Switches <html lang> / <html dir> between RTL and LTR.
 * - Remembers the visitor choice in localStorage.
 * - Also translates content injected later by other scripts/modals.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'akhawein_lang';
  var DICT = window.I18N_EN || {};
  var MAP = new Map();

  // Normalize dictionary keys once (whitespace + tatweel tolerant)
  function normalizeKey(value) {
    return String(value)
      .replace(/\u00a0/g, ' ')
      .replace(/[ \t\r\n\f]+/g, ' ')
      .replace(/\u0640/g, '')
      .trim();
  }
  Object.keys(DICT).forEach(function (key) {
    MAP.set(normalizeKey(key), DICT[key]);
  });

  var ARABIC_RE = /[\u0600-\u06FF]/;
  var ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, KBD: 1, SAMP: 1, SVG: 1
  };
  var TRANSLATABLE_ATTRS = ['title', 'alt', 'placeholder', 'aria-label', 'aria-description', 'content', 'value'];

  var lang = 'ar';
  var applying = false;
  var observer = null;

  var nodeSource = new WeakMap();   // text node -> original Arabic text
  var nodeApplied = new WeakMap();  // text node -> last value we wrote
  var attrSource = new WeakMap();   // element -> { attr: original }
  var attrApplied = new WeakMap();  // element -> { attr: last value we wrote }
  var originalTitle = null;

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function toLatinDigits(value) {
    return String(value)
      .replace(/[٠-٩]/g, function (digit) {
        return String(ARABIC_DIGITS.indexOf(digit));
      })
      .replace(/\u066C/g, ',')  // Arabic thousands separator
      .replace(/\u066B/g, '.'); // Arabic decimal separator
  }

  function normalizeText(value) {
    return String(value).replace(/\u00a0/g, ' ').replace(/[ \t\r\n\f]+/g, ' ').trim();
  }

  function lookup(raw) {
    if (!raw) return null;
    var key = normalizeText(raw);
    if (!key) return null;
    if (MAP.has(key)) return MAP.get(key);
    var withoutTatweel = key.replace(/\u0640/g, '');
    if (MAP.has(withoutTatweel)) return MAP.get(withoutTatweel);
    return null;
  }

  // Patterns for strings that carry live numbers/values (counters, toasts…)
  var DYNAMIC_RULES = [
    [/^شهادة\s+([\d٠-٩]+)\s+من\s+([\d٠-٩]+)$/, 'Certificate $1 of $2'],
    [/^مادة\s+([\d٠-٩]+)\s+من\s+([\d٠-٩]+)$/, 'Media item $1 of $2'],
    [/^([\d٠-٩]+)\s+شهادة تقدير معروضة$/, '$1 certificates of appreciation displayed'],
    [/^([\d٠-٩]+)\s+مادة إعلامية معروضة$/, '$1 media items displayed'],
    [/^([\d٠-٩]+)\s+متصفح نشط$/, '$1 active visitors'],
    [/^([\d٠-٩]+)\s*ج\.?\s*م$/, '$1 EGP'],
    [/^([\d٠-٩]+)\s*جنيه(?:اً|ًا|ا)?$/, '$1 EGP'],
    [/^تم جمع:\s*(.+)$/, 'Raised: $1'],
    [/^المستهدف:\s*(.+)$/, 'Goal: $1'],
    [/^جميع الحقوق محفوظة\s*©\s*$/, 'All rights reserved ©'],
    [/^لـ$/, 'for'],
    // Copy feedback (donations table, cause modal)
    [/^تم نسخ \((.+)\) بنجاح$/, 'Copied ($1) successfully'],
    [/^تم نسخ رقم الحساب بنجاح:\s*(.+)$/, 'Account number copied successfully: $1'],
    [/^(?:✓\s*)?تم نسخ رقم حساب "(.+)" بنجاح:\s*(.+)$/, 'Account number for "$1" copied successfully: $2'],
    [/^تم نسخ رابط حالة "(.+)" بنجاح!$/, 'The link to the case "$1" was copied successfully!'],
    // Protocol search counter
    [/^([\d٠-٩]+)\s+بروتوكول(?:ات)? مطابقة$/, '$1 matching protocols'],
    // Contact form activation notice (contains the site email address)
    [/^تم إرسال رابط تفعيل لمرة واحدة إلى البريد \((.+)\)\. يرجى فتح البريد والضغط على رابط التفعيل \(Activate Form\) لمرة واحدة فقط لتصل كافة الرسائل القادمة إلى بريدكم فوراً\.$/, 'A one-time activation link has been sent to ($1). Please open the email and click the activation link (Activate Form) only once so that all future messages arrive in your inbox immediately.']
  ];

  function applyDynamicRules(text) {
    var normalized = normalizeText(text);
    for (var i = 0; i < DYNAMIC_RULES.length; i++) {
      var rule = DYNAMIC_RULES[i];
      if (rule[0].test(normalized)) {
        // Translate captured fragments (names, titles…) when they are known keys,
        // otherwise keep them as-is (numbers, account numbers, URLs…).
        var match = normalized.match(rule[0]);
        return rule[1].replace(/\$(\d+)/g, function (token, index) {
          var group = match ? match[Number(index)] : null;
          if (group == null) return '';
          var translatedGroup = lookup(group);
          return translatedGroup != null ? translatedGroup : group;
        });
      }
    }
    return null;
  }

  function postProcess(text) {
    return toLatinDigits(text)
      .replace(/ج\.?\s*م/g, 'EGP')
      .replace(/جنيهاً|جنيهًا|جنيه/g, 'EGP');
  }

  function translateTitle(title) {
    var full = lookup(title);
    if (full) return full;
    if (title.indexOf('|') !== -1) {
      return title.split('|').map(function (part) {
        var trimmed = part.trim();
        return translateValue(trimmed) || trimmed;
      }).join(' | ');
    }
    return translateValue(title);
  }

  function preserveOuterWhitespace(source, translated) {
    var leading = (source.match(/^\s+/) || [''])[0];
    var trailing = (source.match(/\s+$/) || [''])[0];
    return leading + String(translated).trim() + trailing;
  }

  /**
   * Translate a raw text value.
   * Returns the translated string or null when nothing was translated.
   */
  function translateValue(raw) {
    if (!raw) return null;
    var value = String(raw);

    // Multi-line blocks (modals, descriptions): translate line by line so the
    // paragraphs / line breaks of the original layout are preserved.
    if (value.indexOf('\n') !== -1) {
      var parts = value.split('\n');
      var changed = false;
      var translatedParts = parts.map(function (part) {
        if (!part.trim()) return part;
        var translated = lookup(part);
        if (translated == null) translated = lookup(normalizeText(part));
        if (translated != null) {
          changed = true;
          return preserveOuterWhitespace(part, translated);
        }
        return part;
      });
      if (changed) return toLatinDigits(translatedParts.join('\n'));
    }

    var result = lookup(value);
    if (result == null) result = applyDynamicRules(value);
    if (result == null) return null;
    return preserveOuterWhitespace(value, postProcess(result));
  }

  function isTranslatableElement(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SKIP_TAGS[el.nodeName]) return false;
    if (el.closest && el.closest('[data-i18n-ignore]')) return false;
    return true;
  }

  function translateTextNode(node) {
    if (!node || node.nodeType !== 3) return;
    if (!isTranslatableElement(node.parentElement)) return;

    var current = node.nodeValue;
    if (current == null || !current.trim()) return;
    if (nodeApplied.get(node) === current) return; // already processed

    var hasArabic = ARABIC_RE.test(current);
    var next = null;

    if (hasArabic) {
      next = translateValue(current);
    }
    if (next == null) {
      var latin = toLatinDigits(current);
      if (latin !== current) next = latin;
    }
    if (next == null || next === current) return;

    nodeSource.set(node, current);
    nodeApplied.set(node, next);
    applying = true;
    node.nodeValue = next;
    applying = false;
  }

  function translateAttribute(el, attr) {
    if (!isTranslatableElement(el)) return;
    if (!el.hasAttribute(attr)) return;

    // `value` only makes sense for submit-like buttons, never for user input.
    if (attr === 'value') {
      var type = (el.getAttribute('type') || '').toLowerCase();
      if (!/^(submit|button|reset)$/.test(type)) return;
    }
    if (attr === 'content') {
      var name = (el.getAttribute('name') || el.getAttribute('property') || '').toLowerCase();
      if (name && !/(description|title|site_name|keywords)/.test(name)) return;
    }

    var current = el.getAttribute(attr);
    if (current == null || !current.trim()) return;

    var applied = attrApplied.get(el);
    if (applied && applied[attr] === current) return; // already processed

    var next = ARABIC_RE.test(current) ? translateValue(current) : null;
    if (next == null) {
      var latin = toLatinDigits(current);
      if (latin !== current) next = latin;
    }
    if (next == null || next === current) return;

    var sourceMap = attrSource.get(el);
    if (!sourceMap) {
      sourceMap = {};
      attrSource.set(el, sourceMap);
    }
    var appliedMap = attrApplied.get(el);
    if (!appliedMap) {
      appliedMap = {};
      attrApplied.set(el, appliedMap);
    }

    sourceMap[attr] = current;
    appliedMap[attr] = next;

    applying = true;
    el.setAttribute(attr, next);
    applying = false;
  }

  function walk(root) {
    if (!root || !root.isConnected) return;

    // Translate text nodes (skipping scripts/styles and ignored blocks)
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return isTranslatableElement(node.parentElement)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      }
    });
    var textNode;
    while ((textNode = walker.nextNode())) {
      translateTextNode(textNode);
    }

    // Translate accessible / descriptive attributes
    var elements = [];
    if (root.nodeType === 1) elements.push(root);
    if (root.querySelectorAll) {
      elements = elements.concat(Array.prototype.slice.call(root.querySelectorAll('*')));
    }
    elements.forEach(function (el) {
      if (!isTranslatableElement(el)) return;
      for (var i = 0; i < TRANSLATABLE_ATTRS.length; i++) {
        translateAttribute(el, TRANSLATABLE_ATTRS[i]);
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* Restore Arabic                                                      */
  /* ------------------------------------------------------------------ */
  function restoreAll() {
    if (!document.body) return;

    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (!nodeSource.has(node)) continue;
      var source = nodeSource.get(node);
      applying = true;
      node.nodeValue = source;
      applying = false;
      nodeApplied.delete(node);
    }

    Array.prototype.forEach.call(document.querySelectorAll('*'), function (el) {
      var sourceMap = attrSource.get(el);
      if (!sourceMap) return;
      var appliedMap = attrApplied.get(el);
      if (!appliedMap) return;
      Object.keys(sourceMap).forEach(function (attr) {
        applying = true;
        el.setAttribute(attr, sourceMap[attr]);
        applying = false;
        delete appliedMap[attr];
      });
    });

    if (originalTitle) {
      applying = true;
      document.title = originalTitle;
      applying = false;
    }
  }

  /* ------------------------------------------------------------------ */
  /* Mutation observer (dynamic content: modals, toasts, counters…)      */
  /* ------------------------------------------------------------------ */
  function startObserver() {
    if (observer || !document.body) return;
    observer = new MutationObserver(function (mutations) {
      if (lang !== 'en' || applying) return;
      for (var i = 0; i < mutations.length; i++) {
        var mutation = mutations[i];
        if (mutation.type === 'characterData') {
          translateTextNode(mutation.target);
        } else if (mutation.type === 'childList') {
          for (var j = 0; j < mutation.addedNodes.length; j++) {
            var added = mutation.addedNodes[j];
            if (added.nodeType === 1) walk(added);
            else if (added.nodeType === 3) translateTextNode(added);
          }
        } else if (mutation.type === 'attributes') {
          translateAttribute(mutation.target, mutation.attributeName);
        }
      }
    });
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: TRANSLATABLE_ATTRS
    });
  }

  function stopObserver() {
    if (!observer) return;
    observer.takeRecords();
    observer.disconnect();
    observer = null;
  }

  /* ------------------------------------------------------------------ */
  /* Language switch button                                              */
  /* ------------------------------------------------------------------ */
  function bindLanguageButton(button) {
    if (button.dataset.i18nBound === '1') return;
    button.dataset.i18nBound = '1';
    button.setAttribute('data-i18n-ignore', '');
    button.addEventListener('click', function () {
      setLanguage(lang === 'en' ? 'ar' : 'en');
    });
  }

  function buildLanguageButton(extraClass) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'lang-switch-btn' + (extraClass ? ' ' + extraClass : '');
    // Fill the label immediately so the button never changes size after being
    // inserted (no layout shift while/after the header paints).
    button.innerHTML = '<i class="fa-solid fa-globe" aria-hidden="true"></i>' +
      '<span class="lang-switch-label">' + (lang === 'en' ? 'العربية' : 'English') + '</span>';
    bindLanguageButton(button);
    return button;
  }

  function injectLanguageButtons() {
    // Static buttons already exist in the HTML: just bind them (no injection,
    // no layout shift). Only create buttons for pages without the markup.
    var existing = document.querySelectorAll('.lang-switch-btn');
    var hasHeaderButton = false;
    Array.prototype.forEach.call(existing, function (button) {
      if (!button.classList.contains('lang-switch-btn-drawer') && !button.classList.contains('lang-switch-floating')) {
        hasHeaderButton = true;
      }
      bindLanguageButton(button);
    });

    var actions = document.querySelector('.header-actions');
    if (actions && !hasHeaderButton && !actions.querySelector('.lang-switch-btn')) {
      var button = buildLanguageButton();
      var donateBtn = actions.querySelector('.header-donate-btn');
      if (donateBtn) actions.insertBefore(button, donateBtn);
      else actions.insertBefore(button, actions.firstChild);
    }

    var drawerHeader = document.querySelector('.drawer-header');
    if (drawerHeader && !drawerHeader.querySelector('.lang-switch-btn')) {
      var drawerButton = buildLanguageButton('lang-switch-btn-drawer');
      var closeBtn = drawerHeader.querySelector('.drawer-close-btn');
      if (closeBtn) drawerHeader.insertBefore(drawerButton, closeBtn);
      else drawerHeader.appendChild(drawerButton);
    }

    // Fallback for pages without the standard header
    if (!document.querySelector('.lang-switch-btn')) {
      var floating = buildLanguageButton('lang-switch-floating');
      document.body.appendChild(floating);
    }
  }

  function updateLanguageButtons() {
    var isEnglish = lang === 'en';
    var label = isEnglish ? 'العربية' : 'English';
    var title = isEnglish ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية';

    Array.prototype.forEach.call(document.querySelectorAll('.lang-switch-btn'), function (button) {
      button.innerHTML = '<i class="fa-solid fa-globe" aria-hidden="true"></i>' +
        '<span class="lang-switch-label">' + label + '</span>';
      button.setAttribute('title', title);
      button.setAttribute('aria-label', title);
      button.classList.toggle('is-en', isEnglish);
    });
  }

  /* ------------------------------------------------------------------ */
  /* Apply language                                                      */
  /* ------------------------------------------------------------------ */
  /**
   * Remove the anti-flash hiding state (added by the inline bootstrap when the
   * saved language is English) and reveal the fully-translated page.
   */
  function revealTranslatedPage() {
    var html = document.documentElement;
    if (!html.classList.contains('lang-loading') && !html.classList.contains('lang-reveal')) return;
    html.classList.remove('lang-loading');
    html.classList.add('lang-reveal');
  }

  function setLanguage(nextLang, options) {
    nextLang = nextLang === 'en' ? 'en' : 'ar';
    var silent = options && options.silent;
    lang = nextLang;

    try {
      localStorage.setItem(STORAGE_KEY, nextLang);
    } catch (error) { /* private mode */ }

    var html = document.documentElement;
    html.classList.toggle('lang-en', nextLang === 'en');
    html.setAttribute('lang', nextLang === 'en' ? 'en' : 'ar');
    html.setAttribute('dir', nextLang === 'en' ? 'ltr' : 'rtl');

    if (nextLang === 'en') {
      if (originalTitle == null) originalTitle = document.title;
      if (document.body) walk(document.body);
      // Head metadata (meta description, Open Graph tags…) lives outside <body>.
      if (document.head) walk(document.head);
      if (originalTitle) {
        var translatedTitle = translateTitle(originalTitle);
        if (translatedTitle) document.title = translatedTitle;
      }
      startObserver();
      // Fully translated: reveal the (previously hidden) page in one fade
      revealTranslatedPage();
    } else {
      stopObserver();
      restoreAll();
      revealTranslatedPage();
    }

    updateLanguageButtons();

    if (!silent) {
      document.dispatchEvent(new CustomEvent('languagechange', {
        detail: { lang: nextLang }
      }));
    }
  }

  /* ------------------------------------------------------------------ */
  /* Bootstrap                                                           */
  /* ------------------------------------------------------------------ */
  function hideBrokenEagles() {
    Array.prototype.forEach.call(document.querySelectorAll('img.eagle-badge'), function (img) {
      var hide = function () { img.style.display = 'none'; };
      if (img.complete && img.naturalWidth === 0) hide();
      img.addEventListener('error', hide);
    });
  }

  function init() {
    injectLanguageButtons();
    hideBrokenEagles();

    var saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (error) { /* private mode */ }

    if (saved === 'en') {
      setLanguage('en', { silent: true });
    } else {
      updateLanguageButtons();
      // The page was never hidden (Arabic bootstrap) — just mark it ready.
      revealTranslatedPage();
    }

    // BFCache restore (back/forward): re-apply the saved language so a cached
    // page never stays in the wrong language.
    window.addEventListener('pageshow', function (event) {
      if (!event || !event.persisted) return;
      var stored = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch (error) { /* private mode */ }
      var wanted = stored === 'en' ? 'en' : 'ar';
      if (wanted !== lang) {
        setLanguage(wanted, { silent: true });
      } else {
        revealTranslatedPage();
      }
    });

    // Keep tabs in sync
    window.addEventListener('storage', function (event) {
      if (event.key === STORAGE_KEY && event.newValue && event.newValue !== lang) {
        setLanguage(event.newValue, { silent: true });
      }
    });
  }

  // Public API (handy for links such as ?lang=en)
  window.setSiteLanguage = function (code) {
    setLanguage(code, { silent: false });
  };
  window.getSiteLanguage = function () {
    return lang;
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
