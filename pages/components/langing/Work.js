import React from "react";
import PickMeals from "../../../utils/Assets/pick-meals-image.png";
import DeliveryMeals from "../../../utils/Assets/delivery-image.png";
import Image from 'next/image'

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Pick Meals",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      image: PickMeals,
      title: "Choose How Often",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      image: PickMeals,
      title: "Fast Deliveries",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      image: DeliveryMeals,
      title: "Fast Deliveries",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      image: DeliveryMeals,
      title: "Fast Deliveries",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
    {
      image: DeliveryMeals,
      title: "Fast Deliveries",
      text: "Lorem ipsum dolor sit amet consectetur.",
    },
  ];
  return (
    <div className="bg-gray-100 py-16" id="work">
      <div className="container mx-auto text-center">
        <div className="mb-8">
          <p className="text-gray-600">Notre organisation</p>
          <h1 className="text-3xl font-semibold text-orange-500">Comment travaillons nous ?</h1>
          <p className="mt-4 text-gray-700">
            Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
            elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workInfoData.map((data) => (
            <div key={data.title} className="flex flex-col items-center">
              <div className="info-boxes-img-container">
                <Image src={data.image} alt={data.title} className="w-full h-auto" width={500} height={500}/>
              </div>
              <h2 className="text-xl font-semibold mt-4 text-blue-500">{data.title}</h2>
              <p className="text-gray-700 mt-2">{data.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Work;
