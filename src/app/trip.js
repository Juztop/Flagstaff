import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload } from "lucide-react";
import Image from "next/image";

export default function ShotChallenge() {
  const totalShots = 22;
  const [shots, setShots] = useState(Array(totalShots).fill(null));

  const handleUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newShots = [...shots];
        newShots[index] = reader.result;
        setShots(newShots);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6">22 Shot Challenge</h1>
      <div className="grid grid-cols-4 gap-4">
        {shots.map((shot, index) => (
          <Card key={index} className="p-2 border-dashed border-2 border-gray-300 flex flex-col items-center">
            <span className="text-lg font-semibold">{index + 1}</span>
            {shot ? (
              <Image src={shot} alt={`Shot ${index + 1}`} width={100} height={100} className="mt-2 rounded-md" />
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
    </div>
  );
}
