import React from 'react'
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import CreateThemePage from '../components/PostTheme';

const CreateTheme = () => {
    const { id } = useParams();

  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="w-full bg-white">
              <CreateThemePage type="theme" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateTheme