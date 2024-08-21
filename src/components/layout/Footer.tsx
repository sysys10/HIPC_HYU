import { Link } from 'react-router-dom';
import { FaGithub, FaInstagram, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-800 text-white py-8">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h2 className="text-2xl font-bold mb-4">HIPC</h2>
                        <p className="text-gray-300">
                            한양대학교 정보시스템학과 프로그래밍 동아리
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">빠른 링크</h3>
                        <ul className="space-y-2">
                            <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">홈</Link></li>
                            <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">소개</Link></li>
                            <li><Link to="/study" className="text-gray-300 hover:text-white transition-colors">스터디</Link></li>
                            <li><Link to="/penalty" className="text-gray-300 hover:text-white transition-colors">벌금</Link></li>
                            <li><Link to="/board" className="text-gray-300 hover:text-white transition-colors">게시판</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-4">연락처</h3>
                        <ul className="space-y-2">
                            <li className="flex items-center">
                                <FaEnvelope className="mr-2" />
                                <a href="mailto:yunsu102896@gmail.com" className="text-gray-300 hover:text-white transition-colors">contact@hipc.com</a>
                            </li>
                            <li className="flex items-center">
                                <FaGithub className="mr-2"/>
                                <a href="https://github.com/sysys10/HIPC_HYU.git" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">GitHub</a>
                            </li>
                            <li className="flex items-center">
                                <FaInstagram className="mr-2" />
                                <a href="" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Instagram</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>&copy; {currentYear} HIPC. All rights reserved.</p>
                    <p className="mt-2">개발: 신윤수</p>
                </div>
            </div>
        </footer>
    );
}