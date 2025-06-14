import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import UploadPage from "./UploadPage"
import GalleryPage from "./GalleryPage"
import { FaCirclePlus } from "react-icons/fa6";
import { FaUserCircle } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import AccountInput from "../components/AccountInput";

function MainPage() {
  return (
    <div>
      <Tabs defaultValue="upload" className="w-full">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <FaCircleInfo size={28}/>
            <Drawer>
              <DrawerTrigger asChild>
                <FaCirclePlus size={28} className="cursor-pointer" />
              </DrawerTrigger>
              <DrawerContent>
                
                  {/* Input Details Component */}
                  <AccountInput />
                
              </DrawerContent>
            </Drawer>

            <Drawer>
              <DrawerTrigger asChild>
                <FaUserCircle size={28} className="cursor-pointer" />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Change Cloudinary Account</DrawerTitle>
                  <DrawerDescription>Account 1</DrawerDescription>
                  <DrawerDescription>Account 2</DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

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