// Force Light Theme (Clinic Green)
(function() {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
})();

// Hero Page-Load Reveal Animation
window.addEventListener('DOMContentLoaded', function() {
    var hero = document.querySelector('.hero');
    if (hero) {
        setTimeout(function() {
            hero.classList.add('loaded');
        }, 100);
    }

    // Page-Load Blur Reveal (for pages like services.html)
    var blurEls = document.querySelectorAll('.blur-reveal');
    if (blurEls.length) {
        setTimeout(function() {
            blurEls.forEach(function(el) {
                el.classList.add('revealed');
            });
        }, 150);
    }
});

// Mobile Menu
function toggleMenu() {
    document.getElementById('navLinks').classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// Treatment Search (services.html mobile only)
(function() {
    if (window.innerWidth > 768) return;

    var searchInput = document.getElementById('treatmentSearch');
    var clearBtn = document.getElementById('searchClear');
    if (!searchInput || !clearBtn) return;

    var cards = document.querySelectorAll('.service-card[data-search]');
    var categories = document.querySelectorAll('.service-category');

    function filterTreatments() {
        var query = searchInput.value.toLowerCase().trim();

        if (query.length > 0) {
            clearBtn.classList.add('visible');
        } else {
            clearBtn.classList.remove('visible');
        }

        cards.forEach(function(card) {
            var title = card.querySelector('h3').textContent.toLowerCase();
            var desc = card.querySelector('p').textContent.toLowerCase();
            var keywords = card.getAttribute('data-search').toLowerCase();
            var searchText = title + ' ' + desc + ' ' + keywords;
            if (query === '' || searchText.indexOf(query) !== -1) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        categories.forEach(function(cat) {
            var visibleCards = cat.querySelectorAll('.service-card:not(.hidden)');
            if (visibleCards.length === 0 && query !== '') {
                cat.classList.add('hidden');
            } else {
                cat.classList.remove('hidden');
            }
        });
    }

    searchInput.addEventListener('input', filterTreatments);

    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        clearBtn.classList.remove('visible');
        filterTreatments();
        searchInput.focus();
    });
})();

// Appointment Modal (only on pages with the modal)
function openAppointmentModal() {
    const modal = document.getElementById('book');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}
function closeAppointmentModal() {
    const modal = document.getElementById('book');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

const bookModal = document.getElementById('book');
if (bookModal) {
    bookModal.addEventListener('click', function(e) {
        if (e.target === this) closeAppointmentModal();
    });
}

// Service Expand Panels — Popup modal on click
(function() {
    var expandedOverlay = null;
    var triggeringCard = null;

    var flipCards = document.querySelectorAll('.flip-card[data-expand], .treatment-main-card[data-expand]');
    var overlays = document.querySelectorAll('.service-expand-overlay');

    function getFocusableElements(container) {
        return container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function trapFocus(e) {
        if (!expandedOverlay) return;
        var panel = expandedOverlay.querySelector('.service-expand-panel');
        var focusable = getFocusableElements(panel);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                }
            } else {
                if (document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    }

    function openOverlay(card) {
        if (expandedOverlay) closeOverlay();

        var expandId = card.getAttribute('data-expand');
        var overlay = document.getElementById(expandId);
        if (!overlay) return;

        triggeringCard = card;
        expandedOverlay = overlay;

        overlay.classList.add('show');
        overlay.setAttribute('aria-hidden', 'false');
        card.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';

        var closeBtn = overlay.querySelector('.expand-close');
        if (closeBtn) closeBtn.focus();

        document.addEventListener('keydown', trapFocus);
    }

    function closeOverlay() {
        if (!expandedOverlay) return;

        var overlay = expandedOverlay;
        expandedOverlay = null;

        overlay.classList.remove('show');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        document.removeEventListener('keydown', trapFocus);

        if (triggeringCard) {
            triggeringCard.setAttribute('aria-expanded', 'false');
            triggeringCard.focus();
            triggeringCard = null;
        }
    }

    flipCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            openOverlay(card);
        });

        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openOverlay(card);
            }
        });
    });

    document.querySelectorAll('.expand-close').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeOverlay();
        });
    });

    overlays.forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closeOverlay();
            }
        });
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && expandedOverlay) {
            closeOverlay();
        }
        if (e.key === 'Escape') {
            closeAppointmentModal();
        }
    });
})();

