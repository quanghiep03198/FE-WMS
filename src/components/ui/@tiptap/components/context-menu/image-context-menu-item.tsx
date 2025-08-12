import { ContextMenuItem, ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent, ContextMenuSubTrigger, Icon, Label } from '@/components/ui'
import { Editor } from '@tiptap/react'
import React, { Fragment, useContext } from 'react'
import SetImageForm from '../image-form'
import { EditorContext } from '../../context/editor-context'

const ImageContextMenuItem: React.FC<{ editor: Editor }> = ({ editor }) => {
   const { setImageFormOpen } = useContext(EditorContext)

   return (
      <Fragment>
         <ContextMenuSeparator />
         <ContextMenuSub>
            <ContextMenuSubTrigger className='gap-x-2'>
               <Icon name='Image' />
               Thay ảnh
            </ContextMenuSubTrigger>
            <ContextMenuSubContent>
               <ContextMenuItem asChild>
                  <Label htmlFor='editor-image-input' className='flex items-center gap-x-2'>
                     <Icon name='Upload' /> Tải lên từ máy tính
                  </Label>
               </ContextMenuItem>
               <ContextMenuItem className='gap-x-2' onClick={() => setImageFormOpen(true)}>
                  <Icon name='Link2' />
                  Theo URL
               </ContextMenuItem>
            </ContextMenuSubContent>
         </ContextMenuSub>
         <ContextMenuItem
            className='gap-x-2'
            onClick={() => {
               document.execCommand('delete')
               editor.commands.focus(editor.state.selection.anchor)
            }}
         >
            <Icon name='Trash2' />
            Xóa ảnh
         </ContextMenuItem>
         <SetImageForm editor={editor} />
      </Fragment>
   )
}

export default ImageContextMenuItem
