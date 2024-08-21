import { useEffect, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../services/firebase";
import { parseDeparture, parseName } from '../utils/func';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        setLoading(true);
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (!user.email?.endsWith("@hanyang.ac.kr")) {
                await signOut(auth);
                alert("한양대 계정으로만 로그인이 가능합니다.");
            } else {

                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = {
                    email: user.email,
                    name: parseName(user.displayName!),
                    photoURL: user.photoURL,
                    departure: parseDeparture(user.displayName!),
                    uid: user.uid
                };
                if (!userDoc.exists()) {
                    await setDoc(userDocRef, userData);
                }
                navigate('/');
            }
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full h-screen flex items-center justify-center px-4 pt-16 Dirty_Beauty'>
            <div className='bg-white flex flex-col md:flex-row items-center max-w-4xl w-full rounded-2xl shadow-lg overflow-hidden h-2/3'>
                <div className='md:flex bg-blue-950 bg-cover bg-no-repeat md:w-1/2 h-64 md:h-full hidden items-center justify-center'
                    style={{ backgroundImage: "url(./assets/images/hipc_bgmain.png)" }}>
                    <h1 className='font-pretendard font-bold text-white text-4xl opacity-70'>HIPC</h1>
                </div>
                <div className='w-full md:w-1/2 h-full pb-8 flex flex-col justify-center items-center'>
                   
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        className="w-20 h-20 mb-6"
                    />
                    <button
                        onClick={signInWithGoogle}
                        disabled={loading}
                        className={`flex items-center justify-center w-full max-w-xs py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <span>로그인 중...</span>
                        ) : (
                            <>
                                <img
                                    src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                    alt="Google logo"
                                    className="w-6 h-6 mr-2"
                                />
                                <span>한양대 계정으로 로그인</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}