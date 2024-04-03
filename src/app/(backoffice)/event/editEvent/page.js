"use client";
import DefaultButton from "@/components/button/defaultButton";
import DefaultLink from "@/components/link/defaultLink";
import InputField from "@/components/form/inputField";
import InputSelect from "@/components/form/inputSelect";
import TextareaField from "@/components/form/textareaField";
import HeadTitle from "@/components/headTitle";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function EditEventPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get("id");
  console.log(id);

  // State untuk menyimpan data event
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [divisionId, setDivisionId] = useState("");
  const [media, setMedia] = useState("");
  const [heldOn, setHeldOn] = useState("");
  const [budget, setBudget] = useState("");

  const [loading, setLoading] = useState(true); // State untuk menunjukkan bahwa data sedang dimuat

  useEffect(() => {
    // Cek apakah query 'id' ada atau tidak
    if (!id) {
      // Jika tidak ada, arahkan pengguna ke halaman 404
      router.push("./id");
      return; // Hentikan eksekusi useEffect
    }

    // Lakukan request data event berdasarkan ID dari query parameter
    axios
      .get(`http://localhost:3000/api/eventById`)
      .then(function (response) {
        const data = response.data.data;
        // Set data event ke state
        setName(data.name);
        setDescription(data.description);
        setDivisionId(data.divisionId);
        setMedia(data.media);
        setHeldOn(data.heldOn);
        setBudget(data.budget);
        setLoading(false); // Setelah data dimuat, atur loading menjadi false
      })
      .catch(function (error) {
        console.log(error);
        setLoading(false); // Jika terjadi kesalahan, tetap atur loading menjadi false
      });
  }, [id]);

  return (
    <div>
      <HeadTitle title={"Edit Event"}>
        {loading ? (
          <div className="text-center">Loading...</div> // Tampilkan pesan loading jika data sedang dimuat
        ) : (
          <div className="mt-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2 sm:p-6 ">
            <form action="#">
              <div className="grid grid-cols-6 gap-6">
                <div className="col-span-6 sm:col-span-4">
                  <InputField
                    id={"name"}
                    name={"name"}
                    placeholder={"CCI SUMMIT"}
                    type={"text"}
                    value={name}
                    required
                    label={"Name"}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputSelect
                    id={"divisionId"}
                    name={"division"}
                    placeholder={"Web Development"}
                    type={"text"}
                    value={divisionId}
                    required
                    label={"Division"}
                    onChange={(e) => {
                      setDivisionId(e.target.value);
                    }}
                  >
                    <option>Web Development</option>
                    <option>UI/UX Design</option>
                    <option>Data Resarch</option>
                    <option>Networking</option>
                  </InputSelect>
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"media"}
                    name={"media"}
                    type={"file"}
                    value={media}
                    required
                    label={"Media"}
                    onChange={(e) => {
                      setMedia(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"heldOn"}
                    name={"heldOn"}
                    type={"month"}
                    value={heldOn}
                    required
                    label={"Held On"}
                    onChange={(e) => {
                      setHeldOn(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-2">
                  <InputField
                    id={"budget"}
                    name={"budget"}
                    placeholder={"0"}
                    type={"text"}
                    value={budget}
                    required
                    label={"Budget"}
                    onChange={(e) => {
                      setBudget(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-span-6">
                  <TextareaField
                    id={"description"}
                    name={"description"}
                    placeholder={"e.g Description ..."}
                    value={description}
                    required
                    label={"Description"}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </div>
                <div className="col-span-6 sm:col-full flex gap-3">
                  <DefaultButton
                    size={"small"}
                    status={"primary"}
                    title={"Update"}
                    type={"submit"}
                    onClick={() => {}}
                  />
                  <DefaultLink
                    size={"small"}
                    status={"secondary"}
                    title={"Back"}
                    href={"/event"}
                  />
                </div>
              </div>
            </form>
          </div>
        )}
      </HeadTitle>
    </div>
  );
}
