import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import UploadPage from "./UploadPage"

function MainPage() {
  return (
    <div>
      <Tabs defaultValue="tab1" className="w-full">
        <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Upload</h2>
            <p>Upload your files here.</p>
            {/* upload component  */}
            <UploadPage />
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Gallery</h2>
            <p>View your uploaded files here.</p>
            {/* Add your gallery component here */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MainPage
