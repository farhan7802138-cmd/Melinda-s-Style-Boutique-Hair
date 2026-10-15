/**
 * MELINDA'S STYLE BOUTIQUE HAIR SALON - APPLICATION JAVASCRIPT
 * Phoenix, Arizona
 */

document.addEventListener('DOMContentLoaded', () => {

  // ===================================================================
  // 1. DYNAMIC SALON HOURS (ARIZONA MST / UTC-7)
  // ===================================================================
  function updateSalonStatus() {
    // Salon Schedule
    // 0: Sunday (Closed/VIP), 1: Monday (Closed), 2: Tuesday (9-18), 3: Wednesday (9-18),
    // 4: Thursday (9-18), 5: Friday (9-18), 6: Saturday (9-17)
    const schedule = {
      0: { name: 'Sunday', open: 0, close: 0, closed: true, note: 'Closed (VIP Appt Only)' },
      1: { name: 'Monday', open: 0, close: 0, closed: true, note: 'Closed' },
      2: { name: 'Tuesday', open: 9, close: 18, closed: false, note: '9:00 AM – 6:00 PM' },
      3: { name: 'Wednesday', open: 9, close: 18, closed: false, note: '9:00 AM – 6:00 PM' },
      4: { name: 'Thursday', open: 9, close: 18, closed: false, note: '9:00 AM – 6:00 PM' },
      5: { name: 'Friday', open: 9, close: 18, closed: false, note: '9:00 AM – 6:00 PM' },
      6: { name: 'Saturday', open: 9, close: 17, closed: false, note: '9:00 AM – 5:00 PM' },
    };

    // Calculate current Phoenix time (UTC - 7 hours)
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const phoenixTime = new Date(utcTime - (7 * 3600000));
    
    const day = phoenixTime.getDay();
    const hour = phoenixTime.getHours();
    const minute = phoenixTime.getMinutes();
    const currentTimeDecimal = hour + (minute / 60);

    const todayInfo = schedule[day];
    const liveStatusBadge = document.getElementById('liveStatusBadge');
    const liveStatusText = document.getElementById('liveStatusText');

    let isOpen = false;
    let statusMessage = '';

    if (!todayInfo.closed && currentTimeDecimal >= todayInfo.open && currentTimeDecimal < todayInfo.close) {
      isOpen = true;
      const closingHour = todayInfo.close > 12 ? todayInfo.close - 12 : todayInfo.close;
      statusMessage = `Open Now · Closes ${closingHour}:00 PM`;
    } else {
      isOpen = false;
      // Find next opening day
      let nextDay = (day + 1) % 7;
      let daysLookahead = 1;
      while (schedule[nextDay].closed && daysLookahead < 7) {
        nextDay = (nextDay + 1) % 7;
        daysLookahead++;
      }
      const nextDayName = daysLookahead === 1 ? 'Tomorrow' : schedule[nextDay].name.substring(0, 3);
      if (!todayInfo.closed && currentTimeDecimal < todayInfo.open) {
        statusMessage = `Closed · Opens 9:00 AM Today`;
      } else {
        statusMessage = `Closed · Opens 9:00 AM ${nextDayName}`;
      }
    }

    if (liveStatusBadge && liveStatusText) {
      liveStatusBadge.className = `status-badge ${isOpen ? 'open' : 'closed'}`;
      liveStatusText.textContent = statusMessage;
    }

    // Also update mobile status strip
    const mobileStatusPill = document.getElementById('mobileStatusPill');
    const mobileStatusText = document.getElementById('mobileStatusText');
    if (mobileStatusPill && mobileStatusText) {
      mobileStatusPill.className = `mobile-status-pill ${isOpen ? 'open' : 'closed'}`;
      mobileStatusText.textContent = statusMessage;
    }

    // Highlight today in the hours table
    const dayRowIds = ['hour-sun', 'hour-mon', 'hour-tue', 'hour-wed', 'hour-thu', 'hour-fri', 'hour-sat'];
    dayRowIds.forEach((id, index) => {
      const row = document.getElementById(id);
      if (row) {
        if (index === day) {
          row.classList.add('today');
          const firstCell = row.querySelector('td:first-child');
          if (firstCell && !firstCell.querySelector('.today-indicator')) {
            firstCell.innerHTML += ' <span class="today-indicator">TODAY</span>';
          }
        } else {
          row.classList.remove('today');
        }
      }
    });
  }

  updateSalonStatus();
  setInterval(updateSalonStatus, 60000); // Check every minute


  // ===================================================================
  // 2. HEADER SCROLL & MOBILE DRAWER NAVIGATION
  // ===================================================================
  const mainHeader = document.getElementById('mainHeader');
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navOverlay = document.getElementById('navOverlay');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      mainHeader.classList.add('scrolled');
    } else {
      mainHeader.classList.remove('scrolled');
    }
  });

  function openMobileMenu() {
    if (navMenu) navMenu.classList.add('open');
    if (mobileToggle) mobileToggle.classList.add('open');
    if (navOverlay) navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (navMenu) navMenu.classList.remove('open');
    if (mobileToggle) mobileToggle.classList.remove('open');
    if (navOverlay) navOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu && navMenu.classList.contains('open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerCloseBtn) {
    drawerCloseBtn.addEventListener('click', closeMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu when clicking any nav link or drawer button
  if (navMenu) {
    navMenu.querySelectorAll('.nav-link, .drawer-book-btn').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  }


  // ===================================================================
  // 3. SERVICES CATEGORY FILTER TABS
  // ===================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  // ===================================================================
  // 4. "BOOK THIS SERVICE" AUTOFILL & SCROLL
  // ===================================================================
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  const serviceSelect = document.getElementById('serviceSelect');
  const estimatedPriceDisplay = document.getElementById('estimatedPriceDisplay');
  const bookDateInput = document.getElementById('bookDate');

  // Set min date to today
  if (bookDateInput) {
    const todayStr = new Date().toISOString().split('T')[0];
    bookDateInput.setAttribute('min', todayStr);
    // Default to tomorrow or next business day
    const tmrw = new Date();
    tmrw.setDate(tmrw.getDate() + 1);
    bookDateInput.value = tmrw.toISOString().split('T')[0];
  }

  function updatePriceDisplay() {
    if (!serviceSelect || !estimatedPriceDisplay) return;
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const price = selectedOption ? selectedOption.getAttribute('data-price') : 0;
    if (price && parseInt(price, 10) > 0) {
      estimatedPriceDisplay.textContent = `$${price}.00+`;
    } else {
      estimatedPriceDisplay.textContent = '$0.00';
    }
  }

  if (serviceSelect) {
    serviceSelect.addEventListener('change', updatePriceDisplay);
  }

  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.getAttribute('data-service');
      const price = btn.getAttribute('data-price');

      if (serviceSelect) {
        // Find option with this text or value
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value === serviceName) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
        updatePriceDisplay();
      }

      // Smooth scroll to booking form
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
        // Focus name field
        setTimeout(() => {
          const clientNameInput = document.getElementById('clientName');
          if (clientNameInput) clientNameInput.focus();
        }, 600);
      }
    });
  });


  // ===================================================================
  // 5. APPOINTMENT FORM SUBMISSION
  // ===================================================================
  const appointmentForm = document.getElementById('appointmentForm');
  const bookingSuccessBox = document.getElementById('bookingSuccessBox');
  const resetBookingBtn = document.getElementById('resetBookingBtn');

  if (appointmentForm && bookingSuccessBox) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const service = serviceSelect.value;
      const date = document.getElementById('bookDate').value;
      const time = document.getElementById('bookTime').value;

      if (!name || !phone || !service || !date || !time) {
        showToast('Please fill in all required fields.');
        return;
      }

      // Format date nicely
      const dateObj = new Date(date + 'T00:00:00');
      const dateFormatted = dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      // Generate realistic booking code
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const refCode = `MSB-${randNum}`;

      document.getElementById('confName').textContent = name;
      document.getElementById('confService').textContent = service;
      document.getElementById('confDateTime').textContent = `${dateFormatted} at ${time}`;
      document.getElementById('confRefCode').textContent = refCode;

      // Hide form, show confirmation
      appointmentForm.style.display = 'none';
      bookingSuccessBox.style.display = 'block';

      showToast(`Appointment reserved! Reference: ${refCode}`);
    });

    if (resetBookingBtn) {
      resetBookingBtn.addEventListener('click', () => {
        appointmentForm.reset();
        updatePriceDisplay();
        bookingSuccessBox.style.display = 'none';
        appointmentForm.style.display = 'block';
      });
    }
  }


  // ===================================================================
  // 6. GALLERY LIGHTBOX MODAL
  // ===================================================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const fullSrc = item.getAttribute('data-full');
      const title = item.getAttribute('data-title') || '';
      const desc = item.getAttribute('data-desc') || '';

      if (lightboxModal && lightboxImg && lightboxCaption) {
        lightboxImg.src = fullSrc;
        lightboxCaption.innerHTML = `<strong>${title}</strong><br><span style="font-size: 0.88rem; color: #a3a6b1;">${desc}</span>`;
        lightboxModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  });


  // ===================================================================
  // 7. FAQ ACCORDION
  // ===================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close others
        faqItems.forEach(otherItem => {
          if (otherItem !== item) otherItem.classList.remove('active');
        });
        // Toggle current
        item.classList.toggle('active', !isActive);
      });
    }
  });


  // ===================================================================
  // 8. CLIPBOARD COPY & SOCIAL SHARING
  // ===================================================================
  const copyAddressBtn = document.getElementById('copyAddressBtn');
  const shareBtn = document.getElementById('shareBtn');

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', () => {
      const address = "2640 W Baseline Rd #105, Phoenix, AZ 85041, United States (Baseline Crossings LLC)";
      navigator.clipboard.writeText(address).then(() => {
        showToast('Address copied! Paste into Google Maps or Uber.');
      }).catch(() => {
        showToast('Address: 2640 W Baseline Rd #105, Phoenix, AZ');
      });
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: "Melinda's Style Boutique Hair Salon",
          text: "Check out Melinda's Style Boutique Hair Salon in Phoenix, AZ! 4.9 Stars on Google.",
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('Website link copied to clipboard!');
        });
      }
    });
  }


  // ===================================================================
  // 9. TOAST NOTIFICATION HELPER
  // ===================================================================
  function showToast(message) {
    const toast = document.getElementById('toastMsg');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3800);
  }

});
