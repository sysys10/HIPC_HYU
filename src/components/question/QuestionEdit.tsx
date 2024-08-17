import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Question } from '../../types';
import { getQuestionById, updateQuestion } from '../../services/questionService';
import { useAuth } from '../../services/authProvider';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

const QuestionEdit: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [question, setQuestion] = useState<Question | null>(null);
    const [input, setInput] = useState({
        p_num: 0,
        title: '',
        content: '',
        codeLanguage: '',
        codespace: '',
        solved: false
    });
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuestion = async () => {
            if (id) {
                try {
                    const fetchedQuestion = await getQuestionById(id);
                    setQuestion(fetchedQuestion);
                    if (fetchedQuestion) {
                        setInput({
                            p_num: fetchedQuestion.p_num,
                            title: fetchedQuestion.title,
                            content: fetchedQuestion.content,
                            codeLanguage: fetchedQuestion.codeLanguage,
                            codespace: fetchedQuestion.codespace || '',
                            solved: fetchedQuestion.solved
                        });
                    }
                } catch (err) {
                    console.error('Failed to fetch question:', err);
                    setError('질문을 불러오는 데 실패했습니다.');
                }
            }
        };
        fetchQuestion();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !question) return;

        if (user.uid !== question.author) {
            setError('자신의 글만 수정할 수 있습니다.');
            return;
        }

        setIsSubmitting(true);
        try {
            await updateQuestion(id!, input);
            navigate(`/board/${id}`);
        } catch (err) {
            console.error('Failed to update question:', err);
            setError('질문 수정에 실패했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const languages = [
        "C++17", "Python 3", "PyPy3", "C99", "Java 11", "Ruby", "Kotlin (JVM)", 
        "Swift", "Text", "C#", "node.js", "Go", "D", "Rust 2018", "C++17 (Clang)"
    ];

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
                    <p className="font-bold">오류</p>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!question) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
                    <p className="mt-4 text-xl">질문을 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto mt-10 px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">질문 수정</h1>
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
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="solved"
                        name="solved"
                        checked={input.solved}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="solved" className="ml-2 block text-sm text-gray-900">
                        해결됨
                    </label>
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
                    <label htmlFor="codespace" className="block text-sm font-medium text-gray-700 mb-2">코드</label>
                    <textarea
                        id="codespace"
                        name="codespace"
                        value={input.codespace}
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
                                {input.codespace}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                )}
                <button 
                    type="submit" 
                    className="w-full bg-indigo-600 text-white px-4 py-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '수정 중...' : '수정 완료'}
                </button>
            </form>
        </div>
    );
};

export default QuestionEdit;