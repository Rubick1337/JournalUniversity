import Header from "../../components/Header/Header";
import ScheduleDay from "../../components/ScheduleDay/ScheduleDay";
import Footer from "../../components/Footer/Footer";


const SchedulePage = props => {
    return (
        <>
            <Header/>
            <main>
                <ScheduleDay/>
            </main>
            <Footer/>
        </>
    )
}
export default SchedulePage;