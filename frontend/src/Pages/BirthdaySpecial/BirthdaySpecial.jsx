import React from 'react'
import BirthdaySpecialMain from '../../Components/BirthdaySpecialMain/BirthdaySpecialMain'
import BirthdaySpecialTwo from '../../Components/BirthdaySpecialTwo/BirthdaySpecialTwo'
import BirthdayWhyChoose from '../../Components/BirthdayWhyChoose/BirthdayWhyChoose'
import BirthdayPackage from '../../Components/BirthdayPackage/BirthdayPackage'

const BirthdaySpecial = () => {
  return (
    <div>
        <BirthdaySpecialMain/>
        <BirthdaySpecialTwo/>
        <BirthdayWhyChoose/>
        <BirthdayPackage/>
    </div>
  )
}

export default BirthdaySpecial