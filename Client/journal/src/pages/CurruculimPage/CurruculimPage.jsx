import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import CurriculumsTable from "../../components/CurriculumsTable/CurriculumsTable";



const CurruculimPage = () => {
    return (
        <>
            <Header/>
            <main>
                <CurriculumsTable></CurriculumsTable>
            </main>
            <Footer/>
        </>
    )
}
export default CurruculimPage;