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
    link: 'https://www.apa.org/ptsd-guideline',
  },
  {
    name: 'VA (US Department of Veterans Affairs)',
    summary: 'Strongly recommends EMDR for veterans with PTSD.',
    link: 'https://www.ptsd.va.gov/understand_tx/emdr.asp',
  },
  {
    name: 'NHS (National Health Service)',
    summary: 'Lists EMDR as an effective trauma-focused therapy for PTSD.',
    link: 'https://www.nhs.uk/mental-health/conditions/post-traumatic-stress-disorder-ptsd/treatment/',
  },
  {
    name: 'EMDRIA (EMDR International Association)',
    summary: 'Summarises global clinical endorsements of EMDR for PTSD.',
    link: 'https://www.emdria.org/about-emdr-therapy/emdr-and-ptsd/',
  },
  {
    name: 'International Society for Traumatic Stress Studies (ISTSS)',
    summary: 'Guidelines recommend EMDR as a first-line treatment for PTSD.',
    link: 'https://istss.org/clinical-resources/trauma-treatment/new-istss-prevention-and-treatment-guidelines/',
  },
];

export default function EndorsementCarousel() {
  const openInNewTab = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-20 emdr-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full bg-white/10 backdrop-blur-sm rounded-xl p-8 overflow-hidden">{/* Removed faded edges */}

          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Leading Organisations That Endorse EMDR
          </h2>
          <p className="text-white/90 text-center mb-8 text-sm">
            Swipe to see all endorsements →
          </p>

          <Swiper
            slidesPerView={1}
            spaceBetween={20}
            pagination={{ 
              clickable: true,
              dynamicBullets: true
            }}
            loop={true}
            centeredSlides={false}
            breakpoints={{
              640: { 
                slidesPerView: 2,
                spaceBetween: 20
              },
              1024: { 
                slidesPerView: 3,
                spaceBetween: 20
              },
            }}
            modules={[Pagination]}
            className="mb-8"
          >
            {endorsements.map((org, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-[280px] flex flex-col justify-between bg-white border border-blue-200 rounded-2xl p-6 shadow hover:shadow-md transition overflow-hidden">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">{org.name}</h3>
                    <p className="text-sm text-gray-700 mb-4">{org.summary}</p>
                  </div>
                  <button
                    onClick={() => openInNewTab(org.link)}
                    className="text-sm text-green-700 hover:underline font-medium mt-auto text-left"
                  >
                    View Guidelines →
                  </button>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-6 px-4">
            <p className="text-xs text-white/80">
              The organisations listed above have endorsed EMDR as a treatment for PTSD. Their inclusion here reflects support for the EMDR method itself, not this specific app.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}