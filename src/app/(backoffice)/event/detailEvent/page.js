/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useState, useCallback, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import moment from "moment";

import { StateContext } from "@/app/(backoffice)/state";
import { currency } from "@/app/utils/numberFormat";
import request from "@/app/utils/request";
import DefaultLink from "@/components/link/defaultLink";
import LogoNotfound from '/public/assets/icon/notfound.svg';


function DetailEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  const page = searchParams.get("page") ?? "1";
  
  const [name, setName] = useState("");
  const [mediaUri, setMediaUri] = useState("");
  const [divisionId, setDivisionId] = useState([]);
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState();
  const [isActive, setIsActive] = useState(true);
  const [description, setDescription] = useState("");
  const { setEventName, setEventId } = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    setLoading(true);
    request
      .get(`/cms/events?id=${id}`)
      .then(function (response) {
        const data = response.data.data;
        setName(data.name);
        setMediaUri(data.mediaUri);
        setDivisionId(data.division ? data.division.name : "None");
        setHeldOn(data.heldOn);
        setBudget(data.budget);
        setDescription(data.description);
        setIsActive(data.isActive);
        setEventName(data.name);
        setEventId(data.id);
        setLoading(false);
      })
      .catch(function (error) {
        console.error(error);
        setLoading(false);
      });
  }, [id, setEventName, setEventId]);

  useEffect(() => {
    if (!id) {
      router.push("/project");
      return;
    }
  }, [id, fetchEvent, router]);

  useEffect(() => {
    if (page < 1) {
      router.push(`/project/detailProject?id=${id}&page=1`);
    } else {
      fetchEvent();
      setLoading(false);
    }
  }, [id, page, fetchEvent, router]);

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="col-span-2 px-4 pt-6">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 ">
              <div className="flow-root">
                <div className="flow-root">
                  <div className="mb-8 ">
                    <h3 className="flex justify-center mb-4 text-xl font-semibold">
                      {name ? name : "Event name not found"}
                    </h3>
                    <div className="flex justify-center">
                    <img
                      src={
                        mediaUri
                          ? `${process.env.NEXT_PUBLIC_HOST}` + mediaUri
                          : LogoNotfound.src
                      }
                      style={{ height: 300, width: 700 }}
                      className="w-full rounded-2xl"
                      alt="Event Thumbnail CCI"
                    />
                    </div>
                  </div>
                </div>
                
                <div className="flex ">
                  <div className="flex-auto">
                    <h3 className="mb-4 text-xl font-semibold">Division</h3>
                    <div className="mb-8">
                      <p className="mb-3 text-gray-500 ">{divisionId ? divisionId : "id not found"}</p>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <h3 className="mb-4 text-xl font-semibold">Held On</h3>
                    <div className="mb-8">
                      <p className="mb-3 text-gray-500 ">
                        {heldOn ? moment(heldOn).format("DD MMM YYYY") : "No date found"}
                      </p>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <h3 className="mb-4 text-xl font-semibold">Budget</h3>
                    <div className="mb-8">
                      <p className="mb-3 text-gray-500 ">{budget ? currency(budget) : "No budget found"}</p>
                    </div>
                  </div>
                  <div className="flex-auto">
                    <h3 className="mb-4 text-xl font-semibold">Status</h3>
                    <div className="mb-8">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isActive ? "bg-green-500" : "bg-red-500"
                          }`}
                        />
                        <p>{isActive ? "Active" : "Inactive"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <h3 className="mb-4 text-xl font-semibold">Description</h3>
                <div className="mb-8">
                  <p className="mb-3 text-gray-500 ">{description ? description : "No description found"}</p>
                </div>
                <div className="flex items-center">
                  <DefaultLink
                    href={`/event/editEvent?id=${id}`}
                    size={"base"}
                    status={"primary"}
                    title={"Edit"}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailEventPage;