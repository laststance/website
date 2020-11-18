import React from 'react'

const PostTitle: React.FC = ({ children }) => {
  return (
    <h1 className="text-7xl font-bold tracking-tighter leading-tight md:leading-none mb-12 text-center md:text-left">
      {children}
    </h1>
  )
}

export default PostTitle