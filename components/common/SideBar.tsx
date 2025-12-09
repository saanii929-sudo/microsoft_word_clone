'use client'
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    Tag, Image as Images, Upload, TextSelect,
    ImageDownIcon,
    UploadIcon
} from "lucide-react";
import ActionButtons from "./ActionButtons";
import {
    ArrowLeft2, ArrowRight2, AudioSquare, Cardano, Chart, CodeCircle,
    Element2, ExportSquare, Gift, Link, LinkSquare, Magicpen,
    MessageAdd1, MessageQuestion, Next, Note, Previous,
    SearchNormal1,
    Setting2, Setting4, Shapes, Smallcaps, Snapchat, Spotify,
    Sticker,
    TableDocument,
    Text, Video, VideoHorizontal, Whatsapp,
} from 'iconsax-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import Image from "next/image";
import StockPhotosPanel from './StockPhotosPanel';
import StockVideosPanel from './StockVideosPanel';
import ShapesPanel from './ShapesPanel';
import GifsPanel from './GifsPanel';
import StickersPanel from './StickersPanel';
import AudiosPanel from './AudiosPanel';
import ChartsPanel from './ChartsPanel';
import TablePanel from './TablePanel';
import LinkButtonPanel from './LinkButtonPanel';
import LinkAreaPanel from './LinkAreaPanel';

const CategoryHeading = ({ title }: { title: string }) => (
    <div className="mb-2 mt-5 text-xs font-thin text-gray-100 ">
        {title}
    </div>
);

