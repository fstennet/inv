import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { CardDescription } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

function Scan({ currentVolunteer, searchTerm, handleSearch, borrowsByVolunteer, deleteOrReturnBorrow, updateDescription }) {
  const { t } = useTranslation(); // Hook to access translations

  return (
    <div>
      <Input
        type="text"
        placeholder={t('searchPlaceholder')}
        value={searchTerm}
        onChange={handleSearch}
      />

      <div className="m-4">
        <CardDescription>
          {currentVolunteer && currentVolunteer.name}
        </CardDescription>
        <CardDescription>
          {currentVolunteer && currentVolunteer.id} 
        </CardDescription> 
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-full leading-normal">
          <TableCaption>{t('scanTableCaption')}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>
                {t('tool')}
              </TableHead>
              <TableHead>
                {t('description')}
              </TableHead>
              <TableHead>
                {t('actions')}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {borrowsByVolunteer(currentVolunteer).map((borrow) => (
              <TableRow key={borrow.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {borrow.toolName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <Input
                          value={borrow.toolDescription || ''}
                          onChange={updateDescription}
                          name={borrow.id}
                          type="text"
                          placeholder={t('descriptionPlaceholder')}
                          className="border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <Button
                      onClick={deleteOrReturnBorrow}
                      name={borrow.id}
                      value="return"
                      className="m-1"
                    >
                      {t('return')}
                    </Button>
                    <Button
                      onClick={deleteOrReturnBorrow}
                      name={borrow.id}
                      value="delete"
                      className="m-1"
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default Scan;