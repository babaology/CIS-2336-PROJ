var roomCards = document.querySelectorAll('.room-card');
var formWrap = document.getElementById('booking-form-wrap');
var roomIdInput = document.getElementById('room-id');
var selectedRoomTitle = document.getElementById('selected-room-title');
var bookingForm = document.getElementById('booking-form');
var cancelBtn = document.getElementById('cancel-btn');
var bookingResult = document.getElementById('booking-result');

roomCards.forEach(function(card) {
  var btn = card.querySelector('.select-room-btn');
  btn.addEventListener('click', function() {
    roomCards.forEach(function(c) { c.classList.remove('selected'); });
    card.classList.add('selected');
    roomIdInput.value = card.dataset.roomId;
    selectedRoomTitle.textContent = 'Booking: ' + card.dataset.roomName;
    formWrap.style.display = 'block';
  });
});

cancelBtn.addEventListener('click', function() {
  formWrap.style.display = 'none';
  bookingForm.reset();
  bookingResult.textContent = '';
  roomCards.forEach(function(c) { c.classList.remove('selected'); });
});

function validate() {
  var ok = true;

  function check(id, errId, condition) {
    var input = document.getElementById(id);
    var err = document.getElementById(errId);
    if (!condition(input.value)) {
      input.classList.add('error');
      err.classList.add('visible');
      ok = false;
    } else {
      input.classList.remove('error');
      err.classList.remove('visible');
    }
  }

  check('firstName', 'err-firstName', function(v) { return v.trim() !== ''; });
  check('lastName', 'err-lastName', function(v) { return v.trim() !== ''; });
  check('email', 'err-email', function(v) {
    return /@(cougarnet\.uh\.edu|uh\.edu)$/.test(v);
  });
  check('date', 'err-date', function(v) {
    if (!v) return false;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var max = new Date(today);
    max.setDate(today.getDate() + 14);
    var picked = new Date(v + 'T00:00:00');
    return picked >= today && picked <= max;
  });
  check('time', 'err-time', function(v) { return v !== ''; });
  check('duration', 'err-duration', function(v) { return v !== ''; });
  check('groupSize', 'err-groupSize', function(v) {
    var n = parseInt(v);
    return !isNaN(n) && n >= 1 && n <= 20;
  });

  return ok;
}

bookingForm.addEventListener('submit', function(e) {
  e.preventDefault();
  if (!validate()) return;

  var data = {
    roomId: document.getElementById('room-id').value,
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    duration: document.getElementById('duration').value,
    groupSize: document.getElementById('groupSize').value
  };

  fetch('http://localhost:3000/api/book', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  .then(function(res) { return res.json(); })
  .then(function(result) {
    if (result.success) {
      bookingResult.style.color = 'green';
      bookingResult.textContent = 'Booking confirmed! ID: ' + result.bookingId;
    } else {
      bookingResult.style.color = '#C8102E';
      bookingResult.textContent = result.message || 'Booking failed. Please try again.';
    }
  })
  .catch(function() {
    bookingResult.style.color = '#C8102E';
    bookingResult.textContent = 'Could not reach the server. Make sure it is running.';
  });
});
