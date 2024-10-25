"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { parseISO, format } from "date-fns";
import { useQuery } from "react-query";
import axios from "axios";
import Container from "@/components/Container";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";
import WeatherInfo from "@/components/ForecastWeatherDetails";

export default function Home() {
  const [currentPlace, setCurrentPlace] = useState("Mumbai");

  const { isLoading, error, data } = useQuery(
    ["weatherData", currentPlace],
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${currentPlace}&appid=${process.env.NEXT_PUBLIC_KEY}&units=metric`
      );
      return data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const firstItem = data?.list[0];

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-red-400 font-bold text-lg">Loading...</span>
      </div>
    );

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <Navbar currentPlace={currentPlace} setCurrentPlace={setCurrentPlace} />

      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-10 w-full pb-10 pt-4">
        <section>
          <div>
            <h2 className="flex gap-1 text-2xl items-end">
              <p className="font-bold">
                {format(parseISO(firstItem?.dt_txt ?? ""), "EEEE")}
              </p>
              <p className="text-2xl">
                {format(parseISO(firstItem?.dt_txt ?? ""), "dd.MM.yyyy")}
              </p>
            </h2>

            <Container className="gap-10 px-6 items-center my-4">
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {Math.round(firstItem?.main.temp ?? 0)}°C
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  Feels Like {Math.round(firstItem?.main.feels_like ?? 0)}°C
                </p>
                <p className="text-xs space-x-1">
                  <span>{Math.round(firstItem?.main.temp_min ?? 0)}°C↑ </span>
                  <span>{Math.round(firstItem?.main.temp_max ?? 0)}°C↓</span>
                </p>
              </div>
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold"
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>
                    <div className="relative h-20 w-20">
                      <img
                        className="h-full w-full"
                        src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@4x.png`}
                        alt="Weather icon"
                      />
                    </div>
                    <p className="whitespace-nowrap">
                      {Math.round(d?.main.temp ?? 0)} °C
                    </p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className="flex gap-4">
            <Container className="w-fit justify-center flex-col px-4 items-center">
              <p className="capitalize text-center">
                {firstItem?.weather[0].description}
              </p>
              <div className="relative h-20 w-20">
                <img
                  className="h-full w-full"
                  src={`https://openweathermap.org/img/wn/${firstItem.weather[0].icon}@4x.png`}
                  alt="Weather icon"
                />
              </div>
            </Container>

            <Container className="bg-red-300 px-6 gap-4 justify-between overflow-x-auto">
              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Visibility</p>
                <div className="text-3xl">
                  <LuEye />
                </div>
                <p className="whitespace-nowrap">
                  {firstItem.visibility / 1000} km
                </p>
              </div>

              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Humidity</p>
                <div className="text-3xl">
                  <FiDroplet />
                </div>
                <p className="whitespace-nowrap">{firstItem.main.humidity}%</p>
              </div>

              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Wind Speed</p>
                <div className="text-3xl">
                  <MdAir />
                </div>
                <p className="whitespace-nowrap">{firstItem.wind.speed} m/s</p>
              </div>

              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Pressure</p>
                <div className="text-3xl">
                  <ImMeter />
                </div>
                <p className="whitespace-nowrap">
                  {firstItem.main.pressure} hPa
                </p>
              </div>

              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Sunrise</p>
                <div className="text-3xl">
                  <LuSunrise />
                </div>
                <p className="whitespace-nowrap">
                  {format(new Date(data.city.sunrise * 1000), "hh:mm a")}
                </p>
              </div>

              <div className="flex flex-col justify-between gap-2 items-center text-xs font-semibold">
                <p className="whitespace-nowrap">Sunset</p>
                <div className="text-3xl">
                  <LuSunset />
                </div>
                <p className="whitespace-nowrap">
                  {format(new Date(data.city.sunset * 1000), "hh:mm a")}
                </p>
              </div>
            </Container>
          </div>
        </section>

        <section className="flex w-full flex-col gap-4">
          <p className="text-2xl">Forecast (7 days)</p>
          <div className="flex flex-col gap-4">
            {data?.list
              .reduce((acc, current) => {
                const date = new Date(current.dt * 1000).toDateString();

                const entry = acc.find((item) => item.date === date) || {
                  date,
                  temps: [],
                  count: 0,
                  weatherData: current,
                };

                entry.temps.push(current.main.temp);
                entry.count++;

                if (!acc.some((item) => item.date === date)) {
                  acc.push(entry);
                }

                return acc;
              }, [])
              .slice(0, 7)
              .map((item) => {
                const averageTemp =
                  item.temps.reduce((sum, temp) => sum + temp, 0) / item.count;

                return (
                  <WeatherInfo
                    key={item.date}
                    item={{
                      ...item.weatherData,
                      main: {
                        ...item.weatherData.main,
                        temp: averageTemp,
                      },
                    }}
                    data={data}
                  />
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}
