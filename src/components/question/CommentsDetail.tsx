import { Comment } from '../../types';
import { useState } from 'react';
import { FaUser, FaClock } from 'react-icons/fa';

interface CommentsProps {
  comment: Comment;
  onUpdate: (commentId: string, newContent: string, author: string) => void;
  onDelete: (commentId: string, author: string) => void;
  currentUser: string | undefined;
}

export function Comments({ comment, onUpdate, onDelete, currentUser }: CommentsProps) {
    const [isCommentEdit, setIsCommentEdit] = useState(false);
    const [editComment, setEditComment] = useState(comment.content);

    const handleEditComment = () => {
        onUpdate(comment.id, editComment, comment.author);
        setIsCommentEdit(false);
    };

    const handleCommentDelete = () => {
        onDelete(comment.id, comment.author);
    };

    const isAuthor = currentUser === comment.author;

    return (
        <div className="mb-4 pb-4 border-b">
            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                <div className='w-full flex justify-between'>
                    <div>
                        <FaUser className="mr-2 inline" />
                        <span className="mr-4">{comment.writer}</span>
                        <FaClock className="mr-2 inline" />
                        <span>{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    {isAuthor && (
                        <div>
                            <button onClick={() => { setIsCommentEdit(true); }} className='mr-2 hover:text-blue-500'>수정</button>
                            <button onClick={handleCommentDelete} className='hover:text-blue-500'>삭제</button>
                        </div>
                    )}
                </div>
            </div>
            {
                isCommentEdit ?
                    <textarea
                        className='w-full p-2 my-3 border rounded-lg outline-none'
                        value={editComment}
                        onChange={(e) => { setEditComment(e.target.value); }}
                        rows={4}
                    /> :
                    <div className="whitespace-pre-wrap">{comment.content}</div>
            }
            {isCommentEdit &&
                <button
                    onClick={handleEditComment}
                    className='text-sm px-2 py-1 bg-blue-500 text-white rounded mt-2'
                >
                    수정
                </button>
            }
        </div>
    );
}