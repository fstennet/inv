import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function UnreturnedBorrows({ borrows, updateDescription, deleteOrReturnBorrow }) {
  const { t } = useTranslation(); // Hook to access translations

  const unreturnedBorrows = Array.from(borrows.values()).filter(borrow => !borrow.wasReturned && !borrow.wasDeleted);

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full leading-normal">
        <TableHeader>
          <TableRow>
            <TableHead>
              {t('volunteer')}
            </TableHead>
            <TableHead>
              {t('tool')}
            </TableHead>
            <TableHead>
              {t('description')}
            </TableHead>
            <TableHead>
              {t('date')}
            </TableHead>
            <TableHead>
              {t('actions')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {unreturnedBorrows.map((borrow) => (
            <TableRow key={borrow.id}>
              <TableCell>
                {borrow.volunteerName}
              </TableCell>
              <TableCell>
                {borrow.toolName}
              </TableCell>
              <TableCell>
                <Input
                  value={borrow.toolDescription || ''}
                  onChange={updateDescription}
                  name={borrow.id}
                  type="text"
                  placeholder={t('descriptionPlaceholder')}
                />
              </TableCell>
              <TableCell>
                {borrow.date && new Date(borrow.date).toLocaleDateString()}
              </TableCell>
              <TableCell>
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default UnreturnedBorrows;