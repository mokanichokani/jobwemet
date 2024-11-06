import Navbar from '@/components/Navbar';
import React from 'react';

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="p-8 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-bold mb-6 text-gray-800">About Job We Meet</h1>
        <p className="text-lg mb-4 text-gray-600">
          At <strong>Job We Meet</strong>, we believe that landing your dream job should be simpler and more accessible. Our platform is designed to revolutionize the job search experience by connecting job seekers with employers in a fast, seamless, and personalized way. Whether you’re a fresh graduate or an experienced professional, Job We Meet is your ultimate tool for career success.
        </p>
        <p className="text-lg mb-6 text-gray-600">
          Built with <strong>Next.js</strong>, our job portal offers lightning-fast performance, intuitive navigation, and robust security, ensuring a flawless experience for users.
        </p>
        <h2 className="text-3xl font-semibold mb-4 text-gray-800">Meet the Team</h2>
  
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-gray-700">Aakash Mokani – Full Stack Developer</h3>
          <p className="text-lg text-gray-600 mt-2">
            Arjun brought his extensive expertise in full stack development to the Job We Meet project. He utilized Next.js to develop the platform’s core functionalities, focusing on server-side rendering and API integration for fast and reliable performance.
          </p>
        </div>
  
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-gray-700">Aayush Mohite – UI/UX Designer</h3>
          <p className="text-lg text-gray-600 mt-2">
            Priya has a keen eye for design and user experience. She worked closely with the development team to create a sleek and intuitive interface using Next.js, ensuring a smooth user journey across devices.
          </p>
        </div>
  
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-gray-700">Krrish Nichanni – Frontend Engineer</h3>
          <p className="text-lg text-gray-600 mt-2">
            Sameer specialized in frontend development, leveraging Next.js’s client-side features to make the platform fast, dynamic, and responsive. His work ensures that users enjoy a seamless experience.
          </p>
        </div>
  
        <div className="mb-8">
          <h3 className="text-2xl font-medium text-gray-700"> – Piyush Mehta Engineer</h3>
          <p className="text-lg text-gray-600 mt-2">
            Neha’s expertise in backend architecture was crucial in optimizing database interactions and API performance. With her contributions, the platform can handle thousands of job listings and user profiles efficiently.
          </p>
        </div>
      </div>
    </>
  );
};

export default About;
