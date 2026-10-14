import React from 'react'
import RSVPBreadcrum from '../../Components/RSVPBreadcrum/RSVPBreadcrum'
import RSVPInvitation from '../../Components/RSVPInvitation/RSVPInvitation'
import RSVPWedingHero from '../../Components/RSVPWedingHero/RSVPWedingHero'
import RSVPPartner from '../../Components/RSVPPartner/RSVPPartner'

const RSVP = () => {
  return (
    <div>
      <RSVPBreadcrum />
      <RSVPInvitation />
     <RSVPWedingHero />
     <RSVPPartner />
    </div>
  )
}

export default RSVP
