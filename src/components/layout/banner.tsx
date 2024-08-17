

export default function Banner({ text }: { text: string }) {
    return (
        <>
            <div style={{ backgroundImage: "" }} className="mb-4 bg-gradient-to-br from-blue-800 to-cyan-100 relative bg-cover bg-no-repeat bg-center w-full h-72 flex justify-center items-center">
                <h1 className="text-4xl mt-16 font-semibold text-white">{text}</h1>
            </div>

        </>
    );
}
