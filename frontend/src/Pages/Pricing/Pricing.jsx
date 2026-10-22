import React from 'react'
import PricingBreadcrum from '../../Components/PricingBreadcrum/PricingBreadcrum'
import PackageMemories from '../../Components/PackageMemories/PackageMemories'
import PricingMain from '../../Components/PricingMain/PricingMain'
import PricingFaq from '../../Components/PricingFaq/PricingFaq'

const Pricing = () => {
  return (
    <div>
      <PricingBreadcrum/>
      <PackageMemories/>
      <PricingMain/>
      <PricingFaq/>
    </div>
  )
}

export default Pricing
