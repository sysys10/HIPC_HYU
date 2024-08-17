import { useEffect, useState } from "react";
import {
    fetchTopUsersByRating,
    fetchTopUsersBySolvedDiff,
    fetchTopUsersByRatingDiff,
    fetchSolvedProblems,
    fetchSolvedCount
} from "../services/problem";
import BgMain from "../components/main/bg_main";
import RankMain from "../components/main/rankMain";
import { Problem, RankType, RatingDiffRankUser, RatingRankUser, SolvedDiffRankUser } from "../types";
import PenaltyTable from "../components/rank/PenaltyTable";

export default function Home() {
    const [ratingRank, setRatingRank] = useState<RatingRankUser[]>([]);
    const [solvedDiffRank, setSolvedDiffRank] = useState<SolvedDiffRankUser[]>([]);
    const [ratingDiffRank, setRatingDiffRank] = useState<RatingDiffRankUser[]>([]);
    const [currentRankType, setCurrentRankType] = useState<RankType>('rating');
    const [solvedProblems, setSolvedProblems] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [solvedCnt, setSolvedCnt] = useState(0);

    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const [ratingData, solvedDiffData, ratingDiffData, problemsData, solvedCount] = await Promise.all([
                    fetchTopUsersByRating(),
                    fetchTopUsersBySolvedDiff(),
                    fetchTopUsersByRatingDiff(),
                    fetchSolvedProblems(),
                    fetchSolvedCount()
                ]);
                setRatingRank(ratingData);
                setSolvedDiffRank(solvedDiffData.map(user => ({
                    ...user,
                    full_solved_diff: user.full_solved_diff ?? 0
                })));
                setRatingDiffRank(ratingDiffData.map(user => ({
                    ...user,
                    rating_diff: user.rating_diff ?? 0
                })));
                setSolvedProblems(problemsData);
                setSolvedCnt(solvedCount);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);
    return (
        <div className="w-full bg-gradient-to-tl from-gray-200 to-white">
            <BgMain count={solvedCnt} p_one={solvedDiffRank[0]?.boj_id} r_one={ratingDiffRank[0]?.boj_id} />
            <RankMain
                loading={loading}
                error={error}
                ratingRank={ratingRank}
                solvedDiffRank={solvedDiffRank}
                ratingDiffRank={ratingDiffRank}
                currentRankType={currentRankType}
                setCurrentRankType={setCurrentRankType}
                solvedProblems={solvedProblems}
            />
            <div className="max-w-7xl mx-auto">
                <div className='mt-2 px-8 text-2xl sm:text-4xl font-semibold mb-1'>Penalty</div>
                <PenaltyTable />
            </div>
        </div>
    );
}