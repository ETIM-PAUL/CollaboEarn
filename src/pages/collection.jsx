import React from 'react'
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import MyCollection from '../components/MyCollection'

const Collection = () => {
  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <MyCollection classType="collection" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Collection;