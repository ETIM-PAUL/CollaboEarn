import React, { useContext } from 'react'
import { useParams } from 'react-router-dom';
import SideBar from '../components/SideBar'
import TopHeader from '../components/TopHeader'
import BlogPostDetails from '../components/BlogPostDetails';
import { PostsContext } from '../context/PostsContext';

const BlogDetails = () => {
    const { id } = useParams();

    const { forYouPosts, themes } = useContext(PostsContext)
    const selectedContent = forYouPosts.find((item) => Number(item?.id) === Number(id))
    
    if (!selectedContent) {
      return (
        <div>
        <div className="w-full bg-[#f6f2ff]">
          <div className="flex p-4">
            <SideBar />
            <div className="block w-full lg:w-10/12">
              <TopHeader />
              <div className="w-full bg-white text-center h-full my-auto min-h-screen mt-4">
                <span className='text-black block text-2xl pt-10'>Invalid Content ID</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
    
    const selectedTheme = themes.find((item) => Number(item?.id) === Number(selectedContent?.theme))

  return (
    <div>
      <div className="w-full bg-[#f6f2ff]">
        <div className="flex p-4">
          <SideBar />
          <div className="block w-full lg:w-10/12">
            <TopHeader />
            <div className="w-full bg-white">
              <BlogPostDetails post={selectedContent} theme={selectedTheme}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetails