import { useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { auth, db } from "../services/firebase";

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (!userDoc.exists()) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    updatedAt: new Date(),
                });
            }
            navigate('/');
        } catch (error) {
            console.error("Error signing in with Google: ", error);
        }
    };

    return (
        <div className='Dirty_Beauty w-full h-screen flex items-center justify-center px-8'>
            <div className='bg-white flex flex-row items-center max-w-4xl w-full rounded-2xl h-[600px]'>
                <div style={{ backgroundImage: "url(./assets/images/hipc_bgmain.png)" }} className='hidden md:flex items-center justify-center bg-blue-950 bg-cover bg-no-repeat maxmd:rounded-t-2xl md:rounded-l-2xl w-full md:w-1/2 md:h-full h-1/2'>
                    <div className='font-pretendard font-bold text-white text-4xl opacity-70 '>
                        HIPC
                    </div>
                </div>
                <div className='mx-auto w-1/2 flex flex-col justify-center items-center'>
                    <img
                        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                        alt="Google logo"
                        className="w-20 h-20 mb-4"
                    />
                    <button
                        onClick={signInWithGoogle}
                        className="flex items-center justify-center w-full max-w-xs mx-auto py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google logo"
                            className="w-6 h-6 mr-2"
                        />
                        <span>Google로 로그인</span>
                    </button>
                </div>
            </div>
        </div>
    );
}