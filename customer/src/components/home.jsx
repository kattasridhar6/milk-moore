import React from 'react';
import homepic from '../img/homepic3.jpg';


const Home = () => {
  return (
    <div className=" mx-auto px-6 py-4 flex flex-col items-center justify-center gap-12">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full h-[300px] rounded-2xl overflow-hidden shadow-lg">
          <img
            src={homepic}
            alt="Fresh Milk"
            className="w-full h-full object-cover object-top"
          />
        </div>

        <div className="space-y-8">
          <h1 className="text-7xl font-extrabold text-[#1E1A1E] leading-tight sm:text-4xl text-balance">
            Our Milk Takes Daily Exams!
          </h1>
          <p className="text-xl text-[#6A616B] leading-relaxed font-lexend">
            Tested daily for antibiotics, hormones, and additives — it takes more tests than any college kid!
            Only milk that aces every test is delivered to your doorstep.
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;
