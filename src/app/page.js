'use client';
import React, { useState, useEffect } from 'react'; 
import { v4 as uuidv4 } from 'uuid';
import Scan from './components/scan';
import UnreturnedBorrows from './components/unreturnedBorrows';
import Add from './components/add';
import './i18n'; // Import i18n configuration
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Toaster, toast } from 'sonner';
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

function Home() {
  const { t, i18n } = useTranslation(); // Hook to access translations

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // Change the language dynamically
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [tools, setTools] = useState(new Map());
  const [volunteers, setVolunteers] = useState(new Map());
  const [currentVolunteer, setCurrentVolunteer] = useState(null);
  const [borrows, setBorrows] = useState(new Map());
  const [firstTimer, setFirstTimer] = useState(false);

  // Load borrows from local storage on component mount
  useEffect(() => {
    const borrows = localStorage.getItem('borrows');
    const volunteers = localStorage.getItem('volunteers');
    const tools = localStorage.getItem('tools');


    if (borrows == "[]" && volunteers == "[]" && tools == "[]") {
      setFirstTimer(true);
      return;
    }

    const data = [borrows, volunteers, tools];

    for (let i = 0; i < data.length; i++) {
      if (data[i]) {
        try {
          const parsedData = JSON.parse(data[i]);
          if (parsedData && typeof(parsedData) != "string" && parsedData.length > 0) {
            const map = new Map(parsedData.map(item => [item.id, item]));
            switch (i) {
              case 0:
                setBorrows(map);
                break;
              case 1:
                setVolunteers(map);
                break;
              case 2:
                setTools(map);
                break;
              default:
                break;
            }
          }
        } catch (error) {
          console.error(`Error parsing data from local storage: ${error}`);
          // Optionally handle the error, e.g., set the state to an empty Map
          switch (i) {
            case 0:
              setBorrows(new Map());
              break;
            case 1:
              setVolunteers(new Map());
              break;
            case 2:
              setTools(new Map());
              break;
            default:
              break;
          }
        }
      }
    }
  }, []); // Add an empty dependency array to run this effect only once

  // Save borrows to local storage whenever the borrows state changes
  useEffect(() => {
    localStorage.setItem('borrows', JSON.stringify(Array.from(borrows.values())));
  }, [borrows]);

  useEffect(() => {

  }, [firstTimer]);

  // Save volunteers to local storage whenever the volunteers state changes
  useEffect(() => {
    localStorage.setItem('volunteers', JSON.stringify(Array.from(volunteers.values())));
  }, [volunteers]);

  // Save tools to local storage whenever the tools state changes
  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(Array.from(tools.values())));
  }, [tools]);

  const downloadData = () => {
    const localBorrows = Array.from(borrows.values());
    const localVolunteers = Array.from(volunteers.values());
    const localTools = Array.from(tools.values());
    const data = { borrows: localBorrows, volunteers: localVolunteers, tools: localTools };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const now = new Date();
    a.href = url;
    a.download = `Datos de inventario al ${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}.${now.getMinutes()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    const volunteer = searchVolunteers(term);
    if (volunteer) {
      setCurrentVolunteer(volunteer);
      setSearchTerm(''); // Clear search term after selecting a volunteer
      return;
    }

    const tool = searchTools(term);
    if (tool && currentVolunteer) {
      const newBorrow = {
        id: uuidv4(),
        volunteerId: currentVolunteer.id,
        volunteerName: currentVolunteer.name,
        toolName: tool.name,
        toolId: tool.id,
        toolDescription: '',
        date: new Date(),
        wasReturned: false,
        wasDeleted: false,
      };
      setBorrows((prevBorrows) => new Map(prevBorrows).set(newBorrow.id, newBorrow));

      setSearchTerm(''); // Clear search term after adding a borrow
      return;
    }
  };

  const searchVolunteers = (searchTerm) => {
    return volunteers.get(searchTerm); // More concise way to search
  };

  const searchTools = (searchTerm) => {
    return tools.get(searchTerm); // More concise way to search
  };

  const borrowsByVolunteer = (volunteer) => {
    if (!volunteer) return []; // Handle case where currentVolunteer is null
    return Array.from(borrows.values()).filter(borrow => borrow.volunteerId === volunteer.id && !borrow.wasReturned && !borrow.wasDeleted); // Combined conditions
  };

  const deleteOrReturnBorrow = (event) => {
    const { name: id, value } = event.target;
    setBorrows((prevBorrows) => {
      const newBorrows = new Map(prevBorrows);
      const borrow = newBorrows.get(id);
      if (borrow) {
        if (value === 'return') {
          borrow.wasReturned = true;
        } else if (value === 'delete') {
          borrow.wasDeleted = true;
        }
        newBorrows.set(id, borrow);
      }
      return newBorrows;
    });
  };

  const updateDescription = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setBorrows((prevBorrows) => {
      const newBorrows = new Map(prevBorrows);
      const borrow = newBorrows.get(name);
      if (borrow) {
        borrow.toolDescription = value;
        newBorrows.set(name, borrow);
      }
      return newBorrows;
    });
  };

  const handleAddVolunteer = (volunteer) => {
    setVolunteers((prevVolunteers) => new Map(prevVolunteers).set(volunteer.id, { ...volunteer }));
  };

  const handleAddTool = (tool) => {
    setTools((prevTools) => new Map(prevTools).set(tool.id, { ...tool }));
  };

  const handleAddMultipleVolunteers = (volunteers) => {
    let count = 0;
    for (var volunteer of volunteers) {
      volunteer = {
        ...volunteer,
        id: volunteer.id ? volunteer.id.toString().toLowerCase() : ''
      };

      handleAddVolunteer(volunteer);
      count++;
    }
    toast(t('volunteersAddedSuccess'), { description: `${count} ${t('volunteersAddedSuccessDesc')}` });
  };

  const handleAddMultipleTools = (tools) => {
    let count = 0;
    for (var tool of tools) {
      tool = {
        ...tool,
        id: tool.id ? tool.id.toString().toLowerCase() : ''
      };
      handleAddTool(tool);
      count++;
    }
    toast(t('toolsAddedSuccess'), { description: `${count} ${t('toolsAddedSuccessDesc')}` });
  };

  const handleDeleteVolunteer = (id) => {
    setVolunteers((prevVolunteers) => {
      var newVolunteers = new Map(prevVolunteers);
      newVolunteers.delete(id);
      return newVolunteers;
    });
  };

  const handleDeleteTool = (id) => {
    setTools((prevTools) => {
      var newTools = new Map(prevTools);
      newTools.delete(id);
      return newTools;
    });
  };

  const renderView = (viewName) => {
    switch (viewName) {
      case "scan":
        return (
          <Scan 
            currentVolunteer={currentVolunteer}
            searchTerm={searchTerm}
            handleSearch={handleSearch} 
            borrowsByVolunteer={borrowsByVolunteer}
            deleteOrReturnBorrow={deleteOrReturnBorrow}
            updateDescription={updateDescription}
          />
        );
      case "borrows":
        return (
          <UnreturnedBorrows
            borrows={borrows}
            updateDescription={updateDescription}
            deleteOrReturnBorrow={deleteOrReturnBorrow}
          />
        );
      case "add":
        return (
          <Add
            handleAddVolunteer={handleAddVolunteer}
            handleAddTool={handleAddTool}
            handleAddMultipleVolunteers={handleAddMultipleVolunteers}
            handleAddMultipleTools={handleAddMultipleTools}
          />
        )
      default:
        return null;
    }
  };

  const uploadData = (event) => {
    console.log('Uploading data...');
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.borrows) {
            toast(t('borrowsUploadSuccess'), { description: `${data.borrows.length} ${t('borrowsUploadSuccessDesc')}` });
            setBorrows((prev) => {
              const newBorrows = new Map(prev);
              data.borrows.forEach((borrow) => {
                newBorrows.set(borrow.id, borrow);
              });
              return newBorrows;
            });
          }
          if (data.volunteers) {
            toast(t('volunteersUploadSuccess'), { description: `${data.volunteers.length} ${t('volunteersUploadSuccessDesc')}` });
            setVolunteers((prev) => {
              const newVolunteers = new Map(prev);
              data.volunteers.forEach((volunteer) => {
                newVolunteers.set(volunteer.id, volunteer);
              });
              return newVolunteers;
            });
          }
          if (data.tools) {
            toast(t('toolsUploadSuccess'), { description: `${data.tools.length} ${t('toolsUploadSuccessDesc')}` });
            setTools((prev) => {
              const newTools = new Map(prev);
              data.tools.forEach((tool) => {
                newTools.set(tool.id, tool);
              });
              return newTools;
            });
          }
        } catch (error) {
          console.error('Error parsing uploaded JSON:', error);
        }
      };
      reader.readAsText(file);
    }
    
    // Reset the file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const clearData = () => {
    localStorage.clear();
    setBorrows(new Map());
    setVolunteers(new Map());
    setTools(new Map());
    setCurrentVolunteer('');
  };

  return (
    <div className="font-sans p-5">
      {/* Language Dropdown and Action Buttons */}
      <div className="flex justify-between items-center mb-5">
        <Select
          onValueChange={(value) => changeLanguage(value)}
          defaultValue={i18n.language}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Español</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex space-x-2">
          <Button variant="outline" onClick={downloadData}>
            {t('download')}
          </Button>
          <Button variant="outline" as="label" onClick={() => document.getElementById('upload-json').click()}>
            {t('upload')}
          </Button>
          <Input
              id="upload-json"
              type="file"
              accept=".json"
              className="hidden"
              onChange={uploadData}
            />
          <Button variant="destructive" hidden onClick={clearData}>
            {t('clear')}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="scan" className="w-full h-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="scan">{t('scan')}</TabsTrigger>
        <TabsTrigger value="pending">{t('pending')}</TabsTrigger>
        <TabsTrigger value="add">{t('add')}</TabsTrigger>
      </TabsList>
      <TabsContent value="scan">
        <Card>
          <CardContent className="space-y-2">
            <Scan 
              currentVolunteer={currentVolunteer}
              searchTerm={searchTerm}
              handleSearch={handleSearch} 
              borrowsByVolunteer={borrowsByVolunteer}
              deleteOrReturnBorrow={deleteOrReturnBorrow}
              updateDescription={updateDescription}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="pending">
        <Card>
          <CardContent className="space-y-2">
            <UnreturnedBorrows
              borrows={borrows}
              updateDescription={updateDescription}
              deleteOrReturnBorrow={deleteOrReturnBorrow}
            />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="add">
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent className="space-y-2">
            <Add
              handleAddVolunteer={handleAddVolunteer}
              handleAddTool={handleAddTool}
              handleAddMultipleVolunteers={handleAddMultipleVolunteers}
              handleAddMultipleTools={handleAddMultipleTools}
              volunteers={volunteers}
              tools={tools}
              handleDeleteTool={handleDeleteTool}
              handleDeleteVolunteer={handleDeleteVolunteer}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
    <Toaster />
    <Drawer open={firstTimer} onClose={() => setFirstTimer(false)}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>{t('howToUse')}</DrawerTitle>
            <DrawerDescription>{t('howToUseDescription')}</DrawerDescription>
          </DrawerHeader>
          <Carousel className="w-full max-w-xs">
            <CarouselContent>
              {/* Step 1: Scan */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('scanTitle')}</h2>
                      <p className="text-sm text-center">{t('scanDescription')}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              {/* Step 2: Add */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('addTitle')}</h2>
                      <p className="text-sm text-center">{t('addDescription')}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              {/* Step 3: Unreturned Borrows */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('unreturnedBorrowsTitle')}</h2>
                      <p className="text-sm text-center">{t('unreturnedBorrowsDescription')}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              {/* Step 4: Download */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('downloadTitle')}</h2>
                      <p className="text-sm text-center">{t('downloadDescription')}</p>
                      <Button variant="outline" onClick={downloadData}>
                        {t('download')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              {/* Step 5: Upload */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('uploadTitle')}</h2>
                      <p className="text-sm text-center">{t('uploadDescription')}</p>
                      <Button
                        variant="outline"
                        onClick={() => document.getElementById('upload-json').click()}
                      >
                        {t('upload')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>

              {/* Step 6: Clear */}
              <CarouselItem>
                <div className="p-1">
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                      <h2 className="text-xl font-bold">{t('clearTitle')}</h2>
                      <p className="text-sm text-center">{t('clearDescription')}</p>
                      <Button variant="destructive">
                        {t('clear')}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">{t('close')}</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
    <div>v0.0.15</div>
  </div>
  );
}

export default Home;