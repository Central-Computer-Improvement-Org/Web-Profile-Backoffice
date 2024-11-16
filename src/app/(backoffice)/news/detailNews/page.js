"use client";

import React, { useEffect, useState, useContext } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";
import { StateContext } from "@/app/(backoffice)/state";
import request from "@/app/utils/request";
import DefaultLink from "@/components/link/defaultLink";
import LogoNotfound from "/public/assets/icon/notfound.svg";
import { default as htmlToDraft } from "html-to-draftjs";
import { EditorState, ContentState, convertToRaw } from "draft-js";

const EditorNoSSR = dynamic(
  () => import("draft-js").then((mod) => mod.Editor),
  {
    ssr: false,
  }
);

function DetailNewsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [editorState, setEditorState] = useState(null);
  const id = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [detailsMediaUrl, setDetailsMediaUrl] = useState([]);
  const { setNewsName, setNewsId } = useContext(StateContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      router.push("/news");
      return;
    }
    request
      .get(`/news?id=${id}`)
      .then((response) => {
        const data = response.data.data;
        setTitle(data.title);
        setDescription(data.description);
        setMediaUrl(data.mediaUri);
        setDetailsMediaUrl(data.detailNewsMedia);
        setNewsName(data.title);
        setNewsId(data.id);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id, router, setNewsName, setNewsId]);

  useEffect(() => {
    if (typeof window !== "undefined" && description) {
      const blocksFromHtml = htmlToDraft(description);
      const contentState = ContentState.createFromBlockArray(
        blocksFromHtml.contentBlocks,
        blocksFromHtml.entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      setEditorState(editorState);
    }
  }, [description]);

  const onEditorStateChange = (newEditorState) => {
    setEditorState(newEditorState);
    const currentHtml = draftToHtml(
      convertToRaw(newEditorState.getCurrentContent())
    );
    console.log(currentHtml);
  };

  return (
    <div>
      {loading ? (
        <div className="flex items-center justify-center w-full h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="col-span-2 px-4 pt-6">
            <div className="p-4 mb-4 bg-white border border-gray-200 rounded-lg shadow-sm 2xl:col-span-2">
              <div className="flow-root">
                <div className="mb-8">
                  <h3 className="flex justify-center mb-4 text-xl font-semibold">
                    {title}
                  </h3>
                  <div className="relative w-full h-[500px] flex-shrink-0 mb-4">
                    <Image
                      src={
                        mediaUrl
                          ? `${process.env.NEXT_PUBLIC_HOST}${mediaUrl}`
                          : LogoNotfound.src
                      }
                      width={100}
                      height={100}
                      className="object-cover w-full h-full"
                      alt="News Image"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2 justify-between">
                    {detailsMediaUrl.map((data, i) => (
                      <div key={i} className="flex-grow">
                        <Image
                          src={
                            `${process.env.NEXT_PUBLIC_HOST}${data.mediaUri}` ||
                            LogoNotfound.src
                          }
                          width={100}
                          height={100}
                          className="object-cover w-full h-[200px]"
                          alt="Detail Image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  {editorState && (
                    <EditorNoSSR
                      editorState={editorState}
                      onChange={onEditorStateChange}
                    />
                  )}
                </div>
                <div className="flex items-center">
                  <DefaultLink
                    href={`/news/editNews?id=${id}`}
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

export default DetailNewsPage;
