import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import CreatePost from '../components/PublishPost';
import { PostsContext } from '../context/PostsContext';

const PublishPost = () => {
    const { id } = useParams();
    const { themes } = useContext(PostsContext)
    const selectedTheme = themes.find((item) => Number(item?.id) === Number(id))

    if (!selectedTheme) {
      return (
        <div>
        <div className="w-full bg-[#f6f2ff]">
          <div className="flex p-4">
            <SideBar />
            <div className="block w-full lg:w-10/12">
              <TopHeader />
              <div className="w-full bg-white text-center h-full my-auto min-h-screen mt-4">
                <span className='text-black block text-2xl pt-10'>Invalid Theme</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }


  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="w-full bg-white">
              <CreatePost theme= {selectedTheme}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublishPost