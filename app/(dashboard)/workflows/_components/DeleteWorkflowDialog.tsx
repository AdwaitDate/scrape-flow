"use client";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import React from 'react'


interface Props{
    open:boolean;
    setOpen:(open:boolean)=>void;
    workflowName:string;
}
function DeleteWorkflowDialog({open,setOpen, workflowName}:Props) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
                If you delete this workflow, you will not be able to recover it.
                <div className="flex flec-col py-4 gap-2">
                    <p>If you are sure, enter <b>{workflowName}</b> to confirm</p>
                </div>
            </AlertDialogDescription>
        </AlertDialogHeader>
    </AlertDialogContent>
    </AlertDialog>
  )
}

export default DeleteWorkflowDialog
