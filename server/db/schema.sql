-- ==============================================================================
-- AGENTIC AI-BASED COLLABORATIVE TRAVEL PLANNING AND RECOMMENDATION SYSTEM
-- Database Schema: MySQL Relational Normalization (3NF)
-- Final Year Engineering Project Database Specification
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS agentic_travel_db;
USE agentic_travel_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    profile_image TEXT,
    role ENUM('USER', 'GROUP_MEMBER', 'ADMIN') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. User Travel Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    preferred_travel_style VARCHAR(60) DEFAULT 'Standard',
    preferred_budget_min DECIMAL(10, 2) DEFAULT 5000.00,
    preferred_budget_max DECIMAL(10, 2) DEFAULT 50000.00,
    favourite_activities JSON,
    preferred_food JSON,
    preferred_transport JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Destinations Table
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state_or_country VARCHAR(100) NOT NULL,
    tagline VARCHAR(200),
    description TEXT,
    best_time_to_visit VARCHAR(100),
    avg_temperature_celsius INT DEFAULT 28,
    weather_condition VARCHAR(60) DEFAULT 'Sunny',
    rain_probability INT DEFAULT 15,
    humidity INT DEFAULT 65,
    image_url TEXT,
    popular_interests JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(200) NOT NULL,
    starting_location VARCHAR(120) NOT NULL,
    destination_id VARCHAR(64) NOT NULL,
    destination_name VARCHAR(120) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    travellers_count INT NOT NULL DEFAULT 1,
    adults_count INT NOT NULL DEFAULT 1,
    children_count INT NOT NULL DEFAULT 0,
    budget_allocated DECIMAL(12, 2) NOT NULL,
    travel_style VARCHAR(60) NOT NULL DEFAULT 'Standard',
    interests JSON,
    preferred_transport VARCHAR(60) DEFAULT 'Any',
    hotel_preference VARCHAR(60) DEFAULT 'Standard',
    food_preference VARCHAR(60) DEFAULT 'Any',
    activity_preference VARCHAR(60) DEFAULT 'Balanced',
    status ENUM('PLANNING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'SAVED') DEFAULT 'PLANNING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Trip Members (Group Collaboration) Table
CREATE TABLE IF NOT EXISTS trip_members (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64),
    name VARCHAR(120) NOT NULL,
    email VARCHAR(160) NOT NULL,
    role ENUM('ORGANIZER', 'MEMBER') DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 6. Hotels Table
CREATE TABLE IF NOT EXISTS hotels (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    location_address TEXT NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    review_count INT DEFAULT 120,
    price_per_night DECIMAL(10, 2) NOT NULL,
    room_type VARCHAR(80) NOT NULL,
    facilities JSON,
    image_url TEXT,
    availability_status VARCHAR(40) DEFAULT 'Available',
    description TEXT,
    match_tags JSON
);

-- 7. Transport Options Table
CREATE TABLE IF NOT EXISTS transport_options (
    id VARCHAR(64) PRIMARY KEY,
    type ENUM('BUS', 'TRAIN', 'FLIGHT') NOT NULL,
    operator_name VARCHAR(120) NOT NULL,
    operator_code VARCHAR(40),
    source_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    departure_time VARCHAR(20) NOT NULL,
    arrival_time VARCHAR(20) NOT NULL,
    duration VARCHAR(40) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    available_seats INT DEFAULT 20,
    rating DECIMAL(2, 1) DEFAULT 4.3,
    amenities JSON
);

-- 8. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    location VARCHAR(160) NOT NULL,
    category VARCHAR(60) NOT NULL,
    description TEXT,
    duration VARCHAR(40) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 4.6,
    image_url TEXT,
    suitable_weather VARCHAR(60) DEFAULT 'All',
    best_time_slot ENUM('Morning', 'Afternoon', 'Evening', 'Night') DEFAULT 'Morning'
);

-- 9. Restaurants Table
CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    cuisine VARCHAR(100) NOT NULL,
    price_range VARCHAR(30) DEFAULT '₹₹ (Moderate)',
    avg_price DECIMAL(10, 2) DEFAULT 800.00,
    rating DECIMAL(2, 1) DEFAULT 4.5,
    location VARCHAR(160) NOT NULL,
    opening_time VARCHAR(40) DEFAULT '11:00 AM - 11:00 PM',
    popular_dishes JSON,
    image_url TEXT
);

-- 10. Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(64) PRIMARY KEY, -- e.g. HTL-2026-00124 or TRN-2026-00841
    user_id VARCHAR(64) NOT NULL,
    trip_id VARCHAR(64),
    booking_type ENUM('HOTEL', 'BUS', 'TRAIN', 'FLIGHT', 'ACTIVITY') NOT NULL,
    item_id VARCHAR(64) NOT NULL,
    item_title VARCHAR(160) NOT NULL,
    details JSON,
    total_amount DECIMAL(12, 2) NOT NULL,
    status ENUM('PENDING', 'PAYMENT_PROCESSING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'CONFIRMED',
    qr_payload TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 11. Payments Table (Demo / Sandbox)
CREATE TABLE IF NOT EXISTS payments (
    id VARCHAR(64) PRIMARY KEY,
    booking_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method ENUM('UPI', 'CARD', 'NET_BANKING', 'DEMO_WALLET') NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL,
    status ENUM('INITIATED', 'SUCCESS', 'FAILED', 'EXPIRED') DEFAULT 'SUCCESS',
    is_sandbox BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- 12. Day-wise Itinerary Table
CREATE TABLE IF NOT EXISTS itineraries (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    day_number INT NOT NULL,
    title VARCHAR(120),
    date DATE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 13. Itinerary Items Table
CREATE TABLE IF NOT EXISTS itinerary_items (
    id VARCHAR(64) PRIMARY KEY,
    itinerary_id VARCHAR(64) NOT NULL,
    time_slot VARCHAR(30) NOT NULL, -- e.g. '09:00 AM'
    period ENUM('Morning', 'Afternoon', 'Evening', 'Night') NOT NULL,
    location VARCHAR(160) NOT NULL,
    activity_title VARCHAR(180) NOT NULL,
    estimated_cost DECIMAL(10, 2) DEFAULT 0.00,
    duration VARCHAR(40),
    travel_time VARCHAR(40),
    order_index INT DEFAULT 0,
    notes TEXT,
    FOREIGN KEY (itinerary_id) REFERENCES itineraries(id) ON DELETE CASCADE
);

-- 14. Group Collaboration Votes Table
CREATE TABLE IF NOT EXISTS votes (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    category ENUM('HOTEL', 'TRANSPORT', 'ACTIVITY') NOT NULL,
    option_id VARCHAR(64) NOT NULL,
    option_title VARCHAR(160) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 15. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id VARCHAR(64) PRIMARY KEY,
    trip_id VARCHAR(64) NOT NULL,
    title VARCHAR(160) NOT NULL,
    category ENUM('HOTEL', 'TRANSPORT', 'FOOD', 'ACTIVITY', 'SHOPPING', 'OTHER') NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    paid_by VARCHAR(120) NOT NULL,
    expense_date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 16. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    title VARCHAR(160) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('TRIP_CREATED', 'BOOKING_CONFIRMED', 'PAYMENT_SUCCESS', 'BOOKING_CANCELLED', 'GROUP_INVITE', 'VOTE_UPDATED', 'ITINERARY_UPDATED', 'BUDGET_WARNING') NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
