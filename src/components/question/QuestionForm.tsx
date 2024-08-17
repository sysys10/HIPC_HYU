import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addQuestion } from '../../services/questionService.ts';
import { useAuth } from '../../services/authProvider.tsx';
import { problemType } from '../../types'
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/esm/default-highlight';

const QuestionForm: React.FC = () => {
  const [input, setInput] = useState<problemType>({
    p_num: 1000,
    title: '',
    content: '',
    codeLanguage: '',
    codespace: null
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }
    setIsSubmitting(true);
    try {
      if (!user.uid) {
        setError('사용자 정보를 찾을 수 없습니다.');
        return;
      }
      await addQuestion({ ...input, writer: user.displayName ? user.displayName : "", author: user.uid });
      navigate(`/board`);
    } catch (err) {
      setError('질문 등록에 실패했습니다.');
      console.error('Error adding question:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const languages = [
    "C++17", "Python 3", "PyPy3", "C99", "Java 11", "Ruby", "Kotlin (JVM)", 
    "Swift", "Text", "C#", "node.js", "Go", "D", "Rust 2018", "C++17 (Clang)"
  ];

  return (
    <div className="container mx-auto mt-8 px-4 py-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">질문하기</h1>
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="p_num" className="block text-sm font-medium text-gray-700 mb-2">문제 번호</label>
            <input
              type="number"
              id="p_num"
              name="p_num"
              value={input.p_num}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            />
          </div>
          <div>
            <label htmlFor="codeLanguage" className="block text-sm font-medium text-gray-700 mb-2">프로그래밍 언어</label>
            <select
              id="codeLanguage"
              name="codeLanguage"
              value={input.codeLanguage}
              onChange={handleChange}
              className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
              required
            >
              <option value="">언어를 선택하세요</option>
              {languages.map((lang, index) => (
                <option key={index} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={input.title}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            required
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">내용</label>
          <textarea
            id="content"
            name="content"
            value={input.content}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300"
            rows={5}
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="codespace" className="block text-sm font-medium text-gray-700 mb-2">코드 (선택사항)</label>
          <textarea
            id="codespace"
            name="codespace"
            value={input.codespace || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300 font-mono"
            rows={10}
          ></textarea>
        </div>
        {input.codespace && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">코드 미리보기</h3>
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <SyntaxHighlighter
                language={input.codeLanguage.toLowerCase().startsWith("c") ? "cpp" : input.codeLanguage.toLowerCase().startsWith("node") ? "javascript" : "python"}
                style={docco}
                customStyle={{margin: 0, padding: '1em'}}
              >
                {input.codespace as string}
              </SyntaxHighlighter>
            </div>
          </div>
        )}
        <button 
          type="submit" 
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
          disabled={isSubmitting}
        >
          {isSubmitting ? '제출 중...' : '질문 등록'}
        </button>
      </form>
    </div>
  );
};

export default QuestionForm;