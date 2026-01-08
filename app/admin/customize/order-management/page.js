import Navbar from '@/app/components/navbar'
import { Button } from '@/components/ui/button'
import React from 'react'
import { FaHamburger } from 'react-icons/fa'
import OrderTable from '../../components/OrderTable'

const page = () => {
  return (
    <>
    <Navbar/>
      <div className='p-5  flex flex-col ' >
        <div className='header flex p-1 gap-5 items-center justify-between'>
          <div className='flex gap-3 items-center' >
            <div>
              <FaHamburger />
            </div>
            <div className='font-bold text-2xl '>
              Orders List
            </div>
          </div>
        </div>

        <div className='p-5 mt-3 border-2 border-gray-200 rounded-lg shadow-md'>
        <OrderTable/>
        </div>

        
      </div>

    </>
  )
}

export default page 