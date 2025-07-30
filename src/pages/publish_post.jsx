import React from 'react'
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import CreatePost from '../components/PublishPost';

const PublishPost = () => {
    const { id } = useParams();
    console.log(id);

  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="w-full bg-white">
              <CreatePost />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishPost