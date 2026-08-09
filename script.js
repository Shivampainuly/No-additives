// /script.js — CLEAN MINIMAL BUY FORM (No Syntax Errors)
(function() {
  'use strict';

  // ---------- CONFIG ----------
  const EMAILJS_CONFIG = {
    publicKey: 'g7Fk5biWZJax78742',
    serviceId: 'service_mj0mnkq',
    templateId: 'template_ws9o13s',
    templateParamsMap: {
      name: 'name', email: 'email', phone: 'phone', product: 'product',
      quantity: 'quantity', address: 'address', city: 'city', state: 'state',
      postalCode: 'postal_code', message: 'message'
    }
  };

  // ---------- UTIL ----------
  const $ = (id) => document.getElementById(id);
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  // ---------- EMAILJS INIT ----------
  function initEmailJS() {
    if (typeof emailjs === 'undefined') {
      console.error('[EmailJS] SDK MISSING. Check <script src="...email.min.js"> in HTML.');
      return false;
    }
    try { emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey }); console.log('[EmailJS] Ready'); return true; }
    catch (e) { console.error('[EmailJS] Init Error:', e); return false; }
  }

  // ---------- BUY FORM ----------
  function initBuyForm() {
    console.log('🔥 initBuyForm() running...');

    const form = $('buyForm');
    const success = $('buySuccess');
    const errorBox = $('buyError');
    const errorText = $('buyErrorText');
    const retryBtn = $('retryBtn');
    const submitBtn = $('submitBtn');
    const btnText = submitBtn?.querySelector('.btn__text');

    if (!form) { console.error('❌ FATAL: #buyForm missing'); return; }
    if (!submitBtn) { console.error('❌ FATAL: #submitBtn missing'); return; }
    console.log('✅ Form & Button found. Attaching listener...');

    // --- Quantity UI ---
    const qtyInput = $('quantity');
    const customField = $('customQtyField');
    const customInput = $('customQuantity');
    const btnDec = $('qtyDecrease');
    const btnInc = $('qtyIncrease');

    const updateQtyBtns = () => {
      const v = parseInt(qtyInput?.value, 10) || 1;
      if (btnDec) btnDec.disabled = v <= 1;
      if (btnInc) btnInc.disabled = v >= 5;
    };
    btnDec?.addEventListener('click', () => { const v = parseInt(qtyInput.value,10)||1; if(v>1){qtyInput.value=v-1;updateQtyBtns();} });
    btnInc?.addEventListener('click', () => { const v = parseInt(qtyInput.value,10)||1; if(v<5){qtyInput.value=v+1;updateQtyBtns();} });
    qtyInput?.addEventListener('change', () => { qtyInput.value = clamp(parseInt(qtyInput.value,10)||1,1,5); updateQtyBtns(); });
    qtyInput?.addEventListener('input', () => {
      const v = parseInt(qtyInput.value,10)||1;
      if (customField) customField.hidden = !(v > 5);
      if (customInput) customInput.required = v > 5;
      updateQtyBtns();
    });

    // --- Validation ---
    const validators = {
      product: v => v ? null : 'Select a product',
      fullName: v => v.trim().length >= 2 ? null : 'Enter full name',
      email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Valid email required',
      phone: v => v.trim().length >= 10 ? null : 'Valid phone required',
      address: v => v.trim().length >= 5 ? null : 'Address required',
      city: v => v.trim().length >= 2 ? null : 'City required',
      state: v => v.trim().length >= 2 ? null : 'State/Province required',
      postalCode: v => v.trim().length >= 3 ? null : 'Postal code required',
      quantity: v => (parseInt(v,10)||0) >= 1 ? null : 'Quantity required',
      customQuantity: v => !customField?.hidden ? ((parseInt(customInput?.value,10)||0) >= 6 ? null : 'Min 6 for custom') : null
    };

    function showErr(key, msg) {
      const el = $(key);
      const errEl = $(key === 'customQuantity' ? 'customQtyError' : key + 'Error');
      if (el) el.setAttribute('aria-invalid', 'true');
      if (errEl) { errEl.textContent = msg; errEl.hidden = false; }
    }
    function clearErr(key) {
      const el = $(key);
      const errEl = $(key === 'customQuantity' ? 'customQtyError' : key + 'Error');
      if (el) el.removeAttribute('aria-invalid');
      if (errEl) { errEl.textContent = ''; errEl.hidden = true; }
    }
    function validate(key) {
      const el = $(key);
      if (!el) return true;
      const val = key === 'customQuantity' ? (customInput?.value || '') : el.value;
      const err = validators[key]?.(val);
      return err ? (showErr(key, err), false) : (clearErr(key), true);
    }

    // Live Validation
    Object.keys(validators).forEach(key => {
      const el = $(key);
      if (el) {
        el.addEventListener('blur', () => validate(key));
        el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validate(key); });
      }
    });
    customInput?.addEventListener('blur', () => validate('customQuantity'));
    customInput?.addEventListener('input', () => { if (customInput.getAttribute('aria-invalid') === 'true') validate('customQuantity'); });

    // --- SUBMIT HANDLER ---
    form.addEventListener('submit', async (e) => {
      e.preventDefault(); // STOP RELOAD
      console.log('🛑 Submit intercepted. Validating...');

      Object.keys(validators).forEach(clearErr);

      let ok = true;
      Object.keys(validators).forEach(k => { if (!validate(k)) ok = false; });

      if (!ok) {
        console.log('❌ Validation failed');
        document.querySelector('[aria-invalid="true"]')?.focus();
        return;
      }

      console.log('✅ Validation passed. Sending...');
      if (btnText) btnText.textContent = 'Sending...';
      submitBtn.disabled = true;

      const fd = new FormData(form);
      const data = {
        product: fd.get('product'),
        quantity: customField?.hidden === false ? fd.get('customQuantity') : fd.get('quantity'),
        fullName: fd.get('fullName'), email: fd.get('email'), phone: fd.get('phone'),
        address: fd.get('address'), city: fd.get('city'), state: fd.get('state'),
        postalCode: fd.get('postalCode'), message: fd.get('message')
      };

      try {
        if (typeof emailjs === 'undefined') throw new Error('EmailJS SDK not loaded');

        const params = {};
        const pName = data.product === 'regular' ? 'Regular Peanut Butter' : 'Supernut Butter';
        for (const [jsKey, tplKey] of Object.entries(EMAILJS_CONFIG.templateParamsMap)) {
          let v = data[jsKey]; if (jsKey === 'product') v = pName; params[tplKey] = v ?? '';
        }

        console.group('[EmailJS] Sending'); console.table(params); console.groupEnd();

        const res = await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, params);

        console.log('[EmailJS] Response:', res.status, res.text);
        if (res.status !== 200) throw new Error('EmailJS Error: ' + res.text);

        // SUCCESS UI
        form.hidden = true;
        if (errorBox) errorBox.hidden = true;
        if (success) success.hidden = false;
        const st = success?.querySelector('.buy-success__text');
        if (st) st.textContent = 'Thank you! Your request has been received. We will contact you with pricing and availability.';

      } catch (err) {
        console.error('❌ Send Failed:', err);
        form.hidden = false;
        if (success) success.hidden = true;
        if (errorBox) errorBox.hidden = false;
        if (errorText) errorText.textContent = err.message || 'Failed to send. Email us directly.';
        if (btnText) btnText.textContent = 'Submit Request';
        submitBtn.disabled = false;
      }
    });

    // Retry Button
    retryBtn?.addEventListener('click', () => {
      if (errorBox) errorBox.hidden = true;
      form.hidden = false;
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'Submit Request';
    });

    // URL Pre-fill
    const params = new URLSearchParams(window.location.search);
    const pre = params.get('product');
    if (pre && (pre === 'regular' || pre === 'supernut')) $('productSelect').value = pre;

    console.log('🎉 Buy Form Ready.');
  }

  // ---------- FOOTER YEAR ----------
  function initFooterYear() { const y = $('currentYear'); if (y) y.textContent = new Date().getFullYear(); }

  // ---------- CINEMATIC PRODUCT EXPERIENCE ----------
  // Only controls the four-step jar animation in the Experience section.
  function initExperienceAnimation() {
    const steps = document.querySelectorAll('.experience__step');
    const lid = document.getElementById('experienceLid');
    const jarFill = document.getElementById('experienceJarFill');
    const jarLabel = document.querySelector('.experience__jar-label');
    const particles = document.getElementById('experienceParticles');

    if (!steps.length || !lid || !jarFill || !jarLabel || !particles) return;

    let particleInterval = null;

    function createParticle() {
      const particle = document.createElement('span');
      particle.className = 'experience__particle';
      particle.style.left = (45 + Math.random() * 10) + '%';
      particle.style.top = (48 + Math.random() * 8) + '%';
      particle.style.setProperty('--tx', ((Math.random() - 0.5) * 180) + 'px');
      particle.style.setProperty('--ty', (-50 - Math.random() * 150) + 'px');
      particles.appendChild(particle);
      particle.addEventListener('animationend', () => particle.remove(), { once: true });
    }

    function clearParticles() {
      if (particleInterval) {
        clearInterval(particleInterval);
        particleInterval = null;
      }
      particles.innerHTML = '';
    }

    function startParticles() {
      clearParticles();
      for (let i = 0; i < 15; i++) setTimeout(createParticle, i * 50);
      particleInterval = setInterval(createParticle, 200);
    }

    function updateExperienceStep(index) {
      steps.forEach((step, i) => step.classList.toggle('active', i === index));

      // Step 01 — The Seal: jar remains closed.
      if (index === 0) {
        lid.classList.remove('open');
        jarFill.classList.remove('visible');
        jarLabel.classList.remove('visible');
        clearParticles();
      }

      // Step 02 — The Reveal: lift the lid.
      if (index >= 1) {
        lid.classList.add('open');
      }

      // Step 03 — The Taste: reveal the rich contents and label.
      if (index >= 2) {
        jarFill.classList.add('visible');
        jarLabel.classList.add('visible');
      }

      // Step 04 — The Versatility: finish with the subtle ingredient burst.
      if (index >= 3 && !particleInterval) {
        startParticles();
      }
    }

    const stepObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateExperienceStep(parseInt(entry.target.dataset.step, 10) - 1);
        }
      });
    }, { threshold: 0.5, rootMargin: '0px 0px -30% 0px' });

    steps.forEach(step => stepObserver.observe(step));

    // Start in the same closed state as Step 01.
    updateExperienceStep(0);
  }

  // ---------- BOOT ----------
  function boot() {
    console.log('--- BOOT START ---');
    initEmailJS();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => { initBuyForm(); initFooterYear(); initExperienceAnimation(); })
    } else {
      initBuyForm(); initFooterYear(); initExperienceAnimation();
    }
    console.log('--- BOOT COMPLETE ---');
  }

  boot();

})();


