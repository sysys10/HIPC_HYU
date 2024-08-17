import Banner from "../components/layout/banner";
import { easeInOut, motion } from "framer-motion";

export default function About() {
    return (
        <div className="bg-gray-50 font-pretendard">
            <Banner text={"소개"} />
            <div className="text-center mt-6 sm:mt-10 flex flex-col items-center text-base sm:text-lg min-h-screen font-pretendard max-w-4xl px-4 sm:px-6 mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: easeInOut }}
                    className="text-left mb-4 sm:mb-8 text-gray-700 leading-relaxed"
                >
                    <p className="mb-4 sm:mb-6">정보시스템학과 백준 스터디는 2022년 1학기에 5명의 작은 그룹으로 시작하여, 2023년 2학기에는 25명의 활발한 커뮤니티로 성장했습니다. <br />
                        이 스터디는 데이터구조, 알고리즘분석 등의 알고리즘 강의 학습 및 성적 향상에 기여하며, 취업 시 다양한 기업의 코딩테스트 대비에도 큰 도움이 됩니다.</p>
                    <p className="text-xl sm:text-2xl font-semibold text-center text-blue-600 my-6 sm:my-8">『 매일 한 문제, 꾸준한 성장 』</p>
                    <p>2023년 여름학기에는 45일 동안 22명의 회원이 약 1800개의 백준 문제를 해결하는 놀라운 성과를 이뤄냈습니다. 이를 통해 대부분의 브론즈 티어 회원들이 실버 티어로 성장했고, 두 명의 스터디원은 골드에서 플래티넘 티어로 도약했습니다.</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: easeInOut }}
                    className="my-10 sm:my-12"
                >
                    <img src="/Logo_2.svg" className="rounded-lg shadow-xl max-w-full h-auto" style={{ width: '100%', maxWidth: '600px' }} />
                </motion.div>

                {[
                    {
                        title: "자동 업데이트 시스템",
                        content: "문제를 풀면 다음날 오전 중에 자동으로 업로드됩니다. 이름, 백준 아이디, 문제 번호, 해결 시각 등의 정보가 데이터베이스에 저장되어 각 회원의 성장을 체계적으로 관리합니다."
                    },
                    {
                        title: "벌금 제도",
                        content: "1일 1제 규칙을 통해 꾸준한 학습을 장려합니다. 매일 한 문제를 풀지 않으면 1000원의 벌금이 부과되며, 마감 시각은 익일 06:00을 기준으로 합니다. 벌금은 스터디 종료 후 서버비, 회식비로 사용되거나, 투표를 통해 다른 용도(알고리즘 강의, 학습 도서 구매 등)로 사용될 수 있습니다."
                    },
                    {
                        title: "정식 동아리 인준 준비",
                        content: "2024-2학기 총회에서 정식 동아리로 인준을 위한 투표가 진행될 예정입니다. 이는 우리 스터디의 성장과 공식적인 인정을 나타내는 중요한 단계입니다."
                    }
                ].map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 * index, ease: easeInOut }}
                        className="mb-8 sm:mb-12 bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-2xl w-full"
                    >
                        <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-3 sm:mb-4">"{item.title}"</h2>
                        <p className="text-left text-gray-600 text-sm sm:text-base">{item.content}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}