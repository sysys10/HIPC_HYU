import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { addComment, getComments, deleteComment, updateComment } from '../../services/commentService';
import { Comment, Question } from '../../types';
import { useAuth } from '../../services/authProvider';
import { FaUser, FaClock, FaArrowLeft, FaCode } from 'react-icons/fa';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Badgesm } from '../badge';
import { Comments } from './CommentsDetail.tsx';
import { getQuestionById } from '../../services/questionService.ts';

const QuestionDetail: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const { user, loading } = useAuth();
  const [question, setQuestion] = useState<Question | null>(null);

  useEffect(() => {
    const fetchQuestionAndComments = async () => {
      if (id) {
        try {
          const fetchedQuestion = await getQuestionById(id);
          const fetchedComments = await getComments(id);
          setComments(fetchedComments);
          setQuestion(fetchedQuestion);
          setError(null);
        } catch (err) {
          setError('댓글을 불러오는 데 실패했습니다.');
          console.error(err);
        }
      }
    };
    fetchQuestionAndComments();
  }, [id, user]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !id) {
      setError('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    try {
      const newCommentData: Omit<Comment, "id" | "createdAt"> = {
        questionId: id,
        author: user.uid,
        writer: user.displayName || user.email || "익명",
        content: newComment
      };
      await addComment(newCommentData);
      const updatedComments = await getComments(id);
      setComments(updatedComments);
      setNewComment('');
      setError(null);
    } catch (err) {
      console.error('댓글 추가 실패:', err);
      setError('댓글 추가에 실패했습니다.');
    }
  };

  const handleCommentUpdate = async (commentId: string, newContent: string) => {
    if (!user) return;
    try {
      await updateComment(commentId, newContent, user.uid);
      const updatedComments = await getComments(id!);
      setComments(updatedComments);
    } catch (err) {
      console.error('댓글 수정 실패:', err);
      setError('댓글 수정에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId: string, author: string) => {
    if (!user) return;
    try {
      await deleteComment(commentId, author);
      setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
      setError('댓글 삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="text-red-500 text-center text-xl mt-10">{error}</div>;
  }

  if (!question) {
    return <div className="text-center text-xl mt-10">질문을 찾을 수 없습니다.</div>;
  }

  const isAuthor = user?.uid === question.author;

  return (
    <div className="container font-pretendard mx-auto px-4 py-8 mt-20 max-w-3xl">
      <Link to="/board" className="inline-flex items-center text-blue-500 hover:underline mb-6">
        <FaArrowLeft className="mr-2" />
        목록으로 돌아가기
      </Link>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className='flex justify-between'>
            <h1 className="text-3xl font-bold mb-4">{question.title}</h1>
            {isAuthor &&
              <Link to={`/board/${question.id}/edit`}>
                <button type="submit" className="mr-10 flex bg-blue-500 h-fit text-white px-2 py-1 text-sm rounded hover:bg-blue-600">
                  수정하기
                </button>
              </Link>}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-6">
            <FaUser className="mr-2" />
            <span className="mr-4">{question.writer}</span>
            <FaClock className="mr-2" />
            <span>{new Date(question.createdAt).toLocaleDateString()}</span>
            <FaCode className="ml-4 mr-2" />
            <span>{question.codeLanguage}</span>
            <span className='ml-3'>
              {question.solved ? <Badgesm color="#00c471" text="해결" />
                : <Badgesm color="#ced4da" text="미해결" />}
            </span>
          </div>
          <div className="prose max-w-none mb-6">
            <Link target="_blank" to={`https://www.acmicpc.net/problem/${question.p_num}`} className=' text-blue-500 text-sm'>
              {`https://www.acmicpc.net/problem/${question.p_num}`}
            </Link>
            <br />
            <br />
            {question.content}
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">코드</h3>
            <SyntaxHighlighter language={question.codeLanguage.toLowerCase().startsWith("c") ? "cpp" : question.codeLanguage.toLowerCase().startsWith("node") ? "javascript" : "python"} style={docco}>
              {question.codespace || ''}
            </SyntaxHighlighter>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">댓글</h2>
          {comments.map(comment => (
            <Comments
              key={comment.id}
              comment={comment}
              onUpdate={handleCommentUpdate}
              onDelete={handleCommentDelete}
              currentUser={user?.uid}
            />
          ))}
          {user ? (
            <form onSubmit={handleCommentSubmit} className="mt-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded outline-none"
                rows={3}
                placeholder="댓글을 입력하세요..."
                required
              />
              <button type="submit" className="mt-2 bg-blue-500 text-white px-2 py-1 text-sm rounded hover:bg-blue-600">
                댓글 작성
              </button>
            </form>
          ) : (
            <p className="mt-6 text-gray-600">댓글을 작성하려면 로그인 하세요.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionDetail;