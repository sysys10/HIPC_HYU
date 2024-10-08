import { FaArrowDown } from "react-icons/fa";
import CountUp from 'react-countup';
import { easeInOut, motion } from "framer-motion";

interface BgMainProps {
    count: number;
    p_one: string;
    r_one: string;
}

export default function BgMain({ count, p_one, r_one }: BgMainProps) {
    return (
        <div className="bg-gradient-to-b from-sky-950 to-sky-300 min-h-screen">
            <div 
                style={{ backgroundImage: "url(./assets/images/hipc_bgmain.png)" }} 
                className="relative w-full min-h-screen bg-no-repeat bg-cover bg-center flex items-center justify-center overflow-hidden"
            >
                <div className="relative max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 flex flex-col justify-between h-full">
                    <div className="font-pretendard absolute top-0 left-0 text-white text-9xl lg:text-[12rem] xl:text-[16.5rem] font-extrabold opacity-10 leading-none">HIPC</div>
                    
                    <div className="mt-32 text-center sm:mt-40 lg:mt-52 flex flex-col text-white space-y-8">
                        <div className="flex flex-col items-center w-fit mx-auto">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 opacity-90 break-keep">
                                한양인들을 위한 알고리즘 스터디
                            </h1>
                            <div className="w-full flex items-center justify-center space-x-4">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 1, ease: easeInOut }}
                                    className="h-[2px] sm:h-[3px] bg-white flex-1 md:flex hidden"
                                    style={{ transformOrigin: "left" }}
                                />
                                <div className="font-pretendard text-xs sm:text-sm md:text-base lg:text-lg font-semibold opacity-80 tracking-wider md:whitespace-nowrap md:w-1/2 ">
                                    Hanyang Information System Programming Club
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-16 md:mt-28 font-pretendard text-nowrap text-white text-xl xl:text-3xl font-bold opacity-80 space-y-3 sm:space-y-4">
                        <p>오늘까지 HIPC는 총 <CountUp end={3844 + count} duration={2} className="text-yellow-300" /> 문제,</p>
                        <p>이번 분기에 총 <CountUp end={count ? count : 60} start={0} duration={2} className="text-yellow-300" /> 문제를 풀었습니다.</p>
                        <p>이번 분기 문제 수 1위: <span className="text-green-300">{p_one}</span></p>
                        <p>랭크 상승 1위: <span className="text-blue-300">{r_one}</span></p>
                    </div>
                </div>
                
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <a href='#1' className="animate-bounce inline-block">
                        <FaArrowDown className="text-3xl sm:text-4xl lg:text-5xl text-white opacity-60 hover:opacity-100 transition-opacity duration-300" />
                    </a>
                </div>
            </div>
        </div>
    );
}