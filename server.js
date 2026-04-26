
const express = require('express'); 
const app = express(); 


const cors = require('cors'); 
app.use(cors());

const fs = require('fs'); 
const path = require('path'); 

app.use(express.json());

app.use(express.static(path.join(__dirname, 'frontend')));

const dbPath = path.join(__dirname, 'bookings.json');

function getBookings() {
    if (fs.existsSync(dbPath)) {
        const content = fs.readFileSync(dbPath, 'utf-8');
        if (content) return JSON.parse(content);
    }
    return {};
}

function saveBookings(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

const rooms = [
    { id: 'collab-a',     name: 'Collaboration Room A', capacity: 8  },
    { id: 'collab-b',     name: 'Collaboration Room B', capacity: 8  },
    { id: 'study-room-1', name: 'Quiet Study Room 1',   capacity: 4  },
    { id: 'study-room-2', name: 'Quiet Study Room 2',   capacity: 4  },
    { id: 'event-space',  name: 'Event Space',           capacity: 20 }
];

app.get('/api/rooms', (req, res) => {
    res.json({ rooms: rooms });
});

app.post('/api/book', (req, res) => {
    const roomId    = req.body.roomId;
    const firstName = req.body.firstName;
    const lastName  = req.body.lastName;
    const email     = req.body.email;
    const date      = req.body.date;
    const time      = req.body.time;
    const duration  = req.body.duration;
    const groupSize = req.body.groupSize;

    let room = null;
    for (let i = 0; i < rooms.length; i++) {
        if (rooms[i].id === roomId) {
            room = rooms[i];
            break;
        }
    }

    if (!room) {
        return res.json({ success: false, message: 'Room not found.' });
    }

    if (parseInt(groupSize) > room.capacity) {
        return res.json({ success: false, message: `Group size exceeds room capacity of ${room.capacity}.` });
    }

    const bookings = getBookings();

    if (!bookings[roomId]) {
        bookings[roomId] = [];
    }

    const newStart = parseInt(time.replace(':', ''));
    const newEnd   = newStart + (parseInt(duration) * 100);

    for (let j = 0; j < bookings[roomId].length; j++) {
        const existing = bookings[roomId][j];
        if (existing.date === date) {
            const exStart = parseInt(existing.time.replace(':', ''));
            const exEnd   = exStart + (parseInt(existing.duration) * 100);
            if (newStart < exEnd && newEnd > exStart) {
                return res.json({ success: false, message: 'That time slot is already booked for this room.' });
            }
        }
    }

    const bookingId = 'SC-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const newEntry = {
        bookingId: bookingId,
        firstName: firstName,
        lastName:  lastName,
        email:     email,
        date:      date,
        time:      time,
        duration:  duration,
        groupSize: groupSize
    };

    bookings[roomId].push(newEntry);
    saveBookings(bookings);

    res.json({
        success:   true,
        bookingId: bookingId,
        message:   'Booking confirmed!',
        details: {
            room:     room.name,
            date:     date,
            time:     time,
            duration: duration
        }
    });
});

app.get('/api/bookings', (req, res) => {
    const bookings = getBookings();
    const all = [];
    const keys = Object.keys(bookings);
    for (let i = 0; i < keys.length; i++) {
        for (let j = 0; j < bookings[keys[i]].length; j++) {
            all.push(bookings[keys[i]][j]);
        }
    }
    res.json({ count: all.length, bookings: all });
});

const port = 8080;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

