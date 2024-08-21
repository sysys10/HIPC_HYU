import { useEffect, useState } from "react";
import { getPenalty } from "../../services/userService";
import { FaMoneyBillWave, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

interface PenaltyType {
    boj_id: string;
    name: string;
    penalty: number;
    paid: number;
}

const defaultPenalty: PenaltyType = {
    boj_id: '',
    name: '',
    penalty: 0,
    paid: 0
};

export default function PenaltyTable() {
    const [penalties, setPenalties] = useState<PenaltyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPenalties() {
            try {
                const penaltyData = await getPenalty();
                if (penaltyData) {
                    const processedData = penaltyData.map(penalty => ({
                        ...defaultPenalty,
                        ...penalty
                    }));
                    setPenalties(processedData);
                } else {
                    setError("데이터를 불러올 수 없습니다.");
                }
            } catch (err) {
                setError("데이터 로딩 중 오류가 발생했습니다.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchPenalties();
    }, []);

    const totalPenalty = penalties.reduce((sum, penalty) => sum + penalty.penalty, 0);
    const totalPaid = penalties.reduce((sum, penalty) => sum + penalty.paid, 0);
    const totalUnpaid = totalPenalty - totalPaid;

    return (
        <div className="max-w-7xl font-pretendard mx-auto px-4 md:px-8 pb-12">
            <div className="text-sm md:text-base text-gray-500 mb-2">-벌금은 갱신까지 시간이 소요됩니다.. 수동이라..ㅎ</div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-2 py-3 rounded relative" role="alert">
                    <strong className="font-bold">오류!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-4">
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center">
                                <FaMoneyBillWave className="text-green-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600">총 벌금</p>
                                    <p className="text-lg sm:text-2xl font-bold">{totalPenalty.toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center">
                                <FaCheckCircle className="text-blue-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600">총 납부액</p>
                                    <p className="text-lg sm:text-2xl font-bold">{totalPaid.toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                            <div className="flex items-center">
                                <FaExclamationCircle className="text-red-500 text-2xl sm:text-3xl mr-3 sm:mr-4" />
                                <div>
                                    <p className="text-xs sm:text-sm text-gray-600">총 미납액</p>
                                    <p className="text-lg sm:text-2xl font-bold">{totalUnpaid.toLocaleString()}원</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">이름</th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">BOJ ID</th>
                                        <th className="px-2 py-3 text-left text-nowrap text-xs font-medium text-gray-600 uppercase tracking-wider">벌금</th>
                                        <th className="px-2 py-3 text-left text-xs text-nowrap font-medium text-gray-600 uppercase tracking-wider">납부액</th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">미납액</th>
                                        <th className="px-2 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">상태</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {penalties.map((penalty) => {
                                        const unpaid = penalty.penalty - penalty.paid;
                                        return (
                                            <tr key={penalty.boj_id} className="hover:bg-gray-50">
                                                <td className="px-2 py-4 whitespace-nowrap text-sm">{penalty.name || '-'}</td>
                                                <td className="px-2  py-4 whitespace-nowrap text-sm">{penalty.boj_id || '-'}</td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm">{penalty.penalty.toLocaleString()}원</td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm">{penalty.paid.toLocaleString()}원</td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm">{unpaid.toLocaleString()}원</td>
                                                <td className="px-2 py-4 whitespace-nowrap text-sm">
                                                    {unpaid === 0 ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            완납
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            미납
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}