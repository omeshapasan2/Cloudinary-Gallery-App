import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react'
import { useState } from "react"
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import AccountInput from "../components/AccountInput";
import AccountSelector from "../components/AccountSelector";

function MainPage() {
  const [showSelector, setShowSelector] = useState(false); 

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

            <DropdownMenu>
              <DropdownMenuTrigger>
                <FaUserCircle size={28} className="cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                
                <AccountSelector onClose={() => setShowSelector(false)}/>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          
        </div>

        <TabsContent value="upload">
          <div className="p-4">
            {/* upload component  */}
            {/* <UploadPage /> */}
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Gallery</h2>
            <p>View your uploaded files here.</p>
            {/* gallery component*/}
            {/* <GalleryPage /> */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default MainPage