// Appointment Form Validation (only on pages with the form)
(function() {
    const form = document.getElementById('appointmentForm');
    if (!form) return;
    
    const fields = {
        fullName: {
            el: document.getElementById('fullName'),
            error: document.getElementById('error-fullName'),
            validate: (v) => /^[A-Za-z\s]{3,}$/.test(v.trim())
        },
        phone: {
            el: document.getElementById('phone'),
            error: document.getElementById('error-phone'),
            validate: (v) => /^[6-9]\d{9}$/.test(v.trim())
        },
        email: {
            el: document.getElementById('email'),
            error: document.getElementById('error-email'),
            validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        },
        appDate: {
            el: document.getElementById('appDate'),
            error: document.getElementById('error-appDate'),
            validate: (v) => {
                if (!v) return false;
                const selected = new Date(v + 'T00:00');
                const today = new Date();
                today.setHours(0,0,0,0);
                return selected >= today;
            }
        },
        appTime: {
            el: document.getElementById('appTime'),
            error: document.getElementById('error-appTime'),
            validate: (v) => {
                if (!v) return false;
                const dateVal = document.getElementById('appDate').value;
                if (!dateVal) return false;
                const now = new Date();
                const slot = new Date(dateVal + 'T' + v);
                return slot > now;
            }
        },
        symptoms: {
            el: document.getElementById('symptoms'),
            error: document.getElementById('error-symptoms'),
            validate: (v) => v.trim().length >= 10 && v.trim().length <= 500
        }
    };

    function showError(key, show) {
        const f = fields[key];
        if (show) {
            f.error.classList.add('show');
            f.el.classList.add('input-error');
        } else {
            f.error.classList.remove('show');
            f.el.classList.remove('input-error');
        }
    }

    Object.keys(fields).forEach(key => {
        const f = fields[key];
        f.el.addEventListener('input', () => showError(key, false));
        f.el.addEventListener('blur', () => {
            if (f.el.value.trim() && !f.validate(f.el.value)) showError(key, true);
        });
    });

    // Character counter for symptoms
    const symptomsEl = document.getElementById('symptoms');
    const symptomsCount = document.getElementById('symptoms-count');
    symptomsEl.addEventListener('input', function() {
        symptomsCount.textContent = this.value.length;
    });

    // Time slot generation based on date
    const appDateEl = document.getElementById('appDate');
    const appTimeEl = document.getElementById('appTime');
    const timeNote = document.getElementById('timeNote');

    // Set minimum date to today so past dates cannot be selected
    if (appDateEl) {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        appDateEl.min = `${yyyy}-${mm}-${dd}`;
    }

    function formatLocalDate(d) {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
    }

    function formatToLocalTime(h, m) {
        const date = new Date(2000, 0, 1, h, m);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function updateTimeSlots() {
        const dateStr = appDateEl.value;
        appTimeEl.innerHTML = '<option value="" disabled selected>Select a time slot</option>';
        
        const labelSpan = document.querySelector('label[for="appTime"] .hours-label');

        if (!dateStr) {
            timeNote.textContent = 'Choose a date to see available 30-minute time slots.';
            appTimeEl.disabled = true;
            const h9 = formatToLocalTime(9, 0);
            const h20 = formatToLocalTime(20, 0);
            const h10 = formatToLocalTime(10, 0);
            const h14 = formatToLocalTime(14, 0);
            if (labelSpan) labelSpan.textContent = `(${h9}-${h20} \u00A0|\u00A0 Sun: ${h10}-${h14})`;
            return;
        }

        appTimeEl.disabled = false;

        const dateObj = new Date(dateStr + 'T00:00');
        const day = dateObj.getDay();
        const isSunday = day === 0;
        const now = new Date();
        const isToday = dateStr === formatLocalDate(now);

        const startHour = isSunday ? 10 : 9;
        const endHour = isSunday ? 14 : 20; // exclusive

        if (isSunday) {
            timeNote.textContent = `Working hours on Sunday: ${formatToLocalTime(10,0)} - ${formatToLocalTime(14,0)}`;
            if (labelSpan) labelSpan.textContent = `(Sun: ${formatToLocalTime(10,0)}-${formatToLocalTime(14,0)})`;
        } else {
            const weekdays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
            timeNote.textContent = `Working hours on ${weekdays[day]}: ${formatToLocalTime(9,0)} - ${formatToLocalTime(20,0)}`;
            if (labelSpan) labelSpan.textContent = `(Mon-Sat: ${formatToLocalTime(9,0)}-${formatToLocalTime(20,0)})`;
        }

        for (let h = startHour; h < endHour; h++) {
            [0, 30].forEach(m => {
                const slotStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
                if (isToday) {
                    const slotDate = new Date(dateStr + 'T' + slotStr);
                    if (slotDate <= now) return;
                }
                const opt = document.createElement('option');
                opt.value = slotStr;
                opt.textContent = formatToLocalTime(h, m);
                appTimeEl.appendChild(opt);
            });
        }
    }

    if (appDateEl && appTimeEl) {
        appDateEl.addEventListener('change', updateTimeSlots);
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        let valid = true;
        Object.keys(fields).forEach(key => {
            const f = fields[key];
            if (!f.validate(f.el.value)) {
                showError(key, true);
                valid = false;
            }
        });

        if (valid) {
            document.getElementById('successBanner').classList.add('show');
            form.reset();
            appTimeEl.innerHTML = '<option value="" disabled selected>Select date first to view slots</option>';
            appTimeEl.disabled = true;
            if (timeNote) timeNote.textContent = 'Choose a date to see available 30-minute time slots.';
            const labelSpan = document.querySelector('label[for="appTime"] .hours-label');
            if (labelSpan) labelSpan.textContent = '(Mon-Sat: 9AM-8PM \u00A0|\u00A0 Sun: 10AM-2PM)';
            symptomsCount.textContent = '0';
            setTimeout(() => {
                document.getElementById('successBanner').classList.remove('show');
            }, 5000);
        }
    });
})();

