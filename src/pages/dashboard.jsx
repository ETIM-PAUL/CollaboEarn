import React from 'react'
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import Dashboard from '../components/Dashboard'

const DashboardPage = () => {
  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <Dashboard />
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage