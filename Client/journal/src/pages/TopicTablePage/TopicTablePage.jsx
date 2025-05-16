import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import TopicsTable from "../../components/TopicsTable/TopicsTable";



const TopicTablePage = () => {
    return (
        <>
            <Header/>
            <main>
                <TopicsTable/>
            </main>
            <Footer/>
        </>
    )
}
export default TopicTablePage;