// Scroll Reveal Animation (replays every scroll)
(function() {
    var reveals = document.querySelectorAll('.reveal, .reveal-scale, .reveal-fade, .blur-reveal');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(function(el) {
        observer.observe(el);
    });
})();

// Testimonial Marquee — Duplicate cards for seamless loop
(function() {
    var track = document.querySelector('.testi-marquee-track');
    if (!track) return;

    // Clone all cards and append for infinite scroll
    var cards = track.innerHTML;
    track.innerHTML = cards + cards;
})();

// Testimonials Split — Clone scroll tracks for seamless vertical loop
(function() {
    var tracks = document.querySelectorAll('.testi-scroll-track');
    if (!tracks.length) return;

    tracks.forEach(function(track) {
        var html = track.innerHTML;
        track.innerHTML = html + html;
    });
})();

// Testimonials Split — Counter animation for stats
(function() {
    var counters = document.querySelectorAll('.testi-stat-number');
    if (!counters.length) return;

    var animated = false;

    function animateCounters() {
        if (animated) return;
        animated = true;

        counters.forEach(function(counter) {
            var target = parseFloat(counter.getAttribute('data-target'));
            var isDecimal = counter.getAttribute('data-decimal') === 'true';
            var duration = 2000;
            var start = performance.now();

            function update(now) {
                var elapsed = now - start;
                var progress = Math.min(elapsed / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var current = target * eased;

                if (isDecimal) {
                    counter.textContent = current.toFixed(1);
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + '+';
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                }
            }

            requestAnimationFrame(update);
        });
    }

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(function(c) { observer.observe(c); });
})();
