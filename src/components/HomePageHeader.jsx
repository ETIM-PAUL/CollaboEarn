import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon } from 'lucide-react'

const HomePageHeader = () => {
    const navigate = useNavigate()
  return (
    <header className="flex items-center justify-between py-6">
        <div className='flex items-center space-x-10'>
          <h1 className="text-xl font-bold text-[#9e74eb]">CollaboEarn</h1>
          <nav className="space-x-6 text-sm text-gray-700">
            <a href="#categories" className="hover:text-black">Categories</a>
            <a href="#explore" className="hover:text-black">Explore</a>
            <a href="#plans" className="hover:text-black">Plans</a>
          </nav>
        </div>

        <div>
          <button onClick={() => navigate('/dashboard')} className="text-sm cursor-pointer bg-gradient-to-r from-[#9e74eb] to-[#c6b9ef] hover:opacity-90 text-white px-6 py-3 rounded-xl inline-flex items-center transition duration-300 shadow-md">
            Launch App
            <ArrowRightIcon className="w-5 h-5 ml-2" />
          </button>
        </div>
      </header>
  )
}

export default HomePageHeader