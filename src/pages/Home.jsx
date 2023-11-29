import React, { useState } from "react";
import Navbar from "../conponents/Navbar";
import { useFetch } from "../auth/functions";
import Card from "../conponents/Card";
import loading from "../asset/loading.gif";

const Home = () => {
  const { isLoading, cardList } = useFetch();
  return (
    <div>
      <Navbar />
      <div className="flex justify-center gap-2 mb-12 items-center">
        <span className="w-[200px] h-2 bg-black"></span>
        <p className="text-2xl uppercase">Hikayelerim</p>
        <span className="w-[200px] h-2 bg-black "></span>
      </div>
      {!isLoading ? (
        <div className="flex flex-wrap gap-6 justify-center items-center bg-blue-100 ">
          {!cardList?.length && (
            <p className="text-2xl uppercase mx-auto text-center">
              Herhangi bir hikaye yüklenmedi...
            </p>
          )}
          {cardList?.map((item, index) => (
            <Card item={item} key={index} />
          ))}
        </div>
      ) : (
        <div>
          <img src={loading} alt="" className="mt-20 mx-auto" />
        </div>
      )}
    </div>
  );
};

export default Home;
