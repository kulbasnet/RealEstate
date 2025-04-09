import React from 'react'
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from './ui/table'
import CardSkeleton from './CardSkeleton'
import Skeleton from 'react-loading-skeleton'

function TableSkeleton() {
  return (
    <div className='rounded-md border mt-3'>
      <Table>
        <TableHeader>
            <TableRow>
                <TableHead><Skeleton /></TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableCell><Skeleton/></TableCell>
        </TableBody>
      </Table>
    </div>
  )
}

export default TableSkeleton
