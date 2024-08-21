import React from 'react';
import { Link } from "react-router-dom";
import { FaMedal } from "react-icons/fa";
import { BaseUserState, RankMainProps, RatingDiffRankUser, RatingRankUser, SolvedDiffRankUser } from '../../types';
import { motion } from 'framer-motion';

type RankUser = RatingRankUser | SolvedDiffRankUser | RatingDiffRankUser;

function isValidUser(user: BaseUserState): user is BaseUserState & { tier: string } {
    return user.tier !== undefined;
}

function isRatingRankUser(user: RankUser): user is RatingRankUser {
    return 'rating' in user;
}

function isSolvedDiffRankUser(user: RankUser): user is SolvedDiffRankUser {
    return 'full_solved_diff' in user;
}

function isRatingDiffRankUser(user: RankUser): user is RatingDiffRankUser {
    return 'rating_diff' in user;
}

interface RankingGraphProps {
    data: RankUser[];
    valueKey: 'rating' | 'full_solved_diff' | 'rating_diff';
}
const RankingGraph: React.FC<RankingGraphProps> = ({ data, valueKey }: {
    data: (RatingRankUser | SolvedDiffRankUser | RatingDiffRankUser)[],
    valueKey: 'rating' | 'full_solved_diff' | 'rating_diff'
}) => {
    if (data.length === 0) return <div>No data available</div>;

    const getValueFromUser = (user: RatingRankUser | SolvedDiffRankUser | RatingDiffRankUser): number => {
        if (isRatingRankUser(user) && valueKey === 'rating') return user.rating;
        if (isSolvedDiffRankUser(user) && valueKey === 'full_solved_diff') return user.full_solved_diff;
        if (isRatingDiffRankUser(user) && valueKey === 'rating_diff') return user.rating_diff;
        return 0;
    };

    const maxValue = Math.max(...data.map(getValueFromUser));

    return (
        <div className="flex flex-col space-y-2">
            {data.filter(isValidUser).map((user, index) => {
                const value = getValueFromUser(user);
                return (
                    <div key={user.boj_id} className="flex items-center space-x-2 bg-white p-2 rounded-lg shadow">
                        <div className="w-8 text-center">
                            {index < 3 ? (
                                <FaMedal className={`inline ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-yellow-600'}`} size={20} />
                            ) : (
                                <span className="font-bold">{index + 1}</span>
                            )}
                        </div>
                        <div className="w-36 sm:w-44 flex items-center gap-2 font-medium" title={user.boj_id}>
                            <Link target="_blank" to={`http://solved.ac/profile/${user.boj_id}`} className="w-24 truncate">{user.boj_id}</Link>
                            <img src={`https://static.solved.ac/tier_small/${user.tier}.svg`} width={16} className="" alt={`Tier ${user.tier}`} />
                            <p className="text-sm hidden sm:block">{user.name}</p>
                        </div>
                        <div className="flex-grow hidden sm:block">
                            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                                <motion.div
                                    className="bg-blue-500 h-4"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${(value / maxValue) * 100}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                        <div className="w-16 text-right font-semibold">{value}</div>
                    </div>
                );
            })}
        </div>
    );
};

export default function RankMain({
    loading,
    error,
    ratingRank,
    solvedDiffRank,
    ratingDiffRank,
    currentRankType,
    setCurrentRankType,
    solvedProblems
}: RankMainProps) {
    if (loading) {
        return <div className="text-center mt-8">Loading...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">{error}</div>;
    }

    const getCurrentRankData = () => {
        switch (currentRankType) {
            case 'rating':
                return ratingRank;
            case 'solved_diff':
                return solvedDiffRank;
            case 'rating_diff':
                return ratingDiffRank;
        }
    };

    const getCurrentValueKey = (): 'rating' | 'full_solved_diff' | 'rating_diff' => {
        switch (currentRankType) {
            case 'rating':
                return 'rating';
            case 'solved_diff':
                return 'full_solved_diff';
            case 'rating_diff':
                return 'rating_diff';
        }
    };

    const topUser = getCurrentRankData()[0];

    return (
        <div id="1" className="font-pretendard w-full py-8 sm:py-12">
            <div className="max-w-6xl mx-auto px-4 md:px-8">
                <div className='mt-2 text-2xl sm:text-4xl font-semibold mb-1'>Ranking</div>
                <div className='text-sm md:text-base text-gray-500 mb-2'>- 모든 랭킹은 매일 06:00에 갱신됩니다.</div>
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-3/4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                            <div className="px-4 py-2 w-full sm:w-auto bg-indigo-900 gap-4 rounded-xl flex items-center text-white mb-4 sm:mb-0">
                                <FaMedal className="inline text-yellow-400 text-3xl sm:text-4xl mb-1" />
                                <p className='text-sm sm:text-base'>{topUser?.boj_id}</p>
                                <p className='text-sm sm:text-base hidden sm:block'>{topUser?.name}</p>
                            </div>
                            <div className="flex flex-wrap justify-center gap-2">
                                <button
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${currentRankType === 'solved_diff' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setCurrentRankType('solved_diff')}
                                >
                                    푼 문제
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${currentRankType === 'rating_diff' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setCurrentRankType('rating_diff')}
                                >
                                    레이팅 성장률
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-full text-xs sm:text-sm ${currentRankType === 'rating' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                                    onClick={() => setCurrentRankType('rating')}
                                >
                                    전체 레이팅
                                </button>
                            </div>
                        </div>
                        <motion.div
                            key={currentRankType}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <RankingGraph data={getCurrentRankData()} valueKey={getCurrentValueKey()} />
                        </motion.div>
                    </div>

                    <div className="w-full lg:w-1/4 bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
                        <div className="flex items-center mb-4">
                            <h2 className="text-lg sm:text-xl font-bold">최근 푼 문제</h2>
                        </div>
                        <div className="bg-gray-100 p-4 rounded-lg max-h-[540px] overflow-y-auto">
                            <div className="flex flex-wrap gap-y-2">
                                {solvedProblems.map((problem, index) => (
                                    <div
                                        className="flex w-1/2 lg:w-full items-center text-sm sm:text-base"
                                        key={index}>
                                        <Link
                                            target="_blank"
                                            to={`https://www.acmicpc.net/problem/${problem.p_num}`}
                                            className="bg-gray-200 font-semibold px-1 ml-1 rounded hover:bg-blue-200 transition-colors flex gap-2"
                                            title={`Tier: ${problem.p_tier}, Solved by: ${problem.boj_id}`}
                                        >
                                            {problem.p_num}
                                            <img src={`https://static.solved.ac/tier_small/${problem.p_tier}.svg`} width={16} className="mt-0.5" alt={`Tier ${problem.p_tier}`} />
                                        </Link>
                                        <p className="ml-2 truncate">{problem.boj_id}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}