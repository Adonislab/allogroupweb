import React from "react";
import { BsFillPlayCircleFill } from "react-icons/bs";


const About = () => {
  return (
    <div className="about-section-container" id="about">
      <div className="about-section-text-container text-white p-8">
        <p className="text-2xl font-bold text-orange-500">ALLÔ GROUP</p>
        <h1 className="text-4xl font-bold mt-4 text-blue-500">
          Etre leader dans le service d'intermédiation au Bénin.
        </h1>
        <p className="text-xl mt-4 text-black">
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>
        <p className="text-xl mt-4 text-black">
          Non tincidunt magna non et elit. Dolor turpis molestie dui magnis
          facilisis at fringilla quam.
        </p>
        <div className="mt-8">
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-base mr-4">Plus</button>
          <button className="bg-blue-600 text-white py-2 px-6 rounded-lg text-base">
            <BsFillPlayCircleFill className="inline-block" /> Demo
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
