// === AVAILABLE CARS ===

const carListEl = document.getElementById('carList');
const carSelect = document.getElementById('car');
const API_BASE = 'http://localhost:4000/api';

async function loadCars() {
  try {
    const res = await fetch(`${API_BASE}/cars`);
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const cars = await res.json();
    renderCars(cars);
    populateCarSelect(cars);
  } catch (err) {
    console.warn('⚠️ Backend unavailable, showing sample cars', err);
    const fallbackCars = [
      { name: "Toyota Innova", price: 2600, img: "innova.jpg" },
      { name: "Suzuki Swift", price: 1600, img: "swift.jpg" },
      { name: "Toyota Fortuner", price: 3500, img: "fortuner.jpg" },
      { name: "Mahindra Thar", price: 5000, img: "thar.jpg" },
      { name: "Toyota Innova Crysta", price: 3000, img: "innova crysta.jpg" },
      { name: "Maruti Baleno", price: 1500, img: "baleno.jpg" },
      { name: "Hyundai Exter", price: 2200, img: "hyundai.jpg" },
      { name: "Hyundai i20", price: 2800, img: "hyundaii20.jpg" },
    ];
    renderCars(fallbackCars);
    populateCarSelect(fallbackCars);
  }
}

function renderCars(cars) {
  if (!carListEl) return;
  carListEl.innerHTML = '';
  cars.forEach((car) => {
    const div = document.createElement('div');
    div.className = 'car-card';
    const placeholderText = encodeURIComponent(car.name);
    div.innerHTML = `
      <img src="${car.img}" alt="${car.name}" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=${placeholderText}'">
      <div class="car-info">
        <h3>${car.name}</h3>
        <p>Comfort, power, and performance.</p>
        <span class="price">₹${Number(car.price).toLocaleString()} / day</span>
        <button class="btn rent-btn" data-car="${car.name}" data-price="${car.price}">Rent Now</button>
      </div>
    `;
    carListEl.appendChild(div);
  });

  // Add event listeners to all "Rent Now" buttons
  document.querySelectorAll('.rent-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const carName = e.target.getAttribute('data-car');
      const carSelectElement = document.getElementById('car');
      if (carSelectElement) {
        carSelectElement.value = carName;
      }
      const bookSection = document.getElementById('book');
      if (bookSection) {
        bookSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

function populateCarSelect(cars) {
  if (!carSelect) return;
  carSelect.innerHTML = '<option value="">Select a car...</option>';
  cars.forEach(car => {
    const option = document.createElement('option');
    option.value = car.name;
    option.textContent = `${car.name} - ₹${Number(car.price).toLocaleString()}/day`;
    carSelect.appendChild(option);
  });
}

// Wait for DOM to be ready before calling loadCars
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCars);
} else {
  loadCars();
}

// Booking Form
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const car = document.getElementById('car')?.value?.trim() || '';
    const pickup = document.getElementById('pickup')?.value?.trim() || '';
    const ret = document.getElementById('return')?.value?.trim() || '';
    const name = document.getElementById('bookingName')?.value?.trim() || '';
    const email = document.getElementById('bookingEmail')?.value?.trim() || '';
    const confirmation = document.getElementById('confirmation');

    if (!car || !pickup || !ret || !name || !email) {
      if (confirmation) {
        confirmation.style.color = 'red';
        confirmation.textContent = '❌ Please fill in all booking fields.';
      }
      return;
    }

    if (new Date(ret) <= new Date(pickup)) {
      if (confirmation) {
        confirmation.style.color = 'red';
        confirmation.textContent = '❌ Return date must be after pickup date.';
      }
      return;
    }

    if (confirmation) {
      confirmation.style.color = "green";
      confirmation.textContent = `✅ Thank you, ${name}! Your booking for "${car}" from ${pickup} to ${ret} is confirmed. We will email details to ${email}.`;
    }

    setTimeout(() => bookingForm.reset(), 500);
  });
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contactName')?.value?.trim() || '';
    const email = document.getElementById('contactEmail')?.value?.trim() || '';
    const message = document.getElementById('message')?.value?.trim() || '';
    const confirmation = document.getElementById('contactConfirmation');

    if (!name || !email || !message) {
      if (confirmation) {
        confirmation.style.color = 'red';
        confirmation.textContent = '❌ Please fill in all fields.';
      }
      return;
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (confirmation) {
        confirmation.style.color = 'red';
        confirmation.textContent = '❌ Please enter a valid email address.';
      }
      return;
    }

    if (confirmation) {
      confirmation.style.color = 'green';
      confirmation.textContent = `✅ Thank you, ${name}! We'll get back to you at ${email} soon.`;
    }

    setTimeout(() => contactForm.reset(), 500);
  });
}

// Remove any leftover "Hello" that may have been rendered into the React root during development
const reactRoot = document.getElementById('react-root');
if (reactRoot && reactRoot.textContent.trim().toLowerCase() === 'hello') {
    reactRoot.textContent = '';
}
