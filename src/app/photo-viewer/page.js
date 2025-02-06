"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, XCircle } from "lucide-react";

export default function PhotoViewer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const albumIndex = parseInt(searchParams.get("album"), 10);
  const photoIndex = parseInt(searchParams.get("photo"), 10);

  const [albums, setAlbums] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(photoIndex);

  useEffect(() => {
    const savedAlbums = JSON.parse(localStorage.getItem("albums")) || [];
    setAlbums(savedAlbums);
  }, []);

  useEffect(() => {
    if (albums[albumIndex]?.shots?.length) {
      setCurrentPhotoIndex((prevIndex) => (prevIndex < albums[albumIndex].shots.length ? prevIndex : 0));
    }
  }, [albums, albumIndex]);

  const validPhotos = albums[albumIndex]?.shots?.filter(Boolean) || [];
  const totalPhotos = validPhotos.length;

  if (totalPhotos === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <p>No photo available</p>
      </div>
    );
  }

  const nextPhoto = () => {
    const newIndex = (currentPhotoIndex + 1) % totalPhotos;
    setCurrentPhotoIndex(newIndex);
    router.replace(`/photo-viewer?album=${albumIndex}&photo=${newIndex}`);
  };

  const prevPhoto = () => {
    const newIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
    setCurrentPhotoIndex(newIndex);
    router.replace(`/photo-viewer?album=${albumIndex}&photo=${newIndex}`);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white relative">
      <button onClick={prevPhoto} className="absolute left-4 text-white text-4xl">
        <ChevronLeft size={40} />
      </button>
      <Image src={validPhotos[currentPhotoIndex]} alt="Full view" width={500} height={500} className="rounded-md" />
      <button onClick={nextPhoto} className="absolute right-4 text-white text-4xl">
        <ChevronRight size={40} />
      </button>
      <button onClick={() => router.push("/trip")} className="absolute top-4 right-4 text-white text-4xl">
        <XCircle size={40} />
      </button>
    </div>
  );
}
