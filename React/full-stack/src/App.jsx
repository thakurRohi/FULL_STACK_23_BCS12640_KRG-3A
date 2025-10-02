import React from 'react';
import PostCard from './Components/PostCard';
import Todo from './Components/Todo';

const App = () => {
  return (
    <div className="p-8 font-sans min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Product Cards</h1>
      <div className="flex gap-6 flex-wrap">
        <PostCard
          name="Wireless Headphones"
          price={590}
          description="Comfortable, long-lasting wireless headphones with rich sound."
          instock={true}
        />
        <PostCard
          name="Smart Watch"
          price={120}
          description="Track your fitness and stay connected on the go."
          instock={false}
        />
        <PostCard
          name="Desk Lamp"
          price={245}
          description="Minimalist LED lamp for your workspace. Adjustable brightness."
          instock={true}
        />

        <Todo/>
      </div>
    </div>
  );
}

export default App;
