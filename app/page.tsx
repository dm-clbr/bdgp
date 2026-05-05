import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import CourseCarousel from '@/components/CourseCarousel'
import AboutSection from '@/components/AboutSection'
import HighlightsSection from '@/components/HighlightsSection'
import LodgingSection from '@/components/LodgingSection'
import TeeTimesSection from '@/components/TeeTimesSection'
import RSVPSection from '@/components/RSVPSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />
      <CourseCarousel />
      <AboutSection />
      <div className="gold-divider" />
      <HighlightsSection />
      <div className="gold-divider" />
      <LodgingSection />
      <div className="gold-divider" />
      <TeeTimesSection />
      <div className="gold-divider" />
      <RSVPSection />
      <Footer />
    </>
  )
}
