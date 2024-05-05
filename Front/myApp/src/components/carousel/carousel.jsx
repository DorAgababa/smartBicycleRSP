import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './carousel.css';
import { Colors } from '../../data/constants';
import Stack from '@mui/material/Stack';
import { getFromLocalStorage } from '../../utils/utils';

let dir = "rtl"; 
getFromLocalStorage("Language") == "IL" || undefined   ? dir = "rtl"   : dir = "ltr";
const Carousel = ({ data ,space}) => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };
  
    return (
      <>
      <Stack direction="row" sx={{ height: space }}></Stack>
      <Slider {...settings} className="carousel-container">
        {data.map((item, index) => (
          <div key={index} className="carousel-slide">
            <img src={item.image} alt={`image ${index + 1}` }  style={{ height: '28vh' , '@media (maxWidth: 767px)': { width: '100%'}}}/>
            <div className="carousel-content">
              <h2 style={{color:Colors.SemiDarkColor, fontWeight:'600',direction:dir}}>{item.title}</h2>
              <p style={{direction:dir}}>{item.description}</p>
            </div>
          </div>
        ))}
      </Slider>
      <Stack direction="row" sx={{ height: '50px' }}></Stack>
      </>
    );
  };
  
  export default Carousel;