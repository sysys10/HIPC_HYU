import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FormControl, Input, InputAdornment, InputLabel, Button, Pagination as MUIPagination, CircularProgress } from "@mui/material";
import { CiSearch } from "react-icons/ci";
import { motion, AnimatePresence } from "framer-motion";
import { getQuestionList } from '../../services/questionService';
import { QuestionListType, PaginationInfo } from '../../types';
import { Badgesm } from '../badge';
import { PiPencilLine } from "react-icons/pi";

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<QuestionListType[]>([]);
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [problemNumber, setProblemNumber] = useState('');

  const page = parseInt(searchParams.get('page') || '1', 10);
  const currentProblemNumber = searchParams.get('problem') || '';

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      try {
        const { questions, paginationInfo } = await getQuestionList(page, currentProblemNumber);
        setQuestions(questions);
        setPaginationInfo(paginationInfo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [page, currentProblemNumber]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setSearchParams({ page: value.toString(), problem: currentProblemNumber });
  };

  const handleSearch = () => {
    setSearchParams({ page: '1', problem: problemNumber });
  };

  return (
    <div className="pt-[64px] min-h-screen p-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-10 mb-6">
          <h2 className="text-3xl sm:text-4xl font-pretendard font-semibold mb-4 sm:mb-0">질문 게시판</h2>
          <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <FormControl fullWidth variant="outlined" className="max-w-[300px]">
              <InputLabel htmlFor="search-input">문제 번호로 검색</InputLabel>
              <Input
                id="search-input"
                value={problemNumber}
                onChange={(e) => setProblemNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                startAdornment={<InputAdornment position="start"><CiSearch className="text-gray-400" /></InputAdornment>}
                endAdornment={<Button variant="contained" color="primary" onClick={handleSearch}>검색</Button>}
              />
            </FormControl>
            <Link to="/ask" className="bg-blue-500 text-white px-4 py-2 rounded whitespace-nowrap flex items-center hover:bg-blue-600 transition-colors duration-300 w-full sm:w-auto justify-center">
              <PiPencilLine className='text-2xl mr-1'/>질문하기
            </Link>
          </div>
        </div>
        <AnimatePresence>
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-64"
            >
              <CircularProgress />
            </motion.div>
          ) : (
            <motion.ul
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {questions.map((question, index) => (
                <motion.li
                  key={question.id}
                  className="w-full bg-white shadow-sm hover:shadow-md transition-shadow duration-300 border font-pretendard flex flex-col sm:flex-row items-start sm:items-center border-gray-200 p-4 rounded-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center mb-2 sm:mb-0 w-full sm:w-auto">
                    {question.solved ? <Badgesm color="#00c471" text="해결" />
                      : <Badgesm color="#ced4da" text="미해결" />}
                    <Link to={`https://www.acmicpc.net/problem/${question.p_num}`} target='_blank' className="text-gray-500 ml-4 w-16">
                      {question.p_num}
                    </Link>
                  </div>
                  <Link to={`/board/${question.id}`} className='sm:ml-4 font-semibold flex-1 hover:text-blue-600 transition-colors duration-300 my-2 sm:my-0'>
                    {question.title}
                  </Link>
                  <div className='flex flex-wrap text-sm items-center gap-2 sm:gap-5 mt-2 sm:mt-0 w-full sm:w-auto justify-start sm:justify-end'>
                    <p className='bg-gray-200 px-2 py-1 rounded-lg'>{question.codeLanguage}</p>
                    <p className='text-blue-500 hover:underline'>{question.writer}</p>
                    <p className='text-gray-500'>{question.createdAt.toLocaleDateString()}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <motion.div 
            className="flex justify-center mt-6 overflow-x-auto py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <MUIPagination
              count={paginationInfo.totalPages}
              page={paginationInfo.currentPage}
              onChange={handlePageChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default QuestionList;