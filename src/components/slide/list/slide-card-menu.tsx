'use client'

import { MoreHorizontal, Trash2, Type } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { deleteSlide, updateSlide } from '@/actions/slide'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import type { slide } from '@/db/schema'

type Slide = typeof slide.$inferSelect

interface SlideCardMenuProps {
  slide: Slide
}

export function SlideCardMenu({ slide }: SlideCardMenuProps) {
  const t = useTranslations('slide')
  const [isRenameOpen, setIsRenameOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [newName, setNewName] = useState(slide.title)
  const [isPending, startTransition] = useTransition()

  const handleRename = () => {
    if (!newName.trim() || newName === slide.title) {
      setIsRenameOpen(false)
      return
    }

    startTransition(async () => {
      try {
        await updateSlide(slide.id, { title: newName })
        setIsRenameOpen(false)
        toast.success(t('renameSuccess'))
      } catch {
        toast.error(t('renameFailed'))
      }
    })
  }

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteSlide(slide.id)
        setIsDeleteOpen(false)
        toast.success(t('deleteSuccess'))
      } catch {
        toast.error(t('deleteFailed'))
      }
    })
  }

  return (
    <>
      <div className="absolute top-3 right-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm transition-colors hover:bg-background">
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
              <Type className="mr-2 size-4" />
              {t('rename')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 className="mr-2 size-4" />
              {t('delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Dialog onOpenChange={setIsRenameOpen} open={isRenameOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('renameSlide')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              autoFocus
              className="col-span-3"
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename()
                }
              }}
              placeholder={t('enterNewName')}
              value={newName}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRenameOpen(false)} variant="outline">
              {t('cancel')}
            </Button>
            <Button disabled={isPending} onClick={handleRename}>
              {t('save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog onOpenChange={setIsDeleteOpen} open={isDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('confirmDelete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteWarning', { title: slide.title })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isPending}
              onClick={handleDelete}
            >
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