const Sidebar = () => {
    const [showStockPhotos, setShowStockPhotos] = useState(false);
    const [showStockVideos, setShowStockVideos] = useState(false);
    const [showShapes, setShowShapes] = useState(false);
    const [showGifs, setShowGifs] = useState(false);
    const [showStickers, setShowStickers] = useState(false);
    const [showAudios, setShowAudios] = useState(false);
    const [showCharts, setShowCharts] = useState(false);
    const [showTable, setShowTable] = useState(false);
    const [showLinkButton, setShowLinkButton] = useState(false);
    const [showLinkArea, setShowLinkArea] = useState(false);
    return (
        <div className='w-full md:w-[376px] h-full bg-[#181923] flex sticky pr-2 md:pr-4'>
            <Tabs defaultValue="text" className="h-full w-full flex flex-row gap-1 md:gap-2">
                <TabsList className="pt-3 md:pt-5 w-[60px] md:w-[89px] p-0 bg-[#010313] h-full flex flex-col justify-between rounded-none overflow-y-auto overflow-x-hidden">
                    <div className='flex flex-col gap-1 md:gap-2'>
                        <TabsTrigger value="text" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Text">
                                    <Smallcaps size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Text</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Upload">
                                    <Upload size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Upload</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="elements" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Elements">
                                    <Shapes size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Elements</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="interactions" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Interactions">
                                    <TextSelect size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Interactions</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="templates" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Templates">
                                    <Element2 size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Templates</p>
                            </div>
                        </TabsTrigger>
                        <TabsTrigger value="aiwrite" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                            <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                                <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Ai Write">
                                    <Magicpen size="18" color="#ffffff" />
                                </Button>
                                <p className="text-xs text-white text-center w-full">Ai Write</p>
                            </div>
                        </TabsTrigger>
                    </div>
                    <TabsTrigger value="settings" className="w-[45px] md:w-[50px] h-[45px] md:h-[50px] border-b-2 border-transparent data-[state=active]:border-b-white rounded-none data-[state=active]:shadow-none data-[state=active]:bg-transparent cursor-pointer pb-1 p-0">
                        <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-full">
                            <Button className="flex gap-2 items-center align-middle hover:bg-transparent w-full h-auto p-2" variant="ghost" aria-label="Settings">
                                <Setting2 size="18" color="#ffffff" />
                            </Button>
                            <p className="text-xs text-white text-center w-full">Settings</p>
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="text" className='relative w-full h-full flex flex-col overflow-y-auto no-scrollbar p-2 md:p-4'>
                    <CategoryHeading title="Click or drag text to add to ebook page" />

                    <div className='flex flex-col  w-full flex-wrap gap-3 md:gap-5 justify-between mt-1'>
                        <Button className='p-4 bg-[#FFFFFF14] text-2xl h-[48px] cursor-pointer'>Add Heading</Button>
                        <Button className='p-4 bg-[#FFFFFF14] text-xl h-[48px] cursor-pointer'>Add Sub Heading</Button>
                        <Button className='p-4 bg-[#FFFFFF14] text-lg font-thin h-[48px] cursor-pointer'>Add Body Text</Button>
                        <Button className='p-4 bg-[#FFFFFF14] text-xl h-[48px] cursor-pointer'>#Pagination</Button>
                    </div>
                    <div className=' w-full flex justify-end'>
                        <CategoryHeading title="Edit or add font styles" />
                    </div>

                    <CategoryHeading title="Text Templates" />
                    <div className='grid grid-cols-2  w-full flex-wrap gap-3 md:gap-5 justify-between'>
                        {
                            Array.from({ length: 4 }).map((_, index) => {
                                return (
                                    <div key={index}>
                                        <Skeleton className="h-[174px] w-[115px] mt-2 shadow-sm"/>
                                    </div>
                                )
                            })
                        }
                    </div>

                </TabsContent>

                <TabsContent value="upload"  className='relative w-full h-full flex flex-col gap-4 overflow-y-auto no-scrollbar p-2 md:p-4'>
                    {/* search input box */}
                    <div className='flex items-center justify-between px-3 h-[44px] w-full bg-white rounded-lg gap-2'>
                        <SearchNormal1 size="18" color="#555555" className="shrink-0" />
                        <Input 
                            placeholder='Search' 
                            className='h-[44px] flex-1 outline-none border-none focus:ring-0 focus-visible:ring-0 px-0' 
                        />
                        <Setting4 size="18" color="#555555" className="shrink-0 cursor-pointer hover:opacity-70" />
                    </div>

                    <div className='flex mt-3'>
                        <Button variant={"outline"} className='bg-[#00697733] text-white rounded-br-none rounded-tr-none cursor-pointer'>My Uploads</Button>
                        <Button variant={"outline"} className='bg-transparent text-white rounded-tl-none rounded-bl-none cursor-pointer'>Team Uploads</Button>
                    </div>
                    <Button className='p-3 bg-[#006977] text-white rounded-lg w-full hover:bg-[#1d3235] cursor-pointer'>
                        <UploadIcon size="18" color="#ffffff" />
                        Upload media
                    </Button>
                    <div className='flex flex-col gap-2 w-full items-center justify-center'>
                       <p className='text-xl font-semibold  text-white'>No uploads yet</p>

                       <Image src="/images/noUploads.png" alt="no uploads" width={104} height={104} className='w-[104px] h-[104px]'/>
                    </div>
                </TabsContent>

                <TabsContent value="elements" className='relative w-full h-full flex flex-col overflow-y-auto no-scrollbar p-2 md:p-4'>
                    {showTable ? (
                        <TablePanel onBack={() => setShowTable(false)} />
                    ) : showCharts ? (
                        <ChartsPanel onBack={() => setShowCharts(false)} />
                    ) : showAudios ? (
                        <AudiosPanel onBack={() => setShowAudios(false)} />
                    ) : showStickers ? (
                        <StickersPanel onBack={() => setShowStickers(false)} />
                    ) : showGifs ? (
                        <GifsPanel onBack={() => setShowGifs(false)} />
                    ) : showShapes ? (
                        <ShapesPanel onBack={() => setShowShapes(false)} />
                    ) : showStockVideos ? (
                        <StockVideosPanel onBack={() => setShowStockVideos(false)} />
                    ) : showStockPhotos ? (
                        <StockPhotosPanel onBack={() => setShowStockPhotos(false)} />
                    ) : (
                        <>
                            <CategoryHeading title="Graphics" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5 justify-between'>
                                <Button onClick={() => setShowStockPhotos(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Images size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Stock Photo</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowStockVideos(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <ImageDownIcon size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Stock Video</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowShapes(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Shapes size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Shapes</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowGifs(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Gift size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Gif</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowStickers(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Sticker size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Sticker</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowAudios(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <AudioSquare size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Audio</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Data" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5 justify-between'>
                                <Button onClick={() => setShowCharts(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Chart size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Chart</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowTable(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <TableDocument size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Table</p>
                                    </div>
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>

                <TabsContent value="interactions" className='relative w-full h-full flex flex-col overflow-y-auto no-scrollbar p-2 md:p-4'>
                    {showLinkArea ? (
                        <LinkAreaPanel onBack={() => setShowLinkArea(false)} />
                    ) : showLinkButton ? (
                        <LinkButtonPanel onBack={() => setShowLinkButton(false)} />
                    ) : (
                        <>
                            <CategoryHeading title="Links & Tags" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5 justify-between'>
                                <Button onClick={() => setShowLinkArea(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Link size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Link Area</p>
                                    </div>
                                </Button>
                                <Button onClick={() => setShowLinkButton(true)} className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <LinkSquare size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Link Button</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Tag size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Tag</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <MessageAdd1 size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Caption</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <CodeCircle size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Embed code</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Text size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Pop-up frame</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Images" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5'>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Cardano size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Spotlight</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Images size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Slideshow</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Audio & video" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5'>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <VideoHorizontal size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Video embed</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Video size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Video Button</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <AudioSquare size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Audio Button</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Engagement" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5'>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <MessageQuestion size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Question</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Note size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Contact Form</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Navigation" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5'>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <ArrowLeft2 size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Previous Page</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <ArrowRight2 size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Next Page</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <ExportSquare size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Go to page</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Previous size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">First page</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Next size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Last page</p>
                                    </div>
                                </Button>
                            </div>

                            <CategoryHeading title="Social" />
                            <div className='grid grid-cols-3  w-full flex-wrap gap-3 md:gap-5 mb-10'>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Snapchat size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Snapchat</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Whatsapp size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">WhatsApp</p>
                                    </div>
                                </Button>
                                <Button className='cursor-pointer p-0 h-auto bg-transparent hover:bg-transparent' variant="ghost">
                                    <div className="flex flex-col gap-1 items-center align-middle h-[50px] w-[65px]">
                                        <div className="flex items-center justify-center w-full h-8">
                                            <Spotify size="18" color="#ffffff" />
                                        </div>
                                        <p className="text-xs text-white text-center w-full">Spotify</p>
                                    </div>
                                </Button>
                            </div>
                        </>
                    )}
                </TabsContent>
                <TabsContent value="templates" className='p-3 md:p-5'>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-white text-sm md:text-base'>Templates section</p>
                        <p className='text-gray-400 text-xs md:text-sm mt-2'>This section is under development</p>
                    </div>
                </TabsContent>

                <TabsContent value="aiwrite" className='p-3 md:p-5'>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-white text-sm md:text-base'>AI Write section</p>
                        <p className='text-gray-400 text-xs md:text-sm mt-2'>This section is under development</p>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className='p-3 md:p-5'>
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-white text-sm md:text-base'>Settings section</p>
                        <p className='text-gray-400 text-xs md:text-sm mt-2'>This section is under development</p>
                    </div>
                </TabsContent>
            </Tabs>

        </div>
    );
};

export default Sidebar;