/* ---------- PRODUCT DETAIL MODAL ---------- */
(function initProductDetails() {
  const modal = document.getElementById('productModal');
  const body = document.getElementById('productModalBody');
  const closeBtn = document.getElementById('productModalClose');
  const overlay = document.getElementById('productModalOverlay');

  if (!modal || !body) return;

  const products = {
    regular: {
      name: 'Regular Peanut Butter',
      tagline: 'Simple. Creamy. Naturally sweetened.',
      image: 'assets/regular-peanut-butter.svg',
      description: 'A straightforward peanut butter made around roasted peanuts, Medjool dates and salt. Smooth, creamy and naturally sweetened.',
      ingredients: 'Dry-roasted peanuts, Medjool dates, salt.',
      bestFor: 'Toast, baking, smoothies and everyday cooking.',
      features: [
        'Palm-oil free',
        'No refined sugar',
        'Naturally sweetened with dates',
        'No artificial flavors',
        'Creamy, smooth texture'
      ]
    },
    supernut: {
      name: 'Supernut Butter',
      tagline: 'More nuts. More texture. More character.',
      image: 'assets/supernut-butter.svg',
      description: 'A richer nut-forward blend for people who want more variety and texture while keeping the same simple philosophy.',
      ingredients: 'Peanuts, additional nuts & seeds, Medjool dates, salt.',
      bestFor: 'Snacking, cheese boards, gourmet use and textured spreads.',
      features: [
        'Palm-oil free',
        'No refined sugar',
        'Naturally sweetened with dates',
        'Nut-rich blend',
        'Creamy with subtle texture'
      ]
    }
  };

  function renderProduct(key) {
    const product = products[key];
    if (!product) return;

    body.innerHTML = `
      <div class="product-detail">
        <div class="product-detail__visual">
          <img src="${product.image}" alt="${product.name} jar" class="product-detail__image">
          <div class="product-detail__badges" aria-label="Product highlights">
            <span>Palm-Oil Free</span>
            <span>No Refined Sugar</span>
          </div>
        </div>
        <div class="product-detail__content">
          <p class="section__eyebrow">Product Details</p>
          <h2 id="productModalTitle" class="product-detail__title">${product.name}</h2>
          <p class="product-detail__tagline">${product.tagline}</p>
          <p class="product-detail__description">${product.description}</p>

          <div class="product-detail__highlights">
            ${product.features.map(feature => `<div class="product-detail__highlight"><span aria-hidden="true">✓</span>${feature}</div>`).join('')}
          </div>

          <div class="product-detail__info">
            <div>
              <h3>Ingredients</h3>
              <p>${product.ingredients}</p>
            </div>
            <div>
              <h3>Best for</h3>
              <p>${product.bestFor}</p>
            </div>
          </div>

          <div class="product-detail__actions">
            <a href="buy.html?product=${key}" class="btn btn--primary magnetic-btn">Request to Buy</a>
            <button type="button" class="btn btn--outline" data-modal-close>Close</button>
          </div>
        </div>
      </div>
    `;

    const dynamicClose = body.querySelector('[data-modal-close]');
    dynamicClose?.addEventListener('click', closeModal);
  }

  function openModal(key) {
    renderProduct(key);
    if (typeof modal.showModal === 'function') {
      modal.showModal();
    } else {
      modal.setAttribute('open', '');
    }
    document.body.classList.add('product-modal-open');
  }

  function closeModal() {
    if (typeof modal.close === 'function') {
      modal.close();
    } else {
      modal.removeAttribute('open');
    }
    document.body.classList.remove('product-modal-open');
  }

  document.querySelectorAll('.product-card__explore').forEach(button => {
    button.addEventListener('click', () => openModal(button.dataset.product));
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', closeModal);

  modal.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModal();
  });
})();
