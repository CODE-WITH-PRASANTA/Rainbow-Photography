import React from 'react'
import HomeHeroSection from '../../Components/HomeHeroSection/HomeHeroSection'
import HomeGallerySection from '../../Components/HomeGallerySection/HomeGallerySection'
import HomeAboutSection from '../../Components/HomeAboutSection/HomeAboutSection'
import HomeServiceSection from '../../Components/HomeServiceSection/HomeServiceSection'
import HomeHeading from '../../Components/HomeHeading/HomeHeading'
import HomeStories from '../../Components/HomeStories/HomeStories'
import HomeWedingClicks from '../../Components/HomeWeddingClicks/HomeWeddingClicks'
import HomePricing from '../../Components/HomePricing/HomePricing'
import HomeScoring from '../../Components/HomeScoring/HomeScoring'
import HomeNews from '../../Components/HomeNews/HomeNews'

const Home = () => {
  return (
    <div>
      <HomeHeroSection />
      <HomeGallerySection />
      <HomeAboutSection />
      <HomeServiceSection />
      <HomeHeading />
     
      <HomeWedingClicks />
      <HomePricing />
      <HomeScoring />
      <HomeNews />
    </div>
  )
}

export default Home
