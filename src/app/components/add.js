import React from 'react';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import * as XLSX from 'xlsx'; // Import the xlsx library

function Add({ handleAddVolunteer, handleAddTool, handleAddMultipleVolunteers, handleAddMultipleTools, volunteers, tools, handleDeleteVolunteer, handleDeleteTool }) {
  const { t } = useTranslation(); // Hook to access translations

  const [volunteerName, setVolunteerName] = React.useState('');
  const [volunteerId, setVolunteerId] = React.useState('');
  const [toolName, setToolName] = React.useState('');
  const [toolId, setToolId] = React.useState('');

  const addVolunteer = () => {
    handleAddVolunteer({ name: volunteerName, id: volunteerId });
    setVolunteerName('');
    setVolunteerId('');
  };

  const addTool = () => {
    handleAddTool({ name: toolName, id: toolId });
    setToolName('');
    setToolId('');
  };

  const handleExcelUpload = (e, handler) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0]; // Get the first sheet
        const sheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet); // Convert sheet to JSON
        handler(jsonData); // Pass the parsed data to the handler
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Add Single Volunteer */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('addSingleVolunteer')}</h3>
        <Input
          type="text"
          placeholder={t('volunteerName')}
          value={volunteerName}
          onChange={(e) => setVolunteerName(e.target.value)}
          className="m-1"
        />
        <Input
          type="text"
          placeholder={t('volunteerId')}
          value={volunteerId}
          onChange={(e) => setVolunteerId(e.target.value)}
          className="m-1"
        />
        <Button onClick={addVolunteer} className="m-1">
          {t('add')}
        </Button>
        <Separator className="my-4" />
      </div>

      {/* Add Single Tool */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('addSingleTool')}</h3>
        <Input
          type="text"
          placeholder={t('toolName')}
          value={toolName}
          onChange={(e) => setToolName(e.target.value)}
          className="m-1"
        />
        <Input
          type="text"
          placeholder={t('toolId')}
          value={toolId}
          onChange={(e) => setToolId(e.target.value)}
          className="m-1"
        />
        <Button onClick={addTool} className="m-1">
          {t('add')}
        </Button>
        <Separator className="my-4" />
      </div>

      {/* Add Multiple Volunteers */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('addMultipleVolunteers')}</h3>
        <Input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleExcelUpload(e, handleAddMultipleVolunteers)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-600">{t('uploadFileInstructions')}</p>
        <a
          href="https://storage.googleapis.com/inventario-jw/assets/Voluntarios.xlsx"
          className="text-blue-500 underline"
        >
          {t('downloadExample')}
        </a>
      </div>

      {/* Add Multiple Tools */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{t('addMultipleTools')}</h3>
        <Input
          type="file"
          accept=".xlsx"
          onChange={(e) => handleExcelUpload(e, handleAddMultipleTools)}
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-600">{t('uploadFileInstructions')}</p>
        <a
          href="https://storage.googleapis.com/inventario-jw/assets/Herramientas.xlsx"
          className="text-blue-500 underline"
        >
          {t('downloadExample')}
        </a>
      </div>

      {/* View Volunteers */}
      <div className="p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">{t('viewVolunteers')}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('volunteers')}</SheetTitle>
            </SheetHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('volunteerId')}</TableHead>
                  <TableHead>{t('volunteerName')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volunteers && Array.from(volunteers.values()).map((volunteer, index) => (
                  <TableRow key={index}>
                    <TableCell>{volunteer.id}</TableCell>
                    <TableCell>{volunteer.name}
                      <div onClick={() => handleDeleteVolunteer(volunteer.id)}>
                        ❌
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SheetContent>
        </Sheet>
      </div>

      {/* View Tools */}
      <div className="p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">{t('viewTools')}</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{t('tools')}</SheetTitle>
            </SheetHeader>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('toolId')}</TableHead>
                  <TableHead>{t('toolName')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tools && Array.from(tools.values()).map((tool, index) => (
                  <TableRow key={index}>
                    <TableCell>{tool.id}</TableCell>
                    <TableCell>{tool.name}
                      <a onClick={() => handleDeleteTool(tool.id)}>
                        ❌
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export default Add;