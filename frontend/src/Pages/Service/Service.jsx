import React from 'react'
import ServiceHome from '../../Components/ServiceHome/ServiceHome'
import OurService from '../../Components/OurService/OurService'
import Venue from '../../Components/Venue/Venue'
import PriceandPlane from '../../Components/PriceandPlane/PriceandPlane'
import Arrangement from '../../Components/Arrangement/Arrangement'

const Service = () => {
  return (
    <div>
        <ServiceHome/>
        <OurService/>
        <Venue/>
        <PriceandPlane/>
        <Arrangement/>

    </div>
  )
}

export default Service