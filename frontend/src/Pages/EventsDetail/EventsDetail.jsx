import React from 'react'
import DetailsBreadcrum from '../../Components/DetailsBreadcrum/DetailsBreadcrum'
import ImageFrame from '../../Components/ImageFrame/ImageFrame'
import EventInfo from '../../Components/EventInfo/EventInfo'
import AboutEvents from '../../Components/AboutEvent/AboutEvent'
import EventNavigation from '../../Components/EventNavigation/EventNavigation'


const EventsDetail = () => {
  return (
    <div>
      <DetailsBreadcrum/>
      <ImageFrame/>
      <EventInfo/>
      <AboutEvents/>
      <EventNavigation/>
    </div>
  )
}

export default EventsDetail
