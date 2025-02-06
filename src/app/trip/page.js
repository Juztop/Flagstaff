"use client";

import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Upload, Trash, XCircle, Edit, CheckCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ShotChallenge() {
  const [albums, setAlbums] = useState([]);
  const [currentAlbum, setCurrentAlbum] = useState(0);
  const [newAlbumName, setNewAlbumName] = useState("");
  const [editingAlbumIndex, setEditingAlbumIndex] = useState(null);
  const [editedAlbumName, setEditedAlbumName] = useState("");
  const [notification, setNotification] = useState("");
  const router = useRouter();

  useEffect(() => {
    const savedAlbums = localStorage.getItem("albums");
    if (savedAlbums) {
      setAlbums(JSON.parse(savedAlbums));
    } else {
      const initialAlbums = [{ name: "My First Album", shots: Array(22).fill(null) }];
      setAlbums(initialAlbums);
      localStorage.setItem("albums", JSON.stringify(initialAlbums));
    }
  }, []);

  useEffect(() => {
    if (albums.length > 0) {
      localStorage.setItem("albums", JSON.stringify(albums));
    }
  }, [albums]);

  const handleUpload = (index, event) => {
    if (!albums[currentAlbum]) return;
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAlbums(prevAlbums => {
          const newAlbums = [...prevAlbums];
          newAlbums[currentAlbum].shots[index] = reader.result;
          localStorage.setItem("albums", JSON.stringify(newAlbums));
          return newAlbums;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const editAlbum = (index) => {
    setEditingAlbumIndex(index);
    setEditedAlbumName(albums[index].name);
  };

  const saveAlbumName = (index) => {
    setAlbums(prevAlbums => {
      const newAlbums = [...prevAlbums];
      newAlbums[index].name = editedAlbumName;
      localStorage.setItem("albums", JSON.stringify(newAlbums));
      return newAlbums;
    });
    setNotification(`Album "${editedAlbumName}" updated successfully!`);
    setTimeout(() => setNotification(""), 3000);
    setEditingAlbumIndex(null);
  };

  const deleteAlbum = (index) => {
    const albumName = albums[index].name;
    setAlbums(prevAlbums => {
      const newAlbums = prevAlbums.filter((_, i) => i !== index);
      localStorage.setItem("albums", JSON.stringify(newAlbums));
      return newAlbums;
    });
    setNotification(`Album "${albumName}" deleted successfully!`);
    setTimeout(() => setNotification(""), 3000);
    setCurrentAlbum(0);
  };

  return (
    <div className="relative min-h-screen bg-blue-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-6">🏂 Snowboarding Trip Challenge 🏔️</h1>
      {notification && (
        <div className="mb-4 flex items-center gap-2 text-green-500">
          <CheckCircle size={20} /> <span>{notification}</span>
        </div>
      )}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newAlbumName}
          onChange={(e) => setNewAlbumName(e.target.value)}
          placeholder="New Album Name"
          className="border p-2 rounded text-black"
        />
        <Button onClick={() => {
          setAlbums(prevAlbums => {
            const newAlbums = [...prevAlbums, { name: newAlbumName, shots: Array(22).fill(null) }];
            localStorage.setItem("albums", JSON.stringify(newAlbums));
            return newAlbums;
          });
          setNotification(`Album "${newAlbumName}" created successfully!`);
          setNewAlbumName("");
          setTimeout(() => setNotification(""), 3000);
        }}>Create Album</Button>
      </div>
      <div className="mb-4 flex gap-2">
        {editingAlbumIndex === currentAlbum ? (
          <>
            <input
              type="text"
              value={editedAlbumName}
              onChange={(e) => setEditedAlbumName(e.target.value)}
              className="border p-2 rounded text-black"
            />
            <Button onClick={() => saveAlbumName(editingAlbumIndex)}>Save</Button>
          </>
        ) : (
          <>
            <Button onClick={() => editAlbum(currentAlbum)}>Edit Album</Button>
            <Button onClick={() => deleteAlbum(currentAlbum)} className="bg-red-500">Delete Album</Button>
          </>
        )}
      </div>
      <div className="mb-4 w-full max-w-xs">
        <select
          className="w-full p-2 border rounded text-black"
          value={currentAlbum}
          onChange={(e) => setCurrentAlbum(parseInt(e.target.value, 10))}
        >
          {albums.map((album, index) => (
            <option key={index} value={index}>{album.name}</option>
          ))}
        </select>
      </div>
      {albums.length > 0 && albums[currentAlbum] ? (
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mx-auto">
          {albums[currentAlbum].shots.map((shot, index) => (
            <Card key={index} className="p-2 border-dashed border-2 border-gray-300 flex flex-col items-center bg-gray-900">
              <span className="text-lg font-semibold">{index + 1}</span>
              {shot ? (
                <>
                  <Image src={shot} alt={`Shot ${index + 1}`} width={100} height={100} className="mt-2 rounded-md cursor-pointer" onClick={() => router.push(`/photo-viewer?album=${currentAlbum}&photo=${index}`)} />
                  <Trash className="cursor-pointer mt-2 text-red-500" size={20} onClick={() => {
                    setAlbums(prevAlbums => {
                      const newAlbums = [...prevAlbums];
                      newAlbums[currentAlbum].shots[index] = null;
                      localStorage.setItem("albums", JSON.stringify(newAlbums));
                      return newAlbums;
                    });
                  }} />
                </>
              ) : (
                <>
                  <input type="file" accept="image/*" id={`upload-${index}`} className="hidden" onChange={(e) => handleUpload(index, e)} />
                  <label htmlFor={`upload-${index}`} className="mt-2 cursor-pointer flex flex-col items-center">
                    <Upload size={24} />
                    <span className="text-sm">Upload</span>
                  </label>
                </>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No album selected. Create an album to get started.</p>
      )}
    </div>
  );
}
