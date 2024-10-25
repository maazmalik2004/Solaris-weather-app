import React from "react";
import Container from "@/components/Container";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";
import { format } from "date-fns";

export default function WeatherInfo({ item, data }) {
  return (
    <Container className="gap-4 flex items-center justify-between p-4">
      <section className="flex gap-4 items-center justify-center px-4">
        <div className="relative h-20 w-20">
          <img
            className="h-full w-full"
            src={`https://openweathermap.org/img/wn/${item.weather[0]?.icon}@4x.png`}
            alt={`Weather icon for ${item.weather[0]?.description}`}
          />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-semibold">
            {format(new Date(item.dt * 1000), "EEEE")}
          </p>
          <p className="text-xs">
            {format(new Date(item.dt * 1000), "dd.MM.yyyy")}
          </p>
        </div>
      </section>
      <section className="flex flex-col items-center justify-center px-4">
        <p className="text-5xl font-bold">
          {Math.round(item.main.temp)}°C
        </p>
        <p className="text-xs">
          Feels Like {Math.round(item.main.feels_like)}°C
        </p>
        <p className="capitalize text-xs">{item.weather[0]?.description}</p>
      </section>
      <div className="flex items-center justify-evenly gap-5 w-full bg-red-300 p-4 rounded">
        <StatItem label="Visibility" value={`${(item.visibility / 1000).toFixed(1)} km`} Icon={LuEye} />
        <StatItem label="Humidity" value={`${item.main.humidity}%`} Icon={FiDroplet} />
        <StatItem label="Wind Speed" value={`${item.wind.speed} m/s`} Icon={MdAir} />
        <StatItem label="Pressure" value={`${item.main.pressure} hPa`} Icon={ImMeter} />
        <StatItem label="Sunrise" value={format(new Date(data.city.sunrise * 1000), "hh:mm a")} Icon={LuSunrise} />
        <StatItem label="Sunset" value={format(new Date(data.city.sunset * 1000), "hh:mm a")} Icon={LuSunset} />
      </div>
    </Container>
  );
}

const StatItem = ({ label, value, Icon }) => (
  <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
    <p className="whitespace-nowrap">{label}</p>
    <div className="text-3xl">
      <Icon />
    </div>
    <p className="whitespace-nowrap">{value}</p>
  </div>
);
