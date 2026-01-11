// Customer Home Page - Enhanced Landing Page

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    FiWifi, FiCoffee, FiMapPin, FiArrowRight, FiStar, FiUsers,
    FiAward, FiCalendar, FiHeart, FiPhone, FiMail, FiClock,
    FiShield, FiDroplet, FiSun, FiMusic, FiTv, FiWind
} from 'react-icons/fi';
import { getRooms } from '../../firebase/services/roomService';
import { Spinner } from '../../shared/components/ui';
import './Home.css';

const Home = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ rooms: 0, guests: 0, years: 0, rating: 0 });
    const statsRef = useRef(null);
    const [statsVisible, setStatsVisible] = useState(false);

    useEffect(() => {
        loadFeaturedRooms();

        // Intersection Observer for stats animation
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setStatsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Animate stats counter
    useEffect(() => {
        if (statsVisible) {
            const duration = 2000;
            const targets = { rooms: 150, guests: 50000, years: 25, rating: 4.9 };
            const start = Date.now();

            const animate = () => {
                const elapsed = Date.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic

                setStats({
                    rooms: Math.floor(targets.rooms * eased),
                    guests: Math.floor(targets.guests * eased),
                    years: Math.floor(targets.years * eased),
                    rating: (targets.rating * eased).toFixed(1)
                });

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            requestAnimationFrame(animate);
        }
    }, [statsVisible]);

    const loadFeaturedRooms = async () => {
        const res = await getRooms();
        if (res.success) {
            setRooms(res.data.slice(0, 4));
        }
        setLoading(false);
    };

    const testimonials = [
        {
            name: "Sarah Mitchell",
            role: "Business Traveler",
            text: "Absolutely stunning property! The attention to detail is remarkable. From the moment I arrived, the staff made me feel like royalty.",
            rating: 5,
            avatar: "👩‍💼"
        },
        {
            name: "James Rodriguez",
            role: "Honeymoon Guest",
            text: "We celebrated our honeymoon here and it was magical. The ocean view suite exceeded all expectations. Truly unforgettable!",
            rating: 5,
            avatar: "👨"
        },
        {
            name: "Emily Chen",
            role: "Family Vacation",
            text: "Perfect for families! Kids loved the pool, and we loved the spa. The concierge helped us plan the perfect itinerary.",
            rating: 5,
            avatar: "👩"
        }
    ];

    const services = [
        { icon: <FiDroplet />, title: "Infinity Pool", desc: "Panoramic ocean views" },
        { icon: <FiSun />, title: "Private Beach", desc: "Exclusive access" },
        { icon: <FiCoffee />, title: "Fine Dining", desc: "Michelin-starred chefs" },
        { icon: <FiHeart />, title: "Luxury Spa", desc: "World-class treatments" },
        { icon: <FiShield />, title: "24/7 Security", desc: "Your safety first" },
        { icon: <FiWind />, title: "Fitness Center", desc: "State-of-the-art equipment" },
        { icon: <FiMusic />, title: "Live Entertainment", desc: "Nightly performances" },
        { icon: <FiTv />, title: "Business Center", desc: "Meeting rooms available" }
    ];

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-video-overlay"></div>
                <div className="hero-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle" style={{
                            '--delay': `${Math.random() * 5}s`,
                            '--x': `${Math.random() * 100}%`,
                            '--duration': `${15 + Math.random() * 10}s`
                        }}></div>
                    ))}
                </div>
                <div className="container hero-content">
                    <span className="hero-badge animate-fade-in">✨ Award-Winning Luxury Hotel</span>
                    <h1 className="hero-title">
                        <span className="title-line animate-slide-up">Experience</span>
                        <span className="title-line animate-slide-up delay-1">Timeless</span>
                        <span className="title-line gold animate-slide-up delay-2">Elegance</span>
                    </h1>
                    <p className="hero-subtitle animate-fade-in delay-3">
                        Nestled along pristine shores, LuxeStay offers an unparalleled escape
                        where world-class hospitality meets breathtaking natural beauty.
                    </p>
                    <div className="hero-cta animate-fade-in delay-4">
                        <Link to="/rooms" className="cta-btn primary">
                            Explore Rooms <FiArrowRight />
                        </Link>
                        <a href="#about" className="cta-btn secondary">
                            Discover More
                        </a>
                    </div>
                    <div className="hero-features animate-fade-in delay-5">
                        <div className="hero-feature">
                            <FiStar /> <span>5-Star Luxury</span>
                        </div>
                        <div className="hero-feature">
                            <FiMapPin /> <span>Oceanfront Location</span>
                        </div>
                        <div className="hero-feature">
                            <FiAward /> <span>Award Winning</span>
                        </div>
                    </div>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll to explore</span>
                    <div className="scroll-arrow"></div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="about-section">
                <div className="container about-grid">
                    <div className="about-images">
                        <div className="about-img main-img">
                            <div className="img-placeholder-large">🏨</div>
                        </div>
                        <div className="about-img secondary-img">
                            <div className="img-placeholder-medium">🌅</div>
                        </div>
                        <div className="experience-badge">
                            <span className="exp-number">25+</span>
                            <span className="exp-text">Years of Excellence</span>
                        </div>
                    </div>
                    <div className="about-content">
                        <span className="section-tag">About LuxeStay</span>
                        <h2>Where Luxury Meets <span className="text-gold">Tranquility</span></h2>
                        <p className="about-lead">
                            Since 1999, LuxeStay has redefined hospitality excellence. Our commitment
                            to creating unforgettable experiences has made us a sanctuary for discerning
                            travelers from around the globe.
                        </p>
                        <p>
                            Every detail, from our hand-selected linens to our farm-to-table cuisine,
                            reflects our dedication to perfection. Our award-winning team of hospitality
                            professionals anticipates your every need, ensuring a seamless and
                            extraordinary stay.
                        </p>
                        <div className="about-features">
                            <div className="about-feature">
                                <div className="feature-icon"><FiHeart /></div>
                                <div>
                                    <h4>Personalized Service</h4>
                                    <p>Tailored experiences for every guest</p>
                                </div>
                            </div>
                            <div className="about-feature">
                                <div className="feature-icon"><FiAward /></div>
                                <div>
                                    <h4>Award Winning</h4>
                                    <p>Recognized by leading travel publications</p>
                                </div>
                            </div>
                        </div>
                        <Link to="/rooms" className="about-cta">
                            Explore Our Rooms <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section" ref={statsRef}>
                <div className="container stats-grid">
                    <div className="stat-item">
                        <span className="stat-number">{stats.rooms}+</span>
                        <span className="stat-label">Luxury Rooms</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.guests.toLocaleString()}+</span>
                        <span className="stat-label">Happy Guests</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.years}+</span>
                        <span className="stat-label">Years of Excellence</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">{stats.rating}</span>
                        <span className="stat-label">Guest Rating</span>
                    </div>
                </div>
            </section>

            {/* Featured Rooms */}
            <section className="rooms-section">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Accommodations</span>
                        <h2>Discover Our <span className="text-gold">Signature Rooms</span></h2>
                        <p>Each room is a sanctuary of comfort, designed for the modern traveler</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-8"><Spinner /></div>
                    ) : (
                        <div className="rooms-grid-enhanced">
                            {rooms.map((room, index) => (
                                <div key={room.id} className="room-card-enhanced" style={{ '--delay': `${index * 0.1}s` }}>
                                    <div className="room-image-container">
                                        <div className="room-image-placeholder">
                                            {room.roomTypeName?.includes('Suite') ? '🏰' :
                                                room.roomTypeName?.includes('Deluxe') ? '✨' : '🛏️'}
                                        </div>
                                        <div className="room-overlay">
                                            <Link to={`/book/${room.id}`} className="view-room-btn">
                                                Book Now
                                            </Link>
                                        </div>
                                        <span className="room-price-tag">${room.price}<small>/night</small></span>
                                    </div>
                                    <div className="room-details">
                                        <h3>{room.roomTypeName}</h3>
                                        <p>Room {room.roomNumber} • Floor {room.floor}</p>
                                        <div className="room-amenities-icons">
                                            <span title="WiFi"><FiWifi /></span>
                                            <span title="TV"><FiTv /></span>
                                            <span title="AC"><FiWind /></span>
                                            <span title="Coffee"><FiCoffee /></span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="section-cta">
                        <Link to="/rooms" className="outline-btn">
                            View All Rooms <FiArrowRight />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="services-section">
                <div className="container">
                    <div className="section-header centered light">
                        <span className="section-tag">Services & Amenities</span>
                        <h2>World-Class <span className="text-gold">Facilities</span></h2>
                        <p>Everything you need for an unforgettable stay</p>
                    </div>

                    <div className="services-grid">
                        {services.map((service, i) => (
                            <div key={i} className="service-card" style={{ '--delay': `${i * 0.05}s` }}>
                                <div className="service-icon">{service.icon}</div>
                                <h4>{service.title}</h4>
                                <p>{service.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="container">
                    <div className="section-header centered">
                        <span className="section-tag">Guest Reviews</span>
                        <h2>What Our <span className="text-gold">Guests Say</span></h2>
                    </div>

                    <div className="testimonials-grid">
                        {testimonials.map((testimonial, i) => (
                            <div key={i} className="testimonial-card" style={{ '--delay': `${i * 0.1}s` }}>
                                <div className="testimonial-stars">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <FiStar key={j} className="star-filled" />
                                    ))}
                                </div>
                                <p className="testimonial-text">"{testimonial.text}"</p>
                                <div className="testimonial-author">
                                    <span className="author-avatar">{testimonial.avatar}</span>
                                    <div>
                                        <h5>{testimonial.name}</h5>
                                        <span>{testimonial.role}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Special Offers */}
            <section className="offers-section">
                <div className="container">
                    <div className="offer-card-large">
                        <div className="offer-content">
                            <span className="offer-badge">Limited Time Offer</span>
                            <h2>Stay Longer, Save More</h2>
                            <p>Book 3 nights and get the 4th night absolutely free.
                                Includes complimentary breakfast and spa credit.</p>
                            <ul className="offer-perks">
                                <li>✓ Free 4th night</li>
                                <li>✓ Daily breakfast for two</li>
                                <li>✓ $100 spa credit</li>
                                <li>✓ Late checkout</li>
                            </ul>
                            <Link to="/rooms" className="cta-btn primary">
                                Book This Offer <FiArrowRight />
                            </Link>
                        </div>
                        <div className="offer-image">
                            <div className="offer-image-placeholder">🎁</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Preview */}
            <section className="contact-section">
                <div className="container contact-grid">
                    <div className="contact-info">
                        <span className="section-tag">Get in Touch</span>
                        <h2>We're Here to <span className="text-gold">Help</span></h2>
                        <p>Have questions? Our concierge team is available 24/7 to assist you.</p>

                        <div className="contact-items">
                            <div className="contact-item">
                                <FiPhone />
                                <div>
                                    <h5>Call Us</h5>
                                    <span>+1 (555) 123-4567</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <FiMail />
                                <div>
                                    <h5>Email Us</h5>
                                    <span>reservations@luxestay.com</span>
                                </div>
                            </div>
                            <div className="contact-item">
                                <FiClock />
                                <div>
                                    <h5>Reception Hours</h5>
                                    <span>24/7 - Always Available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="contact-map">
                        <div className="map-placeholder">
                            <FiMapPin className="map-icon" />
                            <span>123 Oceanfront Drive<br />Paradise Bay, CA 90210</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="newsletter-section">
                <div className="container newsletter-content">
                    <h3>Subscribe to Our Newsletter</h3>
                    <p>Get exclusive offers, travel tips, and updates delivered to your inbox.</p>
                    <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" />
                        <button type="submit">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
