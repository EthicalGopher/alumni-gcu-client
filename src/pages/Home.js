import React from 'react';
import './pages.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NewsCard from '../components/common/NewsCard';
import EventCard from '../components/common/EventsCard';
import GalleryPreview from "../components/common/GalleryPreview";
import FeedHome from "../components/feed/FeedHome";
import LeadershipQuotesBanner from "../components/common/LeadershipQuotesBanner";

const Home = () => {
    return (
        <div className='main'>
            <div className="container mx-auto px-4 pt-2">
                <LeadershipQuotesBanner />
            </div>

            {/* Integrated Feed Section on Home */}
            <section className="home-feed-section my-4">
                <FeedHome />
            </section>

            <section className='hero3'>
                <div className="news-events-container">
                    <NewsCard />
                    <EventCard />
                </div>
            </section>

            <section className='hero4'>
                <GalleryPreview />
            </section>
        </div>
    );
};

export default Home;

