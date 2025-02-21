import ConnectButton from "./connect-button"

const MainHeader = () => {
    return (
        <header className="bg-slate-800 w-full px-10 py-6 flex flex-col md:flex-row gap-5 items-center justify-between">
            <h1 className="text-xl font-light tracking-widest">AUTH ON CHAIN</h1>
            <ConnectButton />
        </header>
    )
}

export default MainHeader