import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const endorsements = [
  {
    name: 'NICE (National Institute for Health and Care Excellence)',
    summary: 'Recommends EMDR for PTSD in adults and children.',
    link: 'https://www.nice.org.uk/guidance/ng116/chapter/recommendations',
  },
  {
    name: 'WHO (World Health Organization)',
    summary: 'Recommends EMDR in guidelines for conditions related to stress.',
    link: 'https://www.who.int/news/item/06-08-2013-who-releases-guidance-on-mental-health-care-after-trauma',
  },
  {
    name: 'APA (American Psychological Association)',
    summary: 'Conditionally recommends EMDR as an effective PTSD treatment.',
    link: 'https://www.apa.org/pubs/books/4318028',
  },
  {
    name: 'VA (US Department of Veterans Affairs)',
    summary: 'Strongly recommends EMDR for veterans with PTSD.',
    link: 'https://www.ptsd.va.gov/understand_tx/emdr.asp',
  },
  {
    name: 'SAMHSA (Substance Abuse and Mental Health Services Administration)',
    summary: 'Recognizes EMDR as an effective treatment for veterans with PTSD.',
    link: 'https://www.emdria.org/about-emdr-therapy/emdr-and-ptsd/',
  },
  {
    name: 'ISTSS (International Society for Traumatic Stress Studies)',
    summary: 'Guidelines recommend EMDR as a first-line treatment for PTSD.',
    link: 'https://www.emdria.org/about-emdr-therapy/emdr-and-ptsd/',
  },
];

export default function EndorsementCarousel() {

  return (
    <section className="py-12 emdr-gradient">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-6 overflow-hidden">

          <h2 className="text-xl font-bold text-white mb-3 text-center">
            Leading Organisations That Endorse EMDR
          </h2>
          <p className="text-white/90 text-center mb-6 text-sm">
            Swipe to see all endorsements →
          </p>

          <Swiper
            slidesPerView={1}
            spaceBetween={16}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            loop={false}
            centeredSlides={false}
            breakpoints={{
              640: { 
                slidesPerView: 2,
                spaceBetween: 16
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 16
              },
            }}
            modules={[Pagination]}
          >
            {endorsements.map((org, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-[220px] flex flex-col justify-between bg-white border border-primary-blue/20 rounded-xl p-5 shadow hover:shadow-md transition overflow-hidden">
                  <div>
                    <h3 className="text-base font-semibold text-primary-blue mb-2">{org.name}</h3>
                    <p className="text-sm text-slate-700 mb-3">{org.summary}</p>
                  </div>
                  <div className="text-sm text-primary-green font-medium mt-auto text-left">
                    Guidelines Available Online
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}