import Footer from '@/app/components/footer'
import Navbar from '@/app/components/navbar'
import SignupPage from '@/app/Pages/SignupPage'
import React from 'react'

const page = () => {
  return (
    <>
      <Navbar/>
        <SignupPage/>
        <Footer/>
    </>
  )
}

export default page