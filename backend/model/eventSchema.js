const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Event description is required']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        get: function(date) {
            return date ? date.toISOString().split('T')[0] : null;
        },
        set: function(date) {
            if (!date) return null;
            // If the date is already a Date object, return it
            if (date instanceof Date) return date;
            // If it's a string, parse it
            return new Date(date);
        }
    },
    time: {
        type: String,
        required: [true, 'Event time is required'],
        validate: {
            validator: function(v) {
                // Validate time format (HH:mm)
                return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
            },
            message: props => `${props.value} is not a valid time format! Use HH:mm format`
        }
    },
    venue: {
        type: String,
        required: [true, 'Event venue is required'],
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Event category is required'],
        enum: {
            values: ['conference', 'workshop', 'seminar', 'party'],
            message: '{VALUE} is not supported as a category'
        }
    },
    capacity: {
        type: Number,
        required: [true, 'Event capacity is required'],
        min: [1, 'Capacity must be at least 1']
    },
    price: {
        type: Number,
        required: [true, 'Event price is required'],
        min: [0, 'Price cannot be negative'],
        default: 0
    },
    image: {
        type: String
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Add virtual field for available spots
eventSchema.virtual('availableSpots').get(function() {
    return this.capacity - (this.bookedBy ? this.bookedBy.length : 0);
});

// Add virtual field for isBooked
eventSchema.virtual('isFull').get(function() {
    return this.availableSpots === 0;
});

// Pre-save middleware to ensure date is a valid Date object
eventSchema.pre('save', function(next) {
    if (this.date && !(this.date instanceof Date)) {
        this.date = new Date(this.date);
    }
    next();
});

// Pre-save middleware to validate time format
eventSchema.pre('save', function(next) {
    if (!this.time) {
        next(new Error('Event time is required'));
        return;
    }
    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this.time)) {
        next(new Error('Invalid time format. Use HH:mm format'));
        return;
    }
    next();
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;