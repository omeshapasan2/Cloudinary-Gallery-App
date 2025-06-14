import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import UploadPage from "./UploadPage"
import GalleryPage from "./GalleryPage"

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

            {/* upload component  */}
            <UploadPage />
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Gallery</h2>
            <p>View your uploaded files here.</p>
            {/* gallery component*/}
            <GalleryPage />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MainPage
