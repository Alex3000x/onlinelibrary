import { useRef } from 'react';
import { Button, Container } from 'react-bootstrap';
// Note: You'll need to install swiper: npm install swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function BookCarousel({ title, books }) {
  return (
    <Container fluid className="py-4 px-5">
      <h3 className="text-white mb-4" style={{ fontWeight: '800', letterSpacing: '1px' }}>
        {title}
      </h3>
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1400: { slidesPerView: 5 },
        }}
        className="pb-5"
      >
        {books.map((book) => (
          <SwiperSlide key={book.id}>
            <div className="text-center">
              <img 
                src={book.imageUrl} 
                alt={book.title} 
                className="img-fluid shadow-lg mb-3"
                style={{ 
                  borderRadius: '5px', 
                  height: '350px', 
                  objectFit: 'cover',
                  width: '100%' 
                }} 
              />
              <p className="text-white fw-bold mb-0 text-truncate">{book.title}</p>
              <small className="text-light opacity-75">{book.author}</small>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
}

export default BookCarousel;