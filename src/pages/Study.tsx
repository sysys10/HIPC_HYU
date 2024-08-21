import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from "../services/firebase.js";
import { FaCalendarAlt, FaGraduationCap, FaUsers, FaChalkboardTeacher, FaCheckCircle } from 'react-icons/fa';
import Banner from '../components/layout/banner';
import { TextField, Button, Alert } from '@mui/material';

interface UserData {
    email: string;
    name: string;
    photoURL: string | null;
    departure: string;
    uid: string;
}

interface SignUpForm {
    boj_id: string;
}

interface FormErrors {
    boj_id?: string;
}

interface StudyInfo {
    year: string;
    semester: string;
    startDate: string;
    endDate: string;
    students: number;
    solved: number;
    mentor: string;
    isOpen: boolean;
}

const studyData: StudyInfo[] = [
    {
        year: "2024",
        semester: "2학기",
        startDate: "2024-09-02",
        endDate: "2024-10-02",
        students: 1,
        solved: 0,
        mentor: "신윤수 멘토",
        isOpen: true
    },
    {
        year: "2023",
        semester: "2학기",
        startDate: "2023-07-01",
        endDate: "2023-08-02",
        students: 18,
        solved: 1042,
        mentor: "송우정 멘토",
        isOpen: false
    },
    {
        year: "2023",
        semester: "여름학기",
        startDate: "2023-07-01",
        endDate: "2023-08-02",
        students: 22,
        solved: 1810,
        mentor: "송우정 멘토",
        isOpen: false
    },
    {
        year: "2023",
        semester: "1학기",
        startDate: "2023-07-01",
        endDate: "2023-08-02",
        students: 22,
        solved: 992,
        mentor: "송우정 멘토",
        isOpen: false
    }
];

export default function Study() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState<UserData | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [signUpForm, setSignUpForm] = useState<SignUpForm>({
        boj_id: '',
    });
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [isAlreadyApplied, setIsAlreadyApplied] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userRef = doc(db, 'users', user.uid);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                    const userData = userSnap.data() as UserData;
                    setCurrentUser(userData);

                    // Check if user has already applied
                    const signedUserRef = doc(db, "signedUser", user.uid);
                    const signedUserSnap = await getDoc(signedUserRef);
                    setIsAlreadyApplied(signedUserSnap.exists());
                }
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    const handleApply = () => {
        if (currentUser) {
            setModalIsOpen(true);
        } else {
            navigate('/login');
        }
    };

    const handleSignUpChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setSignUpForm(prev => ({ ...prev, [name]: value }));
        setFormErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!currentUser) {
            console.error("No user logged in");
            return;
        }
        try {
            await setDoc(doc(db, "signedUser", currentUser.uid), {
                ...signUpForm,
                quarter: "2024 2학기",
                email: currentUser.email,
                name: currentUser.name,
                department: currentUser.departure,
                updatedAt: new Date(),
            });
            setModalIsOpen(false);
            setIsAlreadyApplied(true);
        } catch (error) {
            console.error("Error updating user document: ", error);
        }
    };

    const renderStudyCard = (study: StudyInfo) => (
        <div key={`${study.year}-${study.semester}`} className={`bg-white w-[360px] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden`}>
            <div className="p-6">
                <div className="flex items-center mb-4 gap-2">
                    <FaGraduationCap className="text-gray-600 text-3xl" />
                    <h3 className="text-2xl font-bold text-gray-800">{study.year} {study.semester}</h3>
                </div>
                <div className="flex items-center text-gray-700 mb-3">
                    <FaCalendarAlt className="mr-2" />
                    <p>{study.startDate} ~ {study.endDate}</p>
                </div>
                <div className="flex justify-between text-gray-700 mb-3">
                    <div className="flex items-center">
                        <FaUsers className="mr-2" />
                        <p>{study.students}학생</p>
                    </div>
                    <div className="flex items-center">
                        <FaChalkboardTeacher className="mr-2" />
                        <p>{study.mentor}</p>
                    </div>
                </div>
                <div className="flex items-center text-gray-700 mb-6">
                    <FaCheckCircle className="mr-2" />
                    <p>{study.solved}문제 해결</p>
                </div>
                <button
                    onClick={study.isOpen ? handleApply : undefined}
                    className={`w-full bg-white text-gray-800 font-bold py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-200 border border-gray-300 ${!study.isOpen && 'opacity-50 cursor-not-allowed'}`}
                    disabled={!study.isOpen || isAlreadyApplied}
                >
                    {study.isOpen ? (isAlreadyApplied ? '신청완료' : '신청하기') : '마감'}
                </button>
            </div>
        </div>
    );

    return (
        <div className='bg-gradient-to-br pb-12 from-gray-100 to-gray-200 min-h-screen'>
            <Banner text='스터디 신청' />
            <div className='max-w-6xl mx-auto px-4 flex flex-col gap-10'>
                {isAlreadyApplied && (
                    <Alert severity="info">이미 신청하였습니다!</Alert>
                )}
                {studyData.reduce((acc, study) => {
                    const yearGroup = acc.find(group => group.year === study.year);
                    if (yearGroup) {
                        yearGroup.studies.push(study);
                    } else {
                        acc.push({ year: study.year, studies: [study] });
                    }
                    return acc;
                }, [] as { year: string; studies: StudyInfo[] }[]).map(yearGroup => (
                    <div key={yearGroup.year} className="flex flex-col gap-4">
                        <h3 className="text-2xl font-bold text-gray-800">{yearGroup.year}년</h3>
                        <div className='flex gap-4 flex-wrap'>
                            {yearGroup.studies.map(renderStudyCard)}
                        </div>
                    </div>
                ))}
            </div>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="스터디 신청"
                className="modal"
                overlayClassName="overlay"
            >
                <h2 className="text-2xl font-bold mb-4">스터디 신청</h2>
                <div className='w-full flex flex-col justify-center items-center mb-4'>
                    {currentUser && (
                        <>
                            <img src={currentUser.photoURL || undefined} width={100} height={100} className='rounded-full' alt="User profile" />
                        </>
                    )}
                </div>
                <form onSubmit={handleSignUp} className="space-y-4">
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Email"
                        name="email"
                        value={currentUser?.email || ''}
                        disabled
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            backgroundColor: '#f3f4f6',
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                            },
                        }}
                    />
                    <div className='text-sm gray- ml-2'>*Solved.ac에 등록되어있어야합니다.</div>
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="백준 아이디"
                        name="boj_id"
                        value={signUpForm.boj_id}
                        onChange={handleSignUpChange}
                        error={!!formErrors.boj_id}
                        helperText={formErrors.boj_id}
                    />
                    {signUpForm.boj_id && <Link target='_blank' to={`https://solved.ac/profile/${signUpForm.boj_id}`} className="text-sm ml-2 text-blue-600">{`https://solved.ac/profile/${signUpForm.boj_id}`}</Link>}

                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="Name"
                        name="name"
                        value={currentUser?.name || ''}
                        disabled
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            backgroundColor: '#f3f4f6',
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        required
                        margin="normal"
                        label="학과"
                        name="department"
                        value={currentUser?.departure || ''}
                        disabled
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{
                            backgroundColor: '#f3f4f6',
                            '& .MuiInputBase-input.Mui-disabled': {
                                WebkitTextFillColor: 'rgba(0, 0, 0, 0.6)',
                            },
                        }}
                    />

                    <div className="flex justify-end space-x-2">
                        <Button
                            type="button"
                            onClick={() => setModalIsOpen(false)}
                            variant="outlined"
                            color="secondary"
                        >
                            취소
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            신청하기
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

