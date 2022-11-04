import React, { useRef } from 'react';

const Slider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide: true,
    autoplay: true,
    arrows: false,
    lazyLoad: true,
    centerMode: true,
    // centerPadding: '100px',
    focusOnSelect: true,

    responsive: [
      {
        breakpoint: 1260,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
          //   centerPadding: '0',
        },
      },
      {
        breakpoint: 1060,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          initialSlide: 0,
          centerMode: true,
          //   centerPadding: '0',
        },
      },
      {
        breakpoint: 730,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 0,
          centerMode: true,
          centerPadding: '0',
        },
      },
    ],
  };
  const slide = useRef();

  // <Slider {...settings} ref={slide}>
  //           {
  //               item.files.map((i, item) => (
  //                 <div key={item} className="w-full h-full flex justify-center items-center ">
  //                   {
  //                     i.type.startsWith('image')
  //                       ? (
  //                         <>
  //                           {
  //                           imageLoading.filter((t) => t.path === i.path).length > 0
  //                         && (
  //                           <div className="w-full h-full flex items-center justiy-center">
  //                             <BallTriangle
  //                               height={100}
  //                               width={100}
  //                               radius={5}
  //                               color="#4fa94d"
  //                               ariaLabel="ball-triangle-loading"
  //                               wrapperClass={{}}
  //                               wrapperStyle=""
  //                               visible
  //                             />
  //                           </div>

  //                         )

  //                         }
  //                           <img
  //                             onLoad={() => imageLoaded(i.path)}
  //                             src={`${process.env.SERVER}/${i.path}`}
  //                             className={` object-cover
  //                               ${imageLoading.filter((t) => t.path === i.path).length > 0 && 'hidden'}
  //                             `}
  //                             alt="image"
  //                             loading="lazy"
  //                           />

  //                         </>
  //                       )

  //                       : (
  //                         <video
  //                           src={`${process.env.SERVER}/${i.path}`}
  //                           className="object-contain"
  //                           controls
  //                           controlsList="nodownload"
  //                         />
  //                       )
  //                   }
  //                 </div>
  //               ))
  //           }

  //         </Slider>
  return (
    <div>Slider</div>
  );
};

export default Slider;
